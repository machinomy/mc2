pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


contract DistributeToken {
    function execute(address _token, address sender, address receiver, uint256 toSender, uint256 toReceiver) public {
        StandardToken token = StandardToken(_token);

        require(token.transfer(sender, toSender));
        require(token.transfer(receiver, toReceiver));
    }
}
