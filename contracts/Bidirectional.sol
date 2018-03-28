pragma solidity ^0.4.19;

import "./Multisig.sol";
import "./LibBidirectional.sol";


/// @title Bidirectional Ether payment channels contract.
contract Bidirectional {
    LibBidirectional.State public state;

    function Bidirectional(address _multisig, uint32 _settlementPeriod) public payable {
        state.multisig = Multisig(_multisig);
        state.lastUpdate = block.number;
        state.settlementPeriod = _settlementPeriod;
        // DidOpen
    }

    function () payable public {}

    function update(
        uint256 _nonce,
        uint256 _toSender,
        uint256 _toReceiver,
        bytes _senderSig,
        bytes _receiverSig
    ) external
    {
        LibBidirectional.update(
            state,
            _nonce,
            _toSender,
            _toReceiver,
            _senderSig,
            _receiverSig
        );
        // DidUpdate
    }

    function close(uint256 _toSender, uint256 _toReceiver, bytes _senderSig, bytes _receiverSig) public {
        require(LibBidirectional.canClose(state, _toSender, _toReceiver, _senderSig, _receiverSig));
        var (sender, receiver, _nonce) = state.multisig.state();
        receiver.transfer(_toReceiver);
        sender.transfer(_toSender);
        selfdestruct(state.multisig);
    }

    function withdraw() public {
        require(!LibBidirectional.isSettling(state));

        var (sender, receiver, _nonce) = state.multisig.state();
        receiver.transfer(state.toReceiver);
        sender.transfer(state.toSender);
        selfdestruct(state.multisig);
    }
}
