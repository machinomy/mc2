import * as Deployer from 'truffle-deployer'

const PublicRegistry = artifacts.require('PublicRegistry')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(PublicRegistry)
}
