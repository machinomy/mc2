export default {
  "contract_name": "ERC20example",
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
      "inputs": [],
      "payable": false,
      "type": "constructor"
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
  "unlinked_binary": "0x60606040526003805460a060020a60ff0219169055341561001f57600080fd5b5b5b60038054600160a060020a03191633600160a060020a03161790555b5b5b6107d68061004e6000396000f300606060405236156100ac5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305d2035b81146100b1578063095ea7b3146100d857806318160ddd1461010e57806323b872dd1461013357806340c10f191461016f57806370a08231146101a55780637d64bcb4146101d65780638da5cb5b146101fd578063a9059cbb1461022c578063dd62ed3e14610262578063f2fde38b14610299575b600080fd5b34156100bc57600080fd5b6100c46102ba565b604051901515815260200160405180910390f35b34156100e357600080fd5b6100c4600160a060020a03600435166024356102db565b604051901515815260200160405180910390f35b341561011957600080fd5b610121610382565b60405190815260200160405180910390f35b341561013e57600080fd5b6100c4600160a060020a0360043581169060243516604435610388565b604051901515815260200160405180910390f35b341561017a57600080fd5b6100c4600160a060020a036004351660243561049d565b604051901515815260200160405180910390f35b34156101b057600080fd5b610121600160a060020a036004351661057f565b60405190815260200160405180910390f35b34156101e157600080fd5b6100c461059e565b604051901515815260200160405180910390f35b341561020857600080fd5b610210610625565b604051600160a060020a03909116815260200160405180910390f35b341561023757600080fd5b6100c4600160a060020a0360043516602435610634565b604051901515815260200160405180910390f35b341561026d57600080fd5b610121600160a060020a03600435811690602435166106f4565b60405190815260200160405180910390f35b34156102a457600080fd5b6102b8600160a060020a0360043516610721565b005b60035474010000000000000000000000000000000000000000900460ff1681565b600081158061030d5750600160a060020a03338116600090815260026020908152604080832093871683529290522054155b151561031857600080fd5b600160a060020a03338116600081815260026020908152604080832094881680845294909152908190208590557f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259085905190815260200160405180910390a35060015b92915050565b60005481565b600160a060020a0380841660009081526002602090815260408083203385168452825280832054938616835260019091528120549091906103cf908463ffffffff61077916565b600160a060020a038086166000908152600160205260408082209390935590871681522054610404908463ffffffff61079316565b600160a060020a03861660009081526001602052604090205561042d818463ffffffff61079316565b600160a060020a03808716600081815260026020908152604080832033861684529091529081902093909355908616917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9086905190815260200160405180910390a3600191505b509392505050565b60035460009033600160a060020a039081169116146104bb57600080fd5b60035474010000000000000000000000000000000000000000900460ff16156104e357600080fd5b6000546104f6908363ffffffff61077916565b6000908155600160a060020a038416815260016020526040902054610521908363ffffffff61077916565b600160a060020a0384166000818152600160205260409081902092909255907f0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d41213968859084905190815260200160405180910390a25060015b5b5b92915050565b600160a060020a0381166000908152600160205260409020545b919050565b60035460009033600160a060020a039081169116146105bc57600080fd5b6003805474ff00000000000000000000000000000000000000001916740100000000000000000000000000000000000000001790557fae5184fba832cb2b1f702aca6117b8d265eaf03ad33eb133f19dde0f5920fa0860405160405180910390a15060015b5b90565b600354600160a060020a031681565b600160a060020a03331660009081526001602052604081205461065d908363ffffffff61079316565b600160a060020a033381166000908152600160205260408082209390935590851681522054610692908363ffffffff61077916565b600160a060020a0380851660008181526001602052604090819020939093559133909116907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a35060015b92915050565b600160a060020a038083166000908152600260209081526040808320938516835292905220545b92915050565b60035433600160a060020a0390811691161461073c57600080fd5b600160a060020a03811615610774576003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790555b5b5b50565b60008282018381101561078857fe5b8091505b5092915050565b60008282111561079f57fe5b508082035b929150505600a165627a7a723058207f303daa1c5be37728453f28ba1ff6480e77995c75bda725ef18b43f71032b700029",
  "networks": {
    "3": {
      "events": {
        "0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885": {
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
        "0xae5184fba832cb2b1f702aca6117b8d265eaf03ad33eb133f19dde0f5920fa08": {
          "anonymous": false,
          "inputs": [],
          "name": "MintFinished",
          "type": "event"
        },
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925": {
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
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": {
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
      },
      "links": {},
      "address": "0xeb08de5117f8dc15557931f7c21adbf9e252f7a6",
      "updated_at": 1509007569030
    },
    "999": {
      "events": {
        "0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885": {
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
        "0xae5184fba832cb2b1f702aca6117b8d265eaf03ad33eb133f19dde0f5920fa08": {
          "anonymous": false,
          "inputs": [],
          "name": "MintFinished",
          "type": "event"
        },
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925": {
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
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": {
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
      },
      "links": {},
      "address": "0x8ad5c3cd38676d630b060a09baa40b0a3cb0b4b5",
      "updated_at": 1508952753753
    }
  },
  "schema_version": "0.0.5",
  "updated_at": 1509007569030
}