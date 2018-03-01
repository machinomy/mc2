import * as Deployer from 'truffle-deployer'

const ECRecovery = artifacts.require('./ECRecovery.sol')
const SafeMath = artifacts.require('./SafeMath.sol')
const Unidirectional = artifacts.require('./Unidirectional.sol')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(ECRecovery).then(() => {
    return deployer.link(ECRecovery, Unidirectional)
  }).then(() => {
    return deployer.deploy(SafeMath)
  }).then(() => {
    return deployer.link(SafeMath, Unidirectional)
  }).then(() => {
    return deployer.deploy(Unidirectional)
  })
}
