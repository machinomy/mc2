pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ECRecovery.sol";
import "zeppelin-solidity/contracts/MerkleProof.sol";
import "./ISharedState.sol";
import "./BidirectionalCFLibrary.sol";


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

    function isContained(bytes proof, bytes32 hashlock) public view returns (bool) {
        //return BidirectionalCFLibrary.isContained(lastUpdate, updatePeriod, proof, merkleRoot, hashlock);
        bytes32 proofElement;
        bytes32 cursor = hashlock;
        bool result = false;

        if (block.number > lastUpdate + updatePeriod) {
            for (uint256 i = 32; i <= proof.length; i += 32) {
                assembly { proofElement := mload(add(proof, i)) } // solium-disable-line security/no-inline-assembly

                if (cursor < proofElement) {
                    cursor = keccak256(cursor, proofElement);
                } else {
                    cursor = keccak256(proofElement, cursor);
                }
            }
            result = cursor == merkleRoot;
        }
        return result;
    }
}
