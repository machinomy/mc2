import * as Deployer from 'truffle-deployer'

const TransferToken = artifacts.require('TransferToken')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(TransferToken)
}
