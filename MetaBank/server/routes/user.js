const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './uploads/' });
const { getProfile, mintNFTCard, getUserNFTCards, uploadAadhar } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.post('/nft-card/mint', protect, mintNFTCard);
router.get('/nft-cards/:address', getUserNFTCards);
router.post('/upload-aadhar', protect, upload.single('aadharImage'), uploadAadhar);

module.exports = router;
