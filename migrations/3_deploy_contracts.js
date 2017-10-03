var Broker = artifacts.require("./Broker.sol");
var BrokerToken = artifacts.require("./BrokerToken.sol")
var ERC20example = artifacts.require("./ERC20example.sol");

module.exports = async function(deployer) {
  deployer.deploy(Broker);
  deployer.deploy(BrokerToken);
  deployer.deploy(ERC20example);  
};
