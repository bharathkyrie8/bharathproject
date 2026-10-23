const ContactMessage = require('../models/ContactMessage');
const { sendOrganizerContactAlert, sendUserContactAcknowledgment } = require('../services/emailService');
const { logAdminAction } = require('../services/auditService');

/**
 * Submit contact inquiry from public website
 * POST /api/v1/contact
 */
const submitContactMessage = async (req, res, next) => {
  try {
    const contactMessage = await ContactMessage.create(req.validatedBody);

    // Concurrently dispatch organizer alert (received mail) and sender acknowledgment (sent mail)
    await Promise.allSettled([
      sendOrganizerContactAlert({ contactMessage }),
      sendUserContactAcknowledgment({ contactMessage })
    ]);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your inquiry has been logged, a confirmation receipt has been sent to your email, and our organizing team will get back to you shortly.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all contact messages (Admin)
 * GET /api/v1/contact/admin/all
 */
const getMessages = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await ContactMessage.countDocuments(filter);
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update message status / notes (Admin)
 * PUT /api/v1/contact/admin/:id
 */
const updateMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (status === 'REPLIED') updateData.repliedAt = new Date();

    const message = await ContactMessage.findByIdAndUpdate(id, updateData, { new: true });
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await logAdminAction({
      admin: req.admin,
      action: 'CONTACT_MESSAGE_UPDATED',
      resource: 'ContactMessage',
      resourceId: message._id,
      details: { status },
      req
    });

    res.status(200).json({
      success: true,
      message: 'Message status updated',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactMessage,
  getMessages,
  updateMessageStatus
};
