// Specifically request an abstraction for MetaCoin
var TestRPC = require("ethereumjs-testrpc");
var Web3 = require("web3");

let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var Broker = artifacts.require("Broker");
contract('Broker', (accounts) => {
  it("creates channel", async () => {
    let instance = await Broker.deployed()
    let log = await instance.createChannel(accounts[1], 100, 1, {from: accounts[0], value: web3.toWei(1, "ether")})
    let event = log.logs[0]
    assert.equal(event.event, 'DidCreateChannel')
    assert.isString(event.args.channelId);
  });

  it("makes deposit", async () => {
    let instance = await Broker.deployed()
    let startBalance = Number(web3.fromWei((await web3.eth.getBalance(instance.address).toNumber())))

    let log = await instance.createChannel(accounts[1], 100, 1, {from: accounts[0], value: web3.toWei(1, "ether")})
    let event = log.logs[0]
    let channelId = event.args.channelId
    let logDeposit = await instance.deposit(channelId, {from: accounts[0], value: web3.toWei(1, "ether")})

    let balance = Number(web3.fromWei((await web3.eth.getBalance(instance.address).toNumber())))
    assert.equal(balance, startBalance + 2)
  });

  xit("closes channel by sender", async () => {});
  xit("closes channel by receiver", async () => {});
});

