const express = require('express');
const router = express.Router();
const {
  getPublicEventConfig,
  updateEventConfig,
  toggleRegistration
} = require('../controllers/eventController');
const { validateUpdateEvent } = require('../validators/eventValidator');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// Public route to get event info, venue, countdown, and benefits
router.get('/', getPublicEventConfig);

// Admin routes to configure event and toggle registration
router.put('/', authenticateAdmin, validateUpdateEvent, updateEventConfig);
router.post('/toggle-registration', authenticateAdmin, toggleRegistration);

module.exports = router;
