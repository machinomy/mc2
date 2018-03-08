import * as Web3 from 'web3'
import * as chai from 'chai'
import * as BigNumber from 'bignumber.js'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../src/index'
import * as util from 'ethereumjs-util'
import * as truffle from 'truffle-contract'
import * as support from './support'

import TestContractWrapper from '../build/wrappers/TestContract'
import TestTokenWrapper from '../build/wrappers/TestToken'
import { InstantiationFactory } from './support/index'
import MerkleTree from "../src/MerkleTree";

chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert

const ECRecovery = artifacts.require<contracts.ECRecovery.Contract>('ECRecovery.sol')
const PublicRegistry = artifacts.require<contracts.PublicRegistry.Contract>('PublicRegistry.sol')
const TransferToken = artifacts.require<contracts.TransferToken.Contract>('TransferToken.sol')
const Multisig = artifacts.require<contracts.Multisig.Contract>('Multisig.sol')
const Proxy = artifacts.require<contracts.Proxy.Contract>('Proxy.sol')
const DistributeEth = artifacts.require<contracts.DistributeEth.Contract>('DistributeEth.sol')
const DistributeToken = artifacts.require<contracts.DistributeToken.Contract>('DistributeToken.sol')
const SharedState = artifacts.require<contracts.SharedState.Contract>('SharedState.sol')
const ConditionalCall = artifacts.require<contracts.ConditionalCall.Contract>('ConditionalCall.sol')

const TestContract: truffle.TruffleContract<TestContractWrapper.Contract> = artifacts.require<TestContractWrapper.Contract>('TestContract.sol')
const TestToken: truffle.TruffleContract<TestTokenWrapper.Contract> = artifacts.require<TestTokenWrapper.Contract>('TestToken.sol')

contract('ConditionalCall', accounts => {
  let registry: contracts.PublicRegistry.Contract
  let conditional: contracts.ConditionalCall.Contract
  let multisig: contracts.Multisig.Contract
  let counterFactory: InstantiationFactory
  let proxy: contracts.Proxy.Contract

  let transferToken: contracts.TransferToken.Contract
  let distributeEth: contracts.DistributeEth.Contract
  let distributeToken: contracts.DistributeToken.Contract

  let sender = accounts[0]
  let receiver = accounts[1]
  let alien = accounts[2]

  before(async () => {
    Multisig.link(ECRecovery)
    multisig = await Multisig.new(sender, receiver) // TxCheck
    registry = await PublicRegistry.deployed()

    proxy = await Proxy.deployed()
    counterFactory = new InstantiationFactory(web3, multisig)
    transferToken = await TransferToken.new()
    distributeEth = await DistributeEth.new()
    distributeToken = await DistributeToken.new()
    conditional = await ConditionalCall.new()
  })

  let registryNonce = util.bufferToHex(Buffer.from('secret'))

  specify('calls deployed contract', async () => {
    let newNonce = new BigNumber.BigNumber(10)
    let testContract = await TestContract.new(42)
    let bytecode = testContract.updateNonce.request(newNonce).params[0].data

    let codeHash = await conditional.callHash(testContract.address, new BigNumber.BigNumber(0), bytecode)

    let stateBytecode = support.constructorBytecode(web3, SharedState, sender, 0, codeHash)
    let counterfactualAddress = await registry.counterfactualAddress(stateBytecode, registryNonce)
    let sharedStateInstantiation = await counterFactory.call(registry.deploy.request(stateBytecode, registryNonce))

    await counterFactory.execute(sharedStateInstantiation)

    let sharedStateAddress = await registry.resolve(counterfactualAddress)
    let sharedState = await SharedState.at(sharedStateAddress)

    // await testContract.updateNonce(new BigNumber.BigNumber(20))
    let proof = '0x0' // merkleTree.proof(codeHash)
    await conditional.execute(registry.address, counterfactualAddress, proof, testContract.address, new BigNumber.BigNumber(0), bytecode)
    let actualNonce = await testContract.nonce()
    assert.equal(actualNonce.toNumber(), newNonce.toNumber())
  })
})
