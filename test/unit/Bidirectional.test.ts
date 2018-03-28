import * as Web3 from 'web3'
import * as chai from 'chai'
import * as BigNumber from 'bignumber.js'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../../src/index'
import * as support from '../support'
import { InstantiationFactory } from '../support'

chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert
const gaser = new support.Gaser(web3)

const PublicRegistry = artifacts.require<contracts.PublicRegistry.Contract>('PublicRegistry.sol')
const Multisig = artifacts.require<contracts.Multisig.Contract>('Multisig.sol')
const Proxy = artifacts.require<contracts.Proxy.Contract>('Proxy.sol')
const LibMultisig = artifacts.require('LibMultisig.sol')
const LibCommon = artifacts.require('LibCommon.sol')
const Bidirectional = artifacts.require<contracts.Bidirectional.Contract>('Bidirectional.sol')
const LibBidirectional = artifacts.require('LibBidirectional.sol')

Multisig.link(LibCommon)
Multisig.link(LibMultisig)
Bidirectional.link(LibCommon)
Bidirectional.link(LibBidirectional)

let settlementPeriod = new BigNumber.BigNumber(10)

contract('Bidirectional', accounts => {
  let multisig: contracts.Multisig.Contract
  let registry: contracts.PublicRegistry.Contract
  let proxy: contracts.Proxy.Contract
  let counterFactory: support.InstantiationFactory
  let instance: contracts.Bidirectional.Contract

  let sender = accounts[2]
  let receiver = accounts[3]
  let toSender = new BigNumber.BigNumber(10)
  let toReceiver = new BigNumber.BigNumber(20)

  before(async () => {
    registry = await PublicRegistry.deployed()
    proxy = await Proxy.deployed()
  })

  beforeEach(async () => {
    multisig = await Multisig.new(sender, receiver)
    counterFactory = new InstantiationFactory(web3, multisig)
    instance = await Bidirectional.new(multisig.address, settlementPeriod)
  })

  describe('.new', function () {
    specify('instantiate', async () => {
      let instance = await gaser.gasDiff('Bidirectional.new', sender, async () => {
        return await Bidirectional.new(multisig.address, settlementPeriod, {from: sender})
      })
      let state = await instance.state()
      assert.equal(state[0], multisig.address, 'multisig address')
      assert.equal(state[1].toNumber(), web3.eth.getBlock('latest').number, 'lastUpdate')
      assert.equal(state[2].toNumber(), settlementPeriod.toNumber(), 'settlementPeriod')
      assert.equal(state[3].toNumber(), 0, 'nonce')
      assert.equal(state[4].toNumber(), 0, 'toSender')
      assert.equal(state[5].toNumber(), 0, 'toReceiver')
    })
  })

  describe('.update', function () {
    specify('set new state', async () => {
      let nonce = new BigNumber.BigNumber(1)
      let senderSig = support.bidirectionalSign(sender, nonce, toSender, toReceiver)
      let receiverSig = support.bidirectionalSign(receiver, nonce, toSender, toReceiver)
      await gaser.logGas('Bidirectional.update', instance.update(nonce, toSender, toReceiver, senderSig, receiverSig))
      let state = await instance.state()
      assert.equal(state[0], multisig.address, 'multisig address')
      assert.equal(state[1].toNumber(), web3.eth.getBlock('latest').number, 'lastUpdate')
      assert.equal(state[2].toNumber(), settlementPeriod.toNumber(), 'settlementPeriod')
      assert.equal(state[3].toNumber(), 1, 'nonce')
      assert.equal(state[4].toNumber(), toSender.toNumber(), 'toSender')
      assert.equal(state[5].toNumber(), toReceiver.toNumber(), 'toReceiver')
    })
    specify('not if earlier nonce', async () => {
      let nonce = (await instance.state())[3]
      let senderSig = support.bidirectionalSign(sender, nonce, toSender, toReceiver)
      let receiverSig = support.bidirectionalSign(receiver, nonce, toSender, toReceiver)
      await assert.isRejected(instance.update(nonce, toSender, toReceiver, senderSig, receiverSig))
    })
    specify('not if late', async () => {
      let instance = await Bidirectional.new(multisig.address, 0, {from: sender})
      let nonce = (await instance.state())[3].plus(1)
      let senderSig = support.bidirectionalSign(sender, nonce, toSender, toReceiver)
      let receiverSig = support.bidirectionalSign(receiver, nonce, toSender, toReceiver)
      web3.eth.sendTransaction({from: sender, to: receiver, value: 10})
      await assert.isRejected(instance.update(nonce, toSender, toReceiver, senderSig, receiverSig))
    })
    specify('not if wrong signature', async () => {
      let nonce = (await instance.state())[3].plus(1)
      let senderSig = support.bidirectionalSign(sender, nonce, toSender, toReceiver)
      let receiverSig = support.bidirectionalSign(receiver, nonce, toSender, toReceiver)
      web3.eth.sendTransaction({from: sender, to: receiver, value: 10})
      await assert.isRejected(instance.update(nonce, toSender, toReceiver, '0xdead', receiverSig))
      await assert.isRejected(instance.update(nonce, toSender, toReceiver, senderSig, '0xdead'))
    })
  })

  describe('.close', () => {
    specify('destroy contract', async () => {
      let senderSig = support.bidirectionalCloseSign(sender, toSender, toReceiver)
      let receiverSig = support.bidirectionalCloseSign(receiver, toSender, toReceiver)
      web3.eth.sendTransaction({from: sender, to: instance.address, value: toSender.plus(toReceiver)})
      await gaser.logGas('Bidirectional.close', instance.close(toSender, toReceiver, senderSig, receiverSig))
      let state = await instance.state()
      assert.equal(state[0], '0x', 'multisig address')
      assert.equal(state[1].toNumber(), 0, 'lastUpdate')
      assert.equal(state[2].toNumber(), 0, 'settlementPeriod')
      assert.equal(state[3].toNumber(), 0, 'nonce')
      assert.equal(state[4].toNumber(), 0, 'toSender')
      assert.equal(state[5].toNumber(), 0, 'toReceiver')
    })
    specify('transfer funds', async () => {
      let senderSig = support.bidirectionalCloseSign(sender, toSender, toReceiver)
      let receiverSig = support.bidirectionalCloseSign(receiver, toSender, toReceiver)
      web3.eth.sendTransaction({from: sender, to: instance.address, value: toSender.plus(toReceiver)})
      let senderBefore = web3.eth.getBalance(sender)
      let receiverBefore = web3.eth.getBalance(receiver)
      await instance.close(toSender, toReceiver, senderSig, receiverSig)
      let senderAfter = web3.eth.getBalance(sender)
      let receiverAfter = web3.eth.getBalance(receiver)
      assert.equal(senderAfter.minus(senderBefore).toString(), toSender.toString())
      assert.equal(receiverAfter.minus(receiverBefore).toString(), toReceiver.toString())
    })
    specify('not if no funds', async () => {
      let senderSig = support.bidirectionalCloseSign(sender, toSender, toReceiver)
      let receiverSig = support.bidirectionalCloseSign(receiver, toSender, toReceiver)
      await assert.isRejected(instance.close(toSender, toReceiver, senderSig, receiverSig))
    })
    specify('not if wrong signature', async () => {
      let senderSig = support.bidirectionalCloseSign(receiver, toSender, toReceiver)
      let receiverSig = support.bidirectionalCloseSign(receiver, toSender, toReceiver)
      web3.eth.sendTransaction({from: sender, to: instance.address, value: toSender.plus(toReceiver)})
      await assert.isRejected(gaser.logGas('Bidirectional.close', instance.close(toSender, toReceiver, '0xdead', receiverSig)))
      await assert.isRejected(gaser.logGas('Bidirectional.close', instance.close(toSender, toReceiver, senderSig, '0xdead')))
    })
  })
})
