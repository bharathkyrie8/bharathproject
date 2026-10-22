const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getMessages,
  updateMessageStatus
} = require('../controllers/contactController');
const { validateContactMessage } = require('../validators/contactValidator');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public route to submit inquiry
router.post('/', contactLimiter, validateContactMessage, submitContactMessage);

// Admin routes to read and manage messages
router.get('/admin/all', authenticateAdmin, getMessages);
router.put('/admin/:id', authenticateAdmin, updateMessageStatus);

module.exports = router;
