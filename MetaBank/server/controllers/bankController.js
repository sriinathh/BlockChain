const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const Notification = require('../models/Notification');
const FraudReport = require('../models/FraudReport');
const { fraudAnalyze } = require('../services/aiService');

// Helper to create default traditional accounts if none exist
const ensureDefaultAccounts = async (userId) => {
  let checking = await Account.findOne({ user: userId, type: 'checking' });
  if (!checking) {
    checking = await Account.create({
      user: userId,
      accountNumber: 'MB-CK-' + Math.floor(100000 + Math.random() * 900000),
      type: 'checking',
      balance: 12420.50,
      currency: 'USD'
    });
  }
  let savings = await Account.findOne({ user: userId, type: 'savings' });
  if (!savings) {
    savings = await Account.create({
      user: userId,
      accountNumber: 'MB-SV-' + Math.floor(100000 + Math.random() * 900000),
      type: 'savings',
      balance: 8300.00,
      currency: 'USD'
    });
  }
  let investment = await Account.findOne({ user: userId, type: 'investment' });
  if (!investment) {
    investment = await Account.create({
      user: userId,
      accountNumber: 'MB-IN-' + Math.floor(100000 + Math.random() * 900000),
      type: 'investment',
      balance: 4120.50,
      currency: 'USD'
    });
  }
  return [checking, savings, investment];
};

exports.getAccounts = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const accounts = await ensureDefaultAccounts(userId);
    res.json({ ok: true, accounts });
  } catch (err) { next(err); }
};

// Traditional deposit
exports.depositTraditional = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { accountId, amount } = req.body;
    if (!accountId || !amount) return res.status(400).json({ message: 'Missing fields' });
    
    const account = await Account.findOne({ _id: accountId, user: userId });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    
    account.balance += Number(amount);
    await account.save();

    // Log transaction
    const tx = await Transaction.create({
      receiver: account.accountNumber,
      amount: Number(amount),
      tokenType: 'USD',
      status: 'confirmed',
      network: 'traditional'
    });

    await Notification.create({
      user: userId,
      title: 'Deposit Successful',
      message: `Deposited $${amount} into account ${account.accountNumber}`,
      type: 'info'
    });

    res.json({ ok: true, account, tx });
  } catch (err) { next(err); }
};

// Traditional withdraw
exports.withdrawTraditional = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { accountId, amount } = req.body;
    if (!accountId || !amount) return res.status(400).json({ message: 'Missing fields' });
    
    const account = await Account.findOne({ _id: accountId, user: userId });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.balance < Number(amount)) return res.status(400).json({ message: 'Insufficient balance' });

    // AI Fraud Risk evaluation
    const analysis = await fraudAnalyze([{ amount: Number(amount), receiver: 'ATM Withdrawal' }]);
    if (analysis.alerts && analysis.alerts.length > 0) {
      // Flag suspicious transaction
      await FraudReport.create({
        amount: Number(amount),
        riskScore: 0.85,
        reason: 'Large cash withdrawal anomaly',
        status: 'flagged'
      });
      await Notification.create({
        user: userId,
        title: 'Security Alert: Large Withdrawal',
        message: `A withdrawal of $${amount} was flagged for review.`,
        type: 'fraud'
      });
    }
    
    account.balance -= Number(amount);
    await account.save();

    const tx = await Transaction.create({
      sender: account.accountNumber,
      amount: Number(amount),
      tokenType: 'USD',
      status: 'confirmed',
      network: 'traditional'
    });

    await Notification.create({
      user: userId,
      title: 'Withdrawal Successful',
      message: `Withdrew $${amount} from account ${account.accountNumber}`,
      type: 'info'
    });

    res.json({ ok: true, account, tx });
  } catch (err) { next(err); }
};

