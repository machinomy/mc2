pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ECRecovery.sol";
import "./IRegistry.sol";
import "./BidirectionalCFLibrary.sol";
import "./LibMultisig.sol";
import "./LibCommon.sol";


contract MultisigProto {
    LibMultisig.State public state;
    address public receiver;


    function MultisigProto(address _sender, address _receiver)  public {
        receiver = _receiver;
        state = LibMultisig.State(_sender, _receiver, 0);
    }

    function () payable public {}

    function execute(
        address destination,
        uint256 value,
        bytes data,
        bytes senderSig,
        bytes receiverSig
    ) public
    {
        bytes32 hash = LibCommon.recoveryDigest(LibMultisig.executionHash(address(this), destination, value, data, state.nonce));
        require(state.sender == ECRecovery.recover(hash, senderSig));
        require(state.receiver == ECRecovery.recover(hash, receiverSig));
        state.nonce = state.nonce + 1;
        require(destination.call.value(value)(data)); // solium-disable-line security/no-call-value
    }

    function executeDelegate(
        address destination,
        uint256 value,
        bytes data,
        bytes senderSig,
        bytes receiverSig
    ) public
    {
        bytes32 hash = LibCommon.recoveryDigest(LibMultisig.executionHash(address(this), destination, value, data, state.nonce));
        require(state.sender == ECRecovery.recover(hash, senderSig));
        require(state.receiver == ECRecovery.recover(hash, receiverSig));
        state.nonce = state.nonce + 1;
        require(destination.delegatecall(data)); // solium-disable-line security/no-low-level-calls
    }
}

contract Multisig is MultisigProto {

    function Multisig(address _sender, address _receiver) MultisigProto(_sender, _receiver) public {}

    function () payable public {}
}
