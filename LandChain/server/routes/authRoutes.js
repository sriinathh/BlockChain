const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../validations/validator');
const { upload } = require('../services/ipfsService');

// POST /api/auth/register
router.post('/register', upload.single('profileImage'), validateRegister, registerUser);

// POST /api/auth/login
router.post('/login', validateLogin, loginUser);

// GET /api/auth/profile
router.get('/profile', protect, getUserProfile);

module.exports = router;
