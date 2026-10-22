const Joi = require('joi');

const updateEventSchema = Joi.object({
  title: Joi.string().trim(),
  tagline: Joi.string().trim(),
  description: Joi.string().trim(),
  eventDate: Joi.date().iso(),
  registrationDeadline: Joi.date().iso(),
  isRegistrationOpenManually: Joi.boolean(),
  manualClosureReason: Joi.string().allow('', null),
  expoVenue: Joi.object({
    name: Joi.string().trim(),
    addressLine: Joi.string().trim(),
    city: Joi.string().trim(),
    state: Joi.string().trim(),
    pincode: Joi.string().trim(),
    mapsUrl: Joi.string().uri().allow(''),
    mapsEmbedUrl: Joi.string().allow('')
  }),
  expoDates: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    timingsNote: Joi.string().trim()
  }),
  raceDaySchedule: Joi.array().items(
    Joi.object({
      time: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().allow(''),
      location: Joi.string().allow('')
    })
  ),
  benefits: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      iconKey: Joi.string().allow(''),
      isConfirmed: Joi.boolean().default(false),
      isPublished: Joi.boolean().default(false)
    })
  ),
  organizerContact: Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().trim(),
    whatsapp: Joi.string().trim(),
    supportHours: Joi.string().trim()
  })
});

const validateUpdateEvent = (req, res, next) => {
  const { error, value } = updateEventSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Event settings validation error',
      errors: error.details.map((d) => ({ field: d.path.join('.'), message: d.message }))
    });
  }
  req.validatedBody = value;
  next();
};

module.exports = {
  validateUpdateEvent
};
