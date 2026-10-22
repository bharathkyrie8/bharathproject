const {
  verifyPaymentSignature,
  confirmPaymentAndRegistration,
  markPaymentFailed,
  verifyWebhookSignature,
  processWebhookEvent
} = require('../services/paymentService');

/**
 * Verifies Razorpay checkout signature and confirms registration
 * POST /api/v1/payment/verify
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, method } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification requires razorpay_order_id, razorpay_payment_id, and razorpay_signature'
      });
    }

    // 1. Verify cryptographic HMAC signature
    const isValidSignature = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValidSignature) {
      console.warn(`[PaymentVerification] Tampered or invalid signature for Order ID: ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid cryptographic signature.'
      });
    }

    // 2. Confirm payment & registration (idempotent)
    const result = await confirmPaymentAndRegistration({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentMethod: method || 'online'
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and registration successfully confirmed!',
      data: {
        registrationId: result.registration.registrationId,
        participantName: result.registration.participant.fullName,
        category: result.registration.categorySnapshot.name,
        amountPaid: result.registration.amountDueInr,
        receiptNumber: result.payment.receiptNumber,
        status: result.registration.status,
        alreadyConfirmed: result.alreadyConfirmed
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles client-side payment cancellation or checkout failure
 * POST /api/v1/payment/failed
 */
