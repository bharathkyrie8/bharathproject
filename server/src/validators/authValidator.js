const Joi = require('joi');

const loginSchema = Joi.object({
  identifier: Joi.string().trim().required().messages({
    'string.empty': 'Please provide your admin email or username'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required'
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 8 characters long'
  })
});

const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((d) => ({ field: d.path.join('.'), message: d.message }))
    });
  }
  req.validatedBody = value;
  next();
};

const validateChangePassword = (req, res, next) => {
  const { error, value } = changePasswordSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((d) => ({ field: d.path.join('.'), message: d.message }))
    });
  }
  req.validatedBody = value;
  next();
};

module.exports = {
  validateLogin,
  validateChangePassword
};
