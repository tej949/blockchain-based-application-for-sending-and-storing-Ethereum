// If you intend to use the Hardhat Toolbox and ethers v6, require the toolbox
// and make sure private keys include the 0x prefix.
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.4",
  networks: {
    // Be careful when deploying to mainnet — ensure the private key below
    // is for an account you control and is prefixed with 0x.
    Ethereum: {
      url: 'https://eth-mainnet.g.alchemy.com/v2/qq0uJ_udiLC_eHSWPv_js',
      accounts: ['0x44a40b97a35b68380f1567c018c8072568a5c3c64bee92f622ffc32a8bdb60b4']
    }
  }
};