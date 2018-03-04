pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract TestToken is StandardToken, MintableToken {
    function TestToken() public {
    }
}
