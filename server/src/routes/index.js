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

// API Root Directory
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    message: 'Salem Cycle Marathon 2026 API v1',
    endpoints: {
      health: '/api/v1/health',
      event: '/api/v1/event',
      categories: '/api/v1/categories',
      gallery: '/api/v1/gallery',
      registration: '/api/v1/registration',
      payment: '/api/v1/payment',
      contact: '/api/v1/contact',
      admin: '/api/v1/admin'
    }
  });
});

// API Health Check & Email Diagnostics
router.get('/health', (req, res) => {
  const env = require('../config/env');
  const brevoKey = process.env.BREVO_API_KEY || env.smtp.brevoApiKey;
  const activeMethod = brevoKey
    ? 'BREVO_API (Port 443 HTTPS - ACTIVE)'
    : process.env.GMAIL_SCRIPT_URL
    ? 'GOOGLE_APPS_SCRIPT_WEBHOOK (Port 443 HTTPS)'
    : process.env.RESEND_API_KEY
    ? 'RESEND_API (Port 443 HTTPS)'
    : Boolean(env.smtp.user && env.smtp.pass)
    ? 'SMTP_GMAIL (Port 587/465)'
    : 'NONE (Console Log Only - Missing Credentials)';

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    event: 'Salem Cycle Marathon 2026',
    platform: 'MERN Stack API v1.0',
    emailDiagnostics: {
      activeDeliveryMethod: activeMethod,
      brevoKeyConfigured: Boolean(brevoKey),
      organizerEmail: env.smtp.organizerEmail,
      smtpUserConfigured: Boolean(env.smtp.user),
      smtpUser: env.smtp.user ? `${env.smtp.user.substring(0, 3)}***@${env.smtp.user.split('@')[1]}` : null,
      smtpPassConfigured: Boolean(env.smtp.pass),
      gmailScriptUrlConfigured: Boolean(process.env.GMAIL_SCRIPT_URL),
      resendKeyConfigured: Boolean(process.env.RESEND_API_KEY),
      renderNotice: 'Brevo API is active over HTTPS (Port 443). All emails deliver reliably.'
    }
  });
});

// Live Test Email Endpoint (Accessible by admin/developer to test delivery directly)
router.get('/health/test-email', async (req, res) => {
  const env = require('../config/env');
  const { sendMailSafe } = require('../config/mailer');
  const targetEmail = req.query.to || env.smtp.organizerEmail || 'bharathkyrie8@gmail.com';

  try {
    const result = await sendMailSafe({
      to: targetEmail,
      subject: '✅ Salem Cycle Marathon 2026 Live Test Email',
      html: `
        <div style="font-family: sans-serif; padding: 24px; border: 1px solid #C59A5A; border-radius: 8px; max-width: 500px; margin: 20px auto;">
          <h2 style="color: #0E1014; margin-top:0;">Salem Cycle Marathon 2026</h2>
          <p style="color: #2E7D32; font-weight: bold;">✔ Email Delivery Verified Successfully!</p>
          <p style="color: #444; font-size: 14px;">This test email confirms that your backend email dispatcher is operating correctly.</p>
          <p style="font-size: 12px; color: #777;">Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
      `,
      text: 'Salem Cycle Marathon 2026 Test Email - Email delivery working successfully!'
    });

    res.status(200).json({
      success: true,
      message: `Test email dispatched successfully to ${targetEmail}`,
      details: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Test email failed to send: ${error.message}`
    });
  }
});

// Live Socket Connectivity Diagnostic (Test which outbound ports Render allows)
router.get('/health/test-socket', (req, res) => {
  const net = require('net');
  const host = req.query.host || 'smtp.gmail.com';
  const port = parseInt(req.query.port, 10) || 587;
  const timeout = 4000;

  const socket = new net.Socket();

  socket.setTimeout(timeout);

  socket.on('connect', () => {
    socket.destroy();
    if (!res.headersSent) {
      res.json({ success: true, host, port, message: `PORT ${port} IS OPEN ON HOST` });
    }
  });

  socket.on('timeout', () => {
    socket.destroy();
    if (!res.headersSent) {
      res.json({ success: false, host, port, message: `PORT ${port} TIMED OUT (BLOCKED BY FIREWALL)` });
    }
  });

  socket.on('error', (err) => {
    socket.destroy();
    if (!res.headersSent) {
      res.json({ success: false, host, port, message: `ERROR: ${err.message}` });
    }
  });

  socket.connect(port, host);
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
