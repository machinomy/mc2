var util = require('ethereumjs-util')

exports.ethHash = message => {
  const buffer = Buffer.from(
    "\x19Ethereum Signed Message:\n" + message.length + message
  );
  return "0x" + util.sha3(buffer).toString("hex")
};

exports.digest = function(channelId, value) {
  const message = channelId.toString() + value.toString()
  return Buffer.from(message)
};

exports.sign = function(web3, sender, digest) {
  return new Promise((resolve, reject) => {
    web3.eth.sign(sender, util.bufferToHex(digest), (error, signature) => {
      if (error) {
        reject(error)
      } else {
        resolve(util.fromRpcSig(signature))
      }
    });
  });
};
