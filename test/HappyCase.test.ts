import * as chai from 'chai'
import * as Web3 from 'web3'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../src/index'
import * as support from './support'
import * as BigNumber from 'bignumber.js';
import { Instantiation, InstantiationFactory } from './support/index'


chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert


const ECRecovery = artifacts.require<contracts.ECRecovery.Contract>('ECRecovery.sol')
const PublicRegistry = artifacts.require<contracts.PublicRegistry.Contract>('PublicRegistry.sol')
const SharedState = artifacts.require<contracts.SharedState.Contract>('SharedState.sol')
const Multisig = artifacts.require<contracts.Multisig.Contract>('Multisig.sol')
const UnidirectionalCF = artifacts.require<contracts.UnidirectionalCF.Contract>('UnidirectionalCF.sol')
const BidirectionalCF = artifacts.require<contracts.BidirectionalCF.Contract>('BidirectionalCF.sol')
const Proxy = artifacts.require<contracts.Proxy.Contract>('Proxy.sol')
const ConditionalCall = artifacts.require<contracts.ConditionalCall.Contract>('ConditionalCall.sol')
// const BidirectionalCFLibrary = artifacts.require<contracts.BidirectionalCFLibrary.Contract>('BidirectionalCFLibrary.sol')


contract('HappyCase', accounts => {
  let sender = accounts[0]
  let receiver = accounts[1]

  let settlementPeriod = 10

  let multisig: contracts.Multisig.Contract
  let registry: contracts.PublicRegistry.Contract
  let counterFactory: support.InstantiationFactory
  let proxy: contracts.Proxy.Contract
  let instanceForDigest: contracts.BidirectionalCF.Contract

  let sharedState: string
  let bidirectionalCF: string
  let sharedState2: string

  let instSharedState: Instantiation
  let instBidirectionalCF: Instantiation
  let instSharedState2: Instantiation

  let counterfactualAddressSharedState: string
  let counterfactualAddressBidirectionalCF: string
  let counterfactualAddressSharedState2: string

  let nonceBidirectional: number

  before(async () => {
    const BidirectionalCFLibrary = artifacts.require('BidirectionalCFLibrary.sol')
    const LibMultisig = artifacts.require('LibMultisig.sol')
    const ProxyLibrary = artifacts.require('ProxyLibrary.sol')
    const ConditionalCallLibrary = artifacts.require('ConditionalCallLibrary.sol')
    const MerkleProof = artifacts.require('MerkleProof.sol')
    const LibCommon = artifacts.require('LibCommon.sol')

    Multisig.link(ECRecovery)
    Multisig.link(LibCommon)
    BidirectionalCFLibrary.link(ECRecovery)
    LibMultisig.link(ECRecovery)
    Multisig.link(LibMultisig)
    BidirectionalCF.link(ECRecovery)
    BidirectionalCF.link(BidirectionalCFLibrary)
    Proxy.link(ProxyLibrary)
    ConditionalCall.link(ConditionalCallLibrary)
    // SharedState.link(MerkleProof)
    SharedState.link(BidirectionalCFLibrary)


    let ecrecoveryAddress = (await ECRecovery.deployed()).address
    let bidirectionalCFLibraryAddress = (await BidirectionalCFLibrary.deployed()).address
    let multisigLibraryAddress = (await LibMultisig.deployed()).address
    let proxyLibraryAddress = (await ProxyLibrary.deployed()).address
    let conditionalCallAddress = (await ConditionalCallLibrary.deployed()).address
    let merkleRootCallAddress = (await MerkleProof.deployed()).address


    let nonceMultisig = 0
    nonceBidirectional = 0

    registry = await PublicRegistry.deployed()
    proxy = await Proxy.deployed()

    // Step 1
    let multisig = await support.gasDiff('Multisig.new', web3, sender, async () => {
      return await Multisig.new(sender, receiver, {from: sender})
    })

    instanceForDigest = await BidirectionalCF.new(multisig.address, settlementPeriod)
    counterFactory = new InstantiationFactory(web3, multisig)

    // Step 2
    sharedState = support.constructorBytecode(web3, SharedState, sender, settlementPeriod, 0x0).replace(/__BidirectionalCFLibrary________________/g, bidirectionalCFLibraryAddress.replace('0x', ''))
    instSharedState = await counterFactory.call(registry.deploy.request(sharedState, '0x20'), nonceMultisig)
    counterfactualAddressSharedState = await registry.counterfactualAddress(sharedState, '0x20')
    nonceMultisig++

    // Step 3
    // FIXME ConditionalCall
    bidirectionalCF = support.constructorBytecode(web3, BidirectionalCF, multisig.address, settlementPeriod)
      .replace(/__ECRecovery____________________________/g, ecrecoveryAddress.replace('0x', ''))
      .replace(/__BidirectionalCFLibrary________________/g, bidirectionalCFLibraryAddress.replace('0x', ''))
      .replace(/__LibMultisig________________/g, multisigLibraryAddress.replace('0x', ''))
      .replace(/__ProxyLibrary________________/g, proxyLibraryAddress.replace('0x', ''))
      .replace(/__ConditionalCallLibrary________________/g, conditionalCallAddress.replace('0x', ''))
      .replace(/__MerkleRoot________________/g, merkleRootCallAddress.replace('0x', ''))

    // TODO Change name of nonce arg to something else
    instBidirectionalCF = await counterFactory.call(registry.deploy.request(bidirectionalCF, '0x30'), nonceMultisig)
    nonceMultisig++
    counterfactualAddressBidirectionalCF = await registry.counterfactualAddress(bidirectionalCF, '0x30')

    // Step 4
    sharedState2 = support.constructorBytecode(web3, SharedState, sender, settlementPeriod, 0x3).replace(/__BidirectionalCFLibrary________________/g, bidirectionalCFLibraryAddress.replace('0x', ''))
    instSharedState2 = await counterFactory.call(registry.deploy.request(sharedState2, '0x40'), nonceMultisig)

    nonceBidirectional += 2
    // Step 5
    let digest = await instanceForDigest.paymentDigest(nonceBidirectional, new BigNumber.BigNumber(9), new BigNumber.BigNumber(1))
    let signedBySenderData = web3.eth.sign(sender, digest)
    let signedByReceiverData = web3.eth.sign(receiver, digest)
    let moveMoneyToBiDi = await counterFactory.delegatecall(proxy.doCall.request(registry.address, counterfactualAddressBidirectionalCF, new BigNumber.BigNumber(10), '0x00'), new BigNumber.BigNumber(nonceMultisig))

    await support.logGas('instantiate shared state', counterFactory.execute(instSharedState))
    await support.logGas('instantiate BiDi', counterFactory.execute(instBidirectionalCF))

    let counterfactualAddressUpdateBidirectionalCF = await registry.counterfactualAddress(bidirectionalCF, '0x30')
    let realAddress = await registry.resolve(counterfactualAddressUpdateBidirectionalCF)
    let instance = await BidirectionalCF.at(realAddress)
    await instance.update(nonceBidirectional, new BigNumber.BigNumber(9), new BigNumber.BigNumber(1), signedBySenderData, signedByReceiverData)
    assert.equal((await instance.nonce()).toNumber(), nonceBidirectional)
    assert.equal((await instance.toSender()).toNumber(), 9)
    assert.equal((await instance.toReceiver()).toNumber(), 1)
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

  specify('can instantiate BidirectionalCF contract', async () => {

  })
})
