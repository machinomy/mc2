pragma solidity ^0.4.19;


contract ILineup {
    function isContained(bytes proof, bytes32 hashlock) public view returns (bool);
}
