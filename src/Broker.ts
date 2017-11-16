import Web3 = require('web3')
const contract = require('truffle-contract')
import BigNumber from 'bignumber.js'
import {TransactionResult} from 'truffle-contract'

const BrokerJson = require('../build/contracts/Broker.json')

export namespace Broker {
  export interface Contract {
    address: string

    createChannel (receiver: string, duration: number, settlementPeriod: number, options?: Web3.TxData): Promise<TransactionResult>
    startSettle (channelId: string, payment: BigNumber, options?: Web3.TxData): Promise<TransactionResult>
    claim (channelId: string, value: BigNumber, v: number, r: string, s: string, options?: Web3.TxData): Promise<TransactionResult>
    finishSettle (channelId: string, options?: Web3.TxData): Promise<TransactionResult>
    deposit (channelId: string, options?: Web3.TxData): Promise<TransactionResult>

    canClaim (channelId: string, value: BigNumber, v: number, r: string, s: string): Promise<boolean>
    canStartSettle (account: string, channelId: string): Promise<boolean>
    canFinishSettle (sender: string, channelId: string): Promise<boolean>
    canDeposit (sender: string, channelId: string): Promise<boolean>

    getState (channelId: string): Promise<number>
    getUntil (channelId: string): Promise<number>
  }

  export function deployed(provider?: Web3.Provider): Promise<Broker.Contract> {
    let instance = contract(BrokerJson)
    if (provider) {
      instance.setProvider(provider)
    }
    return instance.deployed()
  }
}

export default Broker
