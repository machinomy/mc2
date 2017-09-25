import { FilterResult } from 'web3'
import * as BigNumber from 'bignumber.js'

export namespace Broker {
  export interface Contract {
    address: string

    createChannel(receiver: string, duration: number, settlementPeriod: number, options: any): any
    startSettle(channelId: string, payment: String, options: any): any
    claim(channelId: string, value: number, h: string, v: number, r: string, s: string, options: any, callback: () => void): any
    finishSettle(channelId: string, options: any, callback: () => void): any
    deposit(channelId: string, options: any, callback: () => void): any

    canClaim(channelId: string, h: string, v: number, r: string, s: string, callback: (error: any | null, result?: boolean) => void): void
    canStartSettle(account: string, channelId: string, callback: (error: any | null, result?: boolean) => void): void
    canFinishSettle(sender: string, channelId: string, callback: (error: any | null, result?: boolean) => void): void
    canDeposit(sender: string, channelId: string, callback: (error: any | null, result?: boolean) => void): void

    getState(channelId: string, callback: (error: any | null, state?: number) => void): void
    getUntil(channelId: string, callback: (error: any | null, until?: number) => void): void

    DidSettle(query: { channelId: string }): FilterResult
    DidStartSettle(query: { channelId: string, payment: BigNumber.BigNumber }): FilterResult
    DidCreateChannel(query: { sender: string, receiver: string }): FilterResult
    DidDeposit(query: { channelId?: string, value?: BigNumber.BigNumber }): FilterResult
  }

  // event DidDeposit(bytes32 indexed channelId, uint256 value);
  export interface DidDeposit {
    channelId: string
    value: BigNumber.BigNumber
  }

  // event DidSettle(bytes32 indexed channelId, uint256 payment, uint256 oddValue);
  export interface DidSettle {
    payment: BigNumber.BigNumber
    channelId: string
    oddValue: BigNumber.BigNumber
  }

  // event DidStartSettle(bytes32 indexed channelId, uint256 payment);
  export interface DidStartSettle {
    channelId: string
    payment: BigNumber.BigNumber
  }

  // event DidCreateChannel(address indexed sender, address indexed receiver, bytes32 channelId);
  export interface DidCreateChannel {
    sender: string
    receiver: string
    channelId: string
  }
}