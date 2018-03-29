pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


contract DistributeToken {
    function execute(address _token, address a, address b, uint256 amountA, uint256 amountB) public {
        StandardToken token = StandardToken(_token);
        require(token.transfer(a, amountA));
        require(token.transfer(b, amountB));
    }
}
