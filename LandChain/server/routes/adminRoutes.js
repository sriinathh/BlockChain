const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getAdminUsersList,
  getAdminFraudReportsList
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Secure all admin routes
router.use(protect);
router.use(restrictTo('Admin'));

// GET /api/admin/dashboard
router.get('/dashboard', getAdminDashboardStats);

// GET /api/admin/users
router.get('/users', getAdminUsersList);

// GET /api/admin/fraud-reports
router.get('/fraud-reports', getAdminFraudReportsList);

module.exports = router;
