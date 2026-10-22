const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const registrationRoutes = require('./registrationRoutes');
const paymentRoutes = require('./paymentRoutes');
const eventRoutes = require('./eventRoutes');
const categoryRoutes = require('./categoryRoutes');
const galleryRoutes = require('./galleryRoutes');
const contactRoutes = require('./contactRoutes');
const adminRoutes = require('./adminRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    event: 'Salem Cycle Marathon 2026',
    platform: 'MERN Stack API v1.0'
  });
});

// Mount Routes
router.use('/auth', authRoutes);
router.use('/registration', registrationRoutes);
router.use('/payment', paymentRoutes);
router.use('/event', eventRoutes);
router.use('/categories', categoryRoutes);
router.use('/gallery', galleryRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
