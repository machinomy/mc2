pragma solidity ^0.4.19;

import "./ISharedState.sol";
import "./IRegistry.sol";
import "./ConditionalCallLibrary.sol";

contract ConditionalCall {
    function execute(address _registry, bytes32 _sharedStateCF, bytes _proof, address _destination, uint256 _value, bytes _data) public {
        ConditionalCallLibrary.execute(_registry, _sharedStateCF, _proof, _destination, _value, _data);
    }

    function callHash(address _destination, uint256 _value, bytes _data) public pure returns (bytes32) {
        return keccak256(_destination, _value, _data);
    }
}
