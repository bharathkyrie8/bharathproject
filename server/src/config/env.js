const dotenv = require('dotenv');
const path = require('path');

// Ensure .env is loaded
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cycle_marathon_db',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET || 'cycle_marathon_jwt_secret_dev_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    cookieSecret: process.env.COOKIE_SECRET || 'cookie_secret_salt_marathon_2026'
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || ''
  },
  timezone: process.env.EVENT_TIMEZONE || 'Asia/Kolkata',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'Salem Cycle Marathon <bharathkyrie8@gmail.com>',
    organizerEmail: process.env.ORGANIZER_EMAIL || 'bharathkyrie8@gmail.com',
    brevoApiKey: process.env.BREVO_API_KEY || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    gmailScriptUrl: process.env.GMAIL_SCRIPT_URL || ''
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || ''
  },
  seedAdmin: {
    email: process.env.SEED_ADMIN_EMAIL || 'admin@cyclemarathon.com',
    password: process.env.SEED_ADMIN_PASSWORD || 'AdminSecure2026!'
  },
  upi: {
    id: process.env.UPI_ID || 'bharathkyrie8-1@oksbi',
    payeeName: process.env.UPI_PAYEE_NAME || 'Mr bharath',
    gpayQrUrl: process.env.UPI_GPAY_QR_URL || 'https://res.cloudinary.com/dfbfjvln8/image/upload/v1792601739/ww9sevvqr69fabjnpdow.jpg',
    phonepeQrUrl: process.env.UPI_PHONEPE_QR_URL || 'https://res.cloudinary.com/dfbfjvln8/image/upload/v1792601753/negrs8wd6uvmily2rehq.jpg'
  }
};

module.exports = env;
