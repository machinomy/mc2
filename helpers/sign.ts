var util = require('ethereumjs-util')
import Web3 = require('web3')
var abi = require('ethereumjs-abi')
var BN = require('bn.js')
import BigNumber from 'bignumber.js'

export interface Signature {
  v: number
  r: Buffer
  s: Buffer
}
  
export function soliditySHA3 (channelId: string, value: number, contractAddress: string, chainId: string): string {
  return abi.soliditySHA3(
    [ "bytes32", "uint256", "address", "uint32"],
    [ channelId.toString(), new BigNumber(value).toString(), new BN(contractAddress, 16), chainId]
  ).toString('hex')
}

export function sign (web3: Web3, sender: string, digest: string): Promise<Signature> {
  return new Promise<Signature>((resolve, reject) => {
    web3.eth.sign(sender, digest, (error, signature) => {
      if (error) {
        reject(error)
      } else {
        resolve(util.fromRpcSig(signature))
      }
    })
  })
}