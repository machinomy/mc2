import * as chai from 'chai'
import * as Web3 from 'web3'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../../src/index'
import * as support from '../support/index'
import * as BigNumber from 'bignumber.js'
import {Instantiation, InstantiationFactory, BytecodeManager, HexString, Address} from '../support/index'
import * as util from "ethereumjs-util";
import MerkleTree from "../../src/MerkleTree";


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
const ConditionalCall = artifacts.require<contracts.ConditionalCall.Contract>('ConditionalCall.sol')
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

contract('Uncooperative Behaviour', accounts => {
  let sender = accounts[0]
  let receiver = accounts[1]

  let settlementPeriod = 10

  let registry: contracts.PublicRegistry.Contract
  let counterFactory: support.InstantiationFactory
  let proxy: contracts.Proxy.Contract
  let instanceForDigest: contracts.Bidirectional.Contract

  let bidirectionalCF: string
  let lineup2: string

  let instLineup: Instantiation
  let instBidirectionalCF: Instantiation

  let counterfactualAddressBidirectionalCF: string

  let nonceBidirectional: number
  let nonceMultisig: number

  let bytecodeManager: BytecodeManager

  before(async () => {
    bytecodeManager = new BytecodeManager(web3)
    await bytecodeManager.addLink(ECRecovery, 'ECRecovery')
    await bytecodeManager.addLink(LibBidirectional, 'LibBidirectional')
    await bytecodeManager.addLink(LibCommon, 'LibCommon')
    await bytecodeManager.addLink(LibMultisig, 'LibMultisig')
    await bytecodeManager.addLink(LibLineup, 'LibLineup')

    nonceBidirectional = 0
    nonceMultisig = 0

    registry = await PublicRegistry.deployed()
    proxy = await Proxy.deployed()
  })

  specify('resolve dispute about Ether', async () => {
    const REGISTRY_NONCE = '0x20'
    const depositA = new BigNumber.BigNumber(10)
    const addressA = sender

    // 1: Deploy Multisig
    let multisig = await Multisig.new(sender, receiver)
    let counterFactory = new InstantiationFactory(web3, multisig)
    let conditional = await ConditionalCall.new()

    const lineupSettlementPeriod = 1
    // let instanceForDigest = await Bidirectional.new(multisig.address, settlementPeriod)

    // // 2: Counterfactually deploy Lineup
    let lineupU = updateLineup(null, sender, receiver)
    let lineupB = bytecodeManager.constructBytecode(Lineup, 0x0, lineupSettlementPeriod, multisig.address)
    let lineupA = await registry.counterfactualAddress(lineupB, REGISTRY_NONCE)
    let lineupI = await counterFactory.call(registry.deploy.request(lineupB, REGISTRY_NONCE))

    // 3: Prepare counterfactual deployment of Bidirectional, and update Lineup
    let bidirectionalB = bytecodeManager.constructBytecode(Bidirectional, multisig.address, settlementPeriod)
    let bidirectionalA = await registry.counterfactualAddress(bidirectionalB, REGISTRY_NONCE)
    let bidirectionalDeployment = registry.deploy.request(bidirectionalB, REGISTRY_NONCE).params[0].data
    let bidirectionalCodehash = await conditional.callHash(registry.address, new BigNumber.BigNumber(0), bidirectionalDeployment)
    lineupU = updateLineup(bidirectionalCodehash, sender, receiver)

    // 4. Prepare counterfactual transfer
    let transferB = proxy.doCall.request(registry.address, bidirectionalA, depositA, '0x').params[0].data
    let transferCodehash = await conditional.callHash(proxy.address, new BigNumber.BigNumber(0), transferB)
    lineupU = updateLineup(transferCodehash, sender, receiver)

    // 5: Conditionally counterfactually deploy Bidirectional
    let conditionalBidirectionalB = conditional.execute.request(registry.address, lineupA, proof(lineupU, bidirectionalCodehash), registry.address, new BigNumber.BigNumber(0), bidirectionalDeployment)
    let conditionalBidirectionalI = await counterFactory.call(conditionalBidirectionalB, 1)

    // 5. Conditionally counterfactually move money to deployed Bidirectional, and update Lineup
    let conditionalTransferB = conditional.execute.request(registry.address, lineupA, proof(lineupU, transferCodehash), proxy.address, new BigNumber.BigNumber(0), transferB)
    let conditionalTransferI = await counterFactory.delegatecall(conditionalTransferB, 2)

    // 6. Do deposit to Multisig
    web3.eth.sendTransaction({from: addressA, to: multisig.address, value: depositA})

    // 5. Do exchanges on Bidirectional channel

    // 6. Deploy the contracts to the blockchain
    // await counterFactory.execute(lineupI)
    // let lineup = await Lineup.at(await registry.resolve(lineupA))
    // await lineup.update(new BigNumber.BigNumber(lineupNonce), root(lineupElements), lineupUpdateSenderSig, lineupUpdateReceiverSig)
    // await counterFactory.execute(conditionalBidirectionalI)
    //
    // 7. Resolve the dispute on Bidirectional

    await counterFactory.execute(lineupI)
    let lineup = await Lineup.at(await registry.resolve(lineupA))
    await lineup.update(lineupU.nonce, lineupU.merkleRoot, lineupU.senderSig, lineupU.receiverSig)

    web3.eth.sendTransaction({from: addressA, to: addressA, value: depositA})
    web3.eth.sendTransaction({from: addressA, to: addressA, value: depositA})

    await counterFactory.execute(conditionalBidirectionalI)
    await counterFactory.execute(conditionalTransferI)
    console.log(multisig.address)
    assert(false)
    // await conditional.execute(registry.address, lineupCAddress, util.bufferToHex(proof), testContract.address, new BigNumber.BigNumber(0), bytecode)
    // let call = await counterFactory.call(registry.deploy.request(bidirectionalB, REGISTRY_NONCE), lineupNonce + 1)
    // await counterFactory.execute(call)

    // // Step 3: Construct Bidirectional Call
    // // FIXME ConditionalCall
    // // bidirectionalCF = bytecodeManager.constructBytecode(Bidirectional, multisig.address, settlementPeriod)
    //
    // // TODO Change name of nonce arg to something else
    // instBidirectionalCF = await counterFactory.call(registry.deploy.request(bidirectionalCF, '0x30'), nonceMultisig)
    // nonceMultisig++
    // counterfactualAddressBidirectionalCF = await registry.counterfactualAddress(bidirectionalCF, '0x30')
    //
    // // Step 4
    // lineup2 = bytecodeManager.constructBytecode(Lineup, sender, settlementPeriod, 0x3)
    // // await counterFactory.call(registry.deploy.request(lineup2, '0x40'), nonceMultisig)
    //
    // nonceBidirectional += 2
    // // Step 5
    // let signedBySenderData = await support.bidirectionalSign(sender, new BigNumber.BigNumber(nonceBidirectional), new BigNumber.BigNumber(9), new BigNumber.BigNumber(1))
    // let signedByReceiverData = await support.bidirectionalSign(receiver, new BigNumber.BigNumber(nonceBidirectional), new BigNumber.BigNumber(9), new BigNumber.BigNumber(1))
    // let moveMoneyToBiDi = await counterFactory.delegatecall(proxy.doCall.request(registry.address, counterfactualAddressBidirectionalCF, new BigNumber.BigNumber(10), '0x00'), new BigNumber.BigNumber(nonceMultisig))
    //
    // // await support.logGas('instantiate lineup', counterFactory.execute(instLineup))
    // // await support.logGas('instantiate BiDi', counterFactory.execute(instBidirectionalCF))
    //
    // let counterfactualAddressUpdateBidirectionalCF = await registry.counterfactualAddress(bidirectionalCF, '0x30')
    // let realAddress = await registry.resolve(counterfactualAddressUpdateBidirectionalCF)
    // // let instance = await Bidirectional.at(realAddress)
    // // await instance.update(new BigNumber.BigNumber(nonceBidirectional), new BigNumber.BigNumber(9), new BigNumber.BigNumber(1), signedBySenderData, signedByReceiverData)
    // // assert.equal((await instance.state())[3].toNumber(), nonceBidirectional) // .nonce()
    // // assert.equal((await instance.state())[4].toNumber(), 9) // .toSender()
    // // assert.equal((await instance.state())[5].toNumber(), 1) // .toReceiver()
    // // Step 6
    // web3.eth.sendTransaction({ from: sender, to: multisig.address, value: new BigNumber.BigNumber(14) })
    //
    // // await support.logGas('instantiate move money to BiDi', counterFactory.execute(moveMoneyToBiDi))
    // let balanceOfSender = web3.eth.getBalance(sender)
    // let balanceOfReceiver = web3.eth.getBalance(receiver)
    // // let bytecodeWithdrawCall = instance.withdraw.request().params[0].data
    // // await counterFactory.delegatecall(proxy.doCall.request(registry.address, counterfactualAddressUpdateBidirectionalCF, new BigNumber.BigNumber(0), bytecodeWithdrawCall))
    //
    // // assert.equal(web3.eth.getBalance(multisig.address).toNumber(), new BigNumber.BigNumber(4).toNumber())
    // // assert.equal(web3.eth.getBalance(sender).toNumber(), new BigNumber.BigNumber(9).plus(balanceOfSender).toNumber())
    // // assert.equal(web3.eth.getBalance(receiver).toNumber(), new BigNumber.BigNumber(1).plus(balanceOfReceiver).toNumber())
  })
})
