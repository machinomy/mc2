// Truffle injects the following into the global scope
declare var before: any
declare var beforeEach: any
declare var describe: any
declare var it: any
declare function contract (name: string, callback: (accounts: Array<string>) => void): void
