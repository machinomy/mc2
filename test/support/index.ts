import * as BigNumber from 'bignumber.js'
import * as truffle from 'truffle-contract'
import * as Web3 from 'web3'
import { Multisig, PublicRegistry } from '../../src/index'
import * as chai from 'chai'
import * as abi from 'ethereumjs-abi'
import * as util from 'ethereumjs-util'

const web3 = (global as any).web3 as Web3

const LOG_GAS_COST = Boolean(process.env.LOG_GAS_COST)
const GAS_COST_IN_USD = 0.000012 // 1 ETH = 600 USD

export type Number = BigNumber.BigNumber | number

export class Gaser {
  web3: Web3

  constructor (_web3: Web3) {
    this.web3 = _web3
  }

  async gasDiff<A> (name: string, account: string, fn: () => A, forceLog: boolean = false) {
    let before = web3.eth.getBalance(account)
    let result = fn()
    let after = web3.eth.getBalance(account)
    let gasCost = before.minus(after).div(this.web3.eth.gasPrice.div(0.2)).toNumber()
    this.log(gasCost, name, forceLog)
    return result
  }

  async logGas (name: string, promisedTx: Promise<truffle.TransactionResult>, forceLog: boolean = false) {
    let tx = await promisedTx
    this.log(tx.receipt.gasUsed, name, forceLog)
    return tx
  }

  private log (gasCost: number, name: string, forceLog: boolean = false) {
    if (LOG_GAS_COST || forceLog) {
      console.log(`GAS: ${name}: ($${(gasCost * GAS_COST_IN_USD).toFixed(2)})`, gasCost)
    }
  }
}

export async function logGas (name: string, promisedTx: Promise<truffle.TransactionResult>, forceLog: boolean = false) {
  let tx = await promisedTx
  if (LOG_GAS_COST || forceLog) {
    let gasCost = tx.receipt.gasUsed
    console.log(`GAS: ${name}: ($${(gasCost * GAS_COST_IN_USD).toFixed(2)})`, gasCost)
  }
  return tx
}

export async function gasDiff<A> (name: string, web3: Web3, account: string, fn: () => A, forceLog: boolean = false) {
  let before = web3.eth.getBalance(account)

  // tslint:disable-next-line:await-promise
  let result = await fn() // TODO Do we need await here?
  let after = web3.eth.getBalance(account)
  if (LOG_GAS_COST || forceLog) {
    let gasCost = before.minus(after).div(web3.eth.gasPrice.div(0.2)).toString() // Beware of magic numbers
    console.log(`GAS: ${name}: ($${(parseFloat(gasCost) * GAS_COST_IN_USD).toFixed(2)})`, gasCost)
  }
  return result
}

export function txPrice (web3: Web3, log: truffle.TransactionResult): BigNumber.BigNumber {
  return web3.eth.getTransaction(log.tx).gasPrice.mul(log.receipt.gasUsed)
}

export function constructorBytecode <A> (web3: Web3, contract: truffle.TruffleContract<A>, ...params: any[]): string {
  return web3.eth.contract(contract.abi).getData(...params, {data: contract.bytecode})
}

export function lineupSign (account: string, merkleRoot: HexString, nonce: Number) {
  let operationHash = util.bufferToHex(abi.soliditySHA3(
    ['bytes32', 'uint256'],
    [merkleRoot, nonce.toString()]
  ))
  return web3.eth.sign(account, operationHash)
}

export function bidirectionalSign (account: string, nonce: Number, toSender: Number, toReceiver: Number) {
  let operationHash = util.bufferToHex(abi.soliditySHA3(
    ['uint256', 'uint256', 'uint256'],
    [nonce.toString(), toSender.toString(), toReceiver.toString()]
  ))
  return web3.eth.sign(account, operationHash)
}

export function bidirectionalCloseSign (account: string, toSender: Number, toReceiver: Number) {
  let operationHash = util.bufferToHex(abi.soliditySHA3(
    ['string', 'uint256', 'uint256'],
    ['c', toSender.toString(), toReceiver.toString()]
  ))
  return web3.eth.sign(account, operationHash)
}

export interface CallParams {
  to: string
  data: string
}

export interface Call {
  method: string
  value?: BigNumber.BigNumber,
  params: Array<CallParams>
}

export type Address = string
export type HexString = string

export interface Instantiation {
  destination: Address
  callBytecode: HexString
  value: BigNumber.BigNumber
  operation: number,
  senderSig: HexString,
  receiverSig: HexString,
  nonce: BigNumber.BigNumber
}

export class InstantiationFactory {
  web3: Web3
  multisig: Multisig.Contract

  constructor (web3: Web3, multisig: Multisig.Contract) {
    this.web3 = web3
    this.multisig = multisig
  }

