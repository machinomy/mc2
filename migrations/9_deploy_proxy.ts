import * as Deployer from 'truffle-deployer'

const Proxy = artifacts.require('Proxy')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(Proxy)
}
