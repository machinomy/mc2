declare type _contractTest = (accounts: string[]) => void;
declare function contract(name: string, test: _contractTest): void;
declare interface TransactionMeta {
  from: string,
}

declare interface Contract<T> {
  "new"(): Promise<T>,
  deployed(): Promise<T>,
  at(address: string): T,
}

declare interface MetaCoinInstance {
  getBalance(account: string): number;
  getBalanceInEth(account: string): number;
  sendCoin(account: string, amount: number, meta?: TransactionMeta): Promise<void>;
}

interface Artifacts {
  require(name: "./MetaCoin.sol"): Contract<MetaCoinInstance>,
}

declare var artifacts: Artifacts;
