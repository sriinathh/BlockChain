const express = require('express');
const router = express.Router();
const { deposit, withdraw, transfer, history } = require('../controllers/bankController');

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);
router.get('/history/:wallet', history);

module.exports = router;
