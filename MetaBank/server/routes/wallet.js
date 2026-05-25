const express = require('express');
const router = express.Router();
const { connect, balance, network } = require('../controllers/walletController');

router.post('/connect', connect);
router.get('/balance/:address', balance);
router.get('/network', network);

module.exports = router;
