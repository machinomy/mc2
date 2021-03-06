import * as chai from 'chai'
import * as Web3 from 'web3'
import * as asPromised from 'chai-as-promised'
import { Address, BytecodeManager, Instantiation, InstantiationFactory } from '../support/index'
import * as support from '../support/index'
import * as BigNumber from 'bignumber.js'
import * as contracts from '../../src/index'
import * as util from 'ethereumjs-util'
import * as wrappers from '../../build/wrappers'


chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert
const gaser = new support.Gaser(web3)

const FAKE_ADDRESS_A: Address = '0x0a00000000000000000000000000000000000000'
const FAKE_ADDRESS_B: Address = '0x0b00000000000000000000000000000000000000'

contract('Multisig', accounts => {
  let sender: string
  let receiver: string
  let alien: string

  let registryNonce: string

  const ECRecovery = artifacts.require<contracts.ECRecovery.Contract>('ECRecovery.sol')
  const LibCommon = artifacts.require('LibCommon.sol')
  const Multisig = artifacts.require<contracts.Multisig.Contract>('Multisig.sol')
  const LibMultisig = artifacts.require('LibMultisig.sol')
  const BidirectionalCF = artifacts.require('BidirectionalCF.sol')
  const BidirectionalCFLibrary = artifacts.require('BidirectionalCFLibrary.sol')
  const PublicRegistry = artifacts.require<contracts.PublicRegistry.Contract>('PublicRegistry.sol')
  const Proxy = artifacts.require<contracts.Proxy.Contract>('Proxy.sol')
  const ProxyLibrary = artifacts.require('ProxyLibrary.sol')
  const Lineup = artifacts.require<contracts.Lineup.Contract>('Lineup.sol')
  const TestContract = artifacts.require<contracts.TestContract.Contract>('TestContract.sol')
  const TestToken = artifacts.require<contracts.TestToken.Contract>('TestToken.sol')
  const TransferToken = artifacts.require<contracts.TransferToken.Contract>('TransferToken.sol')
  const DistributeEth = artifacts.require<contracts.DistributeEth.Contract>('DistributeEth.sol')
  const DistributeToken = artifacts.require<contracts.DistributeToken.Contract>('DistributeToken.sol')

  let bytecodeManager: BytecodeManager
  let counterFactory: InstantiationFactory
  let multisig: contracts.Multisig.Contract
  let proxy: contracts.Proxy.Contract
  let registry: contracts.PublicRegistry.Contract
  let transferToken: contracts.TransferToken.Contract
  let distributeEth: contracts.DistributeEth.Contract
  let distributeToken: contracts.DistributeToken.Contract



  before(async () => {
    sender = accounts[0]
    receiver = accounts[1]
    alien = accounts[2]

    Multisig.link(ECRecovery)
    Multisig.link(LibCommon)
    Multisig.link(LibMultisig)
    BidirectionalCFLibrary.link(ECRecovery)
    BidirectionalCF.link(LibCommon)
    BidirectionalCF.link(BidirectionalCFLibrary)
    Proxy.link(ProxyLibrary)
    Lineup.link(LibCommon)
    Lineup.link(BidirectionalCFLibrary)

    bytecodeManager = new BytecodeManager(web3)
    await bytecodeManager.addLink(ECRecovery, 'ECRecovery')
    await bytecodeManager.addLink(BidirectionalCFLibrary, 'BidirectionalCFLibrary')
    await bytecodeManager.addLink(LibCommon, 'LibCommon')
    await bytecodeManager.addLink(LibMultisig, 'LibMultisig')

    registry = await PublicRegistry.deployed()
    proxy = await Proxy.deployed()
    transferToken = await TransferToken.new()
    distributeEth = await DistributeEth.new()
    distributeToken = await DistributeToken.new()

    registryNonce = util.bufferToHex(Buffer.from('secret'))
  })

  beforeEach(async () => {
    multisig = await Multisig.new(sender, receiver, {from: sender})
    counterFactory = new InstantiationFactory(web3, multisig)
  })

  describe('.new', () => {
    specify('have a valid sender', async () => {
      let _multisig = await gaser.gasDiff('Multisig.new', sender, async () => {
        return await Multisig.new(sender, receiver, { from: sender })
      })
      let actualSender = (await _multisig.state())[0]
      assert.equal(actualSender, sender, 'multisig must have a valid sender after construction')
    })

    specify('have a valid receiver', async () => {
      let actualReceiver = (await multisig.state())[1]
      assert.equal(actualReceiver, receiver, 'multisig must have a valid receiver after construction')
    })

    specify('have a valid nonce', async () => {
      let actualNonce = (await multisig.state())[2].toNumber()
      assert.equal(actualNonce, 0, 'multisig must have a valid nonce after construction')
    })
  })

  describe('.execute', () => {
    let amount = new BigNumber.BigNumber(100)

    specify('ok', async () => {
      web3.eth.sendTransaction({from: sender, to: multisig.address, value: amount})

      let transfer = await counterFactory.raw(FAKE_ADDRESS_A, amount, '0x', new BigNumber.BigNumber(0), 0)
      let execution = multisig.doCall(transfer.destination, transfer.value, transfer.callBytecode, transfer.senderSig, transfer.receiverSig)
      // tslint:disable-next-line:await-promise
      await assert.isFulfilled(execution, 'transfer transaction')
      assert.equal(web3.eth.getBalance(FAKE_ADDRESS_A).toString(), amount.toString())
    })

    specify('not if wrong bytecode', async () => {
      let t = await counterFactory.raw(FAKE_ADDRESS_A, amount, '0xdead', new BigNumber.BigNumber(0), 0)
      // tslint:disable-next-line:await-promise
      await assert.isRejected(multisig.doCall(t.destination, t.value, t.callBytecode, t.senderSig, t.receiverSig))
    })

    specify('not if wrong senderSig', async () => {
      let t = await counterFactory.raw(FAKE_ADDRESS_A, amount, '0x', new BigNumber.BigNumber(0), 0)
      // tslint:disable-next-line:await-promise
      await assert.isRejected(multisig.doCall(t.destination, t.value, t.callBytecode, '0xdead', t.receiverSig))
    })

    specify('not if wrong receiverSig', async () => {
      let t = await counterFactory.raw(FAKE_ADDRESS_A, amount, '0x', new BigNumber.BigNumber(0), 0)
      // tslint:disable-next-line:await-promise
      await assert.isRejected(multisig.doCall(t.destination, t.value, t.callBytecode, t.senderSig, t.receiverSig))
    })
  })

  describe('.executeDelegate', () => {
    let TestDelegatecallArtifact = artifacts.require<wrappers.TestDelegatecall.Contract>('TestDelegatecall.sol')
    let testDelegatecall: wrappers.TestDelegatecall.Contract
    let amount = new BigNumber.BigNumber(100)
    let amountA = amount
    let amountB = amount.mul(2)

    before(async () => {
      testDelegatecall = await TestDelegatecallArtifact.new()
    })

    beforeEach(() => {
      web3.eth.sendTransaction({from: sender, to: multisig.address, value: amountA.plus(amountB)})
    })

    specify('ok', async () => {
      let transfer = distributeEth.execute.request(FAKE_ADDRESS_A, FAKE_ADDRESS_B, amountA, amountB)
      let command = await counterFactory.delegatecall(transfer)
      let beforeA = web3.eth.getBalance(FAKE_ADDRESS_A)
      let beforeB = web3.eth.getBalance(FAKE_ADDRESS_B)
      // tslint:disable-next-line:await-promise
      await assert.isFulfilled(multisig.doDelegate(command.destination, command.callBytecode, command.senderSig, command.receiverSig))
      let afterA = web3.eth.getBalance(FAKE_ADDRESS_A)
      let afterB = web3.eth.getBalance(FAKE_ADDRESS_B)
      assert.equal(afterA.minus(beforeA).toString(), amountA.toString())
      assert.equal(afterB.minus(beforeB).toString(), amountB.toString())
    })

    specify('not if failed call', async () => {
      let call = testDelegatecall.execute.request(amountA, amountB)
      let command = await counterFactory.delegatecall(call)
      // tslint:disable-next-line:await-promise
      await assert.isRejected(multisig.doDelegate(command.destination, command.callBytecode, command.senderSig, command.receiverSig))
    })

    specify('not if wrong bytecode', async () => {
      let call = testDelegatecall.execute.request(amountA, amountB)
      call.params[0].data = '0xdead'
      let command = await counterFactory.delegatecall(call)
      // tslint:disable-next-line:await-promise
      await assert.isRejected(multisig.doDelegate(command.destination, command.callBytecode, command.senderSig, command.receiverSig))
    })

    specify('not if wrong signature', async () => {
      let call = testDelegatecall.execute.request(amountA, amountB)
      let command = await counterFactory.delegatecall(call)
      command.callBytecode = '0xdead'
      // tslint:disable-next-line:await-promise
      await assert.isRejected(multisig.doDelegate(command.destination, command.callBytecode, command.senderSig, command.receiverSig))
    })
  })


  specify('can instantiate counterfactual contract', async () => {
    let probe = 42
    let bytecode = bytecodeManager.constructBytecode(TestContract, 42)
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
    let multisig = await Multisig.new(sender, receiver, {from: sender})
    let toMultisig = new BigNumber.BigNumber(web3.toWei(1, 'ether'))
    let toTestContract = new BigNumber.BigNumber(12)
    counterFactory = new InstantiationFactory(web3, multisig)

    let bytecodeTestContract = bytecodeManager.constructBytecode(TestContract, 1)
    let counterfactualAddress = await registry.counterfactualAddress(bytecodeTestContract, registryNonce)

    let instantiateTestContract = await counterFactory.call(registry.deploy.request(bytecodeTestContract, registryNonce))
    let moveMoney = await counterFactory.delegatecall(proxy.doCall.request(registry.address, counterfactualAddress, toTestContract, '0x00'), instantiateTestContract.nonce.plus(1))

    // Move Eth to Multisig

    await support.assertBalance(multisig, 0)
    web3.eth.sendTransaction({ from: sender, to: multisig.address, value: toMultisig }) // TxCheck
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
    let multisig = await Multisig.new(sender, receiver, {from: sender})
    let initialMultisigBalance = new BigNumber.BigNumber(100)
    let toTestContract = new BigNumber.BigNumber(12)
    counterFactory = new InstantiationFactory(web3, multisig)

    let token = await TestToken.new()
    await token.mint(multisig.address, initialMultisigBalance)
    await token.finishMinting()

    // Deploy TestContract
    let bytecodeTestContract = bytecodeManager.constructBytecode(TestContract, 1)
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
    let multisig = await Multisig.new(sender, receiver, {from: sender})
    let toSender = new BigNumber.BigNumber(web3.toWei(3, 'ether'))
    let toReceiver = new BigNumber.BigNumber(web3.toWei(2, 'ether'))
    counterFactory = new InstantiationFactory(web3, multisig)
    let toMultisig = toSender.plus(toReceiver)

    let multisigBefore = web3.eth.getBalance(multisig.address)
    web3.eth.sendTransaction({ from: sender, to: multisig.address, value: toMultisig }) // TxCheck
    let multisigAfter = web3.eth.getBalance(multisig.address)
    assert.equal(multisigAfter.minus(multisigBefore).toString(), toMultisig.toString())

    let distributeEthCommand = await counterFactory.delegatecall(distributeEth.execute.request(sender, receiver, toSender, toReceiver))

    let senderBefore = web3.eth.getBalance(sender)
    let receiverBefore = web3.eth.getBalance(receiver)
    multisigBefore = web3.eth.getBalance(multisig.address)
    await support.logGas('distribute Eth', counterFactory.execute(distributeEthCommand, { from: alien }))
    let senderAfter = web3.eth.getBalance(sender)
    let receiverAfter = web3.eth.getBalance(receiver)
    multisigAfter = web3.eth.getBalance(multisig.address)
    assert.equal(senderAfter.minus(senderBefore).toString(), toSender.toString())
    assert.equal(receiverAfter.minus(receiverBefore).toString(), toReceiver.toString())
    assert.equal(multisigAfter.minus(multisigBefore).toString(), toMultisig.mul(-1).toString())
  })

  specify('can distribute ERC20 token', async () => {
    let multisig = await Multisig.new(sender, receiver, {from: sender})
    let toSender = new BigNumber.BigNumber(web3.toWei(3, 'ether'))
    let toReceiver = new BigNumber.BigNumber(web3.toWei(2, 'ether'))
    counterFactory = new InstantiationFactory(web3, multisig)
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
