pragma solidity ^0.4.19;

import "./LibLineup.sol";
import "./Multisig.sol";


// Optimisation Idea: Use shared Lineup.
contract Lineup {
    LibLineup.State public state;

    event Trace();
    function Lineup(bytes32 _merkleRoot, uint256 _updatePeriod, address _multisig) public {
        state.merkleRoot = _merkleRoot;
        state.updatePeriod = _updatePeriod;
        state.lastUpdate = block.number;
        state.multisig = Multisig(_multisig);
    }

    function update(uint256 _nonce, bytes32 _merkleRoot, bytes _senderSig, bytes _receiverSig) external {
        LibLineup.update(state, _nonce, _merkleRoot, _senderSig, _receiverSig);
    }

    function isContained(bytes proof, bytes32 hashlock) public view returns (bool) {
        return LibLineup.isContained(state, proof, hashlock);
    }
}
