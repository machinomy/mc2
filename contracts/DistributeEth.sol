pragma solidity ^0.4.19;


contract DistributeEth {
    function execute(address sender, address receiver, uint256 toSender, uint256 toReceiver) public {
        sender.transfer(toSender);
        receiver.transfer(toReceiver);
    }
}
