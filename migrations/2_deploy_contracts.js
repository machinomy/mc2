var Broker = artifacts.require("./Broker.sol");

module.exports = function(deployer) {
  deployer.deploy(Broker);
};
