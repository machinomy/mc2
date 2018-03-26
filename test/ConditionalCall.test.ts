import * as Web3 from 'web3'
import * as chai from 'chai'
import * as BigNumber from 'bignumber.js'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../src/index'
import * as util from 'ethereumjs-util'
import * as truffle from 'truffle-contract'

import TestContractWrapper from '../build/wrappers/TestContract'
import { InstantiationFactory, BytecodeManager } from './support/index'

chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert

const ECRecovery = artifacts.require<contracts.ECRecovery.Contract>('ECRecovery.sol')
const PublicRegistry = artifacts.require<contracts.PublicRegistry.Contract>('PublicRegistry.sol')
const Multisig = artifacts.require<contracts.Multisig.Contract>('Multisig.sol')
const Lineup = artifacts.require<contracts.Lineup.Contract>('Lineup.sol')
const ConditionalCall = artifacts.require<contracts.ConditionalCall.Contract>('ConditionalCall.sol')

const TestContract: truffle.TruffleContract<TestContractWrapper.Contract> = artifacts.require<TestContractWrapper.Contract>('TestContract.sol')


contract('ConditionalCall', accounts => {
  let registry: contracts.PublicRegistry.Contract
  let conditional: contracts.ConditionalCall.Contract
  let multisig: contracts.Multisig.Contract
  let counterFactory: InstantiationFactory

  let sender = accounts[0]
  let receiver = accounts[1]

  let bytecodeManager: BytecodeManager

  const LibCommon = artifacts.require('LibCommon.sol')
  const LibMultisig = artifacts.require('LibMultisig.sol')

  before(async () => {
    Multisig.link(ECRecovery)
    Multisig.link(LibMultisig)
    multisig = await Multisig.new(sender, receiver) // TxCheck
    registry = await PublicRegistry.deployed()

    counterFactory = new InstantiationFactory(web3, multisig)
    conditional = await ConditionalCall.new()

    bytecodeManager = new BytecodeManager(web3)
    await bytecodeManager.addLink(LibCommon, 'LibCommon')
  })

  let registryNonce = util.bufferToHex(Buffer.from('secret'))

  specify('calls deployed contract', async () => {
    let newNonce = new BigNumber.BigNumber(10)
    let testContract = await TestContract.new(42)
    let bytecode = testContract.updateNonce.request(newNonce).params[0].data

    let codeHash = await conditional.callHash(testContract.address, new BigNumber.BigNumber(0), bytecode)

    let stateBytecode = bytecodeManager.constructBytecode(Lineup, sender, 0, codeHash)
    let counterfactualAddress = await registry.counterfactualAddress(stateBytecode, registryNonce)
    let lineupInstantiation = await counterFactory.call(registry.deploy.request(stateBytecode, registryNonce))

    await counterFactory.execute(lineupInstantiation)

    // await testContract.updateNonce(new BigNumber.BigNumber(20))
    let proof = '0x0' // merkleTree.proof(codeHash)
    await conditional.execute(registry.address, counterfactualAddress, proof, testContract.address, new BigNumber.BigNumber(0), bytecode)
    let actualNonce = await testContract.nonce()
    assert.equal(actualNonce.toNumber(), newNonce.toNumber())
  })
})
