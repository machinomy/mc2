pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";

library LibMultisig {
    struct State {
        address sender;
        address receiver;
        uint256 nonce;
    }

    // TODO Make it different for call and delegatecall
    function executionHash(address _self, address _destination, uint256 _value, bytes _data, uint256 _nonce) public view returns (bytes32) {
        return keccak256(
            _self,
            _destination,
            _value,
            _data,
            _nonce
        );
    }
}
