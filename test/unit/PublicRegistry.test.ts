import * as Web3 from 'web3'
import * as chai from 'chai'
import * as BigNumber from 'bignumber.js'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../../src/index'
import * as util from 'ethereumjs-util'
import * as support from '../support'
import * as wrappers from '../../build/wrappers'

chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert
const gaser = new support.Gaser(web3)

const PublicRegistry = artifacts.require<contracts.PublicRegistry.Contract>('PublicRegistry.sol')
const TestContract = artifacts.require<wrappers.TestContract.Contract>('TestContract.sol')

contract('PublicRegistry', accounts => {
  let instance: contracts.PublicRegistry.Contract

  let sender = accounts[0]

  before(async () => {
    instance = await gaser.gasDiff('PublicRegistry.new', sender, async () => {
      return await PublicRegistry.new({ from: sender })
    })
  })

  let nonce = util.addHexPrefix(new BigNumber.BigNumber(1).toString(16))
  let probe = 42
  let bytecode = support.constructorBytecode(web3, TestContract, probe)

  describe('.deploy', () => {
    specify('instantiate the contract', async () => {
      await gaser.gasDiff('TestContract.new', sender, async () => {
        await TestContract.new(nonce)
      })
      let tx = await gaser.logGas('PublicRegistry.deploy: TestContract.new', instance.deploy(bytecode, nonce, { from: accounts[0] }))
      let expectedId = await instance.counterfactualAddress(bytecode, nonce)
      assert.equal(tx.logs[0].args.id, expectedId)

      let address = tx.logs[0].args.deployed
      let testInstance = await TestContract.at(address)
      let actualNonce = await testInstance.nonce()
      assert.equal(actualNonce.toString(), probe.toString())
    })
  })

  describe('.resolve', () => {
    specify('returns actual address', async () => {
      await instance.deploy(bytecode, nonce, { from: accounts[0] })
      let counterfactualAddress = await instance.counterfactualAddress(bytecode, nonce)

      let address = await instance.resolve(counterfactualAddress)
      let testInstance = await TestContract.at(address)
      let actualNonce = await testInstance.nonce()
      assert.equal(actualNonce.toString(), probe.toString())
    })
  })
})
