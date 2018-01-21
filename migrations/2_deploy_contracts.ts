import * as Deployer from 'truffle-deployer'

const Broker = artifacts.require('Broker.sol')
const TokenBroker = artifacts.require('TokenBroker.sol')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(Broker, deployer.network_id).then(() => {
    return deployer.deploy(TokenBroker, deployer.network_id)
  })
}
