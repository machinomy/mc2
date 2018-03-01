const GAS_LIMIT = 2700000

module.exports = {
  networks: {
    development: {
      network_id: "*",
      host: "localhost",
      port: 8545,
      gas: GAS_LIMIT
    },
    ropsten: {
      network_id: 3,
      host: "localhost",
      port: 8545,
      gas: GAS_LIMIT
    },
    kovan: {
      network_id: 42,
      host: "localhost",
      port: 8545,
      gas: GAS_LIMIT
    },
    main: {
      host: "localhost",
      port: 8545,
      network_id: 1,
      gas: GAS_LIMIT
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      network_id: 4,
      from: '0x13d1be93e913d910245a069c67fc4c45a3d0b2fc',
      gas: GAS_LIMIT
    }
  }
}
