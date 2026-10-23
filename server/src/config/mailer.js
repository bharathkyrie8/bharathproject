const nodemailer = require('nodemailer');
const env = require('./env');

let transporter = null;

const getTransporter = async () => {
  if (transporter) {
    return transporter;
  }

  const { host, port, user, pass } = env.smtp;
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
          host: host || 'smtp.gmail.com',
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
    // Fallback console logger when no credentials provided
    console.warn('[Mailer] SMTP credentials not provided. Emails will be logged to console in dev mode.');
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('---------------- [EMAIL CONSOLE LOG] ----------------');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Text preview: ${(mailOptions.text || mailOptions.html || '').substring(0, 150)}...`);
        console.log('-----------------------------------------------------');
        return { messageId: `mock-email-${Date.now()}` };
      }
    };
  }

  return transporter;
};

/**
 * Universal safe email dispatcher
 * Supports:
 * 1. Google Apps Script Webhook (Port 443 HTTPS - Free, uses personal Gmail, Render free tier compatible)
 * 2. Brevo HTTPS API (Port 443 HTTPS - Free 300/day, Render free tier compatible)
 * 3. Resend HTTPS API (Port 443 HTTPS - Free 100/day, Render free tier compatible)
 * 4. Nodemailer SMTP (Default fallback for local development or paid instances)
 */
const sendMailSafe = async ({ from, to, replyTo, subject, html, text }) => {
  const fromAddress = from || env.smtp.from || 'Salem Cycle Marathon <bharathkyrie8@gmail.com>';
  const fromEmail = env.smtp.user || 'bharathkyrie8@gmail.com';
  const scriptUrl = process.env.GMAIL_SCRIPT_URL || env.smtp.gmailScriptUrl;
  const brevoKey = process.env.BREVO_API_KEY || env.smtp.brevoApiKey;
  const resendKey = process.env.RESEND_API_KEY || env.smtp.resendApiKey;

  // 1. Google Apps Script Webhook (HTTPS 443 - zero block on Render free tier)
  if (scriptUrl) {
    try {
      console.log(`[Mailer:GAS] Dispatching email to ${to} via Google Apps Script Webhook...`);
      const response = await fetch(scriptUrl, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          html,
          text: text || '',
          replyTo: replyTo || fromEmail,
          fromName: 'Salem Cycle Marathon 2026'
        }),
        signal: AbortSignal.timeout(12000)
      });
      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { response: rawText };
      }
      console.log(`[Mailer:GAS] Sent successfully to ${to}:`, data);
      return { success: true, method: 'google_apps_script', data };
    } catch (err) {
      console.warn(`[Mailer:GAS] Webhook dispatch warning: ${err.message}. Falling back...`);
    }
  }

  // 2. Brevo HTTPS REST API (Port 443 - zero block on Render free tier)
  if (brevoKey) {
    try {
      console.log(`[Mailer:Brevo] Dispatching email to ${to} via Brevo REST API...`);
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Salem Cycle Marathon', email: fromEmail },
          to: [{ email: to }],
          replyTo: replyTo ? { email: replyTo } : { email: fromEmail },
          subject,
          htmlContent: html
        }),
        signal: AbortSignal.timeout(12000)
      });
      const data = await response.json();
      console.log(`[Mailer:Brevo] Sent successfully to ${to}:`, data);
      return { success: true, method: 'brevo_api', data };
    } catch (err) {
      console.warn(`[Mailer:Brevo] Brevo dispatch warning: ${err.message}. Falling back...`);
    }
  }

  // 3. Resend HTTPS REST API (Port 443 - zero block on Render free tier)
  if (resendKey) {
    try {
      console.log(`[Mailer:Resend] Dispatching email to ${to} via Resend REST API...`);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddress.includes('<') ? fromAddress : `Salem Cycle Marathon <${fromAddress}>`,
          to: [to],
          reply_to: replyTo,
          subject,
          html
        }),
        signal: AbortSignal.timeout(12000)
      });
      const data = await response.json();
      console.log(`[Mailer:Resend] Sent successfully to ${to}:`, data);
      return { success: true, method: 'resend_api', data };
    } catch (err) {
      console.warn(`[Mailer:Resend] Resend dispatch warning: ${err.message}. Falling back...`);
    }
  }

  // 4. Default: Standard Nodemailer SMTP
  const mailerTransporter = await getTransporter();
  console.log(`[Mailer:SMTP] Dispatching email to ${to}...`);
  const info = await mailerTransporter.sendMail({
    from: fromAddress,
    to,
    replyTo,
    subject,
    html,
    text
  });
  console.log(`[Mailer:SMTP] Sent successfully to ${to} (Message ID: ${info.messageId || 'OK'})`);
  return info;
};

module.exports = { getTransporter, sendMailSafe };
