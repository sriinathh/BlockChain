const { ethers } = require('ethers');

exports.isValidAddress = (addr) => {
  try { return ethers.isAddress(addr); } catch { return false; }
};
