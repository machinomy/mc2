pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";

import "./Multisig.sol";


library BidirectionalCFLibrary {

    struct BidirectionalCFData {
        Multisig multisig;
        uint256 lastUpdate;
        uint256 settlementPeriod;
        uint32  nonce;
        uint256 toSender;
        uint256 toReceiver;
    }

    function withdraw(BidirectionalCFData storage self) public {
        require(!isSettling(self));

        self.multisig.receiver().transfer(self.toReceiver);
        self.multisig.sender().transfer(self.toSender);
        selfdestruct(self.multisig); // TODO Use that every time
    }

    function canUpdate(BidirectionalCFData storage self, uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public view returns (bool) {
        bool isNonceHigher = _nonce > self.nonce;
        bytes32 hash = recoveryPaymentDigest(paymentDigest(_nonce, _toSender, _toReceiver));
        bool isSenderSignature = self.multisig.sender() == ECRecovery.recover(hash, _senderSig);
        bool isReceiverSignature = self.multisig.receiver() == ECRecovery.recover(hash, _receiverSig);
        return isSettling(self) && isNonceHigher && isSenderSignature && isReceiverSignature;
    }

    function update(BidirectionalCFData storage self, uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        require(canUpdate(self, _nonce, _toSender, _toReceiver, _senderSig, _receiverSig));

        self.toSender = _toSender;
        self.toReceiver = _toReceiver;
        self.nonce = _nonce;
        self.lastUpdate = block.number;
    }

    function recoveryPaymentDigest(bytes32 hash) internal pure returns(bytes32) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return keccak256(prefix, hash);
    }

    function paymentDigest(uint32 _nonce, uint256 _toSender, uint256 _toReceiver) public pure returns(bytes32) {
        return keccak256(_nonce, _toSender, _toReceiver); // TODO Use some contract-internal value
    }



    function isSettling(BidirectionalCFData storage self) public view returns(bool) {
        return block.number <= self.lastUpdate + self.settlementPeriod;
    }



}
