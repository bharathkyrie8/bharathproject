const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const env = require('../config/env');
const { logAdminAction } = require('../services/auditService');

const generateToken = (id) => {
  return jwt.sign({ id }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });
};

const sendTokenResponse = (admin, statusCode, res, message = 'Success') => {
  const token = generateToken(admin._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax'
  };

  res
    .status(statusCode)
    .cookie('admin_token', token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
};

/**
 * Admin Login
 * POST /api/v1/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.validatedBody;

    // Search by email or username
    const admin = await Admin.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }]
    }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials'
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This admin account has been suspended or deactivated.'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    await logAdminAction({
      admin,
      action: 'ADMIN_LOGIN',
      resource: 'Admin',
      resourceId: admin._id,
      details: { email: admin.email },
      req
    });

    sendTokenResponse(admin, 200, res, 'Admin authenticated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Logout
 * POST /api/v1/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    if (req.admin) {
      await logAdminAction({
        admin: req.admin,
        action: 'ADMIN_LOGOUT',
        resource: 'Admin',
        resourceId: req.admin._id,
        req
      });
    }

    res.cookie('admin_token', 'none', {
      expires: new Date(Date.now() + 2 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated admin
 * GET /api/v1/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.admin
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change Admin Password
 * PUT /api/v1/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.validatedBody;
    const admin = await Admin.findById(req.admin._id).select('+password');

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password provided is incorrect'
      });
    }

    admin.password = newPassword;
    await admin.save();

    await logAdminAction({
      admin,
      action: 'ADMIN_PASSWORD_CHANGED',
      resource: 'Admin',
      resourceId: admin._id,
      req
    });

    sendTokenResponse(admin, 200, res, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  getMe,
  changePassword
};
