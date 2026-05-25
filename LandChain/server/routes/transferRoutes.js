const express = require('express');
const router = express.Router();
const {
  createTransferRequest,
  approveTransferRequest,
  getTransferHistory
} = require('../controllers/transferController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { validateTransfer } = require('../validations/validator');

// POST /api/transfers/create
router.post('/create', protect, validateTransfer, createTransferRequest);

// POST /api/transfers/approve
router.post('/approve', protect, restrictTo('Government Officer', 'Admin'), approveTransferRequest);

// GET /api/transfers/history
router.get('/history', getTransferHistory);

module.exports = router;
