pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";
import "./Multisig.sol";

import "./BidirectionalCFLibrary.sol";

/// @title Bidirectional Ether payment channels contract.
contract BidirectionalCF {
    using SafeMath for uint256;

    BidirectionalCFLibrary.BidirectionalCFData public bidiData;

    function BidirectionalCF(address _multisig, uint32 _settlementPeriod) public payable {
        bidiData.multisig = Multisig(_multisig);
        bidiData.lastUpdate = block.number;
        bidiData.settlementPeriod = _settlementPeriod;
        bidiData.nonce = uint32(0);
    }

    function () payable public {}

    function update(uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        BidirectionalCFLibrary.update(bidiData, _nonce, _toSender, _toReceiver, _senderSig, _receiverSig);
        bidiData.toSender = _toSender;
        bidiData.toReceiver = _toReceiver;
        bidiData.nonce = _nonce;
        bidiData.lastUpdate = block.number;
    }

    function close(uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        BidirectionalCFLibrary.closeCheck(bidiData.multisig, bidiData.lastUpdate, bidiData.settlementPeriod, _toSender, _toReceiver, _senderSig, _receiverSig);
        BidirectionalCFLibrary.closeTransfer(bidiData.multisig, bidiData.toSender, bidiData.toReceiver);

        selfdestruct(bidiData.multisig);
    }

    function withdraw() public {
        require(!BidirectionalCFLibrary.isSettling(bidiData.lastUpdate, bidiData.settlementPeriod));

        BidirectionalCFLibrary.closeTransfer(bidiData.multisig, bidiData.toSender, bidiData.toReceiver);
        selfdestruct(bidiData.multisig); // TODO Use that every time
    }

    /*** CHANNEL STATE ***/

    function paymentDigest(uint32 _nonce, uint256 _toSender, uint256 _toReceiver) public pure returns(bytes32) {
        return BidirectionalCFLibrary.paymentDigest(_nonce, _toSender, _toReceiver); // TODO Use some contract-internal value
    }

}
