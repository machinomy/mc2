import BigNumber from 'bignumber.js'
import {TruffleContract} from 'truffle-contract'
const contract = require('truffle-contract')

const TokenBrokerJson = require('../build/contracts/TokenBroker.json')

export namespace TokenBroker {
  export interface Contract {
    address: string
    createChannel (address: string, receiver: string, duration: number, settlementPeriod: number, value: number, options: any): any
    startSettle (channelId: string, payment: String, options: any): Promise<void>
    claim (address: string, channelId: string, value: BigNumber, v: number, r: string, s: string, options: any): any
    finishSettle (address: string, channelId: string, options: any): Promise<void>
    deposit (address: string, channelId: string, value: BigNumber, options: any): any

    canClaim (channelId: string, value: BigNumber, v: number, r: string, s: string): any
    canStartSettle (account: string, channelId: string): any
    canFinishSettle (sender: string, channelId: string): any
    canDeposit (sender: string, channelId: string): any

    getState (channelId: string): any
    getUntil (channelId: string, callback: (error: any | null, until?: number) => void): void
  }
}

export default contract(TokenBrokerJson) as TruffleContract<TokenBroker.Contract>
