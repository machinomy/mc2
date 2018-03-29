import * as chai from 'chai'
import * as Web3 from 'web3'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../src/index'
import * as support from './support'
import * as BigNumber from 'bignumber.js'
import * as wrappers from '../build/wrappers'
import { InstantiationFactory } from './support/index'


chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert


const ECRecovery = artifacts.require<contracts.ECRecovery.Contract>('ECRecovery.sol')
const Multisig = artifacts.require<contracts.Multisig.Contract>('Multisig.sol')
const LibMultisig = artifacts.require('LibMultisig.sol')
const LibCommon = artifacts.require('LibCommon.sol')

const DistributeEth = artifacts.require<contracts.DistributeEth.Contract>('DistributeEth.sol')

const TestToken = artifacts.require<wrappers.TestToken.Contract>('TestToken.sol')
const DistributeToken = artifacts.require<contracts.DistributeToken.Contract>('DistributeToken.sol')



const amountA = new BigNumber.BigNumber(10)
const amountB = new BigNumber.BigNumber(20)

contract('Cooperative', accounts => {
  let addressA = accounts[4]
  let addressB = accounts[5]

  let counterFactory: support.InstantiationFactory
  let multisig: contracts.Multisig.Contract

  let distributeEth: contracts.DistributeEth.Contract
  let token: wrappers.TestToken.Contract
  let distributeToken: contracts.DistributeToken.Contract

  before(async () => {
    Multisig.link(ECRecovery)
    LibMultisig.link(LibCommon)
    Multisig.link(LibMultisig)

    distributeEth = await DistributeEth.new()
    multisig = await Multisig.new(addressA, addressB)
    counterFactory = new InstantiationFactory(web3, multisig)

    token = await TestToken.new()
    await token.mint(multisig.address, amountB.plus(amountA))
    await token.finishMinting()
    distributeToken = await DistributeToken.new()
  })

  specify('distribute Ether', async () => {
    let transfer = distributeEth.execute.request(addressA, addressB, amountA, amountB)
    let command = await counterFactory.delegatecall(transfer)
    web3.eth.sendTransaction({from: accounts[0], to: multisig.address, value: amountB.plus(amountA)})
    let beforeA = web3.eth.getBalance(addressA)
    let beforeB = web3.eth.getBalance(addressB)
    await multisig.doDelegate(command.destination, command.callBytecode, command.senderSig, command.receiverSig)
    let afterA = web3.eth.getBalance(addressA)
    let afterB = web3.eth.getBalance(addressB)
    assert.equal(afterA.minus(beforeA).toString(), amountA.toString())
    assert.equal(afterB.minus(beforeB).toString(), amountB.toString())
    assert.equal(web3.eth.getBalance(multisig.address).toNumber(), 0)
  })

  specify('move  Tokens', async () => {
    let nonce = (await multisig.state())[2]
    let transferTokens = distributeToken.execute.request(token.address, addressA, addressB, amountA, amountB)
    let command = await counterFactory.delegatecall(transferTokens, nonce)
    await support.assertTokenBalance(token, addressA, 0)
    await support.assertTokenBalance(token, addressB, 0)
    await support.assertTokenBalance(token, multisig.address, amountB.plus(amountA))
    await multisig.doDelegate(command.destination, command.callBytecode, command.senderSig, command.receiverSig)
    await support.assertTokenBalance(token, addressA, amountA)
    await support.assertTokenBalance(token, addressB, amountB)
    await support.assertTokenBalance(token, multisig.address, 0)
  })
})
