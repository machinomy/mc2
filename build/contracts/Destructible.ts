export default {
  "contract_name": "Destructible",
  "abi": [
    {
      "constant": false,
      "inputs": [],
      "name": "destroy",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_recipient",
          "type": "address"
        }
      ],
      "name": "destroyAndSend",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "inputs": [],
      "payable": true,
      "type": "constructor"
    }
  ],
  "unlinked_binary": "0x60606040525b5b60008054600160a060020a03191633600160a060020a03161790555b5b5b6101ce806100336000396000f300606060405263ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166383197ef0811461005e5780638da5cb5b14610073578063f2fde38b146100a2578063f5074f41146100c3575b600080fd5b341561006957600080fd5b6100716100e4565b005b341561007e57600080fd5b610086610110565b604051600160a060020a03909116815260200160405180910390f35b34156100ad57600080fd5b610071600160a060020a036004351661011f565b005b34156100ce57600080fd5b610071600160a060020a0360043516610177565b005b60005433600160a060020a039081169116146100ff57600080fd5b600054600160a060020a0316ff5b5b565b600054600160a060020a031681565b60005433600160a060020a0390811691161461013a57600080fd5b600160a060020a03811615610172576000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790555b5b5b50565b60005433600160a060020a0390811691161461019257600080fd5b80600160a060020a0316ff5b5b505600a165627a7a72305820baae775745abc28e787f2eff79c964878b873bfcde8f97eceab74c7a3ff0fcb90029",
  "networks": {},
  "schema_version": "0.0.5",
  "updated_at": 1507021128997
}