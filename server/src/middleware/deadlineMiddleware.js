const Event = require('../models/Event');
const { isDeadlinePassed, formatIST } = require('../utils/timeUtils');

/**
 * Checks whether registration is currently open before accepting new registrations or creating payment orders.
 */
const checkRegistrationOpen = async (req, res, next) => {
  try {
    const event = await Event.findOne().sort({ createdAt: -1 });

    if (!event) {
      // Default hard check if event document is missing
      if (isDeadlinePassed('2026-10-25T23:00:00+05:30')) {
        return res.status(403).json({
          success: false,
          code: 'REGISTRATION_CLOSED',
          message: 'Cycle Marathon registration is officially closed. The deadline of 25 October 2026 at 11:00 PM IST has passed.'
        });
      }
      return next();
    }

    const { isOpen, reason } = event.isRegistrationOpen();

    if (!isOpen) {
      return res.status(403).json({
        success: false,
        code: 'REGISTRATION_CLOSED',
        message: reason || 'Registration is currently closed.',
        deadline: formatIST(event.registrationDeadline)
      });
    }

    req.eventConfig = event;
    next();
  } catch (error) {
    console.error('[DeadlineMiddleware] Error verifying registration availability:', error);
    next(error);
  }
};

module.exports = {
  checkRegistrationOpen
};
