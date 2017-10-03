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
  "unlinked_binary": "0x6060604052341561000f57600080fd5b604051602080610ee4833981016040528080519150505b5b5b60008054600160a060020a03191633600160a060020a03161790555b5b6002805463ffffffff191663ffffffff83161767ffffffff00000000191690555b505b610e6d806100776000396000f300606060405236156100f65763ffffffff60e060020a60003504166309648a9d81146100fb57806339c79e0c146101355780633c46f72f1461014d578063513d144b14610183578063673a96ee146101af57806368b45a2c146101d957806375f996801461020f57806379f48d4c1461022757806383197ef0146102425780638da5cb5b1461025757806398c32128146102865780639a851616146102bf578063ab40428e14610314578063b214faa51461032f578063d0fa96ba1461033c578063e20bff5c146101d9578063e66eefc81461039c578063f03cd5ca146103c4578063f2fde38b146103ec578063f5074f411461040d575b600080fd5b341561010657600080fd5b61011160043561042e565b6040518082600281111561012157fe5b60ff16815260200191505060405180910390f35b341561014057600080fd5b61014b600435610449565b005b341561015857600080fd5b61016f600160a060020a036004351660243561056b565b604051901515815260200160405180910390f35b61019d600160a060020a03600435166024356044356105db565b60405190815260200160405180910390f35b34156101ba57600080fd5b61014b60043560243560443560ff6064351660843560a4356107af565b005b34156101e457600080fd5b61016f600160a060020a0360043516602435610830565b604051901515815260200160405180910390f35b341561021a57600080fd5b61014b600435610876565b005b341561023257600080fd5b61014b6004356024356108ac565b005b341561024d57600080fd5b61014b6109f0565b005b341561026257600080fd5b61026a610a1c565b604051600160a060020a03909116815260200160405180910390f35b341561029157600080fd5b61016f60043560243560ff60443516606435608435610a2b565b604051901515815260200160405180910390f35b34156102ca57600080fd5b61016f600160a060020a0360043581169063ffffffff60243516906044351660643560843560ff60a4351660c43560e435610b00565b604051901515815260200160405180910390f35b341561031f57600080fd5b61014b600435602435610c0d565b005b61014b600435610c98565b005b341561034757600080fd5b61016f600435610d07565b604051901515815260200160405180910390f35b34156101e457600080fd5b61016f600160a060020a0360043516602435610830565b604051901515815260200160405180910390f35b34156103a757600080fd5b61019d600435610d8e565b60405190815260200160405180910390f35b34156103cf57600080fd5b61019d600435610da6565b60405190815260200160405180910390f35b34156103f757600080fd5b61014b600160a060020a0360043516610dbe565b005b341561041857600080fd5b61014b600160a060020a0360043516610e16565b005b60008181526001602052604090206004015460ff165b919050565b600081815260016020526040902060025b600482015460ff16600281111561046d57fe5b1480156104ba575060005433600160a060020a039081169116148061049f5750805433600160a060020a039081169116145b806104ba5750600181015433600160a060020a039081169116145b5b15610566576000816002015411156105075780546002820154600160a060020a039091169080156108fc0290604051600060405180830381858888f19350505050151561050757600080fd5b5b60008281526001602081905260408220805473ffffffffffffffffffffffffffffffffffffffff1990811682559181018054909216909155600281018290556003810182905560048101805460ff1916905560058101829055600601555b5b5050565b60008181526001602081905260408220905b600482015460ff16600281111561059057fe5b1480156105c057508054600160a060020a03858116911614806105c05750600054600160a060020a038581169116145b5b80156105d1575042816005015410155b91505b5092915050565b6002805467ffffffff000000001981166401000000009182900463ffffffff908116600181019091169092021790915560009081908190819060405163ffffffff9190911660e060020a0281526004016040518091039020925033915034905060e06040519081016040908152600160a060020a038085168352891660208301528101829052606081018690526080810160005b8152428801602080830191909152600060409283018190528681526001909152208151815473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0391909116178155602082015160018201805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03929092169190911790556040820151816002015560608201518160030155608082015160048201805460ff1916600183600281111561071f57fe5b021790555060a0820151816005015560c0820151816006015590505086600160a060020a031682600160a060020a03167f2168a0a10cb12f43941acf9cdef54ba002be7269f2b8b38d4ee9e54eb48a46628584898b4201604051938452602084019290925260408084019190915260608301919091526080909101905180910390a38293505b5050509392505050565b6107bc8685858585610a2b565b15156107c757610828565b30600160a060020a03166379f48d4c878760405160e060020a63ffffffff851602815260048101929092526024820152604401600060405180830381600087803b151561081357600080fd5b6102c65a03f1151561082457600080fd5b5050505b505050505050565b6000818152600160205260408120815b600482015460ff16600281111561085357fe5b1480156105d157508054600160a060020a038581169116145b91505b5092915050565b610880338261056b565b151561088b57600080fd5b6000818152600160205260409020600601546108a89082906108ac565b5b50565b600082815260016020526040812060028101549091839182111561090c5760028301546001840154909250600160a060020a031682156108fc0283604051600060405180830381858888f19350505050151561090757600080fd5b610986565b6001830154600160a060020a031682156108fc0283604051600060405180830381858888f19350505050151561094157600080fd5b50600282015482549082900390600160a060020a031681156108fc0282604051600060405180830381858888f19350505050151561097e57600080fd5b600060028401555b6000858152600160208190526040909120600401805460029260ff1990911690835b0217905550847fabfecb41642f4ef37a31c1721c2da0a771e03d530ea99bf54d900d29130f5125858360405191825260208201526040908101905180910390a25b5050505050565b60005433600160a060020a03908116911614610a0b57600080fd5b600054600160a060020a0316ff5b5b565b600054600160a060020a031681565b6000858152600160205260408120815b600482015460ff166002811115610a4e57fe5b1480610a6d575060015b600482015460ff166002811115610a6b57fe5b145b8015610af357506001868686866040516000815260200160405260006040516020015260405193845260ff90921660208085019190915260408085019290925260608401929092526080909201915160208103908084039060008661646e5a03f11515610ad957600080fd5b5050602060405103518154600160a060020a039081169116145b91505b5095945050505050565b60008060028989898960006040516020015260405163ffffffff9490941660e060020a028452600160a060020a03929092166c010000000000000000000000000260048401526018830152603882015260580160206040518083038160008661646e5a03f11515610b7057600080fd5b50506040518051905090506001818686866040516000815260200160405260006040516020015260405193845260ff90921660208085019190915260408085019290925260608401929092526080909201915160208103908084039060008661646e5a03f11515610be057600080fd5b505060206040510351600160a060020a03168a600160a060020a03161491505b5098975050505050505050565b6000610c193384610830565b1515610c2457600080fd5b50600082815260016020819052604090912060048101805491929160ff191682805b021790555060038101544201600582015560068101829055827f673a31efff5b18f60225e513fd4f0f53c708661f184c1898f5c52e85bd95d5008360405190815260200160405180910390a25b505050565b6000610ca43383610830565b1515610caf57600080fd5b506000818152600160205260409081902060028101805434908101909155909183917f6f850cda6d6b2f5cca622bc2d4739e4ed917c12d29f9a92b9e6c127abe398424915190815260200160405180910390a25b5050565b6000818152600160205260408120815b600482015460ff166002811115610d2a57fe5b148015610d3b575042816005015410155b91505b50919050565b600081815260016020526040812081610840565b600482015460ff16600281111561085357fe5b1480156105d157508054600160a060020a038581169116145b91505b5092915050565b6000818152600160205260409020600601545b919050565b6000818152600160205260409020600501545b919050565b60005433600160a060020a03908116911614610dd957600080fd5b600160a060020a038116156108a8576000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790555b5b5b50565b60005433600160a060020a03908116911614610e3157600080fd5b80600160a060020a0316ff5b5b505600a165627a7a72305820f539a34b2715669e06243c8765547984c14b1bf5d75c93aaf1723ada721d0f160029",
  "networks": {
    "999": {
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
      "updated_at": 1507021129444
    }
  },
  "schema_version": "0.0.5",
  "updated_at": 1507021129444
}