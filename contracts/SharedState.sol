pragma solidity ^0.4.19;

import "./ISharedState.sol";
import "./LibCommon.sol";


contract SharedState is ISharedState {
    LibCommon.ShareStateState public state;

    modifier restricted() {
        if (msg.sender == state.owner)
            _;
    }

    function SharedState(address _owner, uint256 _updatePeriod, bytes32 _merkleRoot) public {
        state.owner = _owner;
        state.merkleRoot = _merkleRoot;
        state.updatePeriod = _updatePeriod;
    }

    function update(uint256 _nonce, bytes32 _merkleRoot) public restricted {
        require(_nonce > state.nonce);
        // require(block.number <= lastUpdate + updatePeriod); TODO
        state.merkleRoot = _merkleRoot;
        state.nonce = _nonce;
        state.lastUpdate = block.number;
    }

    function isContained(bytes proof, bytes32 hashlock) public view returns (bool) {
        return LibCommon.isContained(state.lastUpdate, state.updatePeriod, proof, state.merkleRoot, hashlock);
    }
}
