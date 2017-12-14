# Machinomy contracts [![Build Status][travis-img]][travis]
[travis]: https://travis-ci.org/machinomy/machinomy-contracts
[travis-img]: https://img.shields.io/travis/machinomy/machinomy-contracts.svg

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
$ yarn truffle:migrate
```

Truffle generates json files by default. You need to compile the json files to ts files. Run:
```
$ yarn build
```
Now package is ready to use by Machinony.

## Deployment
To deploy the package to the Ropsten network you need to run local geth instance and then run commands:
```
$ yarn truffle:migrate:ropsten
$ yarn build
```

# Ether


https://kovan.etherscan.io/verifyContract

Use [truffle-flattener](https://github.com/alcuadrado/truffle-flattener) 

Constructor Arguments (ABI-encoded and is the last bytes of the Contract Creation Code above)

```js
var abi = require('ethereumjs-abi')
var parameterTypes = ["uint32"];
var parameterValues = [42]
var encoded = abi.rawEncode(parameterTypes, parameterValues);
console.log(encoded.toString('hex'));
```