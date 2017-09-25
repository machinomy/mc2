export default {
  "contract_name": "Broker",
  "abi": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "channelId",
          "type": "bytes32"
        }
      ],
      "name": "getState",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "channelId",
          "type": "bytes32"
        }
      ],
      "name": "close",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "sender",
          "type": "address"
        },
        {
          "name": "channelId",
          "type": "bytes32"
        }
      ],
      "name": "canFinishSettle",
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
          "name": "receiver",
          "type": "address"
        },
        {
          "name": "duration",
          "type": "uint256"
        },
        {
          "name": "settlementPeriod",
          "type": "uint256"
        }
      ],
      "name": "createChannel",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": true,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "channelId",
          "type": "bytes32"
        },
        {
          "name": "payment",
          "type": "uint256"
        },
        {
          "name": "h",
          "type": "bytes32"
        },
        {
          "name": "v",
          "type": "uint8"
        },
        {
          "name": "r",
          "type": "bytes32"
        },
        {
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "claim",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "sender",
          "type": "address"
        },
        {
          "name": "channelId",
          "type": "bytes32"
        }
      ],
      "name": "canStartSettle",
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
          "name": "channelId",
          "type": "bytes32"
        }
      ],
      "name": "finishSettle",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "channelId",
          "type": "bytes32"
        },
        {
          "name": "payment",
          "type": "uint256"
        }
      ],
      "name": "settle",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
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
      "constant": true,
      "inputs": [
        {
          "name": "channelId",
          "type": "bytes32"
        },
        {
          "name": "h",
          "type": "bytes32"
        },
        {
          "name": "v",
          "type": "uint8"
        },
        {
          "name": "r",
          "type": "bytes32"
        },
        {
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "canClaim",
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
          "name": "sender",
          "type": "address"
        },
        {
          "name": "_chainId",
          "type": "uint32"
        },
        {
          "name": "contractId",
          "type": "address"
        },
        {
          "name": "channelId",
          "type": "bytes32"
        },
        {
          "name": "payment",
          "type": "uint256"
        },
        {
          "name": "sigV",
          "type": "uint8"
        },
        {
          "name": "sigR",
          "type": "bytes32"
        },
        {
          "name": "sigS",
          "type": "bytes32"
        }
      ],
      "name": "isStateUpdateSigValid",
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
          "name": "channelId",
          "type": "bytes32"
        },
        {
          "name": "payment",
          "type": "uint256"
        }
      ],
      "name": "startSettle",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "channelId",
          "type": "bytes32"
        }
      ],
      "name": "deposit",
      "outputs": [],
      "payable": true,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "channelId",
          "type": "bytes32"
        }
      ],
      "name": "isOpenChannel",
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
          "name": "sender",
          "type": "address"
        },
        {
          "name": "channelId",
          "type": "bytes32"
        }
      ],
      "name": "canDeposit",
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
          "name": "channelId",
          "type": "bytes32"
        }
      ],
      "name": "getPayment",
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
      "constant": true,
      "inputs": [
        {
          "name": "channelId",
          "type": "bytes32"
        }
      ],
      "name": "getUntil",
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
      "inputs": [
        {
          "name": "_chainId",
          "type": "uint32"
        }
      ],
      "payable": false,
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "channelId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "settlementPeriod",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "until",
          "type": "uint256"
        }
      ],
      "name": "DidCreateChannel",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "channelId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "DidDeposit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "channelId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "payment",
          "type": "uint256"
        }
      ],
      "name": "DidStartSettle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "channelId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "payment",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "oddValue",
          "type": "uint256"
        }
      ],
      "name": "DidSettle",
      "type": "event"
    }
  ],
  "unlinked_binary": "0x6060604052341561000c57fe5b604051602080610e2a83398101604052515b5b5b60008054600160a060020a03191633600160a060020a03161790555b5b6002805463ffffffff191663ffffffff83161767ffffffff00000000191690555b505b610dbb8061006f6000396000f300606060405236156100f65763ffffffff60e060020a60003504166309648a9d81146100f857806339c79e0c1461012f5780633c46f72f14610144578063513d144b14610177578063673a96ee146101a357806368b45a2c146101ca57806375f99680146101fd57806379f48d4c1461021257806383197ef01461022a5780638da5cb5b1461023c57806398c32128146102685780639a8516161461029e578063ab40428e146102f0578063b214faa514610308578063d0fa96ba14610315578063e20bff5c146101ca578063e66eefc81461036f578063f03cd5ca14610394578063f2fde38b146103b9578063f5074f41146103d7575bfe5b341561010057fe5b61010b6004356103f5565b6040518082600281111561011b57fe5b60ff16815260200191505060405180910390f35b341561013757fe5b610142600435610410565b005b341561014c57fe5b610163600160a060020a0360043516602435610523565b604080519115158252519081900360200190f35b610191600160a060020a0360043516602435604435610593565b60408051918252519081900360200190f35b34156101ab57fe5b61014260043560243560443560ff6064351660843560a435610723565b005b34156101d257fe5b610163600160a060020a03600435166024356107a3565b604080519115158252519081900360200190f35b341561020557fe5b6101426004356107e9565b005b341561021a57fe5b610142600435602435610820565b005b341561023257fe5b610142610967565b005b341561024457fe5b61024c610994565b60408051600160a060020a039092168252519081900360200190f35b341561027057fe5b61016360043560243560ff604435166064356084356109a3565b604080519115158252519081900360200190f35b34156102a657fe5b610163600160a060020a0360043581169063ffffffff60243516906044351660643560843560ff60a4351660c43560e435610a6e565b604080519115158252519081900360200190f35b34156102f857fe5b610142600435602435610b61565b005b610142600435610bef565b005b341561031d57fe5b610163600435610c60565b604080519115158252519081900360200190f35b34156101d257fe5b610163600160a060020a03600435166024356107a3565b604080519115158252519081900360200190f35b341561037757fe5b610191600435610ce7565b60408051918252519081900360200190f35b341561039c57fe5b610191600435610cff565b60408051918252519081900360200190f35b34156103c157fe5b610142600160a060020a0360043516610d17565b005b34156103df57fe5b610142600160a060020a0360043516610d63565b005b60008181526001602052604090206004015460ff165b919050565b600081815260016020526040902060025b600482015460ff16600281111561043457fe5b148015610481575060005433600160a060020a03908116911614806104665750805433600160a060020a039081169116145b806104815750600181015433600160a060020a039081169116145b5b1561051e576000816002015411156104cc5780546002820154604051600160a060020a039092169181156108fc0291906000818181858888f1935050505015156104cc5760006000fd5b5b600082815260016020819052604082208054600160a060020a031990811682559181018054909216909155600281018290556003810182905560048101805460ff1916905560058101829055600601555b5b5050565b60008181526001602081905260408220905b600482015460ff16600281111561054857fe5b14801561057857508054600160a060020a03858116911614806105785750600054600160a060020a038581169116145b5b8015610589575042816005015410155b91505b5092915050565b60028054600163ffffffff602060020a80840482169283019091160267ffffffff0000000019909216919091179091556040805160e060020a9092028252805191829003600401822060e083018252600160a060020a03338181168552908716602085015234928401839052606084018590526000939192909160808101855b81524288016020808301919091526000604092830181905286815260018083529083902084518154600160a060020a0319908116600160a060020a039283161783559386015182840180549095169116179092559183015160028083019190915560608401516003830155608084015160048301805493949193909260ff19909116919084908111156106a257fe5b021790555060a0820151600582015560c090910151600690910155604080518481526020810183905280820187905242880160608201529051600160a060020a03808a1692908516917f2168a0a10cb12f43941acf9cdef54ba002be7269f2b8b38d4ee9e54eb48a46629181900360800190a38293505b5050509392505050565b61073086858585856109a3565b151561073b5761079b565b6040805160e260020a631e7d235302815260048101889052602481018790529051600160a060020a033016916379f48d4c91604480830192600092919082900301818387803b151561078957fe5b6102c65a03f1151561079757fe5b5050505b505050505050565b6000818152600160205260408120815b600482015460ff1660028111156107c657fe5b14801561058957508054600160a060020a038581169116145b91505b5092915050565b6107f33382610523565b15156107ff5760006000fd5b60008181526001602052604090206006015461081c908290610820565b5b50565b60008281526001602052604081206002810154909183918211156108805760028301546001840154604051919350600160a060020a03169083156108fc029084906000818181858888f19350505050151561087b5760006000fd5b6108fe565b6001830154604051600160a060020a039091169083156108fc029084906000818181858888f1935050505015156108b75760006000fd5b50600282015482546040519183900391600160a060020a039091169082156108fc029083906000818181858888f1935050505015156108f65760006000fd5b600060028401555b6000858152600160208190526040909120600401805460029260ff1990911690835b02179055506040805185815260208101839052815187927fabfecb41642f4ef37a31c1721c2da0a771e03d530ea99bf54d900d29130f5125928290030190a25b5050505050565b60005433600160a060020a039081169116146109835760006000fd5b600054600160a060020a0316ff5b5b565b600054600160a060020a031681565b6000858152600160205260408120815b600482015460ff1660028111156109c657fe5b14806109e5575060015b600482015460ff1660028111156109e357fe5b145b8015610a61575060408051600081815260208083018452918301819052825189815260ff89168184015280840188905260608101879052925160019360808082019493601f198401939283900390910191908661646e5a03f11515610a4657fe5b5050604051601f1901518154600160a060020a039081169116145b91505b5095945050505050565b6040805160006020918201819052825160e060020a63ffffffff8c16028152606060020a600160a060020a038b1602600482015260188101899052603881018890529251909283926002926058808401938290030181868661646e5a03f11515610ad457fe5b5050604080518051600082815260208084018552928401819052835182815260ff8a168185015280850189905260608101889052935191945060019360808082019493601f1981019392819003909101918661646e5a03f11515610b3457fe5b505060206040510351600160a060020a03168a600160a060020a03161491505b5098975050505050505050565b6000610b6d33846107a3565b1515610b795760006000fd5b50600082815260016020819052604090912060048101805491929160ff191682805b02179055506003810154420160058201556006810182905560408051838152905184917f673a31efff5b18f60225e513fd4f0f53c708661f184c1898f5c52e85bd95d500919081900360200190a25b505050565b6000610bfb33836107a3565b1515610c075760006000fd5b506000818152600160209081526040918290206002810180543490810190915583519081529251909284927f6f850cda6d6b2f5cca622bc2d4739e4ed917c12d29f9a92b9e6c127abe39842492918290030190a25b5050565b6000818152600160205260408120815b600482015460ff166002811115610c8357fe5b148015610c94575042816005015410155b91505b50919050565b6000818152600160205260408120816107b3565b600482015460ff1660028111156107c657fe5b14801561058957508054600160a060020a038581169116145b91505b5092915050565b6000818152600160205260409020600601545b919050565b6000818152600160205260409020600501545b919050565b60005433600160a060020a03908116911614610d335760006000fd5b600160a060020a0381161561081c5760008054600160a060020a031916600160a060020a0383161790555b5b5b50565b60005433600160a060020a03908116911614610d7f5760006000fd5b80600160a060020a0316ff5b5b505600a165627a7a72305820e74d8e2e49c44157932fee300c8ad4aa515aaef2efa1842e16ca82f57e354a730029",
  "networks": {
    "1506328416520": {
      "events": {
        "0x2168a0a10cb12f43941acf9cdef54ba002be7269f2b8b38d4ee9e54eb48a4662": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "channelId",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "receiver",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "value",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "settlementPeriod",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "until",
              "type": "uint256"
            }
          ],
          "name": "DidCreateChannel",
          "type": "event"
        },
        "0x6f850cda6d6b2f5cca622bc2d4739e4ed917c12d29f9a92b9e6c127abe398424": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "channelId",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "DidDeposit",
          "type": "event"
        },
        "0x673a31efff5b18f60225e513fd4f0f53c708661f184c1898f5c52e85bd95d500": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "channelId",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "payment",
              "type": "uint256"
            }
          ],
          "name": "DidStartSettle",
          "type": "event"
        },
        "0xabfecb41642f4ef37a31c1721c2da0a771e03d530ea99bf54d900d29130f5125": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "channelId",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "payment",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "oddValue",
              "type": "uint256"
            }
          ],
          "name": "DidSettle",
          "type": "event"
        }
      },
      "links": {},
      "address": "0xece88c65fb4d46a9f7eebeedc2bfd8d62d0796ae",
      "updated_at": 1506328460065
    }
  },
  "schema_version": "0.0.5",
  "updated_at": 1506328460065
}