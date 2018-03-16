pragma solidity ^0.4.19;

library LibCommon {
    function recoveryDigest(bytes32 hash) public pure returns(bytes32) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return keccak256(prefix, hash);
    }

    function isContained(uint256 lastUpdate, uint256 updatePeriod, bytes proof, bytes32 merkleRoot, bytes32 hashlock) public view returns (bool) {
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

    function executeHashCalc(address thisAddress, address destination, uint256 value, bytes data, uint256 nonce) public pure returns(bytes32) {
        return recoveryDigest(keccak256(thisAddress, destination, value, data, nonce));
    }

    function executeHashCheck(bytes32 hash, bytes senderSig, bytes receiverSig, address sender, address receiver) public pure returns(bool) {
        return sender == recover(hash, senderSig) && receiver == recover(hash, receiverSig);
    }

    /**
   * @dev [code from zeppelin-solidity] Recover signer address from a message by using his signature
   * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
   * @param sig bytes signature, the signature is generated using web3.eth.sign()
   */
    function recover(bytes32 hash, bytes sig) public pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        //Check the signature length
        if (sig.length != 65) {
            return (address(0));
        }

        // Divide the signature in r, s and v variables
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return (address(0));
        } else {
            return ecrecover(hash, v, r, s);
        }
    }

}

