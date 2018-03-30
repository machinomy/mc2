import * as chai from 'chai'
import * as Web3 from 'web3'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../../src/index'
import * as support from '../support/index'
import * as BigNumber from 'bignumber.js'
import { InstantiationFactory, BytecodeManager, HexString, Address } from '../support/index'
import * as util from 'ethereumjs-util'
import MerkleTree from '../../src/MerkleTree'
import * as wrappers from '../../build/wrappers'


chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert


const ECRecovery = artifacts.require<contracts.ECRecovery.Contract>('ECRecovery.sol')
const PublicRegistry = artifacts.require<contracts.PublicRegistry.Contract>('PublicRegistry.sol')
const Lineup = artifacts.require<contracts.Lineup.Contract>('Lineup.sol')
const LibLineup = artifacts.require<contracts.Lineup.Contract>('LibLineup.sol')
const Multisig = artifacts.require<contracts.Multisig.Contract>('Multisig.sol')
const Bidirectional = artifacts.require<contracts.Bidirectional.Contract>('Bidirectional.sol')
const Proxy = artifacts.require<contracts.Proxy.Contract>('Proxy.sol')
const Conditional = artifacts.require<wrappers.Conditional.Contract>('Conditional.sol')
const LibBidirectional = artifacts.require('LibBidirectional.sol')
const LibMultisig = artifacts.require('LibMultisig.sol')
const LibCommon = artifacts.require('LibCommon.sol')

Multisig.link(ECRecovery)
Multisig.link(LibCommon)
LibBidirectional.link(ECRecovery)
LibMultisig.link(ECRecovery)
Multisig.link(LibMultisig)
Bidirectional.link(ECRecovery)
Bidirectional.link(LibCommon)
Bidirectional.link(LibBidirectional)
LibLineup.link(LibCommon)
Lineup.link(LibLineup)
Lineup.link(LibCommon)

interface LineupUpdate {
  nonce: BigNumber.BigNumber
  merkleRoot: HexString
  senderSig: HexString
  receiverSig: HexString,
  tree: MerkleTree
}

let _lineupNonce = 0
let _lineupElements: Array<HexString> = []
function updateLineup (element: HexString|null, sender: Address, receiver: Address): LineupUpdate {
  if (element) _lineupElements.push(element)
  let tree = new MerkleTree(_lineupElements.map(util.toBuffer))
  _lineupNonce += 1
  let r = util.bufferToHex(tree.root)
  return {
    nonce: new BigNumber.BigNumber(_lineupNonce),
    merkleRoot: r,
    senderSig: support.lineupSign(sender, r, _lineupNonce),
    receiverSig: support.lineupSign(receiver, r, _lineupNonce),
    tree: tree
  }
}

function proof (lineupU: LineupUpdate, e: HexString): HexString {
  let tree = lineupU.tree
  let p = Buffer.concat(tree.proof(util.toBuffer(e)))
  return util.bufferToHex(p)
}

const lineupSettlementPeriod = 1 // Hint: Set to 0 to test lineup update period
const bidirectionalSettlementPeriod = 10

const REGISTRY_NONCE = '0x20'
const depositA = new BigNumber.BigNumber(100)
let amountA = new BigNumber.BigNumber(10)
let amountB = new BigNumber.BigNumber(90)

