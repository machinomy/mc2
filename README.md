# Machinomy [![Build Status][travis-img]][travis]
[travis]: https://travis-ci.org/machinomy/machinomy
[travis-img]: https://img.shields.io/travis/machinomy/machinomy.svg

Machinomy contracts is TS interface for Ethereum contracts managed by [Truffle](https://github.com/trufflesuite/truffle) used by [Machinomy](https://github.com/machinomy/machinomy).

## Install
```
$ yarn add @machinomy/contracts
```

## Workflow
Use [testrpc](https://github.com/ethereumjs/testrpc) for fast development. Start testrpc by command:
```
$ testrpc --networkid 999 --mnemonic "testtest"
```

Then deploy contracts to the tesrpc network:
```
$ yarn migrate
```

Truffle generates json files by default. You need to compile the json files to ts files. Run:
```
$ yarn build
```
Now package is ready to use by Machinony.

## Deployment
To deploy the package to the Ropsten network you need to run local geth instance and then run commands:
```
$ yarn migrate_ropsten
$ yarn build
```