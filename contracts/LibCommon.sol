pragma solidity ^0.4.19;

library LibCommon {
    function recoveryDigest(bytes32 hash) public pure returns(bytes32) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return keccak256(prefix, hash);
    }
}
