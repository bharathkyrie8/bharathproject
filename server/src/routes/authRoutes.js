const express = require('express');
const router = express.Router();
const { login, logout, getMe, changePassword } = require('../controllers/authController');
const { validateLogin, validateChangePassword } = require('../validators/authValidator');
const { authenticateAdmin } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/login', authLimiter, validateLogin, login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticateAdmin, getMe);
router.put('/change-password', authenticateAdmin, validateChangePassword, changePassword);

module.exports = router;
