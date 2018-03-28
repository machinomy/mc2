pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";
import "./Multisig.sol";
import "./PublicRegistry.sol";


/// @title Unidirectional Ether payment channels contract.
contract UnidirectionalCF {
    using SafeMath for uint256;

    Multisig multisig;
    PublicRegistry registry; // TODO Remove that, not needed
    uint256 settlingUntil;

    bytes32 id;

    function UnidirectionalCF(address _multisig, address _registry, uint32 _settlementPeriod) public payable {
        multisig = Multisig(_multisig);
        registry = PublicRegistry(_registry);
        settlingUntil = block.number + _settlementPeriod;
    }

    function() payable public {}

    function canSettle() public view returns(bool) {
        bool isWaitingOver = block.number >= settlingUntil;
        return isSettling() && isWaitingOver;
    }

    function settle() public {
        require(canSettle());
        address sender;
        address receiver;
        uint256 _nonce;
        (sender, receiver, _nonce) = multisig.state();
        selfdestruct(sender);
    }

    function canWithdraw(uint256 payment, address origin, bytes signature) public view returns (bool) {
        address sender;
        address receiver;
        uint256 _nonce;
        (sender, receiver, _nonce) = multisig.state();
        bool isReceiver = origin == receiver;
        bytes32 hash = recoveryPaymentDigest(payment);
        bool isSigned = sender == ECRecovery.recover(hash, signature);

        return isReceiver && isSigned;
    }

    function withdraw(uint256 payment, bytes signature) public {
        require(canWithdraw(payment, msg.sender, signature));
        address sender;
        address receiver;
        uint256 _nonce;
        (sender, receiver, _nonce) = multisig.state();

        if (payment >= this.balance) {
            receiver.transfer(payment);
        } else {
            receiver.transfer(payment);
            sender.transfer(this.balance.sub(payment));
        }

        selfdestruct(sender);
    }

    /*** CHANNEL STATE ***/

    function isSettling() public view returns (bool) {
        return settlingUntil != 0;
    }

    function isOpen() public view returns (bool) {
        return !isSettling();
    }

    // FIXME Use some internal nonce/secret to prevent replay attack
    function paymentDigest(uint256 payment) public pure returns (bytes32) {
        return keccak256(payment);
    }

    function recoveryPaymentDigest(uint256 payment) internal pure returns (bytes32) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return keccak256(prefix, paymentDigest(payment));
    }
}
