const express = require('express');
const router = express.Router();
const { apply, history, repay } = require('../controllers/loanController');

router.post('/apply', apply);
router.get('/history/:wallet', history);
router.post('/repay', repay);

module.exports = router;
