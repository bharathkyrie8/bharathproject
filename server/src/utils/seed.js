const mongoose = require('mongoose');
const env = require('../config/env');
const Admin = require('../models/Admin');
const Event = require('../models/Event');
const Category = require('../models/Category');
const Gallery = require('../models/Gallery');

const seedData = async () => {
  try {
    console.log('[Seeder] Connecting to MongoDB...');
    await mongoose.connect(env.mongodbUri);
    console.log('[Seeder] Connected successfully.');

    // 1. Seed or Update Event Configuration
    console.log('[Seeder] Seeding Event Configuration...');
    const existingEvent = await Event.findOne();
    if (!existingEvent) {
      await Event.create({
        title: 'Salem Cycle Marathon 2026',
        tagline: 'Pedal for Health, Ride for Glory!',
        description: 'Salem’s most anticipated cycling marathon brings together amateur riders, cycling enthusiasts, and seasoned endurance athletes.',
        eventDate: new Date('2026-10-30T05:30:00+05:30'),
        registrationDeadline: new Date('2026-10-25T23:00:00+05:30'),
        isRegistrationOpenManually: true,
        expoVenue: {
          name: 'Kauvery Hospital, Salem',
          addressLine: '#9/50, Trichy Main Road, Opp. Chandra Mahal, MGR Nagar, Seelanaickenpatti',
          city: 'Salem',
          state: 'Tamil Nadu',
          pincode: '636201',
          mapsUrl: 'https://maps.app.goo.gl/TSxqXnA53sUKqdsv9',
          mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.8288593444985!2d78.14660857493722!3d11.635832788570387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf1b1319c5c7d%3A0x6002f5a6538d338f!2sKauvery%20Hospital%20Salem!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
        },
        expoDates: {
          startDate: new Date('2026-10-28T09:00:00+05:30'),
          endDate: new Date('2026-10-29T18:00:00+05:30'),
          timingsNote: '9:00 AM to 6:00 PM IST (Bib & Timing Chip Distribution)'
        },
        raceDaySchedule: [
          { time: '04:30 AM', title: 'Assembly & Warm-up', description: 'Holding area opens, light warm-up and technical bicycle inspection', location: 'Kauvery Hospital Salem Arena' },
          { time: '05:30 AM', title: '21.1 KM Flag Off', description: 'Timed competitive cycling ride', location: 'Main Arch' },
          { time: '06:00 AM', title: '10 KM Flag Off', description: 'Timed challenge ride', location: 'Main Arch' },
          { time: '06:30 AM', title: '5 KM Community Ride Flag Off', description: 'Non-timed open fun ride', location: 'Main Arch' },
          { time: '08:30 AM', title: 'Breakfast & Refreshments', description: 'Nutritious breakfast at finish village', location: 'Recovery Zone' },
          { time: '09:30 AM', title: 'Podium & Awards Ceremony', description: 'Prize distribution for category winners', location: 'Main Stage' }
        ],
        benefits: [
          { id: 'timing-chip', name: 'Timing Chip', description: 'Electronic RFID timing tag for precise split and finish results', iconKey: 'timer', isConfirmed: true, isPublished: true },
          { id: 'e-certificate', name: 'E-Certificate', description: 'Official downloadable finisher certificate with verified chip timing', iconKey: 'award', isConfirmed: true, isPublished: true },
          { id: 'breakfast', name: 'Hot Breakfast', description: 'Nutritious post-ride recovery meal and electrolyte hydration', iconKey: 'utensils', isConfirmed: true, isPublished: true },
          { id: 't-shirt', name: 'Dry-Fit Cycling Jersey / T-Shirt', description: 'Premium quick-dry marathon event jersey', iconKey: 'shirt', isConfirmed: true, isPublished: true },
          { id: 'goodie-bag', name: 'Goodie Bag', description: 'Marathon kit bag with sponsor vouchers and cycling essentials', iconKey: 'gift', isConfirmed: true, isPublished: true },
          { id: 'finisher-medal', name: 'Finisher Medal', description: 'Exclusive custom-cast metallic finisher medal for all course finishers', iconKey: 'medal', isConfirmed: true, isPublished: true }
        ],
        organizerContact: {
          email: 'info@cyclemarathon.com',
          phone: '+91 98765 43210',
          whatsapp: '+91 98765 43210',
          supportHours: 'Monday to Saturday, 9:00 AM - 6:00 PM IST'
        }
      });
      console.log('✓ Event configuration seeded.');
    } else {
      console.log('• Event configuration already exists.');
    }

    // 2. Seed Official Categories
    console.log('[Seeder] Seeding Categories...');
    const categoriesToSeed = [
      {
        name: '21.1 KM — Half Marathon / Timed Ride',
        slug: '21k-timed',
        distanceKm: 21.1,
        timingType: 'TIMED',
        activityType: 'CYCLING',
        priceInr: 699,
        minAge: 18,
        maxAge: 80,
        requiresGuardianConsentIfUnder18: false,
        description: 'Premier endurance challenge designed for seasoned riders and competitive cycling athletes. Includes timing chip and leaderboard ranking.',
        benefitsIncluded: ['Timing Chip', 'Finisher Medal', 'Event Jersey', 'E-Certificate', 'Breakfast', 'Goodie Bag'],
        maxCapacity: 1000,
        displayOrder: 1,
        isActive: true
      },
      {
        name: '10 KM — Challenge Ride / Timed',
        slug: '10k-timed',
        distanceKm: 10.0,
        timingType: 'TIMED',
        activityType: 'CYCLING',
        priceInr: 499,
        minAge: 16,
        maxAge: 80,
        requiresGuardianConsentIfUnder18: true,
        description: 'Ideal for fitness enthusiasts and intermediate cyclists looking to test their pacing and endurance.',
        benefitsIncluded: ['Timing Chip', 'Finisher Medal', 'Event T-Shirt', 'E-Certificate', 'Breakfast', 'Goodie Bag'],
        maxCapacity: 1500,
        displayOrder: 2,
        isActive: true
      },
      {
        name: '5 KM — Community Fun Ride',
        slug: '5k-fun-ride',
        distanceKm: 5.0,
        timingType: 'NON_TIMED',
        activityType: 'CYCLING',
        priceInr: 349,
        minAge: 12,
        maxAge: 90,
        requiresGuardianConsentIfUnder18: true,
        description: 'Non-timed open ride for families, beginners, and young champions. Promote green mobility and healthy living.',
        benefitsIncluded: ['Finisher Medal', 'Event T-Shirt', 'Participation Certificate', 'Breakfast', 'Goodie Bag'],
        maxCapacity: 2500,
        displayOrder: 3,
        isActive: true
      }
    ];

    for (const cat of categoriesToSeed) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
    }
    console.log('✓ All 3 official categories seeded/verified (21.1KM @ ₹699, 10KM @ ₹499, 5KM @ ₹349).');

    // 3. Seed Default Superadmin
    console.log('[Seeder] Seeding Admin Account...');
    const adminEmail = env.seedAdmin.email.toLowerCase();
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({
        username: 'superadmin',
        email: adminEmail,
        password: env.seedAdmin.password,
        role: 'superadmin',
        isActive: true
      });
      console.log(`✓ Superadmin account created: ${adminEmail} (password: ${env.seedAdmin.password})`);
    } else {
      console.log(`• Admin account already exists: ${adminEmail}`);
    }

    // 4. Seed Cycling Gallery Showcase
    console.log('[Seeder] Seeding Sample Gallery Showcase...');
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.insertMany([
        {
          title: 'Peloton Dawn Flag Off',
          caption: 'Elite cyclists charging into the morning breeze along Salem scenic highways',
          category: 'FLAG_OFF',
          imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
          displayOrder: 1,
          isPublished: true
        },
        {
          title: 'Endurance on the Highway',
          caption: 'Pedaling past the picturesque backdrop of the Shevaroy Hills',
          category: 'CYCLING',
          imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80',
          displayOrder: 2,
          isPublished: true
        },
        {
          title: 'Bib & Kit Expo Collection',
          caption: 'Participants receiving custom event jerseys and RFID timing chips at Kauvery Hospital Expo',
          category: 'EXPO',
          imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80',
          displayOrder: 3,
          isPublished: true
        },
        {
          title: 'Finisher Celebrations',
          caption: 'Joy and pride at the finish line with custom Salem Cycle Marathon medals',
          category: 'PODIUM',
          imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=400&q=80',
          displayOrder: 4,
          isPublished: true
        }
      ]);
      console.log('✓ Gallery images seeded.');
    }

    console.log('\n======================================================');
    console.log('   🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
