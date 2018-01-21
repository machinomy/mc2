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
