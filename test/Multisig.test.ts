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

const TestContract: truffle.TruffleContract<TestContractWrapper.Contract> = artifacts.require<TestContractWrapper.Contract>('TestContract.sol')
const TestToken: truffle.TruffleContract<TestTokenWrapper.Contract> = artifacts.require<TestTokenWrapper.Contract>('TestToken.sol')

contract('Multisig', accounts => {
  let multisig: contracts.Multisig.Contract
  let registry: contracts.PublicRegistry.Contract
  let proxy: contracts.Proxy.Contract
  let counterFactory: support.InstantiationFactory

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
  })

  let registryNonce = util.bufferToHex(Buffer.from('secret'))

  specify('can instantiate counterfactual contract', async () => {
    let probe = 42
    let bytecode = support.constructorBytecode(web3, TestContract, 42)
    let counterfactualAddress = await registry.counterfactualAddress(bytecode, registryNonce)

    // Instantiate
    let instantiation = await counterFactory.call(registry.deploy.request(bytecode, registryNonce))
    await support.logGas('instantiate test contract', counterFactory.execute(instantiation))

    // Check if instantiated
    let address = await registry.resolve(counterfactualAddress)
    let testInstance = await TestContract.at(address)
    let actualNonce = await testInstance.nonce()
    assert.equal(actualNonce.toNumber(), probe)
  })

  specify('can send Eth to counterfactual contract', async () => {
    let toMultisig = new BigNumber.BigNumber(web3.toWei(1, 'ether'))
    let toTestContract = new BigNumber.BigNumber(12)

    let bytecodeTestContract = support.constructorBytecode(web3, TestContract, 1)
    let counterfactualAddress = await registry.counterfactualAddress(bytecodeTestContract, registryNonce)

    let instantiateTestContract = await counterFactory.call(registry.deploy.request(bytecodeTestContract, registryNonce))
    let moveMoney = await counterFactory.delegatecall(proxy.doCall.request(registry.address, counterfactualAddress, toTestContract, '0x00'), instantiateTestContract.nonce.plus(1))

    // Move Eth to Multisig

    await support.assertBalance(multisig, 0)
    await web3.eth.sendTransaction({ from: sender, to: multisig.address, value: toMultisig }) // TxCheck
    await support.assertBalance(multisig, toMultisig)

    // Not Deployed Yet
    assert.equal(await registry.resolve(counterfactualAddress), '0x0000000000000000000000000000000000000000')

    await support.logGas('instantiate test contract', counterFactory.execute(instantiateTestContract))

    let address = await registry.resolve(counterfactualAddress)
    let testInstance = await TestContract.at(address)

    await support.assertBalance(testInstance, 0)

    // Not moved Eth yet from Multisig to TestContract
    await support.assertBalance(multisig, toMultisig)
    await support.assertBalance(testInstance, 0)

    // Move Eth to TestContract
    await support.logGas('move Eth', counterFactory.execute(moveMoney))
    await support.assertBalance(multisig, toMultisig.minus(toTestContract))
    await support.assertBalance(testInstance, toTestContract)
  })

  specify('can send ERC20 token to counterfactual contract', async () => {
    // Prepare
    let initialMultisigBalance = new BigNumber.BigNumber(100)
    let toTestContract = new BigNumber.BigNumber(12)

    let token = await TestToken.new()
    await token.mint(multisig.address, initialMultisigBalance)
    await token.finishMinting()

    // Deploy TestContract
    let bytecodeTestContract = support.constructorBytecode(web3, TestContract, 1)
    let counterfactualAddress = await registry.counterfactualAddress(bytecodeTestContract, registryNonce)
    let instantiateTestContract = await counterFactory.call(registry.deploy.request(bytecodeTestContract, registryNonce))

    // Move tokens to contract
    let transferTokens = await counterFactory.delegatecall(transferToken.execute.request(registry.address, token.address, counterfactualAddress, toTestContract), instantiateTestContract.nonce.plus(1))

    await support.assertTokenBalance(token, multisig.address, initialMultisigBalance)

    await support.logGas('instantiate test contract', counterFactory.execute(instantiateTestContract))
    let testContractRealAddress = await registry.resolve(counterfactualAddress)
    await support.assertTokenBalance(token, multisig.address, initialMultisigBalance)
    await support.assertTokenBalance(token, testContractRealAddress, 0)

    await support.logGas('transfer tokens', counterFactory.execute(transferTokens))
    await support.assertTokenBalance(token, multisig.address, initialMultisigBalance.minus(toTestContract))
    await support.assertTokenBalance(token, testContractRealAddress, toTestContract)
  })

  specify('can distribute Eth', async () => {
    let toSender = new BigNumber.BigNumber(web3.toWei(3, 'ether'))
    let toReceiver = new BigNumber.BigNumber(web3.toWei(2, 'ether'))
    let toMultisig = toSender.plus(toReceiver)

    let multisigBefore = await web3.eth.getBalance(multisig.address)
    await web3.eth.sendTransaction({ from: sender, to: multisig.address, value: toMultisig }) // TxCheck
    let multisigAfter = await web3.eth.getBalance(multisig.address)
    assert.equal(multisigAfter.minus(multisigBefore).toString(), toMultisig.toString())

    let distributeEthCommand = await counterFactory.delegatecall(distributeEth.execute.request(sender, receiver, toSender, toReceiver))

    let senderBefore = await web3.eth.getBalance(sender)
    let receiverBefore = await web3.eth.getBalance(receiver)
    multisigBefore = await web3.eth.getBalance(multisig.address)
    await support.logGas('distribute Eth', counterFactory.execute(distributeEthCommand, { from: alien }))
    let senderAfter = await web3.eth.getBalance(sender)
    let receiverAfter = await web3.eth.getBalance(receiver)
    multisigAfter = await web3.eth.getBalance(multisig.address)
    assert.equal(senderAfter.minus(senderBefore).toString(), toSender.toString())
    assert.equal(receiverAfter.minus(receiverBefore).toString(), toReceiver.toString())
    assert.equal(multisigAfter.minus(multisigBefore).toString(), toMultisig.mul(-1).toString())
  })

  specify('can distribute ERC20 token', async () => {
    let toSender = new BigNumber.BigNumber(web3.toWei(3, 'ether'))
    let toReceiver = new BigNumber.BigNumber(web3.toWei(2, 'ether'))
    let toMultisig = toSender.plus(toReceiver)

    let token = await TestToken.new()
    await token.mint(multisig.address, toMultisig)
    await token.finishMinting()

    await support.assertTokenBalance(token, multisig.address, toMultisig)
    await support.assertTokenBalance(token, sender, 0)
    await support.assertTokenBalance(token, receiver, 0)

    let distributeTokenCommand = await counterFactory.delegatecall(distributeToken.execute.request(token.address, sender, receiver, toSender, toReceiver))

    await support.logGas('distribute tokens', counterFactory.execute(distributeTokenCommand))
    await support.assertTokenBalance(token, multisig.address, 0)
    await support.assertTokenBalance(token, sender, toSender)
    await support.assertTokenBalance(token, receiver, toReceiver)
  })
})
