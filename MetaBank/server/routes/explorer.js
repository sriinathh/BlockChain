const express = require('express');
const router = express.Router();
const { getLatestBlocks, getTransaction, getStats } = require('../controllers/explorerController');

router.get('/blocks', getLatestBlocks);
router.get('/tx/:hash', getTransaction);
router.get('/stats', getStats);

module.exports = router;
