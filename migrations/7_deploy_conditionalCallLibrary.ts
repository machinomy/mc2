import * as Deployer from 'truffle-deployer'

const ConditionalCall = artifacts.require('ConditionalCall')
const ConditionalCallLibrary = artifacts.require('ConditionalCallLibrary')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(ConditionalCallLibrary).then(() => {
    return deployer.link(ConditionalCallLibrary, ConditionalCall)
  }).then(() => {
    return deployer.deploy(ConditionalCall)
  })
}