// Traditional transfer
exports.transferTraditional = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { fromAccountId, toAccountNumber, amount } = req.body;
    if (!fromAccountId || !toAccountNumber || !amount) return res.status(400).json({ message: 'Missing fields' });
    
    const fromAccount = await Account.findOne({ _id: fromAccountId, user: userId });
    if (!fromAccount) return res.status(404).json({ message: 'Source account not found' });
    if (fromAccount.balance < Number(amount)) return res.status(400).json({ message: 'Insufficient balance' });

    const toAccount = await Account.findOne({ accountNumber: toAccountNumber });
    if (!toAccount) return res.status(404).json({ message: 'Recipient account not found' });

    // AI Fraud risk check
    const analysis = await fraudAnalyze([{ amount: Number(amount), sender: fromAccount.accountNumber, receiver: toAccountNumber }]);
    let requiresHold = false;
    let riskScore = 0.1;
    if (Number(amount) > 10000) {
      requiresHold = true;
      riskScore = 0.9;
    }

    if (requiresHold) {
      // Create fraud report and put on hold
      const report = await FraudReport.create({
        walletAddress: fromAccount.accountNumber,
        amount: Number(amount),
        riskScore,
        reason: 'Transfer amount exceeds enterprise threshold ($10,000)',
        status: 'flagged'
      });

      const tx = await Transaction.create({
        sender: fromAccount.accountNumber,
        receiver: toAccountNumber,
        amount: Number(amount),
        tokenType: 'USD',
        status: 'pending',
        network: 'traditional'
      });

      await Notification.create({
        user: userId,
        title: 'Transfer Under Review',
        message: `Your transfer of $${amount} to account ${toAccountNumber} is flagged by AI Fraud monitor and is pending approval.`,
        type: 'fraud'
      });

      return res.json({ ok: false, message: 'Transfer flagged for fraud evaluation', tx, report });
    }

    // execute transfer
    fromAccount.balance -= Number(amount);
    toAccount.balance += Number(amount);
    await fromAccount.save();
    await toAccount.save();

    // Reward: 0.5% in MBT
    const rewardMbt = Number(amount) * 0.005;
    const user = await User.findById(userId);
    if (user) {
      user.tokenBalance = (user.tokenBalance || 0) + rewardMbt;
      await user.save();
      await Notification.create({
        user: userId,
        title: 'Cashback Reward Credit',
        message: `You earned ${rewardMbt.toFixed(2)} MBT cashback reward tokens for transacting!`,
        type: 'info'
      });
    }

    const tx = await Transaction.create({
      sender: fromAccount.accountNumber,
      receiver: toAccountNumber,
      amount: Number(amount),
      tokenType: 'USD',
      status: 'confirmed',
      network: 'traditional'
    });

    await Notification.create({
      user: userId,
      title: 'Transfer Completed',
      message: `Successfully transferred $${amount} to account ${toAccountNumber}`,
      type: 'info'
    });

    // Notify receiver
    if (toAccount.user) {
      await Notification.create({
        user: toAccount.user,
        title: 'Funds Received',
        message: `Account ${toAccountNumber} credited with $${amount} from account ${fromAccount.accountNumber}`,
        type: 'info'
      });
    }

    res.json({ ok: true, fromAccount, tx, rewardMbt });
  } catch (err) { next(err); }
};

// Web3/Smart Contract deposits/withdrawals/transfers logger
exports.deposit = async (req, res, next) => {
  try {
    const { wallet, amount, tokenType = 'MBT', txHash } = req.body;
    if (!wallet || !amount) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ wallets: wallet });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.tokenBalance = (user.tokenBalance || 0) + Number(amount);
    await user.save();

    const tx = await Transaction.create({
      receiver: wallet,
      amount: Number(amount),
      tokenType,
      txHash,
      status: 'confirmed',
      network: 'blockchain'
    });

    res.json({ ok: true, tx, balance: user.tokenBalance });
  } catch (err) { next(err); }
};

