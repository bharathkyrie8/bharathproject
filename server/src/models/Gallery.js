const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Image title is required'],
      trim: true
    },
    caption: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['CYCLING', 'EXPO', 'FLAG_OFF', 'FINISH_LINE', 'PODIUM', 'ROUTE'],
      default: 'CYCLING'
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true
    },
    thumbnailUrl: {
      type: String,
      trim: true
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
