import Web3 = require('web3')

import TokenBrokerJson from './build/contracts/TokenBroker'
import BrokerJson from './build/contracts/Broker'
import ERC20Json from './build/contracts/ERC20'
const truffleContract = require('truffle-contract')
import { Broker } from './types/Broker'
import { TokenBroker } from './types/TokenBroker'
import { sign, soliditySHA3 } from './helpers/sign'
export { sign, soliditySHA3 }

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
