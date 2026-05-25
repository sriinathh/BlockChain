const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.deposit = async (req, res, next) => {
  try {
    const { wallet, amount, tokenType = 'MBT' } = req.body;
    if (!wallet || !amount) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ wallets: wallet });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.tokenBalance = (user.tokenBalance || 0) + Number(amount);
    await user.save();
    const tx = await Transaction.create({ receiver: wallet, amount, tokenType, status: 'confirmed' });
    res.json({ ok: true, tx, balance: user.tokenBalance });
  } catch (err) { next(err); }
};

exports.withdraw = async (req, res, next) => {
  try {
    const { wallet, amount } = req.body;
    if (!wallet || !amount) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ wallets: wallet });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if ((user.tokenBalance || 0) < Number(amount)) return res.status(400).json({ message: 'Insufficient balance' });
    user.tokenBalance = (user.tokenBalance || 0) - Number(amount);
    await user.save();
    const tx = await Transaction.create({ sender: wallet, amount, status: 'confirmed' });
    res.json({ ok: true, tx, balance: user.tokenBalance });
  } catch (err) { next(err); }
};

exports.transfer = async (req, res, next) => {
  try {
    const { from, to, amount, tokenType = 'MBT' } = req.body;
    if (!from || !to || !amount) return res.status(400).json({ message: 'Missing fields' });
    const sender = await User.findOne({ wallets: from });
    const receiver = await User.findOne({ wallets: to });
    if (!sender) return res.status(404).json({ message: 'Sender not found' });
    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });
    if ((sender.tokenBalance || 0) < Number(amount)) return res.status(400).json({ message: 'Insufficient balance' });
    sender.tokenBalance -= Number(amount);
    receiver.tokenBalance = (receiver.tokenBalance || 0) + Number(amount);
    await sender.save();
    await receiver.save();
    const tx = await Transaction.create({ sender: from, receiver: to, amount, tokenType, status: 'confirmed' });
    res.json({ ok: true, tx });
  } catch (err) { next(err); }
};

exports.history = async (req, res, next) => {
  try {
    const { wallet } = req.params;
    const txs = await Transaction.find({ $or: [{ sender: wallet }, { receiver: wallet }] }).sort({ timestamp: -1 }).limit(200);
    res.json({ ok: true, transactions: txs });
  } catch (err) { next(err); }
};
