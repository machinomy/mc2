"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "contract_name": "BrokerToken",
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
                    "name": "erc20Contract",
                    "type": "address"
                },
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
                },
                {
                    "name": "value",
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
            "payable": false,
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "erc20Contract",
                    "type": "address"
                },
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
            "inputs": [],
            "name": "destroy",
            "outputs": [],
            "payable": false,
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "erc20Contract",
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
            "constant": false,
            "inputs": [
                {
                    "name": "erc20Contract",
                    "type": "address"
                },
                {
                    "name": "channelId",
                    "type": "bytes32"
                },
                {
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "deposit",
            "outputs": [],
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
                    "name": "erc20Contract",
                    "type": "address"
                },
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
    "unlinked_binary": "0x6060604052341561000c57fe5b60405160208061101583398101604052515b5b5b60008054600160a060020a03191633600160a060020a03161790555b5b6002805463ffffffff191663ffffffff83161767ffffffff00000000191690555b505b610fa68061006f6000396000f300606060405236156100f65763ffffffff60e060020a60003504166309648a9d81146100f85780632b0109be1461012f5780632d219b761461016c57806339c79e0c146101905780633c46f72f146101a557806368b45a2c146101d857806383197ef01461020b57806383d36a6a1461021d5780638da5cb5b1461025057806398c321281461027c5780639a851616146102b2578063ab40428e14610304578063d0fa96ba1461031c578063e20bff5c146101d8578063e66eefc814610376578063eb2243f81461039b578063f03cd5ca146103bf578063f29f7d55146103e4578063f2fde38b14610405578063f5074f4114610423575bfe5b341561010057fe5b61010b600435610441565b6040518082600281111561011b57fe5b60ff16815260200191505060405180910390f35b341561013757fe5b61015a600160a060020a036004358116906024351660443560643560843561045c565b60408051918252519081900360200190f35b341561017457fe5b61018e600160a060020a0360043516602435604435610671565b005b341561019857fe5b61018e60043561089a565b005b34156101ad57fe5b6101c4600160a060020a03600435166024356109ad565b604080519115158252519081900360200190f35b34156101e057fe5b6101c4600160a060020a0360043516602435610a1d565b604080519115158252519081900360200190f35b341561021357fe5b61018e610a63565b005b341561022557fe5b61018e600160a060020a036004351660243560443560643560ff6084351660a43560c435610a90565b005b341561025857fe5b610260610abd565b60408051600160a060020a039092168252519081900360200190f35b341561028457fe5b6101c460043560243560ff60443516606435608435610acc565b604080519115158252519081900360200190f35b34156102ba57fe5b6101c4600160a060020a0360043581169063ffffffff60243516906044351660643560843560ff60a4351660c43560e435610b97565b604080519115158252519081900360200190f35b341561030c57fe5b61018e600435602435610c8a565b005b341561032457fe5b6101c4600435610d18565b604080519115158252519081900360200190f35b34156101e057fe5b6101c4600160a060020a0360043516602435610a1d565b604080519115158252519081900360200190f35b341561037e57fe5b61015a600435610d9f565b60408051918252519081900360200190f35b34156103a357fe5b61018e600160a060020a0360043516602435604435610db7565b005b34156103c757fe5b61015a600435610eb0565b60408051918252519081900360200190f35b34156103ec57fe5b61018e600160a060020a0360043516602435610ec8565b005b341561040d57fe5b61018e600160a060020a0360043516610f02565b005b341561042b57fe5b61018e600160a060020a0360043516610f4e565b005b60008181526001602052604090206004015460ff165b919050565b6002805467ffffffff00000000198116602060020a9182900463ffffffff90811660018101909116909202179091556040805160e060020a909202825280516004928190038301812060006020928301819052835160e060020a6323b872dd02815233600160a060020a0381811697830197909752308716602483015260448201889052945191959294938b938416926323b872dd92606480820193929182900301818a87803b151561050b57fe5b6102c65a03f1151561051957fe5b5050604051511515905061052d5760006000fd5b6040805160e081018252600160a060020a0380851682528a166020820152908101869052606081018790526080810160005b81524289016020808301919091526000604092830181905286815260018083529083902084518154600160a060020a0319908116600160a060020a039283161783559386015182840180549095169116179092559183015160028083019190915560608401516003830155608084015160048301805493949193909260ff19909116919084908111156105ee57fe5b021790555060a0820151600582015560c090910151600690910155604080518481526020810187905280820188905242890160608201529051600160a060020a03808b1692908516917f2168a0a10cb12f43941acf9cdef54ba002be7269f2b8b38d4ee9e54eb48a46629181900360800190a38293505b50505095945050505050565b6000828152600160205260408120600281015490918391869083111561071d57600284015460018501546040805160006020918201819052825160e060020a63a9059cbb028152600160a060020a0394851660048201526024810186905292519497509285169363a9059cbb936044808501948390030190829087803b15156106f657fe5b6102c65a03f1151561070457fe5b505060405151151590506107185760006000fd5b61082f565b60018401546040805160006020918201819052825160e060020a63a9059cbb028152600160a060020a0394851660048201526024810188905292519385169363a9059cbb9360448082019493918390030190829087803b151561077c57fe5b6102c65a03f1151561078a57fe5b5050604051511515905061079e5760006000fd5b600284015484546040805160006020918201819052825160e060020a63a9059cbb028152600160a060020a039485166004820152948890036024860181905292519296509285169363a9059cbb93604480830194928390030190829087803b151561080557fe5b6102c65a03f1151561081357fe5b505060405151151590506108275760006000fd5b600060028501555b6000868152600160208190526040909120600401805460029260ff1990911690835b02179055506040805186815260208101849052815188927fabfecb41642f4ef37a31c1721c2da0a771e03d530ea99bf54d900d29130f5125928290030190a25b50505050505050565b600081815260016020526040902060025b600482015460ff1660028111156108be57fe5b14801561090b575060005433600160a060020a03908116911614806108f05750805433600160a060020a039081169116145b8061090b5750600181015433600160a060020a039081169116145b5b156109a8576000816002015411156109565780546002820154604051600160a060020a039092169181156108fc0291906000818181858888f1935050505015156109565760006000fd5b5b600082815260016020819052604082208054600160a060020a031990811682559181018054909216909155600281018290556003810182905560048101805460ff1916905560058101829055600601555b5b5050565b60008181526001602081905260408220905b600482015460ff1660028111156109d257fe5b148015610a0257508054600160a060020a0385811691161480610a025750600054600160a060020a038581169116145b5b8015610a13575042816005015410155b91505b5092915050565b6000818152600160205260408120815b600482015460ff166002811115610a4057fe5b148015610a1357508054600160a060020a038581169116145b91505b5092915050565b60005433600160a060020a03908116911614610a7f5760006000fd5b600054600160a060020a0316ff5b5b565b610a9d8685858585610acc565b1515610aa857610891565b610891878787610671565b5b50505050505050565b600054600160a060020a031681565b6000858152600160205260408120815b600482015460ff166002811115610aef57fe5b1480610b0e575060015b600482015460ff166002811115610b0c57fe5b145b8015610b8a575060408051600081815260208083018452918301819052825189815260ff89168184015280840188905260608101879052925160019360808082019493601f198401939283900390910191908661646e5a03f11515610b6f57fe5b5050604051601f1901518154600160a060020a039081169116145b91505b5095945050505050565b6040805160006020918201819052825160e060020a63ffffffff8c16028152606060020a600160a060020a038b1602600482015260188101899052603881018890529251909283926002926058808401938290030181868661646e5a03f11515610bfd57fe5b5050604080518051600082815260208084018552928401819052835182815260ff8a168185015280850189905260608101889052935191945060019360808082019493601f1981019392819003909101918661646e5a03f11515610c5d57fe5b505060206040510351600160a060020a03168a600160a060020a03161491505b5098975050505050505050565b6000610c963384610a1d565b1515610ca25760006000fd5b50600082815260016020819052604090912060048101805491929160ff191682805b02179055506003810154420160058201556006810182905560408051838152905184917f673a31efff5b18f60225e513fd4f0f53c708661f184c1898f5c52e85bd95d500919081900360200190a25b505050565b6000818152600160205260408120815b600482015460ff166002811115610d3b57fe5b148015610d4c575042816005015410155b91505b50919050565b600081815260016020526040812081610a2d565b600482015460ff166002811115610a4057fe5b148015610a1357508054600160a060020a038581169116145b91505b5092915050565b6000818152600160205260409020600601545b919050565b60006000610dc53385610a1d565b1515610dd15760006000fd5b50506000828152600160209081526040808320805482518401859052825160e060020a6323b872dd028152600160a060020a039182166004820152308216602482015260448101879052925191948894918516936323b872dd936064808301949391928390030190829087803b1515610e4657fe5b6102c65a03f11515610e5457fe5b50506040515115159050610e685760006000fd5b6002820180548401905560408051848152905185917f6f850cda6d6b2f5cca622bc2d4739e4ed917c12d29f9a92b9e6c127abe398424919081900360200190a25b5050505050565b6000818152600160205260409020600501545b919050565b610ed233826109ad565b1515610ede5760006000fd5b6000818152600160205260409020600601546109a89083908390610671565b5b5050565b60005433600160a060020a03908116911614610f1e5760006000fd5b600160a060020a03811615610f495760008054600160a060020a031916600160a060020a0383161790555b5b5b50565b60005433600160a060020a03908116911614610f6a5760006000fd5b80600160a060020a0316ff5b5b505600a165627a7a723058205d0ffb14a88ceb06af961620a760fb159eaa10e8ae1a1a4ede14f354b4fc2e3f0029",
    "networks": {
        "228": {
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
            "address": "0x8782a714fa24e789c8eb3aa1d17e774a74ebff67",
            "updated_at": 1506615898385
        }
    },
    "schema_version": "0.0.5",
    "updated_at": 1506615898385
};
//# sourceMappingURL=BrokerToken.js.map