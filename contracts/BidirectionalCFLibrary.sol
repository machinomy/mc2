pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ECRecovery.sol";

import "./Multisig.sol";
import "./LibCommon.sol";


library BidirectionalCFLibrary {

    struct BidirectionalCFData {
        Multisig multisig;
        uint256  lastUpdate;
        uint256 settlementPeriod;
        uint32  nonce;
        uint256 toSender;
        uint256 toReceiver;
    }
    
    function canUpdate(BidirectionalCFData storage self, uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public view returns (bool) {
        bool isNonceHigher = _nonce > self.nonce;
        bytes32 hash = LibCommon.recoveryDigest(paymentDigest(_nonce, _toSender, _toReceiver));
        address sender;
        address receiver;
        uint256 nonce;
        (sender, receiver, nonce) = self.multisig.state();
        bool isSenderSignature = sender == ECRecovery.recover(hash, _senderSig);
        bool isReceiverSignature = receiver == ECRecovery.recover(hash, _receiverSig);
        return isSettling(self.lastUpdate, self.settlementPeriod) && isNonceHigher && isSenderSignature && isReceiverSignature;
    }

    function update(BidirectionalCFData storage bidiData, uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        require(canUpdate(bidiData, _nonce, _toSender, _toReceiver, _senderSig, _receiverSig));
    }

    function canClose(Multisig multisig, uint256 lastUpdate, uint256 settlementPeriod, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public view returns (bool) {
        bytes32 hash = LibCommon.recoveryDigest(typeDigest('close', _toSender, _toReceiver));

        address sender;
        address receiver;
        uint256 __nonce;
        (sender, receiver, __nonce) = multisig.state();

        bool isSenderSignature = sender == ECRecovery.recover(hash, _senderSig);
        bool isReceiverSignature = receiver == ECRecovery.recover(hash, _receiverSig);
        return isSettling(lastUpdate, settlementPeriod) && isSenderSignature && isReceiverSignature;
    }

    function paymentDigest(uint32 _nonce, uint256 _toSender, uint256 _toReceiver) public pure returns(bytes32) {
        return keccak256(_nonce, _toSender, _toReceiver); // TODO Use some contract-internal value
    }

    function typeDigest(bytes32 _type, uint256 _toSender, uint256 _toReceiver) public pure returns(bytes32) {
        return keccak256(_type, _toSender, _toReceiver); // TODO Use some contract-internal value
    }

    function isSettling(uint256 lastUpdate, uint256 settlementPeriod) public view returns(bool) {
        return block.number <= lastUpdate + settlementPeriod;
    }

}
