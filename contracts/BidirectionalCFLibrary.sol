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

    function paymentDigest(uint32 _nonce, uint256 _toSender, uint256 _toReceiver) public pure returns(bytes32) {
        return keccak256(_nonce, _toSender, _toReceiver); // TODO Use some contract-internal value
    }

    function isSettling(uint256 lastUpdate, uint256 settlementPeriod) public view returns(bool) {
        return block.number <= lastUpdate + settlementPeriod;
    }

    function isContained(uint256 lastUpdate, uint256 updatePeriod, bytes proof, bytes32 merkleRoot, bytes32 hashlock) public view returns (bool) {
        bytes32 proofElement;
        bytes32 cursor = hashlock;
        bool result = false;

        if (block.number > lastUpdate + updatePeriod) {
            for (uint256 i = 32; i <= proof.length; i += 32) {
                assembly { proofElement := mload(add(proof, i)) } // solium-disable-line security/no-inline-assembly

                if (cursor < proofElement) {
                    cursor = keccak256(cursor, proofElement);
                } else {
                    cursor = keccak256(proofElement, cursor);
                }
            }
            result = cursor == merkleRoot;
        }
        return result;
    }

}
