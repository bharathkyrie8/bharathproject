const nodemailer = require('nodemailer');
const env = require('./env');

let transporter = null;

const getTransporter = async () => {
  if (transporter) {
    return transporter;
  }

  const { host, port, user, pass } = env.smtp;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
    console.log(`[Mailer] Initialized SMTP transporter for host: ${host}`);
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
