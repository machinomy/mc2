import Web3 = require('web3')
const contract = require('truffle-contract')
import BigNumber from 'bignumber.js'
import {TransactionResult} from "truffle-contract";

const BrokerJson = require('../build/contracts/Broker.json')

export namespace Broker {
  export interface Contract {
    address: string

    createChannel (receiver: string, duration: number, settlementPeriod: number, options?: Web3.TxData): Promise<TransactionResult>
    startSettle (channelId: string, payment: BigNumber, options?: Web3.TxData): Promise<TransactionResult>
    claim (channelId: string, value: BigNumber, v: number, r: string, s: string, options?: Web3.TxData): Promise<TransactionResult>
    finishSettle (channelId: string, options?: Web3.TxData): Promise<TransactionResult>
    deposit (channelId: string, options?: Web3.TxData): Promise<TransactionResult>

    canClaim (channelId: string, value: BigNumber, v: number, r: string, s: string): any
    canStartSettle (account: string, channelId: string): any
    canFinishSettle (sender: string, channelId: string): any
    canDeposit (sender: string, channelId: string): any

    getState (channelId: string): any
    getUntil (channelId: string, callback: (error: any | null, until?: number) => void): void
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
