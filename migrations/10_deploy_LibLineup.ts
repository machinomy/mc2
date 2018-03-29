import * as Deployer from 'truffle-deployer'

const LibLineup = artifacts.require('LibLineup')
const LibMultisig = artifacts.require('LibMultisig')
const LibCommon = artifacts.require('LibCommon')

module.exports = function (deployer: Deployer) {
  LibLineup.link(LibMultisig)
  LibLineup.link(LibCommon)
  return deployer.deploy(LibLineup)
}
