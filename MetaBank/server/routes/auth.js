const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './uploads/' });
const { register, login, walletLogin, getNonce, verifyWallet, setup2FA, verify2FA, login2FA, linkWallet } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', upload.single('aadharImage'), register);
router.post('/login', login);
router.post('/login-2fa', login2FA);
router.post('/setup-2fa', protect, setup2FA);
router.post('/verify-2fa', protect, verify2FA);
router.post('/wallet-login', walletLogin);
router.get('/nonce', getNonce);
router.post('/verify-wallet', verifyWallet);
router.post('/link-wallet', protect, linkWallet);

module.exports = router;
