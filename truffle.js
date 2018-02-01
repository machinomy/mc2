const FROM = process.env.FROM
const PASSWORD = process.env.PASSWORD

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
      gas: GAS_LIMIT,
      from: FROM,
      password: PASSWORD
    },
    kovan: {
      network_id: 42,
      host: "localhost",
      port: 8545,
      gas: GAS_LIMIT,
      from: FROM,
      password: PASSWORD
    }
  }
}
