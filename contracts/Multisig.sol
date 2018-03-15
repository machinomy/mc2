pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ECRecovery.sol";
import "./IRegistry.sol";
import "./BidirectionalCFLibrary.sol";
import "./LibMultisig.sol";
import "./LibCommon.sol";


contract MultisigProto {
    uint public nonce;
    address public sender;
    address public receiver;


    function MultisigProto(address _sender, address _receiver)  public {
        sender = _sender;
        receiver = _receiver;
        nonce = 0;
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
        bytes32 hash = LibCommon.recoveryDigest(LibMultisig.executionHash(address(this), destination, value, data, nonce));
        require(sender == ECRecovery.recover(hash, senderSig));
        require(receiver == ECRecovery.recover(hash, receiverSig));
        nonce = nonce + 1;
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
        bytes32 hash = LibCommon.recoveryDigest(LibMultisig.executionHash(address(this), destination, value, data, nonce));
        require(sender == ECRecovery.recover(hash, senderSig));
        require(receiver == ECRecovery.recover(hash, receiverSig));
        nonce = nonce + 1;
        require(destination.delegatecall(data)); // solium-disable-line security/no-low-level-calls
    }
}

contract Multisig is MultisigProto {

    function Multisig(address _sender, address _receiver) MultisigProto(_sender, _receiver) public {}

    function () payable public {}
}
