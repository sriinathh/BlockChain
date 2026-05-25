const User = require('../models/User');
const Land = require('../models/Land');
const Transfer = require('../models/Transfer');
const FraudReport = require('../models/FraudReport');
const Transaction = require('../models/Transaction');
const { asyncHandler } = require('../middleware/errorHandler');
const { isNodeActive } = require('../services/blockchainService');

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin Only)
const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalLands = await Land.countDocuments();
  const totalPendingVerifications = await Land.countDocuments({ status: 'Pending' });
  const totalPendingTransfers = await Transfer.countDocuments({ status: 'Pending' });
  const totalFraudAlerts = await FraudReport.countDocuments({ status: 'Investigating' });

  // Get recent transaction history logs
  const recentTransactions = await Transaction.find().sort({ createdAt: -1 }).limit(5);

  return res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalLands,
      totalPendingVerifications,
      totalPendingTransfers,
      totalFraudAlerts,
      blockchainActive: isNodeActive(),
      networkBlocks: 128956,
      gasFeeAvg: '18 Gwei'
    },
    recentTransactions
  });
});

// @desc    Get All Registered Users
// @route   GET /api/admin/users
// @access  Private (Admin Only)
const getAdminUsersList = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Get All Flagged Fraud Reports
// @route   GET /api/admin/fraud-reports
// @access  Private (Admin Only)
const getAdminFraudReportsList = asyncHandler(async (req, res) => {
  const reports = await FraudReport.find()
    .populate('landId', 'surveyNumber district state currentOwnerWallet')
    .sort({ riskScore: -1 });

  return res.status(200).json({ success: true, count: reports.length, reports });
});

module.exports = {
  getAdminDashboardStats,
  getAdminUsersList,
  getAdminFraudReportsList
};
