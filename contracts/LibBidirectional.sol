pragma solidity ^0.4.19;

import "./Multisig.sol";
import "./LibCommon.sol";


library LibBidirectional {
    struct State {
        Multisig multisig;
        uint256 lastUpdate;
        uint256 settlementPeriod;
        uint256 nonce;
        uint256 toSender;
        uint256 toReceiver;
    }

    function canUpdate(
        State storage _self,
        uint256 _nonce,
        uint256 _toSender,
        uint256 _toReceiver,
        bytes _senderSig,
        bytes _receiverSig
    ) public view returns (bool)
    {
        bool isNonceHigher = _nonce > _self.nonce;
        // FIXME Add a secret to prevent replay attach
        bytes32 hash = LibCommon.recoveryDigest(keccak256(_nonce, _toSender, _toReceiver));
        bool isSigned = _self.multisig.isUnanimous(hash, _senderSig, _receiverSig);
        return isSettling(_self) && isNonceHigher && isSigned;
    }

    function update(
        State storage _state,
        uint256 _nonce,
        uint256 _toSender,
        uint256 _toReceiver,
        bytes _senderSig,
        bytes _receiverSig
    ) public
    {
        var can = canUpdate(
            _state,
            _nonce,
            _toSender,
            _toReceiver,
            _senderSig,
            _receiverSig
        );
        require(can);
        _state.toSender = _toSender;
        _state.toReceiver = _toReceiver;
        _state.nonce = _nonce;
        _state.lastUpdate = block.number;
    }

    function canClose(
        State storage _self,
        uint256 _toSender,
        uint256 _toReceiver,
        bytes _senderSig,
        bytes _receiverSig
    ) public view returns (bool)
    {
        // FIXME Add a secret to prevent replay attach
        bytes32 hash = LibCommon.recoveryDigest(keccak256("c", _toSender, _toReceiver));
        bool isSigned = _self.multisig.isUnanimous(hash, _senderSig, _receiverSig);
        return isSettling(_self) && isSigned;
    }

    function isSettling(State storage _state) public view returns(bool) {
        return block.number <= _state.lastUpdate + _state.settlementPeriod;
    }
}
