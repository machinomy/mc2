import Web3 = require('web3');
export interface TruffleContract {
    deployed(): Promise<any>;
}
export declare let buildERC20Contract: (address: string, web3: Web3) => Promise<TruffleContract>;
export declare let buildBrokerContract: (web3: Web3) => TruffleContract;
export declare let buildBrokerTokenContract: (web3: Web3) => TruffleContract;
