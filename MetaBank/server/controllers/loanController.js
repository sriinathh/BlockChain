const Loan = require('../models/Loan');
const User = require('../models/User');
const { simulateCreditScore } = require('../services/aiService');

exports.apply = async (req, res, next) => {
  try {
    const { userId, wallet, amount } = req.body;
    if (!userId || !amount) return res.status(400).json({ message: 'Missing fields' });
    // Simulate AI decision
    const score = await simulateCreditScore({ userId, wallet, amount });
    const interestRate = score > 0.6 ? 5 : 12;
    const status = score > 0.5 ? 'approved' : 'rejected';
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1);
    const loan = await Loan.create({ user: userId, wallet, amount, interestRate, dueDate, status });
    if (status === 'approved') {
      // credit user token balance
      const user = await User.findById(userId);
      if (user) {
        user.tokenBalance = (user.tokenBalance || 0) + Number(amount);
        await user.save();
      }
    }
    res.json({ ok: true, loan, score });
  } catch (err) { next(err); }
};

exports.history = async (req, res, next) => {
  try {
    const { wallet } = req.params;
    const loans = await Loan.find({ wallet }).sort({ createdAt: -1 });
    res.json({ ok: true, loans });
  } catch (err) { next(err); }
};

exports.repay = async (req, res, next) => {
  try {
    const { loanId, amount } = req.body;
    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    loan.repaymentHistory.push({ amount, date: new Date() });
    // simplistic repayment logic
    const totalPaid = loan.repaymentHistory.reduce((s, p) => s + p.amount, 0);
    if (totalPaid >= loan.amount * (1 + loan.interestRate / 100)) loan.status = 'paid';
    await loan.save();
    res.json({ ok: true, loan });
  } catch (err) { next(err); }
};
