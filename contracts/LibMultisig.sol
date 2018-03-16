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
        require(LibCommon.executeHashCheck(LibCommon.executeHashCalc(thisAddress, destination, value, data, state.nonce), senderSig, receiverSig, state.sender, state.receiver));
        state.nonce++;
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
        require(LibCommon.executeHashCheck(LibCommon.executeHashCalc(thisAddress, destination, value, data, state.nonce), senderSig, receiverSig, state.sender, state.receiver));
        state.nonce++;
    }
}
