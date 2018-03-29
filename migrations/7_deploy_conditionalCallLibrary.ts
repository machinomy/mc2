import * as Deployer from 'truffle-deployer'

const ConditionalCall = artifacts.require('ConditionalCall')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(ConditionalCall)
}
