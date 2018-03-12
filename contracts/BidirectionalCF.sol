pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";
import "./Multisig.sol";

import "./BidirectionalCFLibrary.sol";

/// @title Bidirectional Ether payment channels contract.
contract BidirectionalCF {
    using SafeMath for uint256;

    // Multisig multisig; // TODO Maybe it is more cool to pass that as sender, receiver addresses
    BidirectionalCFLibrary.BidirectionalCFData public bidiData;
//    uint256 lastUpdate;
//    uint256 settlementPeriod;
//    uint32  public nonce;
//    uint256 public toSender;
//    uint256 public toReceiver;


    function nonce() public returns (uint32) {
        return bidiData.nonce;
    }


//    function BidirectionalCF(BidirectionalCFLibrary.BidirectionalCFData storage self, address _multisig, uint32 _settlementPeriod) public payable {
//        bidiData.multisig = Multisig(_multisig);
//        bidiData.lastUpdate = block.number;
//        bidiData.settlementPeriod = _settlementPeriod;
//        bidiData.nonce = uint32(0);
//    }

    function BidirectionalCF(address _multisig, uint32 _settlementPeriod) public payable {
        bidiData.multisig = Multisig(_multisig);
        bidiData.lastUpdate = block.number;
        bidiData.settlementPeriod = _settlementPeriod;
        bidiData.nonce = uint32(0);
    }

    function () payable public {}

    function toSender() public returns (uint256) {
        return bidiData.toSender;
    }

    function toReceiver() public returns (uint256) {
        return bidiData.toReceiver;
    }


    // TODO Maybe get rid of signatures in favour of owner=multisig
    function canUpdate(uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public view returns (bool) {
//        bool isNonceHigher = _nonce > bidiData.nonce;
//        bytes32 hash = recoveryPaymentDigest(paymentDigest(_nonce, _toSender, _toReceiver));
//        bool isSenderSignature = bidiData.multisig.sender() == ECRecovery.recover(hash, _senderSig);
//        bool isReceiverSignature = bidiData.multisig.receiver() == ECRecovery.recover(hash, _receiverSig);
//        return isSettling() && isNonceHigher && isSenderSignature && isReceiverSignature;
        return BidirectionalCFLibrary.canUpdate(bidiData, _nonce, _toSender, _toReceiver, _senderSig, _receiverSig);
    }

    function update(uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        require(canUpdate(_nonce, _toSender, _toReceiver, _senderSig, _receiverSig));

        bidiData.toSender = _toSender;
        bidiData.toReceiver = _toReceiver;
        bidiData.nonce = _nonce;
        bidiData.lastUpdate = block.number;
    }

//    function update(uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
//        BidirectionalCFLibrary.update(bidiData, _nonce, _toSender, _toReceiver, _senderSig, _receiverSig);
//    }


    function canClose(uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public view returns (bool) {
        bytes32 hash = BidirectionalCFLibrary.recoveryPaymentDigest(typeDigest('close', _toSender, _toReceiver));
        bool isSenderSignature = bidiData.multisig.sender() == ECRecovery.recover(hash, _senderSig);
        bool isReceiverSignature = bidiData.multisig.receiver() == ECRecovery.recover(hash, _receiverSig);
        return BidirectionalCFLibrary.isSettling(bidiData) && isSenderSignature && isReceiverSignature;
    }

    function close(uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        require(canClose(_toSender, _toReceiver, _senderSig, _receiverSig));
        bidiData.multisig.receiver().transfer(bidiData.toReceiver);
        bidiData.multisig.sender().transfer(bidiData.toSender);
        selfdestruct(bidiData.multisig);
    }

//    function withdraw() public {
//        require(!isSettling());
//
//        bidiData.multisig.receiver().transfer(bidiData.toReceiver);
//        bidiData.multisig.sender().transfer(bidiData.toSender);
//        selfdestruct(bidiData.multisig); // TODO Use that every time
//    }

    function withdraw() public {


        BidirectionalCFLibrary.withdraw(bidiData);
    }

    /*** CHANNEL STATE ***/

//    function isSettling() public view returns(bool) {
//        return block.number <= bidiData.lastUpdate + bidiData.settlementPeriod;
//    }
//
    function paymentDigest(uint32 _nonce, uint256 _toSender, uint256 _toReceiver) public pure returns(bytes32) {
        return BidirectionalCFLibrary.paymentDigest(_nonce, _toSender, _toReceiver); // TODO Use some contract-internal value
    }

    function typeDigest(bytes32 _type, uint256 _toSender, uint256 _toReceiver) public pure returns(bytes32) {
        return keccak256(_type, _toSender, _toReceiver); // TODO Use some contract-internal value
    }

//    function recoveryPaymentDigest(bytes32 hash) internal pure returns(bytes32) {
//        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
//        return keccak256(prefix, hash);
//    }
}
