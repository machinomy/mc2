import * as Deployer from 'truffle-deployer'

const Conditional = artifacts.require('Conditional')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(Conditional)
}
