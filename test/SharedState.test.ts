import * as chai from 'chai'
import * as asPromised from 'chai-as-promised'
import * as contracts from '../src/index'
import { default as MerkleTree } from '../src/MerkleTree'
import * as utils from 'ethereumjs-util'


chai.use(asPromised)

const assert = chai.assert

const ECRecovery = artifacts.require<contracts.ECRecovery.Contract>('ECRecovery.sol')

const SharedState = artifacts.require<contracts.SharedState.Contract>('SharedState.sol')

contract('SharedState', accounts => {
  const sender = accounts[0]

  let sharedState: contracts.SharedState.Contract

  before(async () => {
    SharedState.link(ECRecovery)
    sharedState = await SharedState.new(sender, 100, 0x0)
  })

  specify('SharedState::check update', async () => {
    let elements = [1, 2, 3].map(e => utils.sha3(e))
    let merkleTree = new MerkleTree(elements)
    await sharedState.update(42, utils.bufferToHex(merkleTree.root), {from: sender})
    let nonce = await sharedState.nonce.call()
    assert.equal(nonce.toNumber(), 42)
  })
})
