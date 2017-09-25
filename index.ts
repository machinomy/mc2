import Web3 = require('web3')

import BrokerTokenJson from './build/contracts/BrokerToken'
import BrokerJson from './build/contracts/Broker'
import ERC20Json from './build/contracts/ERC20'

const truffleContract = require('truffle-contract')
const BrokerTokenContract = truffleContract(BrokerTokenJson)
const BrokerContract = truffleContract(BrokerJson)
const provider = new Web3.providers.HttpProvider('http://localhost:8545')

BrokerTokenContract.setProvider(provider)
BrokerContract.setProvider(provider)

let buildERC20Contract = (address: string) => {
  Object.assign(ERC20Json, { networks: {'1506328416520': {address}}} )
  const ERC20Contract = truffleContract(ERC20Json)
  ERC20Contract.setProvider(provider)
  return ERC20Contract
}

export { BrokerContract, BrokerTokenContract, buildERC20Contract}



