const Event = require('../models/Event');
const { logAdminAction } = require('../services/auditService');

/**
 * Get public event configuration, venue, schedule, benefits & closure status
 * GET /api/v1/event
 */
const getPublicEventConfig = async (req, res, next) => {
  try {
    let event = await Event.findOne().sort({ createdAt: -1 });

    if (!event) {
      event = await Event.create({});
    }

    const { isOpen, reason } = event.isRegistrationOpen();

    // Filter to only confirmed and published benefits for the public
    const publishedBenefits = (event.benefits || []).filter((b) => b.isConfirmed && b.isPublished);

    res.status(200).json({
      success: true,
      data: {
        id: event._id,
        title: event.title,
        tagline: event.tagline,
        description: event.description,
        eventDate: event.eventDate,
        registrationDeadline: event.registrationDeadline,
        isRegistrationOpen: isOpen,
        closureReason: reason,
        expoVenue: event.expoVenue,
        expoDates: event.expoDates,
        raceDaySchedule: event.raceDaySchedule,
        benefits: publishedBenefits,
        organizerContact: event.organizerContact
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update event configuration (Admin Only)
 * PUT /api/v1/event
 */
const updateEventConfig = async (req, res, next) => {
  try {
    let event = await Event.findOne().sort({ createdAt: -1 });
    if (!event) {
      event = new Event(req.validatedBody);
    } else {
      Object.assign(event, req.validatedBody);
    }

    await event.save();

    await logAdminAction({
      admin: req.admin,
      action: 'EVENT_CONFIG_UPDATED',
      resource: 'Event',
      resourceId: event._id,
      details: req.validatedBody,
      req
    });

    res.status(200).json({
      success: true,
      message: 'Event settings updated successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Manually toggle registration open or closed (Admin Only)
 * POST /api/v1/event/toggle-registration
 */
const toggleRegistration = async (req, res, next) => {
  try {
    const { isOpen, reason } = req.body;

    let event = await Event.findOne().sort({ createdAt: -1 });
    if (!event) {
      event = await Event.create({});
    }

    event.isRegistrationOpenManually = Boolean(isOpen);
    event.manualClosureReason = reason || '';
    await event.save();

    const action = isOpen ? 'REGISTRATION_OPENED_MANUALLY' : 'REGISTRATION_CLOSED_MANUALLY';

    await logAdminAction({
      admin: req.admin,
      action,
      resource: 'Event',
      resourceId: event._id,
      details: { isOpen, reason },
      req
    });

    res.status(200).json({
      success: true,
      message: `Registration has been manually ${isOpen ? 'opened' : 'closed'}.`,
      data: {
        isRegistrationOpenManually: event.isRegistrationOpenManually,
        manualClosureReason: event.manualClosureReason,
        status: event.isRegistrationOpen()
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicEventConfig,
  updateEventConfig,
  toggleRegistration
};
