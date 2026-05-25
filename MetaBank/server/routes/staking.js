const express = require('express');
const router = express.Router();
const { stake, unstake, rewards } = require('../controllers/stakingController');

router.post('/stake', stake);
router.post('/unstake', unstake);
router.get('/rewards/:wallet', rewards);

module.exports = router;
