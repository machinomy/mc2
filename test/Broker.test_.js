// Specifically request an abstraction for MetaCoin
var TestRPC = require('ethereumjs-testrpc')
var Web3 = require('web3')
var Buffer = require('buffer').Buffer
var helpers = require('../helpers/sign')
var ethHash = helpers.ethHash
var soliditySHA3 = helpers.soliditySHA3
var sign = helpers.sign
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var Broker = artifacts.require("Broker");
var expect = require("chai").expect;
var getNetwork = require('../helpers/web3').getNetwork

contract('Broker', (accounts) => {
  var instance
  var sender
  var receiver
  var createChannel = async (instance, sender, receiver) => {
    const log = await instance.createChannel(receiver, 100, 1, {from: sender, value: web3.toWei(1, "ether")})
    const event = log.logs[0]
    return event
  }

  beforeEach(async () => {
    instance = await Broker.deployed()
    sender = accounts[0];
    receiver = accounts[1];
  })

  it('creates channel', async () => {
    const event = await createChannel(instance, sender, receiver)

    expect(event.event).to.equal("DidCreateChannel")
    expect(event.args.channelId).to.be.a("string");
  })

  it('makes deposit', async () => {
    const startBalance = Number(web3.fromWei((await web3.eth.getBalance(instance.address).toNumber())))
    const event = await createChannel(instance, sender, receiver)
    const channelId = event.args.channelId
    const logDeposit = await instance.deposit(channelId, {from: accounts[0], value: web3.toWei(1, "ether")})
    const balance = Number(web3.fromWei((await web3.eth.getBalance(instance.address).toNumber())))

    expect(logDeposit.logs[0].event).to.equal("DidDeposit")    
    expect(balance).to.equal(startBalance + 2);
  })

  it('claimed by reciver', async () => {
    const event = await createChannel(instance, sender, receiver)
    const channelId = event.args.channelId
    const value = 1
    const chainId = await getNetwork(web3)
    const paymentDigest = soliditySHA3(channelId, value, instance.address, chainId)
    const signature = await sign(web3, sender, paymentDigest)
    const v = signature.v
    const r = "0x" + signature.r.toString("hex")
    const s = "0x" + signature.s.toString("hex")
    const evt = await instance.claim(channelId, value, Number(v), r, s, {from: receiver})

    expect(evt.logs[0].event).to.equal("DidSettle")
    expect(evt.logs[0].args.payment.toString()).to.equal(value.toString());
  })
  
  it("closed by sender", async () => {
    const startBalance = Number(web3.fromWei((await web3.eth.getBalance(instance.address).toNumber())))
    const event = await createChannel(instance, sender, receiver)
    const channelId = event.args.channelId
    const value = 1
    const evt = await instance.startSettle(channelId, value)
    
    expect(evt.logs[0].event).to.equal("DidStartSettle")
    
    const evt1 = await instance.finishSettle(channelId)
    expect(evt1.logs[0].event).to.equal("DidSettle")

    const balance = Number(web3.fromWei((await web3.eth.getBalance(instance.address).toNumber())))
    expect(balance).to.equal(startBalance);
  })
})

