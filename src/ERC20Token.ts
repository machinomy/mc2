import Web3 = require('web3')
const contract = require('truffle-contract')
import BigNumber from 'bignumber.js'
import {TransactionResult} from 'truffle-contract'

const ERC20Json = require('../build/contracts/ERC20.json')

export namespace ERC20Token {
  export interface Contract {
    address: string

    totalSupply(): Promise<TransactionResult>
    balanceOf (address: string): Promise<TransactionResult>
    allowance(owner: string, spender: string): Promise<BigNumber>

    transfer(to: string, value: BigNumber, opts?: Web3.TxData): Promise<TransactionResult>
    transferFrom(from: string, to: string, value: BigNumber, opts?: Web3.TxData): Promise<TransactionResult>
    approve(address: string, startChannelValue: BigNumber, opts?: Web3.TxData): Promise<TransactionResult>
  }

  export function at(provider?: Web3.Provider): Promise<Contract> {
    let instance = contract(ERC20Json)
    if (provider) {
      instance.setProvider(provider)
    }
    return instance.deployed()
  }
}

export default ERC20Token
