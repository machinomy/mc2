pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./LibCommon.sol";


library LibMultisig {
    using SafeMath for uint256;

    struct State {
        address sender;
        address receiver;
        uint256 nonce;
    }

    function callDigest(
        address _self,
        address _destination,
        uint256 _value,
        bytes _data,
        uint256 _nonce
    ) public pure returns(bytes32)
    {
        return LibCommon.recoveryDigest(keccak256(_self, _destination, _value, _data, _nonce));
    }

    function delegateDigest(
        address _self,
        address _destination,
        bytes _data,
        uint256 _nonce
    ) public pure returns(bytes32)
    {
        return LibCommon.recoveryDigest(keccak256(_self, _destination, _data, _nonce));
    }

    function isUnanimous(
        State storage state,
        bytes32 hash,
        bytes senderSig,
        bytes receiverSig
    ) public view returns(bool)
    {
        return state.sender == LibCommon.recover(hash, senderSig) &&
            state.receiver == LibCommon.recover(hash, receiverSig);
    }

    function doCall(
        address self,
        address destination,
        uint256 value,
        bytes data,
        bytes senderSig,
        bytes receiverSig,
        State storage state
    ) public view
    {
        require(isUnanimous(state, callDigest(self, destination, value, data, state.nonce), senderSig, receiverSig));
        state.nonce.add(1);
    }

    function doDelegatecall(
        address self,
        address destination,
        bytes data,
        bytes senderSig,
        bytes receiverSig,
        State storage state
    ) public view
    {
        require(isUnanimous(state, delegateDigest(self, destination, data, state.nonce), senderSig, receiverSig));
        state.nonce.add(1);
    }
}
