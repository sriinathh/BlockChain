const { ethers } = require('ethers');
require('dotenv').config();

const localProvider = new ethers.JsonRpcProvider(process.env.LOCAL_RPC_URL || 'http://127.0.0.1:8545');
const sepoliaProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || process.env.SEPOLIA_RPC_URL);

exports.getProvider = (network = 'local') => (network === 'sepolia' ? sepoliaProvider : localProvider);

exports.getSigner = (privateKey, network = 'local') => {
  const provider = exports.getProvider(network);
  return new ethers.Wallet(privateKey, provider);
};

exports.validateAddress = (address) => {
  try { return ethers.isAddress(address); } catch { return false; }
};
