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

    function execute(
        address destination,
        uint256 value,
        bytes data,
        bytes senderSig,
        bytes receiverSig
    ) public
    {
        bytes32 hash = LibCommon.recoveryDigest(executionHash(destination, value, data, nonce));
        require(sender == ECRecovery.recover(hash, senderSig));
        require(receiver == ECRecovery.recover(hash, receiverSig));
        require(transact(destination, value, data));
    }

    function executeDelegate(
        address destination,
        uint256 value,
        bytes data,
        bytes senderSig,
        bytes receiverSig
    ) public
    {
        bytes32 hash = LibCommon.recoveryDigest(executionHash(destination, value, data, nonce));
        require(sender == ECRecovery.recover(hash, senderSig));
        require(receiver == ECRecovery.recover(hash, receiverSig));
        require(transactDelegate(destination, value, data));
    }

    function transact(address destination, uint256 value, bytes data) internal returns (bool) {
        nonce = nonce + 1;
        return destination.call.value(value)(data); // solium-disable-line security/no-call-value

    }

    function transactDelegate(address destination, uint256 value, bytes data) internal returns (bool) {
        nonce = nonce + 1;
        return destination.delegatecall(data); // solium-disable-line security/no-low-level-calls
    }

    function executionHash(address destination, uint256 value, bytes data, uint256 _nonce) public view returns (bytes32) {
        return keccak256(
            address(this),
            destination,
            value,
            data,
                LibMultisig.Operation.Call,
            _nonce
        );
    }

    function executionHashDelegate(address destination, uint256 value, bytes data, uint256 _nonce) public view returns (bytes32) {
        return keccak256(
            address(this),
            destination,
            value,
            data,
                LibMultisig.Operation.DelegateCall,
            _nonce
        );
    }

    function () payable public {}
}

contract Multisig is MultisigProto {

    function Multisig(address _sender, address _receiver) MultisigProto(_sender, _receiver) public {}

    function () payable public {}
}
