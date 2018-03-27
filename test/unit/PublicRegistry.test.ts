import * as chai from 'chai'
import * as BigNumber from 'bignumber.js'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../../src/index'
import * as util from 'ethereumjs-util'
import * as support from '../support'

chai.use(asPromised)

const PublicRegistry = artifacts.require<contracts.PublicRegistry.Contract>('PublicRegistry.sol')

contract('PublicRegistry', accounts => {
  let instance: contracts.PublicRegistry.Contract

  function getNonceInHex (nonce: number): string {
    return util.addHexPrefix(new BigNumber.BigNumber(nonce).toString(16))
  }

  before(async () => {
    instance = await PublicRegistry.deployed()
  })

  let nonce = 1
  let nonceHex = getNonceInHex(nonce)
  let bytecode = '5'



  // specify('PublicRegistry.deploy:instantiate the contract', async () => {
  //   let tx = await instance.deploy(bytecode, nonceHex, { from: accounts[0] })
  //   let expectedId = await instance.counterfactualAddress(bytecode, nonceHex)
  //   assert.equal(tx.logs[0].args.id, expectedId)
  //
  //   let address = tx.logs[0].args.deployed
  //   let testInstance = await TestContract.at(address)
  //   let actualNonce = await testInstance.nonce()
  //   assert.equal(actualNonce.toString(), probe.toString())
  // })

  // specify('PublicRegistry.resolve:returns actual address', async () => {
  //   await instance.deploy(bytecode, nonceHex, { from: accounts[0] })
  //   let counterfactualAddress = await instance.counterfactualAddress(bytecode, nonceHex)
  //
  //   let address = await instance.resolve(counterfactualAddress)
  //   let testInstance = await TestContract.at(address)
  //   let actualNonce = await testInstance.nonce()
  //   assert.equal(actualNonce.toString(), probe.toString())
  // })
  //
  // specify('PublicRegistry.resolve:pass non-existent address', async () => {
  //   nonce++
  //   nonceHex = getNonceInHex(nonce)
  //   await instance.deploy(bytecode, nonceHex, { from: accounts[0] })
  //   try {
  //     await instance.resolve('0x123456')
  //     assert(false, 'PublicRegistry must throws exception in case of non-existent counterfactualAddress was passed')
  //   } catch (e) {
  //     assert(true)
  //   }
  // })
  //
  // specify('PublicRegistry.resolve:pass non-existent address', async () => {
  //   nonce++
  //   nonceHex = getNonceInHex(nonce)
  //   await instance.deploy(bytecode, nonceHex, { from: accounts[0] })
  //   try {
  //     await instance.resolve('0x123456')
  //     assert(false, 'PublicRegistry must throws exception in case of non-existent counterfactualAddress was passed')
  //   } catch (e) {
  //     assert(true)
  //   }
  // })

  specify('PublicRegistry.counterfactualAddress:All right', async () => {
    nonce = 2
    nonceHex = getNonceInHex(nonce)
    await instance.deploy(bytecode, '2', { from: accounts[0] })
    // let address = await instance.counterfactualAddress('Я', '0')
    console.log('nonceHex: ' + nonceHex)
    let address = await instance.counterfactualAddress(bytecode, '0x32')
    // console.log('bytecode: ', bytecode.substring(2))
    // let addressUtils = createKeccakHash('keccak256').update('').digest().toString('hex')
    // let bytesValue: support.Solidity.Bytes = new support.Solidity.Bytes(bytecode.substring(2))
    // let bytes32Value: support.Solidity.Bytes32 = new support.Solidity.Bytes32('2')
    let bytesValue: support.Solidity.Bytes = new support.Solidity.Bytes(bytecode)
    let bytes32Value: support.Solidity.Bytes32 = new support.Solidity.Bytes32('2')
   // console.log(support.Solidity.solidityConvertToBytes(0))
    console.log('keccak = ' + address)
    console.log('bytecode = ' + bytecode)
    console.log('bytesValue = ' + bytesValue.toString())
    console.log('bytes32Value = ' + bytes32Value.toString())
    console.log('auxKeccak = ' + support.Solidity.keccak(bytesValue,bytes32Value))
    // eb3.sha3(leftPad((1).toString(16), 64, 0), { encoding: 'hex' })
    // try {
    //   await instance.resolve('0x123456')
    //   assert(false, 'PublicRegistry must throws exception in case of non-existent counterfactualAddress was passed')
    // } catch (e) {
    //   assert(true)
    // }
  })
})
