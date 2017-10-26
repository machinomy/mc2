// Specifically request an abstraction for MetaCoin
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var BrokerToken = artifacts.require("TokenBroker")
var ERC20example = artifacts.require("ERC20example")
var expect = require("chai").expect
var helpers = require("../helpers/sign")
var soliditySHA3 = helpers.soliditySHA3
var digest = helpers.digest
var sign = helpers.sign
var getNetwork = require('../helpers/web3').getNetwork

contract("BrokerToken", accounts => {
  var instanceBrokerToken;
  var instanceERC20example;
  var sender;
  var receiver;
  var owner;
  const startChannelValue = 2;

  beforeEach(async () => {
    instanceBrokerToken = await BrokerToken.deployed();
    instanceERC20example = await ERC20example.deployed();
    owner = accounts[0];
    sender = accounts[1];
    receiver = accounts[2];
    await instanceERC20example.mint(owner, 100)
    await instanceERC20example.mint(sender, 100)
    await instanceERC20example.mint(receiver, 100)
  });

  it("creates channel", async () => {
    let startBalance = (await instanceERC20example.balanceOf(instanceBrokerToken.address)).toNumber()

    await instanceERC20example.approve(instanceBrokerToken.address, startChannelValue, {from: sender})
    await instanceBrokerToken.createChannel(instanceERC20example.address, receiver, 100, 1, startChannelValue, {from: sender});

    let newBalance = (await instanceERC20example.balanceOf(instanceBrokerToken.address)).toNumber()
    expect(newBalance).to.equal(startBalance + startChannelValue);
  });

  it("makes deposit", async () => {
    await instanceERC20example.approve(instanceBrokerToken.address, startChannelValue, { from: sender })
    const res = await instanceBrokerToken.createChannel(instanceERC20example.address, receiver, 100, 1, startChannelValue, { from: sender });
    const channelId = res.logs[0].args.channelId
    let startBalance = (await instanceERC20example.balanceOf(instanceBrokerToken.address)).toNumber()
    
    await instanceERC20example.approve(instanceBrokerToken.address, startChannelValue, { from: sender })
    await instanceBrokerToken.deposit(instanceERC20example.address, channelId, startChannelValue, { from: sender });

    let newBalance = (await instanceERC20example.balanceOf(instanceBrokerToken.address)).toNumber()
    expect(newBalance).to.equal(startBalance + startChannelValue);
  });

   it("claimed by reciver", async () => {
     await instanceERC20example.approve(instanceBrokerToken.address, startChannelValue, { from: sender })
     const res = await instanceBrokerToken.createChannel(instanceERC20example.address, receiver, 100, 1, startChannelValue, { from: sender });
     const channelId = res.logs[0].args.channelId
     const chainId = await getNetwork(web3)
     const paymentDigest = soliditySHA3(channelId, startChannelValue, instanceBrokerToken.address, chainId)
    
     const signature = await sign(web3, sender, paymentDigest);
     const v = signature.v;
     const r = "0x" + signature.r.toString("hex");
     const s = "0x" + signature.s.toString("hex");

     const startReciverBalance = (await instanceERC20example.balanceOf(receiver)).toNumber()

     await instanceBrokerToken.claim(instanceERC20example.address, channelId, startChannelValue, Number(v), r, s, {from: receiver});
     const newReciverBalance = (await instanceERC20example.balanceOf(receiver)).toNumber()

     expect(newReciverBalance).to.equal(startReciverBalance + startChannelValue);
   });

   it("closed by sender", async () => {
     await instanceERC20example.approve(instanceBrokerToken.address, startChannelValue, { from: sender })
     const res = await instanceBrokerToken.createChannel(instanceERC20example.address, receiver, 100, 1, startChannelValue, { from: sender });
     const channelId = res.logs[0].args.channelId

     const startReciverBalance = (await instanceERC20example.balanceOf(receiver)).toNumber()

     await instanceBrokerToken.startSettle(channelId, startChannelValue, {from: sender})
     await instanceBrokerToken.finishSettle(instanceERC20example.address, channelId, {from: sender})

     const newReciverBalance = (await instanceERC20example.balanceOf(receiver)).toNumber()
     expect(newReciverBalance).to.equal(startReciverBalance + startChannelValue);
   });
});
