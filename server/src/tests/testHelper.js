const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Event = require('../models/Event');
const Admin = require('../models/Admin');

let mongod = null;

const setupTestDB = () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    // Seed test categories
    await Category.create([
      {
        name: '21.1 KM — Half Marathon / Timed Ride',
        slug: '21k-timed',
        distanceKm: 21.1,
        timingType: 'TIMED',
        activityType: 'CYCLING',
        priceInr: 699,
        minAge: 18,
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
        isActive: true
      }
    ]);

    // Seed test event config
    await Event.create({
      title: 'Salem Cycle Marathon 2026 Test',
      eventDate: new Date('2026-10-30T05:30:00+05:30'),
      registrationDeadline: new Date('2026-10-25T23:00:00+05:30'),
      isRegistrationOpenManually: true
    });

    // Seed test admin
    await Admin.create({
      username: 'testadmin',
      email: 'admin@test.com',
      password: 'AdminPassword123!',
      role: 'superadmin',
      isActive: true
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  });
};

module.exports = { setupTestDB };
