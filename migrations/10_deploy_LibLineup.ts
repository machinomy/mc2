import * as Deployer from 'truffle-deployer'

const LibLineup = artifacts.require('LibLineup')
const LibMultisig = artifacts.require('LibMultisig')

module.exports = function (deployer: Deployer) {
  LibLineup.link(LibMultisig)
  return deployer.deploy(LibLineup)
}
