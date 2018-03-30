pragma solidity ^0.4.19;

import "./Multisig.sol";
import "./LibCommon.sol";


library LibLineup {
    struct State {
        uint256 nonce;
        bytes32 merkleRoot;
        uint256 updatePeriod;
        uint256 lastUpdate;
        Multisig multisig;
    }

    event Trace(bool a);
    function update(State storage _self, uint256 _nonce, bytes32 _merkleRoot, bytes _senderSig, bytes _receiverSig) internal {
        var hash = keccak256(_merkleRoot, _nonce);
        require(_self.multisig.isUnanimous(LibCommon.recoveryDigest(hash), _senderSig, _receiverSig));
        require(_nonce > _self.nonce);
        require(block.number <= _self.lastUpdate + _self.updatePeriod);

        _self.merkleRoot = _merkleRoot;
        _self.nonce = _nonce;
        _self.lastUpdate = block.number;
    }

    function isContained(State storage _self, bytes _proof, bytes32 _hashlock) public view returns (bool) {
        bytes32 proofElement;
        bytes32 cursor = _hashlock;
        bool result = false;

        if (block.number >= _self.lastUpdate + _self.updatePeriod) {
            for (uint256 i = 32; i <= _proof.length; i += 32) {
                assembly { proofElement := mload(add(_proof, i)) } // solium-disable-line security/no-inline-assembly

                if (cursor < proofElement) {
                    cursor = keccak256(cursor, proofElement);
                } else {
                    cursor = keccak256(proofElement, cursor);
                }
            }
            result = cursor == _self.merkleRoot;
        }
        return result;
    }
}