contract('Uncooperative Behaviour', accounts => {
  const addressA = accounts[3]
  const addressB = accounts[4]

  let lineupU = updateLineup(null, addressA, addressB)

  let registry: contracts.PublicRegistry.Contract
  let proxy: contracts.Proxy.Contract

  let bytecodeManager: BytecodeManager

  before(async () => {
    bytecodeManager = new BytecodeManager(web3)
    await bytecodeManager.addLink(ECRecovery, 'ECRecovery')
    await bytecodeManager.addLink(LibBidirectional, 'LibBidirectional')
    await bytecodeManager.addLink(LibCommon, 'LibCommon')
    await bytecodeManager.addLink(LibMultisig, 'LibMultisig')
    await bytecodeManager.addLink(LibLineup, 'LibLineup')

    registry = await PublicRegistry.deployed()
    proxy = await Proxy.deployed()
  })

  specify('resolve dispute about Ether', async () => {
    // 1: Deploy Multisig
    let multisig = await Multisig.new(addressA, addressB)
    let counterFactory = new InstantiationFactory(web3, multisig)
    let conditional = await Conditional.new()

    // // 2: Counterfactually deploy Lineup
    let lineupB = bytecodeManager.constructBytecode(Lineup, 0x0, lineupSettlementPeriod, multisig.address)
    let lineupA = await registry.counterfactualAddress(lineupB, REGISTRY_NONCE)
    let lineupI = await counterFactory.call(registry.deploy.request(lineupB, REGISTRY_NONCE))

    // 3: Prepare counterfactual deployment of Bidirectional, and update Lineup
    let bidirectionalB = bytecodeManager.constructBytecode(Bidirectional, multisig.address, bidirectionalSettlementPeriod)
    let bidirectionalA = await registry.counterfactualAddress(bidirectionalB, REGISTRY_NONCE)
    let bidirectionalDeployment = registry.deploy.request(bidirectionalB, REGISTRY_NONCE).params[0].data
    let bidirectionalCodehash = await conditional.callHash(registry.address, new BigNumber.BigNumber(0), bidirectionalDeployment)
    lineupU = updateLineup(bidirectionalCodehash, addressA, addressB)

    // 4. Prepare counterfactual transfer, and update Lineup
    let transferB = proxy.doCall.request(registry.address, bidirectionalA, depositA, '0x').params[0].data
    let transferCodehash = await conditional.callHash(proxy.address, depositA, transferB)
    lineupU = updateLineup(transferCodehash, addressA, addressB)

    // 5: Conditionally counterfactually deploy Bidirectional
    let conditionalBidirectionalB = conditional.doCall.request(registry.address, lineupA, proof(lineupU, bidirectionalCodehash), registry.address, new BigNumber.BigNumber(0), bidirectionalDeployment)
    let conditionalBidirectionalI = await counterFactory.call(conditionalBidirectionalB, 1)

    // 5. Conditionally counterfactually move money to deployed Bidirectional
    let conditionalTransferB = conditional.doDelegate.request(registry.address, lineupA, proof(lineupU, transferCodehash), proxy.address, depositA, transferB)
    let conditionalTransferI = await counterFactory.delegatecall(conditionalTransferB, 2)

    // 6. Deposit to Multisig
    web3.eth.sendTransaction({from: addressA, to: multisig.address, value: depositA})

    // 5. Do exchanges on Bidirectional Eth channel
    let nonce = new BigNumber.BigNumber(10)
    let sigA = support.bidirectionalSign(addressA, nonce, amountA, amountB)
    let sigB = support.bidirectionalSign(addressB, nonce, amountA, amountB)

    // 5.1 And close transaction for Bidirectional Eth channel
    let closeSigA = support.bidirectionalCloseSign(addressA, amountA, amountB)
    let closeSigB = support.bidirectionalCloseSign(addressB, amountA, amountB)

    // ****** And now Resolve the dispute for Bidirectional ****** \\
    // 6. Deploy Lineup
    await counterFactory.execute(lineupI)
    let lineup = await Lineup.at(await registry.resolve(lineupA))
    // 6.1 Optionally update Lineup
    await lineup.update(lineupU.nonce, lineupU.merkleRoot, lineupU.senderSig, lineupU.receiverSig)

    // 7 Deploy Bidirectional channel
    await counterFactory.execute(conditionalBidirectionalI)

    // 8 Move money to Bidirectional
    await counterFactory.execute(conditionalTransferI)
    assert.equal(web3.eth.getBalance(multisig.address).toNumber(), 0, 'Multisig balance')

    // 9 Close Bidirectional channel
    let bidirectional = await Bidirectional.at(await registry.resolve(bidirectionalA))
    assert.equal(web3.eth.getBalance(bidirectional.address).toNumber(), depositA.toNumber(), 'Bidirectional balance')

    let addressABefore = web3.eth.getBalance(addressA)
    let addressBBefore = web3.eth.getBalance(addressB)
    await bidirectional.close(amountA, amountB, closeSigA, closeSigB)
    let addressAAfter = web3.eth.getBalance(addressA)
    let addressBAfter = web3.eth.getBalance(addressB)
    // Ensure the funds are distributed correctly
    assert.equal(web3.eth.getBalance(bidirectional.address).toNumber(), 0, 'Bidirectional balance after close')
    assert.equal(addressAAfter.minus(addressABefore).toNumber(), amountA.toNumber(), 'balance of addressA after close')
    assert.equal(addressBAfter.minus(addressBBefore).toNumber(), amountB.toNumber(), 'balance of addressB after close')
  })
})