  async call (call: Call, _nonce?: BigNumber.BigNumber|number): Promise<Instantiation> {
    return this.build(call, _nonce)
  }

  async delegatecall (call: Call, _nonce?: BigNumber.BigNumber|number): Promise<Instantiation> {
    return this.buildDelegate(call, _nonce)
  }

  async execute (i: Instantiation, options?: Web3.TxData): Promise<truffle.TransactionResult> {
    if (i.operation === 0) {
      return this.multisig.doCall(i.destination, i.value, i.callBytecode, i.senderSig, i.receiverSig, options)
    } else {
      return this.multisig.doDelegate(i.destination, i.callBytecode, i.senderSig, i.receiverSig, options)
    }

  }

  async raw (destination: Address, value: BigNumber.BigNumber, callBytecode: HexString, nonce: BigNumber.BigNumber, operation: number) {
    let _state = await this.multisig.state()
    let sender = _state[0]
    let receiver = _state[1]

    let operationHash = util.bufferToHex(abi.soliditySHA3(
      ['address', 'address' , 'uint256', 'bytes', 'uint256'],
      [this.multisig.address, destination, value.toString(), util.toBuffer(callBytecode), nonce.toString()]
    )) // TODO Make it different for call and delegatecall
    let senderSig = this.web3.eth.sign(sender, operationHash)
    let receiverSig = this.web3.eth.sign(receiver, operationHash)

    return Promise.resolve({
      destination,
      callBytecode,
      value,
      operation,
      senderSig,
      receiverSig,
      nonce
    })
  }

  private async build (call: Call, _nonce?: BigNumber.BigNumber|number): Promise<Instantiation> {
    let params = call.params[0]
    let value = new BigNumber.BigNumber(0)
    let _state = await this.multisig.state()
    let nonce = new BigNumber.BigNumber(_nonce || _state[2])

    return this.raw(params.to, value, params.data, nonce, 0)
  }

  private async buildDelegate (call: Call, _nonce?: BigNumber.BigNumber|number): Promise<Instantiation> {
    let params = call.params[0]
    let value = call.value || new BigNumber.BigNumber(0)
    let _state = await this.multisig.state()
    let nonce = new BigNumber.BigNumber(_nonce || _state[2])
    let destination = params.to
    let callBytecode = params.data
    let operation = 1
    let sender = _state[0]
    let receiver = _state[1]

    let operationHash = util.bufferToHex(abi.soliditySHA3(
      ['address', 'address' , 'bytes', 'uint256'],
      [this.multisig.address, destination, util.toBuffer(callBytecode), nonce.toString()]
    )) // TODO Make it different for call and delegatecall
    let senderSig = this.web3.eth.sign(sender, operationHash)
    let receiverSig = this.web3.eth.sign(receiver, operationHash)

    return Promise.resolve({
      destination,
      callBytecode,
      value,
      operation,
      senderSig,
      receiverSig,
      nonce
    })
  }
}

export function counterfactualAddress (registry: PublicRegistry.Contract, i: Instantiation, nonce: HexString): Promise<string> {
  let bytecode = i.callBytecode
  return registry.counterfactualAddress(bytecode, nonce)
}

export type ContractLike = {
  address: string
  constructor: {
    web3: Web3
  }
}
export async function assertBalance (contract: ContractLike, expected: BigNumber.BigNumber|number): Promise<void> {
  let web3 = contract.constructor.web3
  let actualBalance = web3.eth.getBalance(contract.address)
  chai.assert.equal(actualBalance.toString(), expected.toString())
}

export interface TokenLike {
  balanceOf (_owner: Address): Promise<BigNumber.BigNumber>
}
export async function assertTokenBalance (token: TokenLike, address: Address, expected: BigNumber.BigNumber|number): Promise<void> {
  let actualBalance = await token.balanceOf(address)
  chai.assert.equal(actualBalance.toString(), expected.toString())
}

export class BytecodeManager {
  private _web3: Web3
  private _links: Map<string, string>

  constructor (web3: Web3, links?: Map<string, string>) {
    this._web3 = web3
    this._links = links ? links : new Map()
  }

  public constructBytecode <A> (contract: truffle.TruffleContract<A>, ...params: any[]): string {
    let bytecode = this._link(contract.bytecode)
    return this._web3.eth.contract(contract.abi).getData(...params, {data: bytecode})
  }

  public async addLink <A> (contract: truffle.TruffleContract<A>, name: string) {
    let deployed = await contract.deployed()
    this._links.set(name, deployed.address)
  }

  protected _link (bytecode: string) {
    this._links.forEach((libraryAddress: string, libraryName: string) => {
      let regex = new RegExp('__' + libraryName + '_+', 'g')
      bytecode = bytecode.replace(regex, libraryAddress.replace('0x', ''))
    })
    return bytecode
  }
}
