const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    distanceKm: {
      type: Number,
      required: [true, 'Distance in KM is required']
    },
    timingType: {
      type: String,
      enum: ['TIMED', 'NON_TIMED'],
      default: 'TIMED'
    },
    activityType: {
      type: String,
      enum: ['CYCLING', 'RUN', 'DUATHLON'],
      default: 'CYCLING'
    },
    priceInr: {
      type: Number,
      required: [true, 'Price in INR is required'],
      min: [0, 'Price cannot be negative']
    },
    minAge: {
      type: Number,
      required: [true, 'Minimum age is required'],
      min: [5, 'Minimum age must be at least 5']
    },
    maxAge: {
      type: Number
    },
    requiresGuardianConsentIfUnder18: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      trim: true
    },
    benefitsIncluded: [
      {
        type: String,
        trim: true
      }
    ],
    maxCapacity: {
      type: Number,
      default: 1000
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Virtual for price in paise (needed for Razorpay)
categorySchema.virtual('priceInPaise').get(function () {
  return Math.round(this.priceInr * 100);
});

categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
