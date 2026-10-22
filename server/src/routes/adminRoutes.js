const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getParticipants,
  getParticipantDetails,
  exportParticipants,
  getAuditLogs
} = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// All admin routes require authentication
router.use(authenticateAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/participants', getParticipants);
router.get('/participants/:id', getParticipantDetails);
router.get('/export-csv', exportParticipants);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
