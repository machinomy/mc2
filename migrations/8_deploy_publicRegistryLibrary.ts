import * as Deployer from 'truffle-deployer'

const PublicRegistry = artifacts.require('PublicRegistry')
const PublicRegistryLibrary = artifacts.require('PublicRegistryLibrary')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(PublicRegistryLibrary).then(() => {
    return deployer.link(PublicRegistryLibrary, PublicRegistry)
  }).then(() => {
    return deployer.deploy(PublicRegistry)
  })
}
