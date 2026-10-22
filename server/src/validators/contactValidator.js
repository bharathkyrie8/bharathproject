const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Please provide your name'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Please provide your email address',
    'string.email': 'Please provide a valid email address'
  }),
  phone: Joi.string().trim().allow('', null),
  subject: Joi.string().trim().min(3).max(200).required().messages({
    'string.empty': 'Subject is required'
  }),
  message: Joi.string().trim().min(10).max(2000).required().messages({
    'string.empty': 'Message is required',
    'string.min': 'Message must be at least 10 characters long'
  })
});

const validateContactMessage = (req, res, next) => {
  const { error, value } = contactSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Contact form validation failed',
      errors: error.details.map((d) => ({ field: d.path.join('.'), message: d.message }))
    });
  }
  req.validatedBody = value;
  next();
};

module.exports = {
  validateContactMessage
};
