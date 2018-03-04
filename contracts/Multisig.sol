pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ECRecovery.sol";
import "./IRegistry.sol";


contract Multisig {
    uint public nonce;
    address public sender;
    address public receiver;

    enum Operation {
        Call,
        DelegateCall
    }

    function Multisig(address _sender, address _receiver) public {
        require(_sender != address(0x0));
        require(_receiver != address(0x0));
        sender = _sender;
        receiver = _receiver;
    }

    function () payable public {}

    function execute(
        address destination,
        uint256 value,
        bytes data,
        Operation op,
        bytes senderSig,
        bytes receiverSig
    ) public
    {
        bytes32 hash = recoveryHash(executionHash(destination, value, data, op, nonce));
        require(sender == ECRecovery.recover(hash, senderSig));
        require(receiver == ECRecovery.recover(hash, receiverSig));
        require(transact(destination, value, data, op));
    }

    function recoveryHash(bytes32 txHash) public pure returns (bytes32) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return keccak256(prefix, txHash);
    }

    function executionHash(address destination, uint256 value, bytes data, Operation op, uint256 _nonce) public view returns (bytes32) {
        return keccak256(
            address(this),
            destination,
            value,
            data,
            op,
            _nonce
        );
    }

    function transact(address destination, uint256 value, bytes data, Operation op) internal returns (bool) {
        nonce = nonce + 1;
        if (op == Operation.Call) {
            return destination.call.value(value)(data); // solium-disable-line security/no-call-value
        } else if (op == Operation.DelegateCall) {
            return destination.delegatecall(data); // solium-disable-line security/no-low-level-calls
        }
    }
}
