const nodemailer = require('nodemailer');
const env = require('./env');

let transporter = null;

const getTransporter = async () => {
  if (transporter) {
    return transporter;
  }

  const isGmail = (host && host.toLowerCase().includes('gmail')) || (user && user.toLowerCase().includes('@gmail.com'));

  if ((host || isGmail) && user && pass) {
    const transportConfig = isGmail
      ? {
          service: 'gmail',
          auth: { user, pass },
          connectionTimeout: 10000,
          greetingTimeout: 5000,
          socketTimeout: 15000,
          tls: { rejectUnauthorized: false }
        }
      : {
          host,
          port: Number(port) || 587,
          secure: Number(port) === 465,
          auth: { user, pass },
          connectionTimeout: 10000,
          greetingTimeout: 5000,
          socketTimeout: 15000,
          tls: { rejectUnauthorized: false }
        };

    transporter = nodemailer.createTransport(transportConfig);
    console.log(`[Mailer] Initialized SMTP transporter for: ${isGmail ? 'Gmail Service' : host}`);
  } else {
    // Development fallback mock
    console.warn('[Mailer] SMTP credentials not provided. Emails will be logged to console in dev mode.');
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('---------------- [DEV EMAIL SENT] ----------------');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Text preview: ${(mailOptions.text || '').substring(0, 150)}...`);
        console.log('--------------------------------------------------');
        return { messageId: `mock-email-${Date.now()}` };
      }
    };
  }

  return transporter;
};

module.exports = { getTransporter };
