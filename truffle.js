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
    }
  }
};
