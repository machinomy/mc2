import * as chai from 'chai'
import * as asPromised from 'chai-as-promised'
import * as Web3 from 'web3'
import * as BigNumber from 'bignumber.js'
import * as util from 'ethereumjs-util'
import * as contracts from '../../src/index'
import * as support from '../support'
import MerkleTree from '../../src/MerkleTree'


chai.use(asPromised)

const assert = chai.assert
const web3 = (global as any).web3 as Web3
const gaser = new support.Gaser(web3)

const Lineup = artifacts.require<contracts.Lineup.Contract>('Lineup.sol')
const LibLineup = artifacts.require('LibLineup.sol')

contract('Lineup', accounts => {
  let lineup: contracts.Lineup.Contract

  const sender = accounts[0]
  const elements = [1, 2, 3].map(e => util.sha3(e))
  const merkleTree = new MerkleTree(elements)

  before(async () => {
    Lineup.link(LibLineup)
    lineup = await gaser.gasDiff('Lineup.new', sender, async () => {
      return await Lineup.new(0x0, 100, { from: sender })
    })
  })

  describe('.update', async () => {
    let nonce = new BigNumber.BigNumber(42)
    let merkleRoot = util.bufferToHex(merkleTree.root)

    specify('set new state', async () => {
      await gaser.gasDiff('Lineup.update', sender, async () => {
        await lineup.update(nonce, merkleRoot, {from: sender})
      })
      let updatedNonce = (await lineup.state())[0]
      assert.equal(updatedNonce.toNumber(), nonce.toNumber())
      let updatedMerkleRoot = (await lineup.state())[1]
      assert.equal(updatedMerkleRoot.toString(), merkleRoot)
    })
    specify('not if late', async () => {
      let lineup = await Lineup.new(0x0, 0)
      web3.eth.sendTransaction({from: sender, to: accounts[1], value: 1}) // 1 block
      await assert.isRejected(lineup.update(nonce, merkleRoot, {from: sender}))
    })
    specify('not if earlier nonce')
    specify('not if not multisig participant')
  })

  describe('.isContained', async () => {
    specify('ok if contained', async () => {
      let updatePeriod = new BigNumber.BigNumber(0)
      let merkleRoot = util.bufferToHex(merkleTree.root)
      let element = elements[0]
      let proof = util.bufferToHex(Buffer.concat(merkleTree.proof(element)))

      let lineup = await Lineup.new(merkleRoot, updatePeriod)

      assert.isTrue(merkleTree.verify(merkleTree.proof(element), element))
      assert.isTrue(await lineup.isContained(proof, util.bufferToHex(element)))
    })
    specify('not if late')
    specify('not if wrong proof')
  })
})
