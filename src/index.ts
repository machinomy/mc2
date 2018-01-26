import Unidirectional from '../build/wrappers/Unidirectional'
import * as ethUtil from 'ethereumjs-util'

export {
  Unidirectional
}

export function randomId (digits: number = 3) {
  const datePart = new Date().getTime() * Math.pow(10, digits)
  // 3 random digits
  const extraPart = Math.floor(Math.random() * Math.pow(10, digits))
  // 16 digits
  return datePart + extraPart
}

export function channelId (sender: string, receiver: string): string {
  let random = randomId()
  let buffer = ethUtil.sha3(sender + receiver + random)
  return ethUtil.bufferToHex(buffer)
}
