pragma solidity ^0.4.19;

import "./Lineup.sol";
import "./PublicRegistry.sol";


contract Conditional {
    function doCall(
        address _registry,
        bytes32 _lineupCF,
        bytes _proof,
        address _destination,
        uint256 _value,
        bytes _data
    ) public
    {

        PublicRegistry registry = PublicRegistry(_registry);
        address lineupAddress = registry.resolve(_lineupCF);
        Lineup lineup = Lineup(lineupAddress);

        bytes32 hash = callHash(_destination, _value, _data);
        require(lineup.isContained(_proof, hash));
        require(_destination.call.value(_value)(_data)); // solium-disable-line security/no-call-value
    }

    function doDelegate(
        address _registry,
        bytes32 _lineupCF,
        bytes _proof,
        address _destination,
        uint256 _value,
        bytes _data
    ) public
    {

        PublicRegistry registry = PublicRegistry(_registry);
        address lineupAddress = registry.resolve(_lineupCF);
        Lineup lineup = Lineup(lineupAddress);

        bytes32 hash = callHash(_destination, _value, _data);
        require(lineup.isContained(_proof, hash));
        require(_destination.delegatecall(_data)); // solium-disable-line security/no-low-level-calls
    }

    function callHash(address _destination, uint256 _value, bytes _data) public pure returns (bytes32) {
        return keccak256(_destination, _value, _data);
    }
}
