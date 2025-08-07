require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()
require("./tasks")

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia:{
      url:"https://eth-sepolia.g.alchemy.com/v2/LOAa3PwwdTDO5QexrMN-7",
      accounts:["61e025834285a979e8b3bac11664d878a541d5bca9e9efbaeb81ec63a18e5bf6",PRIVATE_KEY_1],
      chainId:11155111
    }
  },
  etherscan: {
    apiKey:"U6SU76J498SNFWDSMBMRU5Z1H7KGE5BTYK"
  }
};
