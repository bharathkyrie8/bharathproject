const Joi = require('joi');
const { calculateAge } = require('../utils/timeUtils');

const registrationSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Full Name is required',
    'string.min': 'Full Name must be at least 2 characters long'
  }),
  email: Joi.string().trim().email().lowercase().required().messages({
    'string.empty': 'Email address is required',
    'string.email': 'Please provide a valid email address'
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+ -]{10,15}$/)
    .required()
    .messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Please enter a valid 10-15 digit phone number'
    }),
  dob: Joi.date().iso().max('now').required().messages({
    'date.base': 'A valid Date of Birth is required',
    'date.max': 'Date of Birth cannot be in the future'
  }),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY').required().messages({
    'any.only': 'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY'
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN')
    .default('UNKNOWN'),
  tShirtSize: Joi.string().valid('XS', 'S', 'M', 'L', 'XL', '2XL', '3XL').required().messages({
    'any.only': 'Please select a valid T-Shirt size (XS, S, M, L, XL, 2XL, 3XL)'
  }),
  categoryId: Joi.string().required().messages({
    'string.empty': 'Please select a registration category'
  }),
  address: Joi.object({
    street: Joi.string().trim().allow('', null).default('Salem'),
    city: Joi.string().trim().allow('', null).default('Salem'),
    state: Joi.string().trim().allow('', null).default('Tamil Nadu'),
    pincode: Joi.string().trim().allow('', null).default('636001'),
    country: Joi.string().trim().default('India')
  }).default({
    street: 'Salem',
    city: 'Salem',
    state: 'Tamil Nadu',
    pincode: '636001',
    country: 'India'
  }),
  emergencyContact: Joi.object({
    name: Joi.string().trim().min(2).required().messages({ 'string.empty': 'Emergency contact name is required' }),
    relation: Joi.string().trim().min(2).required().messages({ 'string.empty': 'Emergency contact relation is required' }),
    phone: Joi.string().trim().pattern(/^[0-9+ -]{10,15}$/).required().messages({
      'string.pattern.base': 'Emergency contact must have a valid phone number'
    })
  }).required(),
  guardian: Joi.object({
    fullName: Joi.string().trim().allow('', null),
    relation: Joi.string().trim().allow('', null),
    phone: Joi.string().trim().allow('', null),
    email: Joi.string().trim().email().allow('', null),
    consentGiven: Joi.boolean().default(false)
  }).optional(),
  termsAccepted: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must accept the Event Terms and Conditions'
  }),
  medicalDeclarationAccepted: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must agree to the Medical Fitness Declaration'
  })
});

/**
 * Middleware for validating participant registration payload
 */
const validateRegistration = (req, res, next) => {
  const { error, value } = registrationSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    const errorDetails = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Registration validation failed. Please check form errors.',
      errors: errorDetails
    });
  }

  // Calculate age on event date
  try {
    const calculatedAge = calculateAge(value.dob, '2026-10-30');
    value.calculatedAge = calculatedAge;

    // Check minor guardian consent rule
    if (calculatedAge < 18) {
      if (!value.guardian || !value.guardian.fullName || !value.guardian.phone || !value.guardian.consentGiven) {
        return res.status(400).json({
          success: false,
          message: 'Participants under 18 years of age require verified Parent / Guardian consent and contact information.',
          errors: [
            {
              field: 'guardian',
              message: 'Guardian name, phone, and consent are mandatory for minors.'
            }
          ]
        });
      }
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  req.validatedRegistration = value;
  next();
};

module.exports = {
  validateRegistration
};
