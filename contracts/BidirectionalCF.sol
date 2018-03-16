pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";
import "./Multisig.sol";

import "./BidirectionalCFLibrary.sol";

/// @title Bidirectional Ether payment channels contract.
contract BidirectionalCF {
    using SafeMath for uint256;

    BidirectionalCFLibrary.State public state;

    function BidirectionalCF(address _multisig, uint32 _settlementPeriod) public payable {
        state.multisig = Multisig(_multisig);
        state.lastUpdate = block.number;
        state.settlementPeriod = _settlementPeriod;
        state.nonce = uint32(0);
    }

    function () payable public {}

    function update(uint32 _nonce, uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        BidirectionalCFLibrary.update(state, _nonce, _toSender, _toReceiver, _senderSig, _receiverSig);
        state.toSender = _toSender;
        state.toReceiver = _toReceiver;
        state.nonce = _nonce;
        state.lastUpdate = block.number;
    }

    function close(uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        BidirectionalCFLibrary.closeCheck(state.multisig, state.lastUpdate, state.settlementPeriod, _toSender, _toReceiver, _senderSig, _receiverSig);
        BidirectionalCFLibrary.closeTransfer(state.multisig, state.toSender, state.toReceiver);

        selfdestruct(state.multisig);
    }

    function withdraw() public {
        require(!BidirectionalCFLibrary.isSettling(state.lastUpdate, state.settlementPeriod));

        BidirectionalCFLibrary.closeTransfer(state.multisig, state.toSender, state.toReceiver);
        selfdestruct(state.multisig); // TODO Use that every time
    }

    /*** CHANNEL STATE ***/

    function paymentDigest(uint32 _nonce, uint256 _toSender, uint256 _toReceiver) public pure returns(bytes32) {
        return BidirectionalCFLibrary.paymentDigest(_nonce, _toSender, _toReceiver); // TODO Use some contract-internal value
    }

}
