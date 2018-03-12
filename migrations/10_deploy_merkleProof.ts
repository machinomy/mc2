import * as Deployer from 'truffle-deployer'

const MerkleProof = artifacts.require('MerkleProof.sol')
const SharedState = artifacts.require('SharedState.sol')


module.exports = function (deployer: Deployer) {
  return deployer.deploy(MerkleProof).then(() => {
    return deployer.link(MerkleProof, SharedState)
  }).then(() => {
    return deployer.deploy(SharedState, '0x627306090abab3a6e1400e9345bc60c78a8bef57', '0xf17f52151ebef6c7334fad080c5704d77216b732', 0)
  })
}
