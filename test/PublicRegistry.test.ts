import * as Web3 from 'web3'
import * as chai from 'chai'
import * as BigNumber from 'bignumber.js'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../src/index'
import * as util from 'ethereumjs-util'
import * as support from './support'
import TestContractWrapper from '../build/wrappers/TestContract'

chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert

const PublicRegistry = artifacts.require<contracts.PublicRegistry.Contract>('PublicRegistry.sol')
const TestContract = artifacts.require<TestContractWrapper.Contract>('TestContract.sol')

contract('PublicRegistry', accounts => {
  let instance: contracts.PublicRegistry.Contract

  before(async () => {
    instance = await PublicRegistry.deployed()
  })

  let nonce = util.addHexPrefix(new BigNumber.BigNumber(1).toString(16))
  let probe = 42
  let bytecode = support.constructorBytecode(web3, TestContract, probe)

  describe('.deploy', () => {
    specify('instantiate the contract', async () => {
      let tx = await instance.deploy(bytecode, nonce, { from: accounts[0] })
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
