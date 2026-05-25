const Loan = require('../models/Loan');
const User = require('../models/User');
const Account = require('../models/Account');
const Notification = require('../models/Notification');
const { simulateCreditScore } = require('../services/aiService');

exports.apply = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { amount, wallet } = req.body;
    if (!userId || !amount) return res.status(400).json({ message: 'Missing fields' });

    // AI Underwriting hook
    const score = await simulateCreditScore({ userId, wallet, amount });
    const interestRate = score > 0.6 ? 5 : 12; // lower rate for high credit score
    
    // Create loan as pending
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 3); // 3-month loan
    
    const loan = await Loan.create({
      user: userId,
      wallet,
      amount: Number(amount),
      interestRate,
      dueDate,
      status: 'pending'
    });

    await Notification.create({
      user: userId,
      title: 'Loan Applied',
      message: `Your application for a $${amount} loan at ${interestRate}% interest is under review. AI credit score: ${(score * 100).toFixed(0)}%`,
      type: 'loan'
    });

    res.json({ ok: true, loan, score });
  } catch (err) { next(err); }
};

exports.history = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const loans = await Loan.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ ok: true, loans });
  } catch (err) { next(err); }
};

exports.repay = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { loanId, amount, accountId } = req.body;
    if (!loanId || !amount) return res.status(400).json({ message: 'Missing fields' });

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status === 'paid') return res.status(400).json({ message: 'Loan already fully repaid' });

    // Deduct from checking account
    let checking;
    if (accountId) {
      checking = await Account.findOne({ _id: accountId, user: userId });
    } else {
      checking = await Account.findOne({ user: userId, type: 'checking' });
    }

    if (!checking) return res.status(404).json({ message: 'Checking account not found' });
    if (checking.balance < Number(amount)) return res.status(400).json({ message: 'Insufficient balance in checking account' });

    checking.balance -= Number(amount);
    await checking.save();

    loan.repaymentHistory.push({ amount: Number(amount), date: new Date() });
    
    const totalPaid = loan.repaymentHistory.reduce((s, p) => s + p.amount, 0);
    const totalDue = loan.amount * (1 + loan.interestRate / 100);
    
    if (totalPaid >= totalDue) {
      loan.status = 'paid';
    }
    await loan.save();

    await Notification.create({
      user: userId,
      title: 'Loan Payment Received',
      message: `Repaid $${amount} towards loan. Remaining due: $${Math.max(0, totalDue - totalPaid).toFixed(2)}`,
      type: 'loan'
    });

    res.json({ ok: true, loan, checkingBalance: checking.balance });
  } catch (err) { next(err); }
};

// Officer / Admin endpoint to approve loans
exports.approveLoan = async (req, res, next) => {
  try {
    const { loanId, status } = req.body; // status: 'approved' or 'rejected'
    if (!loanId || !status) return res.status(400).json({ message: 'Missing fields' });

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status !== 'pending') return res.status(400).json({ message: 'Loan is already processed' });

    loan.status = status;
    await loan.save();

    if (status === 'approved') {
      // Credit to Checking account of user
      let checking = await Account.findOne({ user: loan.user, type: 'checking' });
      if (!checking) {
        checking = await Account.create({
          user: loan.user,
          accountNumber: 'MB-CK-' + Math.floor(100000 + Math.random() * 900000),
          type: 'checking',
          balance: 0,
          currency: 'USD'
        });
      }
      checking.balance += loan.amount;
      await checking.save();
    }

    await Notification.create({
      user: loan.user,
      title: status === 'approved' ? 'Loan Approved!' : 'Loan Application Rejected',
      message: status === 'approved' 
        ? `Your application for a $${loan.amount} loan has been approved. Funds have been credited to your Checking account.` 
        : `Your application for a $${loan.amount} loan has been declined after credit review.`,
      type: 'loan'
    });

    res.json({ ok: true, loan });
  } catch (err) { next(err); }
};
