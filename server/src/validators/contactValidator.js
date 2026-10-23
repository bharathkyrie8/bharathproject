const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Please provide your name',
    'string.min': 'Name must be at least 2 characters long'
  }),
  email: Joi.string().trim().email({ tlds: false }).required().messages({
    'string.empty': 'Please provide your email address',
    'string.email': 'Please provide a valid email address'
  }),
  phone: Joi.alternatives().try(
    Joi.string().trim().allow('', null),
    Joi.number().allow('', null)
  ).optional(),
  subject: Joi.string().trim().min(2).max(200).required().messages({
    'string.empty': 'Subject is required'
  }),
  message: Joi.string().trim().min(2).max(3000).required().messages({
    'string.empty': 'Please enter your message',
    'string.min': 'Message must be at least 2 characters long'
  })
});

const validateContactMessage = (req, res, next) => {
  const { error, value } = contactSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errorDetails = error.details.map((d) => d.message).join('. ');
    return res.status(400).json({
      success: false,
      message: errorDetails || 'Contact form validation failed',
      errors: error.details.map((d) => ({ field: d.path.join('.'), message: d.message }))
    });
  }
  req.validatedBody = value;
  next();
};

module.exports = {
  validateContactMessage
};
