"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getNetwork(web3) {
    return new Promise(function (resolve, reject) {
        web3.version.getNetwork(function (error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(parseInt(result, 10));
            }
        });
    });
}
exports.getNetwork = getNetwork;
//# sourceMappingURL=web3.js.map