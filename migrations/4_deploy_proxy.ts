import * as Deployer from 'truffle-deployer'

const Proxy = artifacts.require('Proxy')
const ProxyLibrary = artifacts.require('ProxyLibrary')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(ProxyLibrary).then(() => {
    return deployer.link(ProxyLibrary, Proxy)
  }).then(() => {
    return deployer.deploy(Proxy)
  })
}
