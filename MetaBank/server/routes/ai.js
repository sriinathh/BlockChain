const express = require('express');
const router = express.Router();
const { chat, analyze } = require('../controllers/aiController');

router.post('/chat', chat);
router.post('/analyze', analyze);

module.exports = router;
