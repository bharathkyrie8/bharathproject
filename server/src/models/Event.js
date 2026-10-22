const mongoose = require('mongoose');

const scheduleItemSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String }
  },
  { _id: false }
);

const benefitItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    iconKey: { type: String, default: 'award' },
    isConfirmed: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false }
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Salem Cycle Marathon 2026',
      required: true
    },
    tagline: {
      type: String,
      default: 'Pedal for Health, Ride for Glory!'
    },
    description: {
      type: String,
      default: 'Join thousands of cycling enthusiasts and athletes at the annual Salem Cycle Marathon. Experience scenic routes, high-energy vibes, and premier endurance cycling.'
    },
    eventDate: {
      type: Date,
      default: () => new Date('2026-10-30T05:30:00+05:30'),
      required: true
    },
    registrationDeadline: {
      type: Date,
      default: () => new Date('2026-10-25T23:00:00+05:30'),
      required: true
    },
    isRegistrationOpenManually: {
      type: Boolean,
      default: true
    },
    manualClosureReason: {
      type: String,
      default: ''
    },
    expoVenue: {
      name: {
        type: String,
        default: 'Kauvery Hospital, Salem'
      },
      addressLine: {
        type: String,
        default: '#9/50, Trichy Main Road, Opp. Chandra Mahal, MGR Nagar, Seelanaickenpatti'
      },
      city: {
        type: String,
        default: 'Salem'
      },
      state: {
        type: String,
        default: 'Tamil Nadu'
      },
      pincode: {
        type: String,
        default: '636201'
      },
      mapsUrl: {
        type: String,
        default: 'https://maps.app.goo.gl/TSxqXnA53sUKqdsv9'
      },
      mapsEmbedUrl: {
        type: String,
        default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.8288593444985!2d78.14660857493722!3d11.635832788570387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf1b1319c5c7d%3A0x6002f5a6538d338f!2sKauvery%20Hospital%20Salem!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
      }
    },
    expoDates: {
      startDate: { type: Date, default: () => new Date('2026-10-28T09:00:00+05:30') },
      endDate: { type: Date, default: () => new Date('2026-10-29T18:00:00+05:30') },
      timingsNote: { type: String, default: '9:00 AM to 6:00 PM IST (Bib & Timing Chip Distribution)' }
    },
    raceDaySchedule: {
      type: [scheduleItemSchema],
      default: [
        { time: '04:30 AM', title: 'Assembly & Warm-up', description: 'Holding area opens, light warm-up and technical bicycle inspection' },
        { time: '05:30 AM', title: '21.1 KM Flag Off', description: 'Timed competitive cycling ride' },
        { time: '06:00 AM', title: '10 KM Flag Off', description: 'Timed challenge ride' },
        { time: '06:30 AM', title: '5 KM Community Ride Flag Off', description: 'Non-timed open fun ride' },
        { time: '08:30 AM', title: 'Breakfast & Refreshments', description: 'Nutritious breakfast at finish village' },
        { time: '09:30 AM', title: 'Podium & Awards Ceremony', description: 'Prize distribution for category winners' }
      ]
    },
    benefits: {
      type: [benefitItemSchema],
      default: [
        { id: 'timing-chip', name: 'Timing Chip', description: 'Electronic RFID timing tag for precise split and finish results', iconKey: 'timer', isConfirmed: true, isPublished: true },
        { id: 'e-certificate', name: 'E-Certificate', description: 'Official downloadable finisher certificate with verified chip timing', iconKey: 'award', isConfirmed: true, isPublished: true },
        { id: 'breakfast', name: 'Hot Breakfast', description: 'Nutritious post-ride recovery meal and electrolyte hydration', iconKey: 'utensils', isConfirmed: true, isPublished: true },
        { id: 't-shirt', name: 'Dry-Fit Cycling Jersey / T-Shirt', description: 'Premium quick-dry marathon event jersey', iconKey: 'shirt', isConfirmed: true, isPublished: true },
        { id: 'goodie-bag', name: 'Goodie Bag', description: 'Marathon kit bag with sponsor vouchers and cycling essentials', iconKey: 'gift', isConfirmed: true, isPublished: true },
        { id: 'finisher-medal', name: 'Finisher Medal', description: 'Exclusive custom-cast metallic finisher medal for all course finishers', iconKey: 'medal', isConfirmed: true, isPublished: true }
      ]
    },
    organizerContact: {
      email: { type: String, default: 'info@cyclemarathon.com' },
      phone: { type: String, default: '+91 98765 43210' },
      whatsapp: { type: String, default: '+91 98765 43210' },
      supportHours: { type: String, default: 'Monday to Saturday, 9:00 AM - 6:00 PM IST' }
    }
  },
  {
    timestamps: true
  }
);

// Method to determine if registration is currently open
eventSchema.methods.isRegistrationOpen = function () {
  if (!this.isRegistrationOpenManually) {
    return {
      isOpen: false,
      reason: this.manualClosureReason || 'Registration has been closed by the event administrators.'
    };
  }

  const now = new Date();
  if (now > this.registrationDeadline) {
    return {
      isOpen: false,
      reason: `Registration closed on 25 October 2026 at 11:00 PM IST.`
    };
  }

  return { isOpen: true, reason: null };
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
