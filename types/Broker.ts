import BigNumber from 'bignumber.js'

export namespace Broker {
  export interface Contract {
    address: string

    createChannel (receiver: string, duration: number, settlementPeriod: number, options: any): any
    startSettle (channelId: string, payment: String, options: any): Promise<void>
    claim (channelId: string, value: BigNumber, v: number, r: string, s: string, options: any): any
    finishSettle (channelId: string, options: any): Promise<void>
    deposit (channelId: string, options: any): any

    canClaim (channelId: string, value: BigNumber, v: number, r: string, s: string): any
    canStartSettle (account: string, channelId: string): any
    canFinishSettle (sender: string, channelId: string): any
    canDeposit (sender: string, channelId: string): any

    getState (channelId: string): any
    getUntil (channelId: string, callback: (error: any | null, until?: number) => void): void
  }
}