exports.withdraw = async (req, res, next) => {
  try {
    const { wallet, amount, tokenType = 'MBT', txHash } = req.body;
    if (!wallet || !amount) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ wallets: wallet });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if ((user.tokenBalance || 0) < Number(amount)) return res.status(400).json({ message: 'Insufficient balance' });

    user.tokenBalance = (user.tokenBalance || 0) - Number(amount);
    await user.save();

    const tx = await Transaction.create({
      sender: wallet,
      amount: Number(amount),
      tokenType,
      txHash,
      status: 'confirmed',
      network: 'blockchain'
    });

    res.json({ ok: true, tx, balance: user.tokenBalance });
  } catch (err) { next(err); }
};

exports.transfer = async (req, res, next) => {
  try {
    const { from, to, amount, tokenType = 'MBT', txHash } = req.body;
    if (!from || !to || !amount) return res.status(400).json({ message: 'Missing fields' });
    const sender = await User.findOne({ wallets: from });
    const receiver = await User.findOne({ wallets: to });

    if (sender) {
      sender.tokenBalance = Math.max(0, (sender.tokenBalance || 0) - Number(amount));
      await sender.save();
    }
    if (receiver) {
      receiver.tokenBalance = (receiver.tokenBalance || 0) + Number(amount);
      await receiver.save();
    }

    const tx = await Transaction.create({
      sender: from,
      receiver: to,
      amount: Number(amount),
      tokenType,
      txHash,
      status: 'confirmed',
      network: 'blockchain'
    });

    res.json({ ok: true, tx });
  } catch (err) { next(err); }
};

exports.history = async (req, res, next) => {
  try {
    const { wallet } = req.params;
    // Find checking/savings account numbers if user profile is loaded
    const user = await User.findOne({ wallets: wallet });
    let accountNumbers = [];
    if (user) {
      const accounts = await Account.find({ user: user._id });
      accountNumbers = accounts.map(a => a.accountNumber);
    }

    const txs = await Transaction.find({
      $or: [
        { sender: wallet },
        { receiver: wallet },
        { sender: { $in: accountNumbers } },
        { receiver: { $in: accountNumbers } }
      ]
    }).sort({ timestamp: -1 }).limit(200);

    res.json({ ok: true, transactions: txs });
  } catch (err) { next(err); }
};

exports.downloadStatement = async (req, res, next) => {
  try {
    const { wallet } = req.params;
    const { generatePassbookPDF } = require('../utils/export');
    const path = require('path');
    const fs = require('fs');

    const user = await User.findOne({ wallets: wallet });
    let accountNumbers = [];
    if (user) {
      const accounts = await Account.find({ user: user._id });
      accountNumbers = accounts.map(a => a.accountNumber);
    }

    const txs = await Transaction.find({
      $or: [
        { sender: wallet },
        { receiver: wallet },
        { sender: { $in: accountNumbers } },
        { receiver: { $in: accountNumbers } }
      ]
    }).sort({ timestamp: -1 });

    const filename = `statement-${wallet}-${Date.now()}.pdf`;
    const tempPath = path.join(process.cwd(), 'uploads', filename);

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    await generatePassbookPDF(txs, tempPath);
    res.download(tempPath, 'MetaBank_Statement.pdf', (err) => {
      try {
        fs.unlinkSync(tempPath);
      } catch (e) {
        // ignore
      }
    });
  } catch (err) { next(err); }
};

exports.downloadCSV = async (req, res, next) => {
  try {
    const { wallet } = req.params;
    const { exportCSV } = require('../utils/export');

    const user = await User.findOne({ wallets: wallet });
    let accountNumbers = [];
    if (user) {
      const accounts = await Account.find({ user: user._id });
      accountNumbers = accounts.map(a => a.accountNumber);
    }

    const txs = await Transaction.find({
      $or: [
        { sender: wallet },
        { receiver: wallet },
        { sender: { $in: accountNumbers } },
        { receiver: { $in: accountNumbers } }
      ]
    }).sort({ timestamp: -1 });

    const csvContent = exportCSV(txs);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=MetaBank_Statement.csv');
    res.status(200).send(csvContent);
  } catch (err) { next(err); }
};
