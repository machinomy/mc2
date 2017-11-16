"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require('ethereumjs-util');
var abi = require('ethereumjs-abi');
var BN = require('bn.js');
var bignumber_js_1 = require("bignumber.js");
function soliditySHA3(channelId, value, contractAddress, chainId) {
    return '0x' + abi.soliditySHA3(['bytes32', 'uint256', 'address', 'uint32'], [channelId.toString(), new bignumber_js_1.default(value).toString(), new BN(contractAddress, 16), chainId]).toString('hex');
}
exports.soliditySHA3 = soliditySHA3;
function sign(web3, sender, digest) {
    return new Promise(function (resolve, reject) {
        web3.eth.sign(sender, digest, function (error, signature) {
            if (error) {
                reject(error);
            }
            else {
                resolve(util.fromRpcSig(signature));
            }
        });
    });
}
exports.sign = sign;
//# sourceMappingURL=sign.js.map