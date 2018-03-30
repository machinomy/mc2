import * as Web3 from 'web3'
import * as chai from 'chai'
import * as BigNumber from 'bignumber.js'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../../src/index'
import * as util from 'ethereumjs-util'
import * as truffle from 'truffle-contract'

import TestContractWrapper from '../../build/wrappers/TestContract'
import { InstantiationFactory, BytecodeManager } from '../support/index'
import MerkleTree from '../../src/MerkleTree'

chai.use(asPromised)

const web3 = (global as any).web3 as Web3
const assert = chai.assert

const ECRecovery = artifacts.require<contracts.ECRecovery.Contract>('ECRecovery.sol')
const PublicRegistry = artifacts.require<contracts.PublicRegistry.Contract>('PublicRegistry.sol')
const Multisig = artifacts.require<contracts.Multisig.Contract>('Multisig.sol')
const Lineup = artifacts.require<contracts.Lineup.Contract>('Lineup.sol')
const Conditional = artifacts.require<contracts.Conditional.Contract>('Conditional.sol')
const LibCommon = artifacts.require('LibCommon.sol')
const LibMultisig = artifacts.require('LibMultisig.sol')
const LibLineup = artifacts.require('LibLineup.sol')

const TestContract: truffle.TruffleContract<TestContractWrapper.Contract> = artifacts.require<TestContractWrapper.Contract>('TestContract.sol')


contract('ConditionalCall', accounts => {
  let registry: contracts.PublicRegistry.Contract
  let conditional: contracts.Conditional.Contract
  let multisig: contracts.Multisig.Contract
  let counterFactory: InstantiationFactory
  let bytecodeManager: BytecodeManager

  let sender = accounts[0]
  let receiver = accounts[1]

  before(async () => {
    Multisig.link(ECRecovery)
    Multisig.link(LibCommon)
    Multisig.link(LibMultisig)
    multisig = await Multisig.new(sender, receiver) // TxCheck
    registry = await PublicRegistry.deployed()

    counterFactory = new InstantiationFactory(web3, multisig)
    conditional = await Conditional.new()

    bytecodeManager = new BytecodeManager(web3)
    await bytecodeManager.addLink(LibCommon, 'LibCommon')
    await bytecodeManager.addLink(LibLineup, 'LibLineup')
  })

  let registryNonce = util.bufferToHex(Buffer.from('secret'))

  describe('.execute', () => {
    specify('call deployed contract', async () => {
      let testContract = await TestContract.new(1)
      assert.equal((await testContract.nonce()).toNumber(), 1)
      let newNonce = new BigNumber.BigNumber(10)

      let bytecode = testContract.updateNonce.request(newNonce).params[0].data
      let codeHash = await conditional.callHash(testContract.address, new BigNumber.BigNumber(0), bytecode)

      let merkleTree = new MerkleTree([util.toBuffer(codeHash)])

      let lineupB = bytecodeManager.constructBytecode(Lineup, util.bufferToHex(merkleTree.root), 0, multisig.address)
      let lineupCAddress = await registry.counterfactualAddress(lineupB, registryNonce)
      let lineupI = await counterFactory.call(registry.deploy.request(lineupB, registryNonce))
      await counterFactory.execute(lineupI)

      let proof = Buffer.concat(merkleTree.proof(util.toBuffer(codeHash))) // merkleTree.proof(codeHash)
      await conditional.doCall(registry.address, lineupCAddress, util.bufferToHex(proof), testContract.address, new BigNumber.BigNumber(0), bytecode)
      let actualNonce = await testContract.nonce()
      assert.equal(actualNonce.toNumber(), newNonce.toNumber())
    })
  })
})
