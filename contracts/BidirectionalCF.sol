pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";
import "./Multisig.sol";


/// @title Unidirectional Ether payment channels contract.
contract BidirectionalCF {
    using SafeMath for uint256;

    Multisig multisig; // TODO Maybe it is more cool to pass that as sender, receiver addresses
    uint256 lastUpdate;
    uint256 settlementPeriod;
    uint32  nonce;
    uint256 toSender;
    uint256 toReceiver;

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
        bytes32 hash = recoveryPaymentDigest(paymentDigest(_nonce, _toSender, _toReceiver));
        bool isSenderSignature = multisig.sender() == ECRecovery.recover(hash, _senderSig);
        bool isReceiverSignature = multisig.receiver() == ECRecovery.recover(hash, _receiverSig);
        return isSettling() && isNonceHigher && isSenderSignature && isReceiverSignature;
    }

    function update(uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        require(canUpdate(_nonce, _toSender, _toReceiver, _senderSig, _receiverSig));

        toSender = _toSender;
        toReceiver = _toReceiver;
        nonce = _nonce;
        lastUpdate = block.number;
    }

    function withdraw() public {
        require(!isSettling());

        multisig.receiver().transfer(toReceiver);
        multisig.sender().transfer(toSender);
        selfdestruct(multisig); // TODO Use that every time
    }

    /*** CHANNEL STATE ***/

    function isSettling() public view returns(bool) {
        return block.number <= lastUpdate + settlementPeriod;
    }

    function paymentDigest(uint32 _nonce, uint256 _toSender, uint256 _toReceiver) public pure returns(bytes32) {
        return keccak256(_nonce, _toSender, _toReceiver); // TODO Use some contract-internal value
    }

    function recoveryPaymentDigest(bytes32 hash) internal pure returns(bytes32) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return keccak256(prefix, hash);
    }
}
