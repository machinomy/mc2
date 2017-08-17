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
      from: '0xd5173d09c0567bad2b747cabb54e6bb013077d02',
      password: process.env.PASSWORD
    }
  }
};
