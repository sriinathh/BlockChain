const express = require('express');
const router = express.Router();
const { 
  deposit, 
  withdraw, 
  transfer, 
  history, 
  getAccounts, 
  depositTraditional, 
  withdrawTraditional, 
  transferTraditional,
  downloadStatement,
  downloadCSV
} = require('../controllers/bankController');
const { protect } = require('../middleware/auth');

router.get('/accounts', protect, getAccounts);
router.post('/traditional/deposit', protect, depositTraditional);
router.post('/traditional/withdraw', protect, withdrawTraditional);
router.post('/traditional/transfer', protect, transferTraditional);

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);
router.get('/history/:wallet', history);
router.get('/statement/:wallet', downloadStatement);
router.get('/csv/:wallet', downloadCSV);

module.exports = router;
