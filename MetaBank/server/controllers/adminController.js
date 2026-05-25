const User = require('../models/User');
const Loan = require('../models/Loan');
const FraudReport = require('../models/FraudReport');
const Account = require('../models/Account');
const Notification = require('../models/Notification');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) { next(err); }
};

exports.verifyAadhar = async (req, res, next) => {
  try {
    const { userId, verified } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.aadharVerified = !!verified;
    await user.save();

    await Notification.create({
      user: user._id,
      title: verified ? 'KYC Verified' : 'KYC Status Updated',
      message: verified 
        ? 'Congratulations! Your Aadhar KYC has been verified. You can now use all MetaBank features.'
        : 'Your Aadhar verification status has been updated. Please contact support.',
      type: 'info'
    });

    res.json({ success: true, user: { id: user._id, aadharVerified: user.aadharVerified } });
  } catch (err) { next(err); }
};

// Admin Loan controls
exports.listPendingLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find({ status: 'pending' }).populate('user', 'username email fullName');
    res.json({ ok: true, loans });
  } catch (err) { next(err); }
};

// Admin Fraud controls
exports.listFraudReports = async (req, res, next) => {
  try {
    const reports = await FraudReport.find().sort({ createdAt: -1 });
    res.json({ ok: true, reports });
  } catch (err) { next(err); }
};

exports.resolveFraudReport = async (req, res, next) => {
  try {
    const { reportId, status } = req.body; // status: 'resolved', 'dismissed', etc.
    if (!reportId || !status) return res.status(400).json({ message: 'Missing fields' });
    
    const report = await FraudReport.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Fraud report not found' });
    
    report.status = status;
    await report.save();
    
    res.json({ ok: true, report });
  } catch (err) { next(err); }
};

// Global dashboard analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const accounts = await Account.find();
    const totalDeposits = accounts.reduce((acc, current) => acc + (current.balance || 0), 0);
    const activeLoansCount = await Loan.countDocuments({ status: 'approved' });
    const pendingLoansCount = await Loan.countDocuments({ status: 'pending' });
    const fraudReportsCount = await FraudReport.countDocuments({ status: 'flagged' });

    res.json({
      ok: true,
      stats: {
        totalUsers,
        totalDeposits,
        activeLoansCount,
        pendingLoansCount,
        fraudReportsCount
      }
    });
  } catch (err) { next(err); }
};
