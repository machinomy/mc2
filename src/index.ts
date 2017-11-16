import Web3 = require('web3')

const truffleContract = require('truffle-contract')
import { Broker } from '../types/Broker'
import { TokenBroker } from '../types/TokenBroker'
import { sign, soliditySHA3 } from '../helpers/sign'
export { sign, soliditySHA3 }

const TokenBrokerJson = require('../build/contracts/TokenBroker.json')
const BrokerJson = require('../build/contracts/Broker.json')
const ERC20Json = require('../build/contracts/ERC20.json')

export interface TruffleContract<A> {
  deployed (): Promise<A>
}

export let buildERC20Contract = (address: string, web3: Web3): Promise<any> => {
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((error, result) => {
      if (error) {
        return reject(error)
      }
      let networks: any = {}
      networks[result] = { address }
      Object.assign(ERC20Json, { networks } )
      const ERC20Contract = truffleContract(ERC20Json)
      ERC20Contract.setProvider(web3.currentProvider)
      resolve(ERC20Contract)
    })
  })
}

export let buildBrokerContract = (web3: Web3): TruffleContract<Broker.Contract> => {
  const contract = truffleContract(BrokerJson)
  contract.setProvider(web3.currentProvider)
  return contract
}

export let buildTokenBrokerContract = (web3: Web3): TruffleContract<TokenBroker.Contract> => {
  const contract = truffleContract(TokenBrokerJson)
  contract.setProvider(web3.currentProvider)
  return contract
}
