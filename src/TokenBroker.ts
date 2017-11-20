import Web3 = require('web3')
import BigNumber from 'bignumber.js'
import contract = require('truffle-contract')
import { TransactionResult } from 'truffle-contract'

const TokenBrokerJson = require('../build/contracts/TokenBroker.json')

namespace TokenBroker {
  export interface Contract {
    address: string
    createChannel (address: string, receiver: string, duration: number, settlementPeriod: number, value: BigNumber, options?: Web3.TxData): Promise<TransactionResult>
    startSettle (channelId: string, payment: BigNumber, options?: Web3.TxData): Promise<TransactionResult>
    claim (channelId: string, value: BigNumber, v: number, r: string, s: string, options?: Web3.TxData): Promise<TransactionResult>
    finishSettle (channelId: string, options?: Web3.TxData): Promise<TransactionResult>
    deposit (channelId: string, value: BigNumber, options?: Web3.TxData): Promise<TransactionResult>

    canClaim (channelId: string, value: BigNumber, v: number, r: string, s: string): Promise<boolean>
    canStartSettle (account: string, channelId: string): Promise<boolean>
    canFinishSettle (sender: string, channelId: string): Promise<boolean>
    canDeposit (sender: string, channelId: string): Promise<boolean>

    getState (channelId: string): Promise<number>
    getUntil (channelId: string): Promise<number>
  }

  export function deployed (provider?: Web3.Provider): Promise<Contract> {
    let instance = contract<Contract>(TokenBrokerJson)
    if (provider) {
      instance.setProvider(provider)
    }
    return instance.deployed()
  }
}

export default TokenBroker
