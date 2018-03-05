pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ECRecovery.sol";


contract SharedState {
    address owner;
    uint32 public nonce;
    bytes32 public merkleRoot;


    modifier restricted() {
        if (msg.sender == owner)
            _;
    }

    function SharedState() public {
        owner = msg.sender;
        nonce = 0x0;
        merkleRoot = 0x0;
    }

    function update(uint32 _nonce, bytes32 _merkleRoot) public restricted {
        if (_nonce > nonce) {
            merkleRoot = _merkleRoot;
            nonce = _nonce;
        }
    }

    function isContained(bytes32 _merkleRoot) public view returns(bool) {
        return _merkleRoot == merkleRoot;
    }
}
