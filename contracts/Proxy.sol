pragma solidity ^0.4.19;

import "./PublicRegistry.sol";

// @title Proxy call via counterfactual address.
// @dev This may really suck. TODO Check output types
contract Proxy {
    event Trace(address d, uint256 v, bytes a, address origin, address t);
    function doCall(address _registry, bytes32 _destination, uint256 value, bytes data) public {
        address destination = findDestination(_registry, _destination);
        Trace(destination, value, data, msg.sender, this);

        // require(destination.call.value(value)(data)); // solium-disable-line security/no-call-value
    }

    function doDelegateCall(address _registry, bytes32 _destination, bytes data) public {
        address destination = findDestination(_registry, _destination);
        require(destination.delegatecall(data)); // solium-disable-line security/no-low-level-calls
    }

    function findDestination(address _registry, bytes32 _destination) internal view returns (address destination) {
        PublicRegistry registry = PublicRegistry(_registry);
        destination = registry.resolve(_destination);
        require(destination != address(0x0));
    }
}
