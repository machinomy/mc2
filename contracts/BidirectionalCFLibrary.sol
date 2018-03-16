pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";

import "./Multisig.sol";
import "./LibCommon.sol";


library BidirectionalCFLibrary {
    using SafeMath for uint256;

    struct State {
        Multisig multisig;
        uint256  lastUpdate;
        uint256 settlementPeriod;
        uint32  nonce;
        uint256 toSender;
        uint256 toReceiver;
    }

    function canUpdate(State storage self, uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public view returns (bool) {
        bool isNonceHigher = _nonce > self.nonce;
        bytes32 hash = LibCommon.recoveryDigest(keccak256(_nonce, _toSender, _toReceiver));
        address sender;
        address receiver;
        uint256 nonce;
        (sender, receiver, nonce) = self.multisig.state();
        return isSettling(self.lastUpdate, self.settlementPeriod) && isNonceHigher && LibCommon.executeHashCheck( hash, _senderSig,  _receiverSig,  sender, receiver);
    }

    function update(State storage bidiData, uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public view {
        require(canUpdate(bidiData, _nonce, _toSender, _toReceiver, _senderSig, _receiverSig));
    }

    function canClose(Multisig multisig, uint256 lastUpdate, uint256 settlementPeriod, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public view returns (bool) {
        bytes32 hash = LibCommon.recoveryDigest(keccak256('close', _toSender, _toReceiver));

        address sender;
        address receiver;
        uint256 __nonce;
        (sender, receiver, __nonce) = multisig.state();
        return isSettling(lastUpdate, settlementPeriod) && LibCommon.executeHashCheck( hash, _senderSig,  _receiverSig,  sender, receiver);
    }

    function closeCheck(Multisig multisig, uint256 lastUpdate, uint256 settlementPeriod, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public view {
        require(canClose(multisig, lastUpdate, settlementPeriod, _toSender, _toReceiver, _senderSig, _receiverSig));
    }

    function closeTransfer(Multisig multisig, uint256 toSender, uint256 toReceiver) public {
        address sender;
        address receiver;
        uint256 __nonce;
        (sender, receiver, __nonce) = multisig.state();
        receiver.transfer(toReceiver);

        sender.transfer(toSender);
    }

    function isSettling(uint256 lastUpdate, uint256 settlementPeriod) public view returns(bool) {
        return block.number <= lastUpdate + settlementPeriod;
    }
}
