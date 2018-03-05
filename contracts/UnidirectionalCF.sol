pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ECRecovery.sol";
import "./Multisig.sol";
import "./IRegistry.sol";
import "./ICounterfactual.sol";

/// @title Unidirectional Ether payment channels contract.
contract UnidirectionalCF is ICounterfactual {
    using SafeMath for uint256;

    Multisig multisig;
    IRegistry registry;
    uint256 settlingUntil;

    bytes32 id;

    function UnidirectionalCF(address _multisig, address _registry, uint32 _settlementPeriod) public payable {
        multisig = Multisig(_multisig);
        registry = IRegistry(_registry);
        settlingUntil = block.number + _settlementPeriod;
    }

    function () payable public {}

    function setId(bytes32 _id) public {
        require(id == bytes32(0x0));
        id = _id;
    }

    function canSettle() public view returns(bool) {
        bool isWaitingOver = block.number >= settlingUntil;
        return isSettling() && isWaitingOver;
    }

    function settle() public {
        require(canSettle());
        selfdestruct(multisig.sender());
    }

    function canWithdraw(uint256 payment, address origin, bytes signature) public view returns(bool) {
        bool isReceiver = origin == multisig.receiver();
        bytes32 hash = recoveryPaymentDigest(payment);
        bool isSigned = multisig.sender() == ECRecovery.recover(hash, signature);

        return isReceiver && isSigned;
    }

    function withdraw(uint256 payment, bytes signature) public {
        require(canWithdraw(payment, msg.sender, signature));

        if (payment < this.balance) {
            multisig.receiver().transfer(payment);
        }

        selfdestruct(multisig.receiver());
    }

    /*** CHANNEL STATE ***/

    function isSettling() public view returns(bool) {
        return settlingUntil != 0;
    }

    function isOpen() public view returns(bool) {
        return !isSettling();
    }

    function paymentDigest(uint256 payment) public view returns(bytes32) {
        return keccak256(id, payment);
    }

    function recoveryPaymentDigest(uint256 payment) internal view returns(bytes32) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return keccak256(prefix, paymentDigest(payment));
    }
}
