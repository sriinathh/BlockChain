const { ethers } = require('ethers');
const User = require('../models/User');

const provider = new ethers.JsonRpcProvider(process.env.SEARCH_RPC_URL || process.env.SEPOLIA_RPC_URL || 'http://127.0.0.1:8545');

exports.connect = async (req, res, next) => {
  try {
    const { userId, walletAddress } = req.body;
    if (!walletAddress) return res.status(400).json({ message: 'walletAddress required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.wallets.includes(walletAddress)) user.wallets.push(walletAddress);
    await user.save();
    res.json({ ok: true, wallets: user.wallets });
  } catch (err) { next(err); }
};

exports.balance = async (req, res, next) => {
  try {
    const { address } = req.params;
    if (!ethers.isAddress(address)) return res.status(400).json({ message: 'Invalid address' });
    const bal = await provider.getBalance(address);
    res.json({ address, balance: ethers.formatEther(bal) });
  } catch (err) { next(err); }
};

exports.network = async (req, res, next) => {
  try {
    const net = await provider.getNetwork();
    res.json({ network: net });
  } catch (err) { next(err); }
};
