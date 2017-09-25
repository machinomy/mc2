export default {
  "contract_name": "MintableToken",
  "abi": [
    {
      "constant": true,
      "inputs": [],
      "name": "mintingFinished",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "finishMinting",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
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
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "remaining",
          "type": "uint256"
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
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Mint",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "MintFinished",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    }
  ],
  "unlinked_binary": "0x60606040526003805460a060020a60ff02191690555b60038054600160a060020a03191633600160a060020a03161790555b5b610746806100416000396000f300606060405236156100935763ffffffff60e060020a60003504166305d2035b8114610095578063095ea7b3146100b957806318160ddd146100ec57806323b872dd1461010e57806340c10f191461014757806370a082311461017a5780637d64bcb4146101a85780638da5cb5b146101cc578063a9059cbb146101f8578063dd62ed3e1461022b578063f2fde38b1461025f575bfe5b341561009d57fe5b6100a561027d565b604080519115158252519081900360200190f35b34156100c157fe5b6100a5600160a060020a036004351660243561028d565b604080519115158252519081900360200190f35b34156100f457fe5b6100fc610332565b60408051918252519081900360200190f35b341561011657fe5b6100a5600160a060020a0360043581169060243516604435610338565b604080519115158252519081900360200190f35b341561014f57fe5b6100a5600160a060020a036004351660243561043b565b604080519115158252519081900360200190f35b341561018257fe5b6100fc600160a060020a036004351661050e565b60408051918252519081900360200190f35b34156101b057fe5b6100a561052d565b604080519115158252519081900360200190f35b34156101d457fe5b6101dc610593565b60408051600160a060020a039092168252519081900360200190f35b341561020057fe5b6100a5600160a060020a03600435166024356105a2565b604080519115158252519081900360200190f35b341561023357fe5b6100fc600160a060020a0360043581169060243516610650565b60408051918252519081900360200190f35b341561026757fe5b61027b600160a060020a036004351661067d565b005b60035460a060020a900460ff1681565b60008115806102bf5750600160a060020a03338116600090815260026020908152604080832093871683529290522054155b15156102cb5760006000fd5b600160a060020a03338116600081815260026020908152604080832094881680845294825291829020869055815186815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a35060015b92915050565b60005481565b600160a060020a03808416600090815260026020908152604080832033851684528252808320549386168352600190915281205490919061037f908463ffffffff6106c916565b600160a060020a0380861660009081526001602052604080822093909355908716815220546103b4908463ffffffff6106e316565b600160a060020a0386166000908152600160205260409020556103dd818463ffffffff6106e316565b600160a060020a038087166000818152600260209081526040808320338616845282529182902094909455805187815290519288169391926000805160206106fb833981519152929181900390910190a3600191505b509392505050565b60035460009033600160a060020a0390811691161461045a5760006000fd5b60035460a060020a900460ff16156104725760006000fd5b600054610485908363ffffffff6106c916565b6000908155600160a060020a0384168152600160205260409020546104b0908363ffffffff6106c916565b600160a060020a038416600081815260016020908152604091829020939093558051858152905191927f0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d412139688592918290030190a25060015b5b5b92915050565b600160a060020a0381166000908152600160205260409020545b919050565b60035460009033600160a060020a0390811691161461054c5760006000fd5b6003805460a060020a60ff02191660a060020a1790556040517fae5184fba832cb2b1f702aca6117b8d265eaf03ad33eb133f19dde0f5920fa0890600090a15060015b5b90565b600354600160a060020a031681565b600160a060020a0333166000908152600160205260408120546105cb908363ffffffff6106e316565b600160a060020a033381166000908152600160205260408082209390935590851681522054610600908363ffffffff6106c916565b600160a060020a038085166000818152600160209081526040918290209490945580518681529051919333909316926000805160206106fb83398151915292918290030190a35060015b92915050565b600160a060020a038083166000908152600260209081526040808320938516835292905220545b92915050565b60035433600160a060020a039081169116146106995760006000fd5b600160a060020a038116156106c45760038054600160a060020a031916600160a060020a0383161790555b5b5b50565b6000828201838110156106d857fe5b8091505b5092915050565b6000828211156106ef57fe5b508082035b929150505600ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa165627a7a7230582059924f42b9fe4771bc4e1828d3901450ffacfb47110d1d12483c16713f0afa680029",
  "networks": {},
  "schema_version": "0.0.5",
  "updated_at": 1506328459416
}