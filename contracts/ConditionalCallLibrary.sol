pragma solidity ^0.4.19;

import "./ISharedState.sol";
import "./IRegistry.sol";

library ConditionalCallLibrary {
    function execute(address _registry, bytes32 _sharedStateCF, bytes _proof, address _destination, uint256 _value, bytes _data) public {
        IRegistry registry = IRegistry(_registry);
        address sharedStateAddress = registry.resolve(_sharedStateCF);
        ISharedState sharedState = ISharedState(sharedStateAddress);

        bytes32 hash = callHash(_destination, _value, _data);
        require(sharedState.isContained(_proof, hash));
        require(_destination.call.value(_value)(_data)); // solium-disable-line security/no-call-value
    }

    function callHash(address _destination, uint256 _value, bytes _data) public pure returns (bytes32) {
        return keccak256(_destination, _value, _data);
    }
}
