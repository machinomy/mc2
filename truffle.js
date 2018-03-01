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
      from: '0xb5660e3210b398befaf228337f82c67d240f367c',
      gas: GAS_LIMIT
    }
  }
}
