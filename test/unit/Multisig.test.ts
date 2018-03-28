import * as chai from 'chai'
import * as Web3 from 'web3'
import * as asPromised from 'chai-as-promised'
import { Address, BytecodeManager, InstantiationFactory } from '../support/index'
import * as support from '../support/index'
import * as BigNumber from 'bignumber.js'
import * as contracts from '../../src/index'
import * as wrappers from '../../build/wrappers'


chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert
const gaser = new support.Gaser(web3)

const FAKE_ADDRESS_A: Address = '0x0a00000000000000000000000000000000000000'
const FAKE_ADDRESS_B: Address = '0x0b00000000000000000000000000000000000000'

const ECRecovery = artifacts.require<contracts.ECRecovery.Contract>('ECRecovery.sol')
const LibCommon = artifacts.require('LibCommon.sol')
const Multisig = artifacts.require<contracts.Multisig.Contract>('Multisig.sol')
const LibMultisig = artifacts.require('LibMultisig.sol')
const DistributeEth = artifacts.require<contracts.DistributeEth.Contract>('DistributeEth.sol')

Multisig.link(LibCommon)
Multisig.link(LibMultisig)

contract('Multisig', accounts => {
  let sender: string
  let receiver: string
  let alien: string

  let counterFactory: InstantiationFactory
  let multisig: contracts.Multisig.Contract
  let distributeEth: contracts.DistributeEth.Contract

  let bytecodeManager = new BytecodeManager(web3)

  before(async () => {
    sender = accounts[0]
    receiver = accounts[1]
    alien = accounts[2]

    await bytecodeManager.addLink(ECRecovery, 'ECRecovery')
    await bytecodeManager.addLink(LibCommon, 'LibCommon')
    await bytecodeManager.addLink(LibMultisig, 'LibMultisig')

    distributeEth = await DistributeEth.new()
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
      await assert.isFulfilled(gaser.logGas('Multisig.execute: Transfer Ether', execution), 'transfer transaction')
      assert.equal(web3.eth.getBalance(FAKE_ADDRESS_A).toString(), amount.toString())
    })

    specify('not if wrong bytecode', async () => {
      let t = await counterFactory.raw(FAKE_ADDRESS_A, amount, '0xdead', new BigNumber.BigNumber(0), 0)
      await assert.isRejected(multisig.doCall(t.destination, t.value, t.callBytecode, t.senderSig, t.receiverSig))
    })

    specify('not if wrong senderSig', async () => {
      let t = await counterFactory.raw(FAKE_ADDRESS_A, amount, '0x', new BigNumber.BigNumber(0), 0)
      await assert.isRejected(multisig.doCall(t.destination, t.value, t.callBytecode, '0xdead', t.receiverSig))
    })

    specify('not if wrong receiverSig', async () => {
      let t = await counterFactory.raw(FAKE_ADDRESS_A, amount, '0x', new BigNumber.BigNumber(0), 0)
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
      let execution = multisig.doDelegate(command.destination, command.callBytecode, command.senderSig, command.receiverSig)
      await assert.isFulfilled(gaser.logGas('multisig.doDelegate: DistributeEth.execute', execution))
      let afterA = web3.eth.getBalance(FAKE_ADDRESS_A)
      let afterB = web3.eth.getBalance(FAKE_ADDRESS_B)
      assert.equal(afterA.minus(beforeA).toString(), amountA.toString())
      assert.equal(afterB.minus(beforeB).toString(), amountB.toString())
    })

    specify('not if failed call', async () => {
      let call = testDelegatecall.execute.request(amountA, amountB)
      let command = await counterFactory.delegatecall(call)

      await assert.isRejected(multisig.doDelegate(command.destination, command.callBytecode, command.senderSig, command.receiverSig))
    })

    specify('not if wrong bytecode', async () => {
      let call = testDelegatecall.execute.request(amountA, amountB)
      call.params[0].data = '0xdead'
      let command = await counterFactory.delegatecall(call)

      await assert.isRejected(multisig.doDelegate(command.destination, command.callBytecode, command.senderSig, command.receiverSig))
    })

    specify('not if wrong signature', async () => {
      let call = testDelegatecall.execute.request(amountA, amountB)
      let command = await counterFactory.delegatecall(call)
      command.callBytecode = '0xdead'

      await assert.isRejected(multisig.doDelegate(command.destination, command.callBytecode, command.senderSig, command.receiverSig))
    })
  })
})
