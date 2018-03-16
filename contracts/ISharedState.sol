pragma solidity ^0.4.19;


contract ISharedState {
    function isContained(bytes proof, bytes32 hashlock) internal view returns (bool);
}
