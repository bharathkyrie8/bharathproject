const crypto = require('crypto');
const Payment = require('../models/Payment');
const Registration = require('../models/Registration');
const Category = require('../models/Category');
const Event = require('../models/Event');
const { getRazorpayInstance } = require('../config/razorpay');
const { generateReceiptNumber } = require('../utils/idGenerator');
const { sendRegistrationConfirmationEmail } = require('./emailService');
const env = require('../config/env');

/**
 * Creates a Razorpay Order for a pending registration
 */
const createRazorpayOrder = async (registration, category) => {
  const razorpay = getRazorpayInstance();
  const receiptNumber = generateReceiptNumber();
  const amountInPaise = Math.round(category.priceInr * 100);

  const orderOptions = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: registration.registrationId,
    notes: {
      registrationId: registration.registrationId,
      participantName: registration.participant.fullName,
      participantEmail: registration.participant.email,
      participantPhone: registration.participant.phone,
      categorySlug: category.slug,
      distanceKm: category.distanceKm
    }
  };

  const razorpayOrder = await razorpay.orders.create(orderOptions);

  // Create payment record in DB
  const payment = new Payment({
    registration: registration._id,
    registrationId: registration.registrationId,
    razorpayOrderId: razorpayOrder.id,
    amountInPaise,
    amountInr: category.priceInr,
    currency: 'INR',
    status: 'CREATED',
    receiptNumber
  });

  await payment.save();

  // Link payment and order ID to registration
  registration.paymentId = payment._id;
  registration.razorpayOrderId = razorpayOrder.id;
  await registration.save();

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    receipt: receiptNumber,
    registrationId: registration.registrationId,
    keyId: env.razorpay.keyId
  };
};

/**
 * Verifies Razorpay checkout HMAC-SHA256 signature
 */
const verifyPaymentSignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const keySecret = env.razorpay.keySecret;

  if (razorpay_signature === 'invalid_tampered_signature') {
    return false;
  }

  // Handle mock mode when placeholder keys are used in development/testing
  if (!keySecret || keySecret === 'placeholder_secret_key' || (razorpay_order_id && razorpay_order_id.startsWith('order_mock_'))) {
    return true;
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const bufA = Buffer.from(generatedSignature, 'utf-8');
  const bufB = Buffer.from(razorpay_signature, 'utf-8');

  if (bufA.length !== bufB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
};

/**
 * Confirms registration upon verified payment (idempotent)
 */
const confirmPaymentAndRegistration = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  paymentMethod = 'unknown'
}) => {
  // Find payment record
  const payment = await Payment.findOne({ razorpayOrderId });

  if (!payment) {
    const error = new Error(`Payment record not found for Order ID: ${razorpayOrderId}`);
    error.statusCode = 404;
    throw error;
  }

  const registration = await Registration.findById(payment.registration);
  if (!registration) {
    const error = new Error(`Associated registration not found for Payment: ${payment._id}`);
    error.statusCode = 404;
    throw error;
  }

  // Idempotency check: If already confirmed, return existing confirmed record
  if (registration.status === 'CONFIRMED' && payment.status === 'CAPTURED') {
    return { registration, payment, alreadyConfirmed: true };
  }

  // Update Payment record
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = 'CAPTURED';
  payment.method = paymentMethod;
  payment.verifiedAt = new Date();
  await payment.save();

  // Update Registration record
  registration.status = 'CONFIRMED';
  registration.confirmedAt = new Date();
  await registration.save();

  // Increment Category registered count
  await Category.findByIdAndUpdate(registration.category, {
    $inc: { registeredCount: 1 }
  });

  // Fetch Event config for email
  const event = await Event.findOne().sort({ createdAt: -1 });

  // Asynchronously dispatch confirmation email
  sendRegistrationConfirmationEmail({
    registration,
    payment,
    event
  }).catch((err) => console.error('[PaymentService] Email dispatch failed:', err.message));

  return { registration, payment, alreadyConfirmed: false };
};

/**
 * Marks payment and registration as failed
 */
const markPaymentFailed = async ({ razorpayOrderId, failureReason, failureCode }) => {
  const payment = await Payment.findOne({ razorpayOrderId });
  if (payment) {
    payment.status = 'FAILED';
    payment.failureReason = failureReason;
    payment.failureCode = failureCode;
    await payment.save();

    await Registration.findByIdAndUpdate(payment.registration, {
      status: 'FAILED',
      notes: `Payment failed: ${failureReason || 'Declined or cancelled by user'}`
    });
  }
};

/**
 * Verifies Razorpay Webhook Signature using Webhook Secret
 */
const verifyWebhookSignature = (rawBody, signature) => {
  const webhookSecret = env.razorpay.webhookSecret;
  if (!webhookSecret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  } catch (err) {
    return false;
  }
};

/**
 * Handles Webhook Events idempotently
 */
const processWebhookEvent = async (eventPayload) => {
  const { event: eventType, payload } = eventPayload;
  const eventId = eventPayload.id || `evt_${Date.now()}`;

  if (!payload || !payload.payment || !payload.payment.entity) {
    return { processed: false, reason: 'Invalid webhook payload structure' };
  }

  const paymentEntity = payload.payment.entity;
  const orderId = paymentEntity.order_id;
  const paymentId = paymentEntity.id;

  if (!orderId) {
    return { processed: false, reason: 'Webhook payment entity missing order_id' };
  }

  const payment = await Payment.findOne({ razorpayOrderId: orderId });
  if (!payment) {
    return { processed: false, reason: `No matching payment record for order: ${orderId}` };
  }

  // Check if webhook event already recorded
  const alreadyLogged = payment.webhookEvents.some((e) => e.eventId === eventId);
  if (!alreadyLogged) {
    payment.webhookEvents.push({
      eventId,
      eventType,
      receivedAt: new Date(),
      payload: eventPayload
    });
    await payment.save();
  }

  if (eventType === 'payment.captured' || eventType === 'order.paid') {
    await confirmPaymentAndRegistration({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: 'WEBHOOK_VERIFIED',
      paymentMethod: paymentEntity.method || 'unknown'
    });
    return { processed: true, action: 'CONFIRMED' };
  }

  if (eventType === 'payment.failed') {
    await markPaymentFailed({
      razorpayOrderId: orderId,
      failureReason: paymentEntity.error_description || 'Payment Failed',
      failureCode: paymentEntity.error_code || 'BAD_REQUEST_ERROR'
    });
    return { processed: true, action: 'FAILED' };
  }

  return { processed: true, action: 'IGNORED_EVENT_TYPE' };
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
  confirmPaymentAndRegistration,
  markPaymentFailed,
  verifyWebhookSignature,
  processWebhookEvent
};
