pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ECRecovery.sol";


contract SharedState {
    address public owner;
    uint32 public nonce;
    bytes32 public merkleRoot;
    uint updatePeriod;
    uint lastUpdate;


    modifier restricted() {
        if (msg.sender == owner)
            _;
    }

    function SharedState(address _owner) public {
        owner = _owner;
        nonce = 0x0;
        merkleRoot = 0x0;
        lastUpdate = 0x0;
    }

    function update(uint32 _nonce, bytes32 _merkleRoot) public restricted {
        require(_nonce > nonce);
        merkleRoot = _merkleRoot;
        nonce = _nonce;
        lastUpdate = block.number;
    }

    function isContained(bytes proof, bytes32 hashlock) public view returns (bool) {
        bytes32 proofElement;
        bytes32 cursor = hashlock;
        bool result = false;

        if (block.number > lastUpdate + updatePeriod) {
            for (uint256 i = 32; i <= proof.length; i += 32) {
                assembly { proofElement := mload(add(proof, i)) }

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
