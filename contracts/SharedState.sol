pragma solidity ^0.4.19;

import "./ISharedState.sol";
import "./LibCommon.sol";


contract SharedState is ISharedState {
    address public owner;
    uint32 public nonce;
    bytes32 public merkleRoot;
    uint256 updatePeriod;
    uint256 lastUpdate;


    modifier restricted() {
        if (msg.sender == owner)
            _;
    }

    function SharedState(address _owner, uint256 _updatePeriod, bytes32 _merkleRoot) public {
        owner = _owner;
        nonce = 0x0;
        merkleRoot = _merkleRoot;
        lastUpdate = 0x0;
        updatePeriod = _updatePeriod;
    }

    function update(uint32 _nonce, bytes32 _merkleRoot) public restricted {
        require(_nonce > nonce);
        // require(block.number <= lastUpdate + updatePeriod); TODO
        merkleRoot = _merkleRoot;
        nonce = _nonce;
        lastUpdate = block.number;
    }

    function isContained(bytes proof, bytes32 hashlock) internal view returns (bool) {
        return LibCommon.isContained(lastUpdate, updatePeriod, proof, merkleRoot, hashlock);
    }
}
