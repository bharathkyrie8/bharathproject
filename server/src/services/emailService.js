const { getTransporter } = require('../config/mailer');
const env = require('../config/env');
const { formatIST } = require('../utils/timeUtils');

/**
 * Sends a registration confirmation and receipt email to the participant
 */
const sendRegistrationConfirmationEmail = async ({ registration, payment, event }) => {
  try {
    const transporter = await getTransporter();
    const p = registration.participant;
    const c = registration.categorySnapshot;
    const venue = (event && event.expoVenue) || {
      name: 'Kauvery Hospital, Salem',
      addressLine: '#9/50, Trichy Main Road, Opp. Chandra Mahal, MGR Nagar, Seelanaickenpatti, Salem',
      mapsUrl: 'https://maps.app.goo.gl/TSxqXnA53sUKqdsv9'
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #FAF7F2; color: #1D1E20; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid rgba(29,30,32,0.1); border-radius: 8px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
          .header { background: #0E1014; padding: 36px 24px; text-align: center; color: #FFFFFF; border-bottom: 2px solid #C59A5A; }
          .header h1 { margin: 0; font-family: Georgia, serif; font-size: 22px; letter-spacing: 2px; }
          .header p { margin: 6px 0 0; color: #C59A5A; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
          .badge { display: inline-block; background: #1B6A50; color: #ffffff; padding: 5px 14px; border-radius: 20px; font-weight: bold; font-size: 12px; margin-top: 14px; letter-spacing: 0.5px; }
          .content { padding: 30px 24px; }
          .card { background: #FAF7F2; border: 1px solid rgba(29,30,32,0.08); border-radius: 6px; padding: 18px 20px; margin-bottom: 20px; }
          .title { font-size: 14px; font-weight: bold; color: #8C6830; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid rgba(29,30,32,0.08); padding-bottom: 6px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13.5px; }
          .label { color: #64666B; }
          .val { font-weight: 600; color: #1D1E20; }
          .alert { background: #F3EFE8; border-left: 3px solid #C59A5A; padding: 14px 16px; border-radius: 4px; font-size: 13px; line-height: 1.6; margin-bottom: 20px; color: #444; }
          .footer { text-align: center; padding: 24px; font-size: 12px; color: #888; background: #FAF7F2; border-top: 1px solid rgba(29,30,32,0.06); }
          a { color: #8C6830; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SALEM CYCLE MARATHON 2026</h1>
            <p>Kauvery Hospital Salem • Official Pass</p>
            <div class="badge">REGISTRATION & PAYMENT CONFIRMED</div>
          </div>
          <div class="content">
            <p>Dear <strong>${p.fullName}</strong>,</p>
            <p>Congratulations! Your entry for the <strong>Salem Cycle Marathon 2026</strong> has been officially confirmed and verified.</p>
            
            <div class="card">
              <div class="title">Rider & Category Pass</div>
              <div class="row"><span class="label">Registration ID:</span> <span class="val" style="color:#C59A5A; font-family:monospace; font-size:15px;">${registration.registrationId}</span></div>
              <div class="row"><span class="label">Category:</span> <span class="val">${c.name} (${c.distanceKm} KM)</span></div>
              <div class="row"><span class="label">Timing Type:</span> <span class="val">${c.timingType === 'TIMED' ? 'Official RFID Timed' : 'Open Community Ride'}</span></div>
              <div class="row"><span class="label">Event Jersey Size:</span> <span class="val">${p.tShirtSize}</span></div>
              <div class="row"><span class="label">Blood Group:</span> <span class="val">${p.bloodGroup || 'Recorded'}</span></div>
            </div>

            <div class="card">
              <div class="title">Payment Receipt</div>
              <div class="row"><span class="label">Amount Paid:</span> <span class="val">₹${registration.amountDueInr} (Inclusive of GST)</span></div>
              <div class="row"><span class="label">Payment Mode:</span> <span class="val">${payment.method || 'Direct UPI'}</span></div>
              <div class="row"><span class="label">Transaction Ref:</span> <span class="val" style="font-family:monospace;">${payment.upiReferenceNumber || payment.razorpayPaymentId || 'VERIFIED'}</span></div>
              <div class="row"><span class="label">Status:</span> <span class="val" style="color:#1B6A50;">SETTLED & CONFIRMED</span></div>
            </div>

            <div class="card">
              <div class="title">Bib Collection & Kit Expo</div>
              <p style="margin: 0 0 6px; font-size: 13.5px;"><strong>Venue:</strong> ${venue.name}</p>
              <p style="margin: 0 0 8px; font-size: 13px; color:#555;">${venue.addressLine}</p>
              <p style="margin: 0 0 10px; font-size: 13px;">
                <a href="${venue.mapsUrl}" target="_blank">Open Venue in Google Maps →</a>
              </p>
              <p style="margin: 0; font-size: 13px; color:#666;"><strong>Dates:</strong> 28 & 29 October 2026 (10:00 AM – 06:00 PM IST)</p>
            </div>

            <div class="alert">
              <strong>Race Morning Briefing (30 October 2026):</strong><br/>
              • Bicycle helmets are <strong>strictly mandatory</strong> for all participants.<br/>
              • Reporting & cycle inspection opens at <strong>04:30 AM IST</strong> at Kauvery Hospital arena.<br/>
              • Please present this confirmation voucher on your phone or printed for bib verification.
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 4px; font-weight: 600; color: #1D1E20;">Salem Cycle Marathon 2026 Organizing Committee</p>
            <p style="margin: 0;">Venue Host: Kauvery Hospital Salem • Support: ${env.smtp.organizerEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: env.smtp.from,
      to: p.email,
      subject: `[CONFIRMED] Salem Cycle Marathon 2026 Pass: ${registration.registrationId}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Confirmation email dispatched to ${p.email} (MessageId: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`[EmailService] Failed to send confirmation email:`, error.message);
  }
};

/**
 * Sends a distinct, professional executive alert email to event organizers (bharathkyrie8@gmail.com)
 */
const sendOrganizerContactAlert = async ({ contactMessage }) => {
  try {
    const transporter = await getTransporter();
    const refId = contactMessage._id ? contactMessage._id.toString().slice(-6).toUpperCase() : 'NEW';
    const submittedTime = new Date(contactMessage.createdAt || Date.now()).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const cleanPhone = (contactMessage.phone || '').replace(/[^0-9]/g, '');
    const waLink = cleanPhone ? `https://wa.me/91${cleanPhone.slice(-10)}` : null;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0A0C10; color: #E2E8F0; margin: 0; padding: 24px 16px; }
          .container { max-width: 620px; margin: 0 auto; background: #131720; border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
          .header { background: #0E1014; border-bottom: 2px solid #C59A5A; padding: 28px 24px; text-align: left; }
          .badge { display: inline-block; background: #C85A32; color: #FFF; font-size: 11px; font-weight: 700; letter-spacing: 1px; padding: 4px 10px; border-radius: 3px; text-transform: uppercase; margin-bottom: 8px; }
          .title { margin: 0; font-size: 20px; color: #FFF; font-family: Georgia, serif; }
          .sub { margin: 4px 0 0; font-size: 12px; color: #A0A4AE; }
          .body { padding: 28px 24px; }
          .dossier-card { background: #1A1F2B; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 20px; margin-bottom: 24px; }
          .row { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 9px 0; font-size: 13.5px; }
          .row:last-child { border-bottom: none; }
          .field { color: #8E929B; text-transform: uppercase; font-size: 11px; letter-spacing: 0.8px; font-weight: 600; }
          .val { color: #FFF; font-weight: 600; text-align: right; }
          .msg-box { background: #0E1014; border: 1px solid #C59A5A; border-left: 4px solid #C59A5A; border-radius: 4px; padding: 18px; margin-bottom: 24px; }
          .msg-title { font-size: 11px; color: #C59A5A; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 8px; }
          .msg-content { color: #F0F2F6; font-size: 14px; line-height: 1.65; white-space: pre-wrap; }
          .action-bar { display: flex; gap: 12px; margin-top: 24px; }
          .btn-reply { background: #C59A5A; color: #0E1014; font-weight: 700; font-size: 12px; letter-spacing: 0.8px; text-transform: uppercase; text-decoration: none; padding: 12px 20px; border-radius: 3px; display: inline-block; }
          .btn-wa { background: #25D366; color: #FFF; font-weight: 700; font-size: 12px; letter-spacing: 0.8px; text-transform: uppercase; text-decoration: none; padding: 12px 20px; border-radius: 3px; display: inline-block; }
          .footer { background: #0E1014; border-top: 1px solid rgba(255,255,255,0.08); padding: 18px 24px; text-align: center; font-size: 11.5px; color: #646872; }
          a { color: #C59A5A; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="badge">Action Required • Organizer Alert</div>
            <h2 class="title">New Contact Inquiry Received</h2>
            <div class="sub">Reference: <strong>#INQ-${refId}</strong> • Logged via Salem Marathon Public Portal</div>
          </div>

          <div class="body">
            <div class="dossier-card">
              <div class="row">
                <span class="field">Sender Name:</span>
                <span class="val">${contactMessage.name}</span>
              </div>
              <div class="row">
                <span class="field">Email Address:</span>
                <span class="val"><a href="mailto:${contactMessage.email}?subject=Re:%20${encodeURIComponent(contactMessage.subject)}">${contactMessage.email}</a></span>
              </div>
              <div class="row">
                <span class="field">Mobile Number:</span>
                <span class="val">${contactMessage.phone || 'Not Provided'}</span>
              </div>
              <div class="row">
                <span class="field">Inquiry Subject:</span>
                <span class="val" style="color:#C59A5A;">${contactMessage.subject}</span>
              </div>
              <div class="row">
                <span class="field">Logged Timestamp:</span>
                <span class="val" style="font-family:monospace; font-size:12px;">${submittedTime}</span>
              </div>
            </div>

            <div class="msg-box">
              <div class="msg-title">Submitted Message Content:</div>
              <div class="msg-content">${contactMessage.message}</div>
            </div>

            <div class="action-bar">
              <a href="mailto:${contactMessage.email}?subject=Re:%20${encodeURIComponent(contactMessage.subject)}%20[Salem%20Cycle%20Marathon]" class="btn-reply">
                Reply via Email
              </a>
              ${waLink ? `<a href="${waLink}" target="_blank" class="btn-wa">WhatsApp Chat</a>` : ''}
            </div>
          </div>

          <div class="footer">
            Salem Cycle Marathon 2026 Admin Dispatch System • Kauvery Hospital Salem Desk<br/>
            Access Admin Management Suite: <a href="http://localhost:5173/admin">http://localhost:5173/admin</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: env.smtp.from,
      to: env.smtp.organizerEmail,
      replyTo: contactMessage.email,
      subject: `🔔 [Inquiry: #${refId}] ${contactMessage.subject} — ${contactMessage.name}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Organizer inquiry notification sent to ${env.smtp.organizerEmail} (MessageId: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`[EmailService] Failed to notify organizer:`, error.message);
  }
};

/**
 * Sends a distinct, luxury editorial confirmation acknowledgment to the participant/sender
 */
const sendUserContactAcknowledgment = async ({ contactMessage }) => {
  try {
    const transporter = await getTransporter();
    if (!contactMessage || !contactMessage.email) {
      console.warn('[EmailService] Sender email missing, skipping user acknowledgment');
      return null;
    }
    const refId = contactMessage._id ? contactMessage._id.toString().slice(-6).toUpperCase() : 'ACK';
    const submittedTime = new Date(contactMessage.createdAt || Date.now()).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #FAF7F2; color: #1D1E20; margin: 0; padding: 24px 16px; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid rgba(29,30,32,0.1); border-radius: 8px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
          .header { background: #0E1014; padding: 36px 24px; text-align: center; color: #FFFFFF; border-bottom: 2px solid #C59A5A; }
          .header h1 { margin: 0; font-family: Georgia, serif; font-size: 22px; letter-spacing: 2px; }
          .header p { margin: 6px 0 0; color: #C59A5A; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; }
          .badge { display: inline-block; background: #FAF5EE; color: #8C6830; border: 1px solid rgba(197, 154, 90, 0.4); padding: 5px 14px; border-radius: 20px; font-weight: bold; font-size: 11px; margin-top: 14px; letter-spacing: 1px; text-transform: uppercase; }
          .content { padding: 32px 26px; }
          .inquiry-card { background: #FAF7F2; border: 1px solid rgba(29,30,32,0.08); border-radius: 6px; padding: 20px; margin: 22px 0; }
          .inquiry-title { font-size: 11.5px; font-weight: 700; color: #8C6830; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid rgba(29,30,32,0.08); padding-bottom: 6px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
          .label { color: #666; }
          .val { font-weight: 600; color: #1D1E20; }
          .message-quote { background: #FFFFFF; border-left: 3px solid #C59A5A; padding: 12px 16px; border-radius: 3px; font-style: italic; color: #444; font-size: 13.5px; line-height: 1.6; margin-top: 8px; }
          .event-card { background: #0E1014; color: #FFF; border-radius: 6px; padding: 20px; margin: 24px 0; }
          .event-card h4 { margin: 0 0 10px; font-family: Georgia, serif; font-size: 16px; color: #FFF; }
          .event-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12.5px; color: #A0A4AE; }
          .event-val { color: #FFF; font-weight: 600; }
          .footer { text-align: center; padding: 24px; font-size: 12px; color: #888; background: #FAF7F2; border-top: 1px solid rgba(29,30,32,0.06); }
          a { color: #8C6830; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SALEM CYCLE MARATHON 2026</h1>
            <p>Kauvery Hospital Salem • Official Desk</p>
            <div class="badge">Inquiry Safely Received</div>
          </div>

          <div class="content">
            <p style="font-size: 15px; margin-top: 0;">Dear <strong>${contactMessage.name}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.65; color: #444;">
              Thank you for contacting the <strong>Salem Cycle Marathon 2026</strong> coordination desk. This automated confirmation lets you know that your inquiry has been received by our management team at <strong>Kauvery Hospital Salem</strong>.
            </p>
            <p style="font-size: 14px; line-height: 1.65; color: #444;">
              A representative from our race management team will review your message and respond directly to this email within <strong>12 business hours</strong>.
            </p>

            <div class="inquiry-card">
              <div class="inquiry-title">Your Inquiry Summary</div>
              <div class="row">
                <span class="label">Reference ID:</span>
                <span class="val" style="color: #C59A5A; font-family: monospace;">#INQ-${refId}</span>
              </div>
              <div class="row">
                <span class="label">Subject / Topic:</span>
                <span class="val">${contactMessage.subject}</span>
              </div>
              <div class="row">
                <span class="label">Submitted On:</span>
                <span class="val">${submittedTime} IST</span>
              </div>
              <div style="margin-top: 12px; font-size: 12.5px; color: #666;">
                <strong>Copy of your message:</strong>
                <div class="message-quote">"${contactMessage.message}"</div>
              </div>
            </div>

            <div class="event-card">
              <h4>Race Day & Expo Quick Reminders</h4>
              <div class="event-row">
                <span>Flag-Off Date:</span>
                <span class="event-val">30 October 2026 (Assembly 04:30 AM IST)</span>
              </div>
              <div class="event-row">
                <span>Flag-Off Venue:</span>
                <span class="event-val">Kauvery Hospital Salem, Seelanaickenpatti</span>
              </div>
              <div class="event-row">
                <span>Pre-Race Kit Expo:</span>
                <span class="event-val">28 & 29 October 2026 (10 AM – 6 PM IST)</span>
              </div>
              <div class="event-row">
                <span>Registration Deadline:</span>
                <span class="event-val" style="color:#C59A5A;">25 October 2026 at 11:00 PM IST</span>
              </div>
            </div>

            <p style="font-size: 13.5px; line-height: 1.6; color: #555;">
              If your inquiry is regarding urgent medical clearance, payment verification, or group corporate entries, you can also reach our WhatsApp support line directly at <strong>+91 94422 10820</strong>.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0 0 4px; font-weight: 600; color: #1D1E20;">Salem Cycle Marathon 2026 Organizing Committee</p>
            <p style="margin: 0;">Venue Partner: Kauvery Hospital Salem • Official Email: ${env.smtp.organizerEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: env.smtp.from,
      to: contactMessage.email,
      subject: `[Inquiry Received: #${refId}] Thank you for contacting Salem Cycle Marathon 2026`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] User contact confirmation dispatched to ${contactMessage.email} (MessageId: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`[EmailService] Failed to send user acknowledgment email:`, error.message);
  }
};

/**
 * Sends acknowledgment email to participant when registration & payment proof are submitted
 */
const sendRegistrationSubmittedEmail = async ({ registration, payment }) => {
  try {
    const transporter = await getTransporter();
    const p = registration.participant || {};
    const c = registration.categorySnapshot || {};
    const refId = registration.registrationId;
    if (!p.email) {
      console.warn('[EmailService] Participant email missing, skipping email');
      return null;
    }
    const categoryName = c.name || 'Cycling Marathon';
    const distanceKm = c.distanceKm || 'Official Distance';
    const isUpi = (payment && payment.paymentMode === 'DIRECT_UPI') || registration.paymentProof?.paymentMode === 'DIRECT_UPI';
    const utr = payment?.upiTransactionId || registration.paymentProof?.utrNumber || (isUpi ? 'Pending UPI Submission' : 'Online Payment');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAF7F2; color: #1D1E20; margin: 0; padding: 24px 16px; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid rgba(29,30,32,0.1); border-radius: 8px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
          .header { background: #0E1014; padding: 32px 24px; text-align: center; color: #FFFFFF; border-bottom: 2px solid #C59A5A; }
          .header h1 { margin: 0; font-family: Georgia, serif; font-size: 22px; letter-spacing: 2px; }
          .header p { margin: 6px 0 0; color: #C59A5A; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
          .badge { display: inline-block; background: #D97706; color: #ffffff; padding: 5px 14px; border-radius: 20px; font-weight: bold; font-size: 12px; margin-top: 14px; }
          .content { padding: 30px 24px; }
          .card { background: #FAF7F2; border: 1px solid rgba(29,30,32,0.08); border-radius: 6px; padding: 18px 20px; margin-bottom: 20px; }
          .title { font-size: 13px; font-weight: bold; color: #8C6830; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid rgba(29,30,32,0.08); padding-bottom: 6px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13.5px; }
          .label { color: #64666B; }
          .val { font-weight: 600; color: #1D1E20; }
          .alert { background: #FFFBEB; border-left: 3px solid #D97706; padding: 14px 16px; border-radius: 4px; font-size: 13px; line-height: 1.6; margin-bottom: 20px; color: #92400E; }
          .footer { text-align: center; padding: 24px; font-size: 12px; color: #888; background: #FAF7F2; border-top: 1px solid rgba(29,30,32,0.06); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SALEM CYCLE MARATHON 2026</h1>
            <p>Kauvery Hospital Salem • Official Entry</p>
            <div class="badge">REGISTRATION SUBMITTED & UNDER VERIFICATION</div>
          </div>
          <div class="content">
            <p>Dear <strong>${p.fullName || 'Participant'}</strong>,</p>
            <p>We have successfully received your registration details for the <strong>Salem Cycle Marathon 2026</strong>.</p>
            
            <div class="alert">
              <strong>Verification in Progress:</strong><br/>
              Our race verification desk is currently verifying your payment transaction (UTR: <code>${utr}</code>). As soon as verified, your official race pass and bib confirmation ticket will be emailed to you immediately.
            </div>

            <div class="card">
              <div class="title">Registration Summary</div>
              <div class="row"><span class="label">Registration ID:</span> <span class="val" style="color:#C59A5A; font-family:monospace; font-size:15px;">${refId}</span></div>
              <div class="row"><span class="label">Rider Name:</span> <span class="val">${p.fullName || 'Participant'}</span></div>
              <div class="row"><span class="label">Category:</span> <span class="val">${categoryName} (${distanceKm} KM)</span></div>
              <div class="row"><span class="label">Registration Fee:</span> <span class="val">₹${registration.amountDueInr}</span></div>
              <div class="row"><span class="label">Jersey Size:</span> <span class="val">${p.tShirtSize || 'M'}</span></div>
              <div class="row"><span class="label">Payment Mode:</span> <span class="val">${isUpi ? 'Direct UPI' : 'Online Payment'}</span></div>
            </div>

            <div class="card">
              <div class="title">Race Day & Expo Schedule</div>
              <p style="margin: 0 0 6px; font-size: 13.5px;"><strong>Venue:</strong> Kauvery Hospital Salem Arena</p>
              <p style="margin: 0 0 6px; font-size: 13px; color:#555;">#9/50, Trichy Main Road, Seelanaickenpatti, Salem – 636201</p>
              <p style="margin: 0 0 6px; font-size: 13px; color:#555;"><strong>Bib Expo:</strong> 28 & 29 October 2026 (10 AM – 6 PM IST)</p>
              <p style="margin: 0; font-size: 13px; color:#555;"><strong>Flag-Off Date:</strong> 30 October 2026 (Assembly 04:30 AM IST)</p>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 4px; font-weight: 600; color: #1D1E20;">Salem Cycle Marathon 2026 Organizing Committee</p>
            <p style="margin: 0;">Kauvery Hospital Salem Desk • Support: ${env.smtp.organizerEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: env.smtp.from,
      to: p.email,
      subject: `[Received: ${refId}] Salem Cycle Marathon 2026 Registration Acknowledgment`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Registration submitted email sent to participant: ${p.email}`);
    return info;
  } catch (error) {
    console.error(`[EmailService] Error sending registration submitted email:`, error.message);
  }
};

/**
 * Sends immediate organizer notification when a participant registers
 */
const sendOrganizerRegistrationAlert = async ({ registration, payment }) => {
  try {
    const transporter = await getTransporter();
    const p = registration.participant || {};
    const c = registration.categorySnapshot || {};
    const refId = registration.registrationId;
    const categoryName = c.name || 'Cycling Marathon';
    const distanceKm = c.distanceKm || 'Official Distance';
    const utr = payment?.upiTransactionId || registration.paymentProof?.utrNumber || 'Pending Submission';
    const screenshot = payment?.screenshotUrl || registration.paymentProof?.screenshotUrl;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0A0C10; color: #E2E8F0; margin: 0; padding: 24px 16px; }
          .container { max-width: 620px; margin: 0 auto; background: #131720; border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
          .header { background: #0E1014; border-bottom: 2px solid #C59A5A; padding: 24px; text-align: left; }
          .badge { display: inline-block; background: #C59A5A; color: #0E1014; font-size: 11px; font-weight: 800; letter-spacing: 1px; padding: 4px 10px; border-radius: 3px; text-transform: uppercase; margin-bottom: 8px; }
          .title { margin: 0; font-size: 20px; color: #FFF; font-family: Georgia, serif; }
          .body { padding: 24px; }
          .dossier-card { background: #1A1F2B; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 20px; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 8px 0; font-size: 13.5px; }
          .row:last-child { border-bottom: none; }
          .field { color: #8E929B; text-transform: uppercase; font-size: 11px; font-weight: 600; }
          .val { color: #FFF; font-weight: 600; text-align: right; }
          .btn-action { background: #C59A5A; color: #0E1014; font-weight: 700; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; padding: 12px 24px; border-radius: 3px; display: inline-block; }
          .footer { background: #0E1014; padding: 16px 24px; text-align: center; font-size: 11.5px; color: #646872; }
          a { color: #C59A5A; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="badge">New Registration • Action Required</div>
            <h2 class="title">New Marathon Entry Received</h2>
            <div style="font-size: 12px; color: #A0A4AE; margin-top: 4px;">Pass ID: <strong>#${refId}</strong></div>
          </div>
          <div class="body">
            <div class="dossier-card">
              <div class="row"><span class="field">Participant Name:</span> <span class="val">${p.fullName}</span></div>
              <div class="row"><span class="field">Email Address:</span> <span class="val"><a href="mailto:${p.email}">${p.email}</a></span></div>
              <div class="row"><span class="field">Mobile Number:</span> <span class="val">${p.phone}</span></div>
              <div class="row"><span class="field">Category:</span> <span class="val" style="color:#C59A5A;">${c.name} (${c.distanceKm} KM)</span></div>
              <div class="row"><span class="field">Amount Due:</span> <span class="val">₹${registration.amountDueInr}</span></div>
              <div class="row"><span class="field">Payment Mode:</span> <span class="val">${payment?.paymentMode || 'Direct UPI'}</span></div>
              <div class="row"><span class="field">UPI Reference / UTR:</span> <span class="val" style="font-family:monospace; color:#4ADE80;">${utr}</span></div>
              <div class="row"><span class="field">Jersey Size:</span> <span class="val">${p.tShirtSize}</span></div>
              <div class="row"><span class="field">Emergency Contact:</span> <span class="val">${p.emergencyContact?.name || 'N/A'} (${p.emergencyContact?.phone || ''})</span></div>
              ${screenshot ? `<div class="row"><span class="field">Screenshot:</span> <span class="val"><a href="${screenshot}" target="_blank">View Uploaded Slip ↗</a></span></div>` : ''}
            </div>

            <div style="text-align: center; margin: 24px 0 12px;">
              <a href="http://localhost:5173/admin" class="btn-action">
                Open Admin Console & Verify Bib →
              </a>
            </div>
          </div>
          <div class="footer">
            Salem Cycle Marathon 2026 Admin Alert System • Kauvery Hospital Salem Desk
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: env.smtp.from,
      to: env.smtp.organizerEmail,
      replyTo: p.email,
      subject: `🚴 [New Registration: ${refId}] ${p.fullName} — ${c.name} (UTR: ${utr})`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Organizer registration alert sent to ${env.smtp.organizerEmail}`);
    return info;
  } catch (error) {
    console.error(`[EmailService] Error sending organizer registration alert:`, error.message);
  }
};

module.exports = {
  sendRegistrationConfirmationEmail,
  sendOrganizerContactAlert,
  sendUserContactAcknowledgment,
  sendRegistrationSubmittedEmail,
  sendOrganizerRegistrationAlert
};
