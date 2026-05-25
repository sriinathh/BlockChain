const express = require('express');
const router = express.Router();
const { 
  listUsers, 
  verifyAadhar, 
  listPendingLoans, 
  listFraudReports, 
  resolveFraudReport, 
  getAnalytics 
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

const requireOfficerOrAdmin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'admin' && req.user.role !== 'officer') {
    return res.status(403).json({ message: 'Forbidden: Requires Admin or Officer role' });
  }
  next();
};

router.get('/users', protect, requireOfficerOrAdmin, listUsers);
router.post('/verify-aadhar', protect, requireOfficerOrAdmin, verifyAadhar);
router.get('/loans/pending', protect, requireOfficerOrAdmin, listPendingLoans);
router.get('/fraud/reports', protect, requireOfficerOrAdmin, listFraudReports);
router.post('/fraud/resolve', protect, requireOfficerOrAdmin, resolveFraudReport);
router.get('/analytics', protect, requireOfficerOrAdmin, getAnalytics);

module.exports = router;
