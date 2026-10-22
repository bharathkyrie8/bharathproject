const express = require('express');
const router = express.Router();
const {
  initiateRegistration,
  getRegistrationStatus,
  lookupRegistration
} = require('../controllers/registrationController');
const { validateRegistration } = require('../validators/registrationValidator');
const { checkRegistrationOpen } = require('../middleware/deadlineMiddleware');
const { registrationLimiter } = require('../middleware/rateLimiter');

// Initiate registration (enforces deadline & manual closure check)
router.post('/initiate', registrationLimiter, checkRegistrationOpen, validateRegistration, initiateRegistration);

// Look up registration status by registration ID
router.get('/:registrationId', getRegistrationStatus);

// Look up participant's registration IDs by phone or email
router.post('/lookup', lookupRegistration);

module.exports = router;
