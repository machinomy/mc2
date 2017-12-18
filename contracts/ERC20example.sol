pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/token/StandardToken.sol";
import "zeppelin-solidity/contracts/token/MintableToken.sol";


contract ERC20example is StandardToken, MintableToken {
    function ERC20example() public {
    }
}
