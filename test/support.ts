import Web3 = require('web3')
import { TransactionResult } from 'truffle-contract'
import BigNumber from 'bignumber.js'
const contract = require('truffle-contract')

export function getNetwork (web3: Web3): Promise<number> {
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(parseInt(result, 10))
      }
    })
  })
}

export namespace ERC20Example {
  const Json = require('../build/contracts/ERC20example.json')

  export interface Contract {
    address: string

    mint (receiver: string, amount: BigNumber|number, opts?: Web3.TxData): Promise<TransactionResult>
    balanceOf (address: string): Promise<BigNumber>
    approve (address: string, startChannelValue: BigNumber, opts?: Web3.TxData): Promise<TransactionResult>
    deposit (address: string, channelId: string, startChannelValue: BigNumber, opts?: Web3.TxData): Promise<TransactionResult>
  }

  export const deploy = function (provider?: Web3.Provider, opts?: Web3.TxData): Promise<Contract> {
    let instance = contract(Json)
    if (provider) {
      instance.setProvider(provider)
    }
    return instance.new(opts)
  }

  export function deployed (provider?: Web3.Provider): Promise<Contract> {
    let instance = contract(Json)
    if (provider) {
      instance.setProvider(provider)
    }
    return instance.deployed()
  }
}
