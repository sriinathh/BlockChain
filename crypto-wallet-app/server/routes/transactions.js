const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { requireAuth } = require('../middleware/auth');

// GET /api/transactions/:wallet?page=1&limit=20
router.get('/:wallet', requireAuth, async (req, res, next) => {
  try {
    const wallet = req.params.wallet;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const filter = { $or: [{ sender: wallet }, { receiver: wallet }] };
    const total = await Transaction.countDocuments(filter);
    const txs = await Transaction.find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ success: true, transactions: txs, page, limit, total });
  } catch (err) { next(err); }
});

// POST /api/transactions/save
router.post('/save', async (req, res, next) => {
  try {
    const { sender, receiver, amount, txHash, network, status } = req.body;
    if (!sender || !receiver || !amount || !txHash) return res.status(400).json({ message: 'Missing fields' });
    const tx = await Transaction.create({ sender, receiver, amount, txHash, network: network || 'sepolia', status: status || 'confirmed' });
    res.status(201).json({ success: true, transaction: tx });
  } catch (err) { next(err); }
});

module.exports = router;
