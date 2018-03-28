import * as Deployer from 'truffle-deployer'

const LibCommon = artifacts.require('LibCommon')
const LibBidirectional = artifacts.require('LibBidirectional.sol')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(LibCommon).then(() => {
    return deployer.link(LibCommon, LibBidirectional)
  }).then(() => {
    return deployer.deploy(LibBidirectional)
  })
}
