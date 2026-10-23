const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string().trim().required().messages({ 'string.empty': 'Category name is required' }),
  slug: Joi.string().trim().lowercase().required(),
  distanceKm: Joi.number().positive().required(),
  timingType: Joi.string().valid('TIMED', 'NON_TIMED').default('TIMED'),
  activityType: Joi.string().valid('CYCLING', 'RUN', 'DUATHLON').default('CYCLING'),
  priceInr: Joi.number().min(0).required(),
  minAge: Joi.number().integer().min(5).max(100).required(),
  maxAge: Joi.number().integer().min(5).max(120).allow(null),
  requiresGuardianConsentIfUnder18: Joi.boolean().default(true),
  description: Joi.string().allow('', null),
  benefitsIncluded: Joi.array().items(Joi.string()),
  maxCapacity: Joi.number().integer().positive().default(1000),
  isActive: Joi.boolean().default(true),
  displayOrder: Joi.number().integer().default(0)
});

const categoryUpdateSchema = Joi.object({
  name: Joi.string().trim().messages({ 'string.empty': 'Category name cannot be empty' }),
  slug: Joi.string().trim().lowercase(),
  distanceKm: Joi.number().positive(),
  timingType: Joi.string().valid('TIMED', 'NON_TIMED'),
  activityType: Joi.string().valid('CYCLING', 'RUN', 'DUATHLON'),
  priceInr: Joi.number().min(0),
  minAge: Joi.number().integer().min(5).max(100),
  maxAge: Joi.number().integer().min(5).max(120).allow(null),
  requiresGuardianConsentIfUnder18: Joi.boolean(),
  description: Joi.string().allow('', null),
  benefitsIncluded: Joi.array().items(Joi.string()),
  maxCapacity: Joi.number().integer().positive(),
  isActive: Joi.boolean(),
  displayOrder: Joi.number().integer()
});

const validateCategory = (req, res, next) => {
  const { error, value } = categorySchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Category validation error',
      errors: error.details.map((d) => ({ field: d.path.join('.'), message: d.message }))
    });
  }
  req.validatedBody = value;
  next();
};

const validateUpdateCategory = (req, res, next) => {
  const { error, value } = categoryUpdateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Category update validation error',
      errors: error.details.map((d) => ({ field: d.path.join('.'), message: d.message }))
    });
  }
  req.validatedBody = value;
  next();
};

module.exports = {
  validateCategory,
  validateUpdateCategory
};

