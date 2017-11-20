declare module 'truffle-contract' {
  import Web3 = require('web3')

  namespace contract {
    export interface TruffleContract<A> {
      new (opts?: Web3.TxData): Promise<A>
      deployed (): Promise<A>
      setProvider (provider: Web3.Provider): void
    }

    export interface TransactionEvent {
      event: string
      args: any
    }

    export interface TransactionResult {
      tx: string
      logs: Array<TransactionEvent>
      receipt: Web3.TransactionReceipt
    }
  }

  function contract<A>(json: any): contract.TruffleContract<A>
  export = contract
}
