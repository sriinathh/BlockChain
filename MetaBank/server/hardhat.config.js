require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: '0.8.17',
  networks: {
    localhost: { url: process.env.LOCAL_RPC_URL || 'http://127.0.0.1:8545' },
    sepolia: { url: process.env.SEPOLIA_RPC_URL || '', accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [] }
  }
};
