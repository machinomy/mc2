"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Broker = artifacts.require('Broker.sol');
const TokenBroker = artifacts.require('TokenBroker.sol');
module.exports = function (deployer) {
    return deployer.deploy(Broker, deployer.network_id).then(() => {
        return deployer.deploy(TokenBroker, deployer.network_id);
    });
};
//# sourceMappingURL=2_deploy_contracts.js.map