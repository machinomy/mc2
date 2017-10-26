import Web3 = require('web3')

export function getNetwork (web3: Web3): Promise<string> {
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((error, result) => {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
  })
}
