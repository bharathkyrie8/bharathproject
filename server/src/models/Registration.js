const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    participant: {
      fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        index: true
      },
      phone: {
        type: String,
        required: [true, 'Mobile number is required'],
        trim: true,
        index: true
      },
      dob: {
        type: Date,
        required: [true, 'Date of birth is required']
      },
      age: {
        type: Number,
        required: true
      },
      gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'],
        required: [true, 'Gender is required']
      },
      bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'],
        default: 'UNKNOWN'
      },
      tShirtSize: {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
        required: [true, 'T-Shirt size is required']
      },
      address: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, trim: true },
        country: { type: String, default: 'India', trim: true }
      },
      emergencyContact: {
        name: { type: String, required: true, trim: true },
        relation: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true }
      }
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    categorySnapshot: {
      name: { type: String, required: true },
      slug: { type: String, required: true },
      distanceKm: { type: Number, required: true },
      timingType: { type: String, required: true },
      priceInr: { type: Number, required: true }
    },
    guardian: {
      isMinor: { type: Boolean, default: false },
      fullName: { type: String, trim: true },
      relation: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      consentGiven: { type: Boolean, default: false }
    },
    consent: {
      termsAccepted: { type: Boolean, required: true, default: false },
      medicalDeclarationAccepted: { type: Boolean, required: true, default: false },
      consentTimestamp: { type: Date, default: Date.now }
    },
    status: {
      type: String,
      enum: ['PENDING_PAYMENT', 'PENDING_VERIFICATION', 'CONFIRMED', 'CANCELLED', 'FAILED', 'EXPIRED'],
      default: 'PENDING_PAYMENT',
      index: true
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    paymentProof: {
      paymentMode: { type: String, enum: ['RAZORPAY', 'DIRECT_UPI'], default: 'DIRECT_UPI' },
      utrNumber: { type: String, trim: true, sparse: true },
      screenshotUrl: { type: String, trim: true },
      submittedAt: { type: Date }
    },
    amountDueInr: {
      type: Number,
      required: true
    },
    razorpayOrderId: {
      type: String,
      index: true
    },
    confirmedAt: {
      type: Date
    },
    bibNumber: {
      type: String,
      sparse: true,
      unique: true
    },
    notes: {
      type: String
    },
    meta: {
      ipAddress: { type: String },
      userAgent: { type: String }
    }
  },
  {
    timestamps: true
  }
);

// Composite compound index to detect potential duplicates
registrationSchema.index({ 'participant.email': 1, category: 1, status: 1 });
registrationSchema.index({ 'participant.phone': 1, category: 1, status: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
