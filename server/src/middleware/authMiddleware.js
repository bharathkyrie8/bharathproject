const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.admin_token) {
      // Check HTTP-only cookie
      token = req.cookies.admin_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No valid session or token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, env.jwt.secret);

    // Find admin user
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or deactivated.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.'
    });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Superadmin privileges required.'
    });
  }
  next();
};

module.exports = {
  authenticateAdmin,
  requireSuperAdmin
};
