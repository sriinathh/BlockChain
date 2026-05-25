const express = require('express');
const router = express.Router();
const {
  registerLand,
  getAllLands,
  getLandById,
  updateLand,
  deleteLand
} = require('../controllers/landController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { validateLand } = require('../validations/validator');
const { upload } = require('../services/ipfsService');

// POST /api/lands/register
router.post('/register', protect, upload.single('deedDoc'), validateLand, registerLand);

// GET /api/lands
router.get('/', getAllLands);

// GET /api/lands/:id
router.get('/:id', getLandById);

// PUT /api/lands/:id
router.put('/:id', protect, restrictTo('Government Officer', 'Admin'), updateLand);

// DELETE /api/lands/:id
router.delete('/:id', protect, restrictTo('Admin'), deleteLand);

module.exports = router;
