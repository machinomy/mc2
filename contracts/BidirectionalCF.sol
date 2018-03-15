pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";
import "./Multisig.sol";

import "./BidirectionalCFLibrary.sol";

/// @title Bidirectional Ether payment channels contract.
contract BidirectionalCF {
    using SafeMath for uint256;

    uint32  public nonce;
    Multisig multisig; // TODO Maybe it is more cool to pass that as sender, receiver addresses

    uint256 public lastUpdate;
    uint256 public settlementPeriod;
    uint256 public toSender;
    uint256 public toReceiver;

    function BidirectionalCF(address _multisig, uint32 _settlementPeriod) public payable {
        multisig = Multisig(_multisig);
        lastUpdate = block.number;
        settlementPeriod = _settlementPeriod;
        nonce = uint32(0);
    }

    function () payable public {}

    // TODO Maybe get rid of signatures in favour of owner=multisig
    function canUpdate(uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public view returns (bool) {
        bool isNonceHigher = _nonce > nonce;
        bytes32 hash = LibCommon.recoveryDigest(paymentDigest(_nonce, _toSender, _toReceiver));
        address sender;
        address receiver;
        uint256 __nonce;
        (sender, receiver, __nonce) = multisig.state();
        bool isSenderSignature = sender == ECRecovery.recover(hash, _senderSig);
        bool isReceiverSignature = receiver == ECRecovery.recover(hash, _receiverSig);
        return isSettling() && isNonceHigher && isSenderSignature && isReceiverSignature;
    }

    function update(uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        require(canUpdate(_nonce, _toSender, _toReceiver, _senderSig, _receiverSig));

        toSender = _toSender;
        toReceiver = _toReceiver;
        nonce = _nonce;
        lastUpdate = block.number;
    }

    function canClose(uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public view returns (bool) {
        bytes32 hash = LibCommon.recoveryDigest(typeDigest('close', _toSender, _toReceiver));

        address sender;
        address receiver;
        uint256 __nonce;
        (sender, receiver, __nonce) = multisig.state();

        bool isSenderSignature = sender == ECRecovery.recover(hash, _senderSig);
        bool isReceiverSignature = receiver == ECRecovery.recover(hash, _receiverSig);
        return isSettling() && isSenderSignature && isReceiverSignature;
    }

    function close(uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        require(canClose(_toSender, _toReceiver, _senderSig, _receiverSig));
        address sender;
        address receiver;
        uint256 __nonce;
        (sender, receiver, __nonce) = multisig.state();
        receiver.transfer(toReceiver);

        sender.transfer(toSender);
        selfdestruct(multisig);
    }

    function withdraw() public {
        require(!isSettling());

        address sender;
        address receiver;
        uint256 __nonce;
        (sender, receiver, __nonce) = multisig.state();

        receiver.transfer(toReceiver);

        sender.transfer(toSender);
        selfdestruct(multisig); // TODO Use that every time
    }

    /*** CHANNEL STATE ***/

    function isSettling() public view returns(bool) {
        return block.number <= lastUpdate + settlementPeriod;
    }

    function paymentDigest(uint32 _nonce, uint256 _toSender, uint256 _toReceiver) public pure returns(bytes32) {
        return BidirectionalCFLibrary.paymentDigest(_nonce, _toSender, _toReceiver); // TODO Use some contract-internal value
    }

    function typeDigest(bytes32 _type, uint256 _toSender, uint256 _toReceiver) public pure returns(bytes32) {
        return keccak256(_type, _toSender, _toReceiver); // TODO Use some contract-internal value
    }
}
