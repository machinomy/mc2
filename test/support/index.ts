import * as BigNumber from 'bignumber.js'
import * as truffle from 'truffle-contract'
import * as Web3 from 'web3'
import { Multisig, PublicRegistry } from '../../src/index'
import * as chai from 'chai'

const LOG_GAS_COST = Boolean(process.env.LOG_GAS_COST)

export async function logGas (name: string, promisedTx: Promise<truffle.TransactionResult>, forceLog: boolean = false) {
  let tx = await promisedTx
  if (LOG_GAS_COST || forceLog) {
    let gasCost = tx.receipt.gasUsed
    console.log(`GAS: ${name}: `, gasCost)
  }
}

export function txPrice (web3: Web3, log: truffle.TransactionResult): BigNumber.BigNumber {
  return web3.eth.getTransaction(log.tx).gasPrice.mul(log.receipt.gasUsed)
}

export function constructorBytecode <A> (web3: Web3, contract: truffle.TruffleContract<A>, ...params: any[]): string {
  return web3.eth.contract(contract.abi).getData(...params, {data: contract.bytecode})
}

export interface CallParams {
  to: string
  data: string
}

export interface Call {
  method: string
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

  async call (call: Call, _nonce?: BigNumber.BigNumber): Promise<Instantiation> {
    return this.build(call, 0, _nonce)
  }

  async delegatecall (call: Call, _nonce?: BigNumber.BigNumber): Promise<Instantiation> {
    return this.build(call, 1, _nonce)
  }

  async execute (i: Instantiation): Promise<truffle.TransactionResult> {
    return this.multisig.execute(i.destination, i.value, i.callBytecode, i.operation, i.senderSig, i.receiverSig)
  }

  private async build (call: Call, _operation: number = 0, _nonce?: BigNumber.BigNumber): Promise<Instantiation> {
    let params = call.params[0]
    let destination = params.to
    let callBytecode = params.data
    let value = new BigNumber.BigNumber(0)
    let operation = _operation // FIXME
    let nonce = _nonce || await this.multisig.nonce()
    let _operationHash = await this.multisig.executionHash(destination, value, callBytecode, operation, nonce)
    let sender = await this.multisig.sender()
    let receiver = await this.multisig.receiver()
    let senderSig = await this.web3.eth.sign(sender, _operationHash)
    let receiverSig = await this.web3.eth.sign(receiver, _operationHash)

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
  let actualBalance = await web3.eth.getBalance(contract.address)
  chai.assert.equal(actualBalance.toString(), expected.toString())
}

export interface TokenLike {
  balanceOf (_owner: Address): Promise<BigNumber.BigNumber>
}
export async function assertTokenBalance (token: TokenLike, address: Address, expected: BigNumber.BigNumber|number): Promise<void> {
  let actualBalance = await token.balanceOf(address)
  chai.assert.equal(actualBalance.toString(), expected.toString())
}
