import * as chai from 'chai'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../src/index'
import { default as MerkleTree } from '../src/MerkleTree'
import * as BigNumber from 'bignumber.js'
import * as utils from 'ethereumjs-util'


chai.use(asPromised)

const assert = chai.assert

const ECRecovery = artifacts.require<contracts.ECRecovery.Contract>('ECRecovery.sol')

const Lineup = artifacts.require<contracts.Lineup.Contract>('Lineup.sol')

contract('Lineup', accounts => {
  const sender = accounts[0]

  let lineup: contracts.Lineup.Contract

  const LibCommon = artifacts.require('LibCommon.sol')

  before(async () => {
    Lineup.link(LibCommon)
    Lineup.link(ECRecovery)
    lineup = await Lineup.new(sender, 100, 0x0)
  })

  specify('Lineup::check update', async () => {
    let elements = [1, 2, 3].map(e => utils.sha3(e))
    let merkleTree = new MerkleTree(elements)
    await lineup.update(new BigNumber.BigNumber(42), utils.bufferToHex(merkleTree.root), {from: sender})
    let nonce = (await lineup.state())[1] // nonce()
    assert.equal(nonce.toNumber(), 42)
  })
})
