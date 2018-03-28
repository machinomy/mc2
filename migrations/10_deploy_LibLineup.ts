import * as Deployer from 'truffle-deployer'

const LibLineup = artifacts.require('LibLineup')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(LibLineup)
}
