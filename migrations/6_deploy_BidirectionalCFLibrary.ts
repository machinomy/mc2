import * as Deployer from 'truffle-deployer'

const ECRecovery = artifacts.require('ECRecovery.sol')
const BidirectionalCFLibrary = artifacts.require('BidirectionalCFLibrary.sol')


module.exports = function (deployer: Deployer) {
  return deployer.deploy(ECRecovery).then(() => {
    return deployer.link(ECRecovery, BidirectionalCFLibrary)
  }).then(() => {
    return deployer.deploy(BidirectionalCFLibrary)
  })
}
