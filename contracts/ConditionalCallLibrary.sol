pragma solidity ^0.4.19;

import "./ILineup.sol";
import "./PublicRegistry.sol";


library ConditionalCallLibrary {
    function execute(
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
        ILineup lineup = ILineup(lineupAddress);

        bytes32 hash = callHash(_destination, _value, _data);
        require(lineup.isContained(_proof, hash));
        require(_destination.call.value(_value)(_data)); // solium-disable-line security/no-call-value
    }

    function callHash(address _destination, uint256 _value, bytes _data) public pure returns (bytes32) {
        return keccak256(_destination, _value, _data);
    }
}
