import * as chai from 'chai'
import * as Web3 from 'web3'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../src/index'
import * as support from './support'
import * as BigNumber from 'bignumber.js'
import { Instantiation, InstantiationFactory, BytecodeManager } from './support/index'


chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert


const ECRecovery = artifacts.require<contracts.ECRecovery.Contract>('ECRecovery.sol')
const PublicRegistry = artifacts.require<contracts.PublicRegistry.Contract>('PublicRegistry.sol')
const Lineup = artifacts.require<contracts.Lineup.Contract>('Lineup.sol')
const Multisig = artifacts.require<contracts.Multisig.Contract>('Multisig.sol')
const BidirectionalCF = artifacts.require<contracts.Bidirectional.Contract>('BidirectionalCF.sol')
const Proxy = artifacts.require<contracts.Proxy.Contract>('Proxy.sol')
const ConditionalCall = artifacts.require<contracts.ConditionalCall.Contract>('ConditionalCall.sol')


contract('HappyCase', accounts => {
  let sender = accounts[0]
  let receiver = accounts[1]

  let settlementPeriod = 10

  let registry: contracts.PublicRegistry.Contract
  let counterFactory: support.InstantiationFactory
  let proxy: contracts.Proxy.Contract
  let instanceForDigest: contracts.Bidirectional.Contract

  let lineup: string
  let bidirectionalCF: string
  let lineup2: string

  let instLineup: Instantiation
  let instBidirectionalCF: Instantiation

  let counterfactualAddressBidirectionalCF: string

  let nonceBidirectional: number
  let nonceMultisig: number

  const BidirectionalCFLibrary = artifacts.require('BidirectionalCFLibrary.sol')
  const LibMultisig = artifacts.require('LibMultisig.sol')
  const ProxyLibrary = artifacts.require('ProxyLibrary.sol')
  const ConditionalCallLibrary = artifacts.require('ConditionalCallLibrary.sol')
  const LibCommon = artifacts.require('LibCommon.sol')

  let bytecodeManager: BytecodeManager

  before(async () => {
    Multisig.link(ECRecovery)
    Multisig.link(LibCommon)
    BidirectionalCFLibrary.link(ECRecovery)
    LibMultisig.link(ECRecovery)
    Multisig.link(LibMultisig)
    BidirectionalCF.link(ECRecovery)
    BidirectionalCF.link(LibCommon)
    BidirectionalCF.link(BidirectionalCFLibrary)
    Proxy.link(ProxyLibrary)
    ConditionalCall.link(ConditionalCallLibrary)
    Lineup.link(BidirectionalCFLibrary)

    bytecodeManager = new BytecodeManager(web3)
    await bytecodeManager.addLink(ECRecovery, 'ECRecovery')
    await bytecodeManager.addLink(BidirectionalCFLibrary, 'BidirectionalCFLibrary')
    await bytecodeManager.addLink(LibCommon, 'LibCommon')
    await bytecodeManager.addLink(LibMultisig, 'LibMultisig')
    await bytecodeManager.addLink(ProxyLibrary, 'ProxyLibrary')
    await bytecodeManager.addLink(ConditionalCallLibrary, 'ConditionalCallLibrary')

    nonceBidirectional = 0
    nonceMultisig = 0

    registry = await PublicRegistry.deployed()
    proxy = await Proxy.deployed()
  })

  specify('Steps', async () => {
    // Step 1
    let multisig = await support.gasDiff('Multisig.new', web3, sender, async () => {
      return await Multisig.new(sender, receiver, {from: sender})
    })

    instanceForDigest = await BidirectionalCF.new(multisig.address, settlementPeriod)
    counterFactory = new InstantiationFactory(web3, multisig)

    // Step 2
    lineup = bytecodeManager.constructBytecode(Lineup, sender, settlementPeriod, 0x0)
    instLineup = await counterFactory.call(registry.deploy.request(lineup, '0x20'), nonceMultisig)
    nonceMultisig++

    // Step 3
    // FIXME ConditionalCall
    bidirectionalCF = bytecodeManager.constructBytecode(BidirectionalCF, multisig.address, settlementPeriod)

    // TODO Change name of nonce arg to something else
    instBidirectionalCF = await counterFactory.call(registry.deploy.request(bidirectionalCF, '0x30'), nonceMultisig)
    nonceMultisig++
    counterfactualAddressBidirectionalCF = await registry.counterfactualAddress(bidirectionalCF, '0x30')

    // Step 4
    lineup2 = bytecodeManager.constructBytecode(Lineup, sender, settlementPeriod, 0x3)
    await counterFactory.call(registry.deploy.request(lineup2, '0x40'), nonceMultisig)

    nonceBidirectional += 2
    // Step 5
    let signedBySenderData = await support.bidirectionalSign(sender, new BigNumber.BigNumber(nonceBidirectional), new BigNumber.BigNumber(9), new BigNumber.BigNumber(1))
    let signedByReceiverData = await support.bidirectionalSign(receiver, new BigNumber.BigNumber(nonceBidirectional), new BigNumber.BigNumber(9), new BigNumber.BigNumber(1))
    let moveMoneyToBiDi = await counterFactory.delegatecall(proxy.doCall.request(registry.address, counterfactualAddressBidirectionalCF, new BigNumber.BigNumber(10), '0x00'), new BigNumber.BigNumber(nonceMultisig))

    await support.logGas('instantiate lineup', counterFactory.execute(instLineup))
    await support.logGas('instantiate BiDi', counterFactory.execute(instBidirectionalCF))

    let counterfactualAddressUpdateBidirectionalCF = await registry.counterfactualAddress(bidirectionalCF, '0x30')
    let realAddress = await registry.resolve(counterfactualAddressUpdateBidirectionalCF)
    let instance = await BidirectionalCF.at(realAddress)
    await instance.update(new BigNumber.BigNumber(nonceBidirectional), new BigNumber.BigNumber(9), new BigNumber.BigNumber(1), signedBySenderData, signedByReceiverData)
    assert.equal((await instance.state())[3].toNumber(), nonceBidirectional) // .nonce()
    assert.equal((await instance.state())[4].toNumber(), 9) // .toSender()
    assert.equal((await instance.state())[5].toNumber(), 1) // .toReceiver()
    // Step 6
    web3.eth.sendTransaction({ from: sender, to: multisig.address, value: new BigNumber.BigNumber(14) })

    await support.logGas('instantiate move money to BiDi', counterFactory.execute(moveMoneyToBiDi))
    let balanceOfSender = web3.eth.getBalance(sender)
    let balanceOfReceiver = web3.eth.getBalance(receiver)
    let bytecodeWithdrawCall = instance.withdraw.request().params[0].data
    await counterFactory.delegatecall(proxy.doCall.request(registry.address, counterfactualAddressUpdateBidirectionalCF, new BigNumber.BigNumber(0), bytecodeWithdrawCall))

    assert.equal(web3.eth.getBalance(multisig.address).toNumber(), new BigNumber.BigNumber(4).toNumber())
    assert.equal(web3.eth.getBalance(sender).toNumber(), new BigNumber.BigNumber(9).plus(balanceOfSender).toNumber())
    assert.equal(web3.eth.getBalance(receiver).toNumber(), new BigNumber.BigNumber(1).plus(balanceOfReceiver).toNumber())
  })
})
