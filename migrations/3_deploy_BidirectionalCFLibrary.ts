import * as Deployer from 'truffle-deployer'

const ECRecovery = artifacts.require('ECRecovery.sol')
const LibCommon = artifacts.require('LibCommon')
const BidirectionalCFLibrary = artifacts.require('BidirectionalCFLibrary.sol')


module.exports = function (deployer: Deployer) {
  return deployer.deploy(LibCommon).then(() => {
    return deployer.link(LibCommon, BidirectionalCFLibrary)
  }).then(() => {
    return deployer.deploy(ECRecovery).then(() => {
      return deployer.link(ECRecovery, BidirectionalCFLibrary)
    })
  }).then(() => {
    return deployer.deploy(BidirectionalCFLibrary)
  })
}
