const express = require('express');
const router = express.Router();
const {
  triggerBlockchainRegister,
  triggerBlockchainTransfer,
  getBlockchainTxHistory,
  getBlockchainVerifyOwner
} = require('../controllers/blockchainController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/blockchain/register
router.post('/register', protect, triggerBlockchainRegister);

// POST /api/blockchain/transfer
router.post('/transfer', protect, triggerBlockchainTransfer);

// GET /api/blockchain/history
router.get('/history', getBlockchainTxHistory);

// GET /api/blockchain/verify/:id
router.get('/verify/:id', getBlockchainVerifyOwner);

module.exports = router;