const handlePaymentFailure = async (req, res, next) => {
  try {
    const { razorpay_order_id, error_code, error_description } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    await markPaymentFailed({
      razorpayOrderId: razorpay_order_id,
      failureReason: error_description || 'Payment abandoned or failed by user',
      failureCode: error_code || 'PAYMENT_CANCELLED'
    });

    res.status(200).json({
      success: true,
      message: 'Payment failure recorded.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Webhook handler for asynchronous server-to-server Razorpay events
 * POST /api/v1/payment/webhook
 */
const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];

    // In production, verify raw body against webhook secret
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const isValid = verifyWebhookSignature(rawBody, signature);

    // If signature is invalid in production, reject
    if (!isValid && process.env.NODE_ENV === 'production') {
      console.warn('[Webhook] Invalid Razorpay webhook signature');
      return res.status(400).json({ status: 'invalid_signature' });
    }

    const result = await processWebhookEvent(req.body);
    console.log(`[Webhook] Event processed:`, result);

    res.status(200).json({ status: 'ok', result });
  } catch (error) {
    console.error('[Webhook] Error handling webhook event:', error);
    // Always return 200 to Razorpay if error is handled, otherwise Razorpay retries continuously
    res.status(200).json({ status: 'error_handled', message: error.message });
  }
};

/**
 * Get Direct UPI payment details (UPI ID, QR code URLs, and deep-link)
 * GET /api/v1/payment/upi-details
 */
const getUpiDetails = async (req, res, next) => {
  try {
    const { registrationId } = req.query;
    const env = require('../config/env');
    const Registration = require('../models/Registration');

    let amount = 699;
    let participantName = 'Participant';

    if (registrationId) {
      const reg = await Registration.findOne({ registrationId });
      if (reg) {
        amount = reg.amountDueInr;
        participantName = reg.participant.fullName;
      }
    }

    const upiId = env.upi.id;
    const payeeName = env.upi.payeeName;
    const gpayQrUrl = env.upi.gpayQrUrl;
    const phonepeQrUrl = env.upi.phonepeQrUrl;

    // Standard NPCI UPI Intent Deep-link format
    const encodedPayee = encodeURIComponent(payeeName);
    const encodedNote = encodeURIComponent(`Marathon Reg ${registrationId || ''}`);
    const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodedPayee}&am=${amount}&cu=INR&tn=${encodedNote}`;

    res.status(200).json({
      success: true,
      data: {
        upiId,
        payeeName,
        amount,
        gpayQrUrl,
        phonepeQrUrl,
        upiDeepLink,
        instructions: [
          '1. Scan either Google Pay or PhonePe QR code using any UPI app.',
          '2. Ensure payee name displays "' + payeeName + '" and UPI ID is "' + upiId + '".',
          '3. Pay the exact fee of ₹' + amount + '.',
          '4. Copy the 12-digit UPI UTR / Transaction Reference Number.',
          '5. Upload your payment screenshot and enter the UTR number to complete registration.'
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Participant submits 12-digit UPI UTR number and optional payment screenshot
 * POST /api/v1/payment/submit-upi-proof
 */
const submitUpiPaymentProof = async (req, res, next) => {
  try {
    const { registrationId, utrNumber } = req.body;
    const Registration = require('../models/Registration');
    const Payment = require('../models/Payment');
    const { uploadBufferToCloudinary } = require('../config/cloudinary');
    const { generateReceiptNumber } = require('../utils/idGenerator');

    if (!registrationId || !utrNumber) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID and 12-digit UPI UTR number are required.'
      });
    }

    // Clean UTR
    const cleanUtr = utrNumber.trim();
    if (cleanUtr.length < 8 || cleanUtr.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 12-digit UPI Reference / UTR Number.'
      });
    }

    // Check if UTR already used by a confirmed registration
    const duplicateUtr = await Payment.findOne({
      upiTransactionId: cleanUtr,
      status: 'CAPTURED'
    });

    if (duplicateUtr) {
      return res.status(409).json({
        success: false,
        message: 'This UPI Transaction UTR number has already been used and verified for another registration.'
      });
    }

    const registration = await Registration.findOne({ registrationId });
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `Registration not found: ${registrationId}`
      });
    }

    // Handle optional screenshot upload to Cloudinary
    let screenshotUrl = req.body.screenshotUrl || '';
    if (req.file) {
      try {
        const uploadResult = await uploadBufferToCloudinary(req.file.buffer, 'cycle_marathon_upi_proofs');
        screenshotUrl = uploadResult.secure_url;
      } catch (err) {
        console.warn('[UPI Proof] Cloudinary upload warning:', err.message);
      }
    }

    // Update Registration
    registration.status = 'PENDING_VERIFICATION';
    registration.paymentProof = {
      paymentMode: 'DIRECT_UPI',
      utrNumber: cleanUtr,
      screenshotUrl,
      submittedAt: new Date()
    };
    await registration.save();

    // Create or update Payment record
    let payment = await Payment.findOne({ registration: registration._id });
    if (!payment) {
      payment = new Payment({
        registration: registration._id,
        registrationId: registration.registrationId,
        paymentMode: 'DIRECT_UPI',
        razorpayOrderId: `upi_ord_${Date.now()}`,
        upiTransactionId: cleanUtr,
        screenshotUrl,
        amountInPaise: Math.round(registration.amountDueInr * 100),
        amountInr: registration.amountDueInr,
        currency: 'INR',
        status: 'PENDING_VERIFICATION',
        method: 'upi',
        receiptNumber: generateReceiptNumber()
      });
    } else {
      payment.paymentMode = 'DIRECT_UPI';
      payment.upiTransactionId = cleanUtr;
      payment.screenshotUrl = screenshotUrl;
      payment.status = 'PENDING_VERIFICATION';
      payment.method = 'upi';
    }
    await payment.save();

    registration.paymentId = payment._id;
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Payment proof submitted successfully! Your registration is under verification.',
      data: {
        registrationId: registration.registrationId,
        participantName: registration.participant.fullName,
        category: registration.categorySnapshot.name,
        amountDueInr: registration.amountDueInr,
        utrNumber: cleanUtr,
        screenshotUrl,
        status: registration.status
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin verifies and confirms UPI payment
 * POST /api/v1/payment/admin/verify-upi
 */
const adminVerifyUpiPayment = async (req, res, next) => {
  try {
    const { registrationId } = req.body;
    const Registration = require('../models/Registration');
    const Payment = require('../models/Payment');
    const Category = require('../models/Category');
    const Event = require('../models/Event');
    const { sendRegistrationConfirmationEmail } = require('../services/emailService');
    const { logAdminAction } = require('../services/auditService');

    const registration = await Registration.findOne({ registrationId });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    const payment = await Payment.findOne({ registration: registration._id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Confirm Registration & Payment
    registration.status = 'CONFIRMED';
    registration.confirmedAt = new Date();
    await registration.save();

    payment.status = 'CAPTURED';
    payment.verifiedByAdmin = req.admin._id;
    payment.verifiedAt = new Date();
    await payment.save();

    // Increment Category count
    await Category.findByIdAndUpdate(registration.category, {
      $inc: { registeredCount: 1 }
    });

    const event = await Event.findOne().sort({ createdAt: -1 });

    // Send confirmation email
    sendRegistrationConfirmationEmail({
      registration,
      payment,
      event
    }).catch((err) => console.error('[UPI Verification] Email error:', err.message));

    await logAdminAction({
      admin: req.admin,
      action: 'UPI_PAYMENT_VERIFIED',
      resource: 'Registration',
      resourceId: registration._id,
      details: { registrationId, utr: payment.upiTransactionId },
      req
    });

    res.status(200).json({
      success: true,
      message: 'UPI payment verified and participant confirmed!',
      data: {
        registrationId: registration.registrationId,
        status: registration.status,
        confirmedAt: registration.confirmedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin rejects invalid UPI payment
 * POST /api/v1/payment/admin/reject-upi
 */
const adminRejectUpiPayment = async (req, res, next) => {
  try {
    const { registrationId, reason } = req.body;
    const Registration = require('../models/Registration');
    const Payment = require('../models/Payment');
    const { logAdminAction } = require('../services/auditService');

    const registration = await Registration.findOne({ registrationId });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    registration.status = 'FAILED';
    registration.notes = reason || 'UPI Payment rejected: Invalid UTR or amount not received in account';
    await registration.save();

    await Payment.findOneAndUpdate(
      { registration: registration._id },
      { status: 'FAILED', failureReason: registration.notes }
    );

    await logAdminAction({
      admin: req.admin,
      action: 'UPI_PAYMENT_REJECTED',
      resource: 'Registration',
      resourceId: registration._id,
      details: { registrationId, reason: registration.notes },
      req
    });

    res.status(200).json({
      success: true,
      message: 'UPI payment marked as rejected.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all pending UPI verifications for Admin
 * GET /api/v1/payment/admin/pending-verifications
 */
const getPendingUpiVerifications = async (req, res, next) => {
  try {
    const Registration = require('../models/Registration');
    const pending = await Registration.find({ status: 'PENDING_VERIFICATION' })
      .populate('category', 'name distanceKm priceInr')
      .populate('paymentId')
      .sort({ 'paymentProof.submittedAt': -1 });

    res.status(200).json({
      success: true,
      count: pending.length,
      data: pending
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyPayment,
  handlePaymentFailure,
  handleWebhook,
  getUpiDetails,
  submitUpiPaymentProof,
  adminVerifyUpiPayment,
  adminRejectUpiPayment,
  getPendingUpiVerifications
};
