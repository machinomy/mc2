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
      from: '0x20aac3cd557ec4b91c1545e39cd0495f6aecd5a7',
      password: process.env.PASSWORD
    }
  }
};
