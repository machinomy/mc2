pragma solidity ^0.4.19;


contract TestDelegatecall {
    event Executed();
    function execute(uint256 amountA, uint256 amountB) public {
        require(amountA > amountB);
        Executed();
    }
}
