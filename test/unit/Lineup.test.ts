import * as chai from 'chai'
import * as asPromised from 'chai-as-promised'
import * as Web3 from 'web3'
import * as BigNumber from 'bignumber.js'
import * as util from 'ethereumjs-util'
import * as contracts from '../../src/index'
import * as support from '../support'
import MerkleTree from '../../src/MerkleTree'
import * as abi from 'ethereumjs-abi'
import { HexString } from '../support/index'

chai.use(asPromised)

const assert = chai.assert
const web3 = (global as any).web3 as Web3
const gaser = new support.Gaser(web3)

const Lineup = artifacts.require<contracts.Lineup.Contract>('Lineup.sol')
const Multisig = artifacts.require<contracts.Multisig.Contract>('Multisig.sol')
const LibLineup = artifacts.require('LibLineup.sol')
const LibMultisig = artifacts.require('LibMultisig.sol')
const LibCommon = artifacts.require('LibCommon.sol')

Multisig.link(LibCommon)
Multisig.link(LibMultisig)
Lineup.link(LibLineup)
Lineup.link(LibCommon)

const elements = [1, 2, 3].map(e => util.sha3(e))
const merkleTree = new MerkleTree(elements)

function sign (account: string, merkleRoot: HexString, nonce: BigNumber.BigNumber) {
  let operationHash = util.bufferToHex(abi.soliditySHA3(
    ['bytes32', 'uint256'],
    [merkleRoot, nonce.toString()]
  )) // TODO Make it different for call and delegatecall
  return web3.eth.sign(account, operationHash)
}


contract('Lineup', accounts => {
  let lineup: contracts.Lineup.Contract
  let multisig: contracts.Multisig.Contract

  const sender = accounts[0]
  const receiver = accounts[1]

  before(async () => {
    multisig = await Multisig.new(sender, receiver, {from: sender})
    lineup = await gaser.gasDiff('Lineup.new', sender, async () => {
      return await Lineup.new(0x0, 100, multisig.address, { from: sender })
    })
  })

  describe('.update', async () => {
    let nonce = new BigNumber.BigNumber(42)
    let merkleRoot = util.bufferToHex(merkleTree.root)
    let senderSig = sign(sender, merkleRoot, nonce)
    let receiverSig = sign(receiver, merkleRoot, nonce)

    specify('set new state', async () => {
      await gaser.gasDiff('Lineup.update', sender, async () => {
        await lineup.update(nonce, merkleRoot, senderSig, receiverSig)
      })
      let updatedNonce = (await lineup.state())[0]
      assert.equal(updatedNonce.toNumber(), nonce.toNumber())
      let updatedMerkleRoot = (await lineup.state())[1]
      assert.equal(updatedMerkleRoot.toString(), merkleRoot)
    })
    specify('not if late', async () => {
      let lineup = await Lineup.new(0x0, 0, multisig.address)
      web3.eth.sendTransaction({from: sender, to: accounts[1], value: 1}) // 1 block
      await assert.isRejected(lineup.update(nonce, merkleRoot, senderSig, receiverSig))
    })
    specify('not if earlier nonce', async () => {
      await assert.isRejected(lineup.update(nonce.minus(1), merkleRoot, senderSig, receiverSig))
    })
    specify('not if not signed', async () => {
      await assert.isRejected(lineup.update(nonce.plus(1), merkleRoot, '0xdead', receiverSig))
      await assert.isRejected(lineup.update(nonce.plus(1), merkleRoot, senderSig, '0xdead'))
    })
  })

  describe('.isContained', async () => {
    specify('ok if contained', async () => {
      let updatePeriod = new BigNumber.BigNumber(0)
      let merkleRoot = util.bufferToHex(merkleTree.root)
      let element = elements[0]
      let proof = util.bufferToHex(Buffer.concat(merkleTree.proof(element)))

      let lineup = await Lineup.new(merkleRoot, updatePeriod, multisig.address)

      assert.isTrue(merkleTree.verify(merkleTree.proof(element), element))
      assert.isTrue(await lineup.isContained(proof, util.bufferToHex(element)))
    })
    specify('not if late')
    specify('not if wrong proof')
  })
})
