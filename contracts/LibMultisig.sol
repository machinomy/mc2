pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";

library LibMultisig {
    enum Operation {
        Call,
        DelegateCall
    }

    function executionHash(address ownAddress, address destination, uint256 value, bytes data, Operation op, uint256 _nonce) public view returns (bytes32) {
        return keccak256(
            ownAddress,
            destination,
            value,
            data,
            op,
            _nonce
        );
    }

    function transact(address destination, uint256 value, bytes data, LibMultisig.Operation op) internal returns (bool) {
        if (op == LibMultisig.Operation.Call) {
            return destination.call.value(value)(data); // solium-disable-line security/no-call-value
        } else if (op == LibMultisig.Operation.DelegateCall) {
            return destination.delegatecall(data); // solium-disable-line security/no-low-level-calls
        }
    }

}
