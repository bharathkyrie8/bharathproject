const request = require('supertest');
const crypto = require('crypto');
const app = require('../../server');
const { setupTestDB } = require('./testHelper');
const Category = require('../models/Category');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Payment = require('../models/Payment');
const env = require('../config/env');

setupTestDB();

describe('Cycle Marathon API Test Suite', () => {
  let categories = [];
  let adminToken = '';

  beforeAll(async () => {
    categories = await Category.find();
  });

  // ==========================================
  // 1. Health & Event Config
  // ==========================================
  describe('GET /api/v1/health & GET /api/v1/event', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.event).toBe('Salem Cycle Marathon 2026');
    });

    it('should return event configuration and venue details', async () => {
      const res = await request(app).get('/api/v1/event');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isRegistrationOpen).toBe(true);
      expect(res.body.data.expoVenue.name).toContain('Kauvery Hospital');
    });
  });

  // ==========================================
  // 2. Categories & Pricing
  // ==========================================
  describe('GET /api/v1/categories', () => {
    it('should return all 3 active categories with backend-controlled prices', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(3);

      const cat21k = res.body.data.find((c) => c.slug === '21k-timed');
      const cat10k = res.body.data.find((c) => c.slug === '10k-timed');
      const cat5k = res.body.data.find((c) => c.slug === '5k-fun-ride');

      expect(cat21k.priceInr).toBe(699);
      expect(cat21k.minAge).toBe(18);

      expect(cat10k.priceInr).toBe(499);
      expect(cat10k.minAge).toBe(16);

      expect(cat5k.priceInr).toBe(349);
      expect(cat5k.minAge).toBe(12);
    });
  });

  // ==========================================
  // 3. Registration & Age Validation
  // ==========================================
  describe('POST /api/v1/registration/initiate', () => {
    it('should reject registration if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/registration/initiate')
        .send({
          fullName: 'John'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('validation failed');
    });

    it('should reject participant under 18 attempting to register for 21.1 KM (min age 18)', async () => {
      const cat21k = categories.find((c) => c.slug === '21k-timed');

      // Date of birth corresponding to a 15-year old in Oct 2026
      const underAgeDob = '2011-05-15';

      const res = await request(app)
        .post('/api/v1/registration/initiate')
        .send({
          fullName: 'Young Rider',
          email: 'youngrider@example.com',
          phone: '9876543210',
          dob: underAgeDob,
          gender: 'MALE',
          tShirtSize: 'M',
          categoryId: cat21k._id.toString(),
          address: {
            street: '123 Main Road',
            city: 'Salem',
            state: 'Tamil Nadu',
            pincode: '636001'
          },
          emergencyContact: {
            name: 'Parent Name',
            relation: 'Father',
            phone: '9876543211'
          },
          guardian: {
            fullName: 'Parent Name',
            relation: 'Father',
            phone: '9876543211',
            consentGiven: true
          },
          termsAccepted: true,
          medicalDeclarationAccepted: true
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Minimum required age is 18 years');
    });

    it('should reject minor participant under 18 if guardian consent is missing', async () => {
      const cat10k = categories.find((c) => c.slug === '10k-timed');

      // 16 years old
      const minorDob = '2010-04-10';

      const res = await request(app)
        .post('/api/v1/registration/initiate')
        .send({
          fullName: 'Teen Rider',
          email: 'teenrider@example.com',
          phone: '9876543212',
          dob: minorDob,
          gender: 'FEMALE',
          tShirtSize: 'S',
          categoryId: cat10k._id.toString(),
          address: {
            street: '45 Green Avenue',
            city: 'Salem',
            state: 'Tamil Nadu',
            pincode: '636002'
          },
          emergencyContact: {
            name: 'Guardian One',
            relation: 'Mother',
            phone: '9876543213'
          },
          // Missing guardian consent
          termsAccepted: true,
          medicalDeclarationAccepted: true
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('require verified Parent / Guardian consent');
    });

    it('should successfully initiate registration and create payment order for eligible participant', async () => {
      const cat21k = categories.find((c) => c.slug === '21k-timed');

      const adultDob = '1995-08-20'; // ~31 years old

      const res = await request(app)
        .post('/api/v1/registration/initiate')
        .send({
          fullName: 'Karthik Subramanian',
          email: 'karthik.subramanian@example.com',
          phone: '9840123456',
          dob: adultDob,
          gender: 'MALE',
          bloodGroup: 'B+',
          tShirtSize: 'L',
          categoryId: cat21k._id.toString(),
          address: {
            street: '15 Gandhi Road',
            city: 'Salem',
            state: 'Tamil Nadu',
            pincode: '636007'
          },
          emergencyContact: {
            name: 'Deepa Subramanian',
            relation: 'Spouse',
            phone: '9840123457'
          },
          termsAccepted: true,
          medicalDeclarationAccepted: true
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.registrationId).toMatch(/^CYC-2026-/);
      expect(res.body.data.category.priceInr).toBe(699);
      expect(res.body.data.paymentOrder).toBeDefined();
      expect(res.body.data.paymentOrder.orderId).toBeDefined();
      expect(res.body.data.paymentOrder.amount).toBe(69900); // 699 * 100 paise
    });
  });

  // ==========================================
  // 4. Registration Closure & Deadline Enforcement
  // ==========================================
  describe('Registration Closure Enforcement', () => {
    it('should reject new registrations when registration is manually closed', async () => {
      // Close registration manually
      await Event.findOneAndUpdate({}, { isRegistrationOpenManually: false, manualClosureReason: 'Registration slots fully booked' });

      const cat10k = categories.find((c) => c.slug === '10k-timed');

      const res = await request(app)
        .post('/api/v1/registration/initiate')
        .send({
          fullName: 'Late Rider',
          email: 'laterider@example.com',
          phone: '9988776655',
          dob: '1992-01-01',
          gender: 'MALE',
          tShirtSize: 'M',
          categoryId: cat10k._id.toString(),
          address: {
            street: 'Salem Bypass',
            city: 'Salem',
            state: 'Tamil Nadu',
            pincode: '636004'
          },
          emergencyContact: {
            name: 'Contact',
            relation: 'Friend',
            phone: '9988776654'
          },
          termsAccepted: true,
          medicalDeclarationAccepted: true
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.code).toBe('REGISTRATION_CLOSED');
      expect(res.body.message).toContain('fully booked');

      // Re-open for remaining tests
      await Event.findOneAndUpdate({}, { isRegistrationOpenManually: true });
    });
  });

  // ==========================================
  // 5. Payment Verification & Confirmation
  // ==========================================
  describe('POST /api/v1/payment/verify', () => {
    it('should verify valid payment and confirm registration', async () => {
      const cat5k = categories.find((c) => c.slug === '5k-fun-ride');

      // Initiate registration
      const initRes = await request(app)
        .post('/api/v1/registration/initiate')
        .send({
          fullName: 'Ananya Ramesh',
          email: 'ananya.ramesh@example.com',
          phone: '9876501234',
          dob: '2000-03-15',
          gender: 'FEMALE',
          tShirtSize: 'M',
          categoryId: cat5k._id.toString(),
          address: {
            street: '22 Cherry Road',
            city: 'Salem',
            state: 'Tamil Nadu',
            pincode: '636001'
          },
          emergencyContact: {
            name: 'Ramesh',
            relation: 'Father',
            phone: '9876501235'
          },
          termsAccepted: true,
          medicalDeclarationAccepted: true
        });

      const orderId = initRes.body.data.paymentOrder.orderId;
      const paymentId = 'pay_test_' + Date.now();

      // In dev test mode without real secret, verifyPaymentSignature accepts valid mock orders
      const verifyRes = await request(app)
        .post('/api/v1/payment/verify')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: 'valid_mock_signature',
          method: 'upi'
        });

      expect(verifyRes.statusCode).toBe(200);
      expect(verifyRes.body.success).toBe(true);
      expect(verifyRes.body.data.status).toBe('CONFIRMED');
      expect(verifyRes.body.data.registrationId).toBe(initRes.body.data.registrationId);

      // Verify DB record
      const reg = await Registration.findOne({ registrationId: initRes.body.data.registrationId });
      expect(reg.status).toBe('CONFIRMED');
      expect(reg.confirmedAt).toBeDefined();

      const payment = await Payment.findOne({ razorpayOrderId: orderId });
      expect(payment.status).toBe('CAPTURED');
      expect(payment.razorpayPaymentId).toBe(paymentId);
    });

    it('should reject duplicate confirmed registrations for the same user in same category', async () => {
      const cat5k = categories.find((c) => c.slug === '5k-fun-ride');

      // Ananya Ramesh is already confirmed for 5K from the previous test
      const res = await request(app)
        .post('/api/v1/registration/initiate')
        .send({
          fullName: 'Ananya Ramesh Duplicate',
          email: 'ananya.ramesh@example.com', // same email
          phone: '9876501234',
          dob: '2000-03-15',
          gender: 'FEMALE',
          tShirtSize: 'M',
          categoryId: cat5k._id.toString(),
          address: {
            street: '22 Cherry Road',
            city: 'Salem',
            state: 'Tamil Nadu',
            pincode: '636001'
          },
          emergencyContact: {
            name: 'Ramesh',
            relation: 'Father',
            phone: '9876501235'
          },
          termsAccepted: true,
          medicalDeclarationAccepted: true
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
  });

  // ==========================================
  // 6. Admin Authentication & Dashboard
  // ==========================================
  describe('Admin Auth & Protected Endpoints', () => {
    it('should reject login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: 'admin@test.com',
          password: 'WrongPassword!'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should login successfully with valid credentials and return JWT', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: 'admin@test.com',
          password: 'AdminPassword123!'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.headers['set-cookie']).toBeDefined();

      adminToken = res.body.token;
    });

    it('should reject unauthorized access to admin dashboard without token', async () => {
      const res = await request(app).get('/api/v1/admin/dashboard');
      expect(res.statusCode).toBe(401);
    });

    it('should return dashboard statistics when authenticated', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary.totalRegistrations).toBeGreaterThanOrEqual(1);
      expect(res.body.data.summary.confirmedRegistrations).toBeGreaterThanOrEqual(1);
    });

    it('should export participants in CSV format with UTF-8 BOM', async () => {
      const res = await request(app)
        .get('/api/v1/admin/export-csv')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text.startsWith('\uFEFF')).toBe(true); // UTF-8 BOM check
      expect(res.text).toContain('Registration ID');
      expect(res.text).toContain('Ananya Ramesh');
    });
  });
});
