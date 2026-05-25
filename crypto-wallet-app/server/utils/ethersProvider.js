const { ethers } = require('ethers');

function getProvider() {
  const url = process.env.SEPOLIA_RPC_URL;
  if (!url) throw new Error('SEPOLIA_RPC_URL not set');
  return new ethers.JsonRpcProvider(url);
}

function getWalletFromPrivateKey() {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error('PRIVATE_KEY not set');
  return new ethers.Wallet(pk, getProvider());
}

module.exports = { getProvider, getWalletFromPrivateKey };
