// Truffle injects the following into the global scope
declare var artifacts: {
    require: <A>(name: string) => TruffleContract<A>
};

declare var contract: (name: string, callback: (accounts: Array<string>) => void) => void
declare var before: any
declare var beforeEach: any
declare var describe: any
declare var it: any

declare interface TruffleContract<A> {
    deployed (): Promise<A>
}
