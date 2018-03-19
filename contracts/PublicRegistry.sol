pragma solidity ^0.4.19;

import "./IRegistry.sol";
import "./PublicRegistryLibrary.sol";


contract PublicRegistry is IRegistry {
    mapping (bytes32 => address) _contracts;

    function PublicRegistry() public {
        // Do Nothing
    }

    function deploy(bytes _code, bytes32 nonce) public {
        //PublicRegistryLibrary.deploy(_contracts, _code, nonce);
        address realAddress;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            realAddress := create(0, add(_code, 0x20), mload(_code))
        }
        bytes32 cfAddress = counterfactualAddress(_code, nonce);
        _contracts[cfAddress] = realAddress;

        DidDeploy(cfAddress, realAddress, msg.sender);
    }

    function resolve(bytes32 cfAddress) public view returns (address) {
        return _contracts[cfAddress];
    }

    function counterfactualAddress(bytes _code, bytes32 nonce) public pure returns (bytes32) {
        return keccak256(_code, nonce);
    }
}
