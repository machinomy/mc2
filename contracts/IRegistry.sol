pragma solidity ^0.4.19;


contract IRegistry {
    function deploy(bytes code, bytes32 nonce) public;
    function resolve(bytes32 cfAddress) public view returns (address);
    event DidDeploy(bytes32 indexed id, address indexed deployed, address indexed owner);
}
