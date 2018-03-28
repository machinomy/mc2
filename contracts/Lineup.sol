pragma solidity ^0.4.19;

import "./LibLineup.sol";

// Optimisation Idea: Use shared Lineup.
contract Lineup {
    LibLineup.State public state;

    function Lineup(bytes32 _merkleRoot, uint256 _updatePeriod) public {
        state.merkleRoot = _merkleRoot;
        state.updatePeriod = _updatePeriod;
    }

    function update(uint256 _nonce, bytes32 _merkleRoot) external {
        LibLineup.update(state, _nonce, _merkleRoot);
    }

    function isContained(bytes proof, bytes32 hashlock) public view returns (bool) {
        return LibLineup.isContained(state, proof, hashlock);
    }
}
