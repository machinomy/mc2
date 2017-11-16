// Truffle injects the following into the global scope
declare var contract: (name: string, callback: (accounts: Array<string>) => void) => void
declare var before: any
declare var beforeEach: any
declare var describe: any
declare var it: any
