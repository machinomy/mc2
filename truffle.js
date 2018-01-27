module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: 3,
      from: '0x5D20CFdC322827519bDfC362Add9A98d65922e2C',
      password: process.env.PASSWORD,
      gas: 1700000
    },
    kovan: {
      host: "localhost",
      port: 8545,
      network_id: 42,
      from: '0x1edfecaa5c2ebcccc2a7f200619333d05beaaa69',
      password: process.env.PASSWORD,
      gas: 1700000
    }
  }
}
