const express = require('express');
const router = express.Router();
const { listUsers, verifyAadhar } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// simple admin guard: protect then require role=admin
const requireAdmin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};

router.get('/users', protect, requireAdmin, listUsers);
router.post('/verify-aadhar', protect, requireAdmin, verifyAadhar);

module.exports = router;
