const express = require('express');
const router = express.Router();
const { apply, history, repay, approveLoan } = require('../controllers/loanController');
const { protect } = require('../middleware/auth');

const requireOfficer = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'admin' && req.user.role !== 'officer') {
    return res.status(403).json({ message: 'Forbidden: Requires Officer role' });
  }
  next();
};

router.post('/apply', protect, apply);
router.get('/history', protect, history);
router.post('/repay', protect, repay);
router.post('/approve', protect, requireOfficer, approveLoan);

module.exports = router;
