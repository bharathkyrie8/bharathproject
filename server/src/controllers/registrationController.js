const { createPendingRegistration, getRegistrationById } = require('../services/registrationService');
const { createRazorpayOrder } = require('../services/paymentService');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

/**
 * Initiate a new registration and generate payment order
 * POST /api/v1/registration/initiate
 */
const initiateRegistration = async (req, res, next) => {
  try {
    const validatedData = req.validatedRegistration;
    const meta = {
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    // 1. Create Pending Registration
    const { registration, category } = await createPendingRegistration({
      validatedData,
      meta
    });

    // 2. Create Razorpay Payment Order on backend
    const orderDetails = await createRazorpayOrder(registration, category);

    res.status(201).json({
      success: true,
      message: 'Registration initiated successfully. Proceed to payment checkout.',
      data: {
        registrationId: registration.registrationId,
        participant: {
          fullName: registration.participant.fullName,
          email: registration.participant.email,
          phone: registration.participant.phone
        },
        category: {
          name: category.name,
          distanceKm: category.distanceKm,
          priceInr: category.priceInr
        },
        paymentOrder: orderDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve public registration details by Registration ID
 * GET /api/v1/registration/:registrationId
 */
const getRegistrationStatus = async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const registration = await getRegistrationById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `No registration found matching ID: ${registrationId}`
      });
    }

    const event = await Event.findOne().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        registrationId: registration.registrationId,
        status: registration.status,
        confirmedAt: registration.confirmedAt,
        bibNumber: registration.bibNumber,
        amountDueInr: registration.amountDueInr,
        participant: {
          fullName: registration.participant.fullName,
          email: registration.participant.email,
          phone: registration.participant.phone,
          tShirtSize: registration.participant.tShirtSize,
          gender: registration.participant.gender,
          bloodGroup: registration.participant.bloodGroup,
          city: registration.participant.address.city,
          state: registration.participant.address.state
        },
        category: registration.categorySnapshot,
        payment: registration.paymentId
          ? {
              status: registration.paymentId.status,
              razorpayPaymentId: registration.paymentId.razorpayPaymentId,
              receiptNumber: registration.paymentId.receiptNumber,
              method: registration.paymentId.method,
              verifiedAt: registration.paymentId.verifiedAt
            }
          : null,
        expoDetails: event
          ? {
              venue: event.expoVenue,
              dates: event.expoDates
            }
          : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lookup registration ID by email and phone
 * POST /api/v1/registration/lookup
 */
const lookupRegistration = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either registered email or mobile number.'
      });
    }

    const query = {};
    if (email) query['participant.email'] = email.trim().toLowerCase();
    if (phone) query['participant.phone'] = phone.trim();

    const registrations = await Registration.find(query)
      .select('registrationId participant.fullName categorySnapshot status confirmedAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initiateRegistration,
  getRegistrationStatus,
  lookupRegistration
};
