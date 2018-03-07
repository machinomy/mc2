pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


contract TestContract {
    uint256 public nonce;

    event DidUpdate(uint256 nonce);

    function TestContract(uint256 _nonce) public {
        nonce = _nonce;
    }

    function () payable public {}

    function updateNonce(uint256 _nonce) payable public {
        nonce = _nonce;
        DidUpdate(nonce);
    }
}
