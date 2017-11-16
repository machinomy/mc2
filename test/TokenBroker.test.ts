import Web3 = require('web3')
import chai = require('chai')
import TokenBroker from '../src/TokenBroker'
import BigNumber from 'bignumber.js'
import {ERC20Example, getNetwork} from './support'
import {sign, paymentDigest} from "../src/index";

const expect = chai.expect

const web3 = (global as any).web3 as Web3

interface Setup {
  broker: TokenBroker.Contract
  token: ERC20Example.Contract
}

contract('TokenBroker', async accounts => {
  let owner = accounts[0]
  let sender = accounts[1]
  let receiver = accounts[2]
  let startChannelValue = new BigNumber(2)

  const setup = async function (): Promise<Setup> {
    let token = await ERC20Example.deploy(web3.currentProvider, { from: owner, gas: 700000 })
    let broker = await TokenBroker.deployed(web3.currentProvider)
    await token.mint(owner, 100, { from: owner })
    await token.mint(sender, 100, { from: owner })
    await token.mint(receiver, 100, { from: owner })
    return { broker, token }
  }

  it('create channel', async () => {
    let { broker, token } = await setup()
    let startBalance = await token.balanceOf(broker.address)

    await token.approve(broker.address, startChannelValue, {from: sender})
    await broker.createChannel(token.address, receiver, 100, 1, startChannelValue, {from: sender, gas: 200000});

    let newBalance = await token.balanceOf(broker.address)
    expect(newBalance).to.deep.equal(startBalance.plus(startChannelValue))
  })

  it("makes deposit", async () => {
    let { broker, token } = await setup()

    await token.approve(broker.address, startChannelValue, { from: sender })
    const res = await broker.createChannel(token.address, receiver, 100, 1, startChannelValue, { from: sender, gas: 220000 });

    const channelId = res.logs[0].args.channelId
    let startBalance = await token.balanceOf(broker.address)

    await token.approve(broker.address, startChannelValue, { from: sender })
    await broker.deposit(token.address, channelId, startChannelValue, { from: sender });

    let newBalance = await token.balanceOf(broker.address)
    expect(newBalance).to.deep.equal(startBalance.plus(startChannelValue))
  })

  it('claimed by receiver', async () => {
    let { broker, token } = await setup()

    await token.approve(broker.address, startChannelValue, { from: sender })
    const res = await broker.createChannel(token.address, receiver, 100, 1, startChannelValue, { from: sender, gas: 200000 });
    const channelId = res.logs[0].args.channelId

    const chainId = await getNetwork(web3)
    const digest = paymentDigest(channelId, startChannelValue, broker.address, chainId)
    const signature = await sign(web3, sender, digest)
    const v = signature.v
    const r = '0x' + signature.r.toString('hex')
    const s = '0x' + signature.s.toString('hex')

    const startReceiverBalance = await token.balanceOf(receiver)
    await broker.claim(token.address, channelId, startChannelValue, Number(v), r, s, {from: receiver, gas: 200000})
    const newReceiverBalance = await token.balanceOf(receiver)

    expect(newReceiverBalance).to.deep.equal(startReceiverBalance.plus(startChannelValue))
  })

  it(`closed by sender`, async () => {
    let { broker, token } = await setup()

    await token.approve(broker.address, startChannelValue, { from: sender })
    const res = await broker.createChannel(token.address, receiver, 100, 1, startChannelValue, { from: sender, gas: 200000 });
    const channelId = res.logs[0].args.channelId

    const startBalance = await token.balanceOf(receiver)

    await broker.startSettle(channelId, startChannelValue, {from: sender})

    expect(async () => {
      await broker.finishSettle(token.address, channelId, { from: sender })
    }).to.throw

    const finishBalance = await token.balanceOf(receiver)
    expect(finishBalance).to.deep.equal(startBalance)
  })

  it(`closed by sender, then by receiver`, async () => {
    let { broker, token } = await setup()

    await token.approve(broker.address, startChannelValue, { from: sender })
    const res = await broker.createChannel(token.address, receiver, 100, 1, startChannelValue, { from: sender, gas: 200000 });
    const channelId = res.logs[0].args.channelId

    await broker.startSettle(channelId, startChannelValue, {from: sender})

    const chainId = await getNetwork(web3)
    const digest = paymentDigest(channelId, startChannelValue, broker.address, chainId)
    const signature = await sign(web3, sender, digest)
    const v = signature.v
    const r = '0x' + signature.r.toString('hex')
    const s = '0x' + signature.s.toString('hex')

    const balanceBefore = await token.balanceOf(receiver)
    await broker.claim(token.address, channelId, startChannelValue, Number(v), r, s, {from: receiver, gas: 200000})
    const balanceAfter = await token.balanceOf(receiver)

    expect(balanceAfter).to.deep.equal(balanceBefore.plus(startChannelValue))
  })

})
