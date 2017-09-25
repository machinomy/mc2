var ERC20example = artifacts.require("./ERC20example.sol")

module.exports = async function (deployer) {
  instanceERC20example = await ERC20example.deployed();
  await instanceERC20example.mint('0xc8ebc512fd59a9e9b04233a2178e28aa3e42608d', 100)
  await instanceERC20example.mint('0x5bf66080c92b81173f470e25f9a12fc146278429', 100)
  await instanceERC20example.mint('0xebeab176c2ca2ae72f11abb1cecad5df6ccb8dfe', 100)
};
