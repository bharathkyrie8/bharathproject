const mongoose = require('mongoose');

const webhookEventLogSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true },
    eventType: { type: String, required: true },
    receivedAt: { type: Date, default: Date.now },
    payload: { type: mongoose.Schema.Types.Mixed }
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
      index: true
    },
    registrationId: {
      type: String,
      required: true,
      index: true
    },
    paymentMode: {
      type: String,
      enum: ['RAZORPAY', 'DIRECT_UPI'],
      default: 'RAZORPAY'
    },
    razorpayOrderId: {
      type: String,
      sparse: true,
      index: true
    },
    razorpayPaymentId: {
      type: String,
      sparse: true,
      index: true
    },
    razorpaySignature: {
      type: String
    },
    upiTransactionId: {
      type: String,
      sparse: true,
      index: true,
      trim: true
    },
    screenshotUrl: {
      type: String,
      trim: true
    },
    amountInPaise: {
      type: Number,
      required: true
    },
    amountInr: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['CREATED', 'AUTHORIZED', 'CAPTURED', 'PENDING_VERIFICATION', 'FAILED', 'REFUNDED'],
      default: 'CREATED',
      index: true
    },
    method: {
      type: String,
      default: 'upi'
    },
    receiptNumber: {
      type: String,
      required: true
    },
    verifiedByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    failureReason: {
      type: String
    },
    failureCode: {
      type: String
    },
    webhookEvents: [webhookEventLogSchema],
    verifiedAt: {
      type: Date
    },
    notes: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
