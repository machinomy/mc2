pragma solidity ^0.4.19;

import "./LibMultisig.sol";


contract Multisig {
    LibMultisig.State public state;

    function Multisig(address _sender, address _receiver)  public {
        state.sender = _sender;
        state.receiver = _receiver;
    }

    function () payable external {}

    function doCall(
        address destination,
        uint256 value,
        bytes data,
        bytes senderSig,
        bytes receiverSig
    ) external
    {
        LibMultisig.doCall(
            address(this),
            destination,
            value,
            data,
            senderSig,
            receiverSig,
            state
        );
        require(destination.call.value(value)(data)); // solium-disable-line security/no-call-value
    }

    function doDelegate(
        address destination,
        bytes data,
        bytes senderSig,
        bytes receiverSig
    ) external
    {
        LibMultisig.doDelegatecall(
            address(this),
            destination,
            data,
            senderSig,
            receiverSig,
            state
        );
        require(destination.delegatecall(data)); // solium-disable-line security/no-low-level-calls
    }
}
