module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: ganache-cli)
      port: 7545,            // Standard Ganache UI port
      network_id: "5777",       // Any network (default: none)
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
};
