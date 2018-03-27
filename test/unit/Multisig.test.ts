import * as chai from 'chai'
import * as Web3 from 'web3'
import * as asPromised from 'chai-as-promised'
import { Address, BytecodeManager, Instantiation, InstantiationFactory } from '../support/index'
import * as support from '../support/index'
import * as BigNumber from 'bignumber.js'
import * as contracts from '../../src/index'
import * as util from 'ethereumjs-util'


chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert
const gaser = new support.Gaser(web3)

const FAKE_ADDRESS: Address = '0x0a00000000000000000000000000000000000000'

contract('Multisig', accounts => {
  let sender: string
  let receiver: string
  let alien: string

  let lineup: string
  let registryNonce: string
  let settlementPeriod: number

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
  let lineupI: Instantiation
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

    settlementPeriod = 100

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

    specify('deploy a transaction', async () => {
      web3.eth.sendTransaction({from: sender, to: multisig.address, value: amount})

      let transfer = await counterFactory.raw(FAKE_ADDRESS, amount, '0x', new BigNumber.BigNumber(0), 0)
      let execution = multisig.execute(transfer.destination, transfer.value, transfer.callBytecode, transfer.senderSig, transfer.receiverSig)

      await assert.isFulfilled(execution, 'transfer transaction')
      assert.equal(web3.eth.getBalance(FAKE_ADDRESS).toString(), amount.toString())
    })

    specify('not if wrong bytecode', async () => {
      let t = await counterFactory.raw(FAKE_ADDRESS, amount, '0xdead', new BigNumber.BigNumber(0), 0)
      await assert.isRejected(multisig.execute(t.destination, t.value, t.callBytecode, t.senderSig, t.receiverSig))
    })

    specify('not if wrong senderSig', async () => {
      let t = await counterFactory.raw(FAKE_ADDRESS, amount, '0x', new BigNumber.BigNumber(0), 0)
      await assert.isRejected(multisig.execute(t.destination, t.value, t.callBytecode, '0xdead', t.receiverSig))
    })

    specify('not if wrong receiverSig', async () => {
      let t = await counterFactory.raw(FAKE_ADDRESS, amount, '0x', new BigNumber.BigNumber(0), 0)
      await assert.isRejected(multisig.execute(t.destination, t.value, t.callBytecode, t.senderSig, t.receiverSig))
    })
  })

  describe('.executeDelegate', () => {
    specify('All right', async () => {
      lineup = bytecodeManager.constructBytecode(Lineup, sender, settlementPeriod, 0x0)
      let address = '0x0a00000000000000000000000000000000000000'
      let transferCall: support.Call = {
        method: '',
        value: new BigNumber.BigNumber(10),
        params: [{
          to: address,
          data: ''
        }]
      }
      web3.eth.sendTransaction({ from: sender, to: multisig.address, value: new BigNumber.BigNumber(10) })
      lineupI = await counterFactory.delegatecall(transferCall, 0)

      console.log(lineupI)
      await multisig.executeDelegate(lineupI.destination, lineupI.value, lineupI.callBytecode, lineupI.senderSig, lineupI.receiverSig)
      // assert.equal(web3.eth.getBalance(address).toString(), '10')
    })

    specify('Wrong bytecode', async () => {
      let callBytecode = 'wrong-bytecode-here'

      lineup = bytecodeManager.constructBytecode(Lineup, sender, settlementPeriod, 0x0)
      lineupI = await counterFactory.call(registry.deploy.request(lineup, '0x20'), 0)

      lineupI.callBytecode = callBytecode

      try {
        await multisig.executeDelegate(lineupI.destination, lineupI.value, lineupI.callBytecode, lineupI.senderSig, lineupI.receiverSig)
        assert(false, 'executeDelegate must return false')
      } catch (e) {
        // true
      }
    })

    specify('Wrong destination', async () => {
      let destination = 'wrong-destination-here'

      lineup = bytecodeManager.constructBytecode(Lineup, sender, settlementPeriod, 0x0)
      lineupI = await counterFactory.call(registry.deploy.request(lineup, '0x20'), 0)

      lineupI.destination = destination
      try {
        await multisig.executeDelegate(lineupI.destination, lineupI.value, lineupI.callBytecode, lineupI.senderSig, lineupI.receiverSig)
        assert(false, 'executeDelegate must return false')
      } catch (e) {
        assert(true)
      }
    })

    specify('Wrong value', async () => {
      let value = new BigNumber.BigNumber(12345)

      lineup = bytecodeManager.constructBytecode(Lineup, sender, settlementPeriod, 0x0)
      lineupI = await counterFactory.call(registry.deploy.request(lineup, '0x20'), 0)

      lineupI.value = value
      try {
        await multisig.executeDelegate(lineupI.destination, lineupI.value, lineupI.callBytecode, lineupI.senderSig, lineupI.receiverSig)
        assert(false, 'executeDelegate must return false')
      } catch (e) {
        assert(true)
      }
    })

    specify('Wrong senderSig', async () => {
      let senderSig = 'wrong-senderSig-here'

      lineup = bytecodeManager.constructBytecode(Lineup, sender, settlementPeriod, 0x0)
      lineupI = await counterFactory.call(registry.deploy.request(lineup, '0x20'), 0)

      lineupI.senderSig = senderSig
      try {
        await multisig.executeDelegate(lineupI.destination, lineupI.value, lineupI.callBytecode, lineupI.senderSig, lineupI.receiverSig)
        assert(false, 'executeDelegate must return false')
      } catch (e) {
        // true
      }
    })

    specify('Wrong receiverSig', async () => {
      let receiverSig = 'wrong-receiverSig-here'

      lineup = bytecodeManager.constructBytecode(Lineup, sender, settlementPeriod, 0x0)
      lineupI = await counterFactory.call(registry.deploy.request(lineup, '0x20'), 0)

      lineupI.receiverSig = receiverSig
      try {
        await multisig.executeDelegate(lineupI.destination, lineupI.value, lineupI.callBytecode, lineupI.senderSig, lineupI.receiverSig)
        assert(false, 'executeDelegate must return false')
      } catch (e) {
        // true
      }
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
