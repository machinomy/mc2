pragma solidity ^0.4.19;

import "./LibMultisig.sol";


contract Multisig {
    LibMultisig.State public state;

    function Multisig(address _sender, address _receiver)  public {
        state = LibMultisig.State(_sender, _receiver, 0);
    }

    function () payable external {}

    function execute(
        address destination,
        uint256 value,
        bytes data,
        bytes senderSig,
        bytes receiverSig
    ) external
    {
        LibMultisig.execute(destination, value, data, senderSig, receiverSig, state);
        require(destination.call.value(value)(data)); // solium-disable-line security/no-call-value
    }

    function executeDelegate(
        address destination,
        uint256 value,
        bytes data,
        bytes senderSig,
        bytes receiverSig
    ) external
    {
        LibMultisig.executeDelegate(destination, value, data, senderSig, receiverSig, state);
        require(destination.delegatecall(data)); // solium-disable-line security/no-low-level-calls
    }
}
