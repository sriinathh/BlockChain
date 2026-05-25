const express = require('express');
const router = express.Router();
const { getProvider, getWalletFromPrivateKey } = require('../utils/ethersProvider');
const { requireAuth } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { ethers } = require('ethers');

// POST /api/wallet/connect - save wallet address to user
router.post('/connect', requireAuth, async (req, res, next) => {
  try {
    const { address } = req.body;
    if (!address || !ethers.isAddress(address)) return res.status(400).json({ message: 'Invalid address' });
    const user = req.user;
    user.walletAddress = address;
    await user.save();
    res.json({ success: true, walletAddress: address });
  } catch (err) { next(err); }
});

// GET /api/wallet/balance/:address
router.get('/balance/:address', async (req, res, next) => {
  try {
    const { address } = req.params;
    if (!address || !ethers.isAddress(address)) return res.status(400).json({ message: 'Invalid address' });
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    res.json({ success: true, balance: ethers.formatEther(balance) });
  } catch (err) { next(err); }
});

// POST /api/wallet/send
// Body: { to, amount } - send from server-side PRIVATE_KEY wallet
router.post('/send', requireAuth, async (req, res, next) => {
  try {
    const { to, amount } = req.body;
    if (!to || !amount || !ethers.isAddress(to)) return res.status(400).json({ message: 'Invalid payload' });
    const wallet = getWalletFromPrivateKey();
    const tx = await wallet.sendTransaction({ to, value: ethers.parseEther(String(amount)) });
    // Save transaction
    const txDoc = await Transaction.create({ sender: wallet.address, receiver: to, amount: String(amount), txHash: tx.hash, status: 'pending' });
    res.json({ success: true, txHash: tx.hash, tx: txDoc });
  } catch (err) { next(err); }
});

module.exports = router;
