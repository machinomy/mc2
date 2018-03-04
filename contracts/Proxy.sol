pragma solidity ^0.4.19;

import "./IRegistry.sol";


// @title Proxy call via counterfactual address.
// @dev This may really suck. TODO Check output types
contract Proxy {
    enum Operation {
        Call,
        DelegateCall
    }

    function Proxy() public { } // TODO execute < doCall, doDelegate

    function execute(address _registry, bytes32 _destination, uint256 value, bytes data, Operation op) public returns (bool) {
        IRegistry registry = IRegistry(_registry);
        address destination = registry.resolve(_destination);
        require(destination != address(0x0));
        if (op == Operation.Call) {
            return destination.call.value(value)(data); // solium-disable-line security/no-call-value
        } else if (op == Operation.DelegateCall) {
            return destination.delegatecall(data); // solium-disable-line security/no-low-level-calls
        }
    }
}
