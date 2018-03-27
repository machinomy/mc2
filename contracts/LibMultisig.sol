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

    function isUnanimous(bytes32 hash, bytes senderSig, bytes receiverSig, address sender, address receiver) public pure returns(bool) {
        return sender == LibCommon.recover(hash, senderSig) && receiver == LibCommon.recover(hash, receiverSig);
    }

    function execute(
        address thisAddress,
        address destination,
        uint256 value,
        bytes data,
        bytes senderSig,
        bytes receiverSig,
        State storage state
    ) public
    {
        require(isUnanimous(callDigest(thisAddress, destination, value, data, state.nonce), senderSig, receiverSig, state.sender, state.receiver));
        state.nonce.add(1);
    }

    function executeDelegate(
        address thisAddress,
        address destination,
        uint256 value,
        bytes data,
        bytes senderSig,
        bytes receiverSig,
        State storage state
    ) public
    {
        require(isUnanimous(callDigest(thisAddress, destination, value, data, state.nonce), senderSig, receiverSig, state.sender, state.receiver));
        state.nonce.add(1);
    }
}
