import * as Deployer from 'truffle-deployer'

const ECRecovery = artifacts.require('ECRecovery.sol')
const LibMultisig = artifacts.require('LibMultisig.sol')
const LibCommon = artifacts.require('LibCommon.sol')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(ECRecovery).then(() => {
    return deployer.link(ECRecovery, LibMultisig)
  }).then(() => {
    return deployer.deploy(LibCommon)
  }).then(() => {
    return deployer.link(LibCommon, LibMultisig)
  }).then(() => {
    return deployer.deploy(LibMultisig)
  })
}
