const Registration = require('../models/Registration');
const Payment = require('../models/Payment');
const Category = require('../models/Category');
const AuditLog = require('../models/AuditLog');
const { exportRegistrationsToCsv } = require('../utils/csvExporter');
const { logAdminAction } = require('../services/auditService');

/**
 * Get high-level dashboard metrics & statistics
 * GET /api/v1/admin/dashboard
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const totalRegistrations = await Registration.countDocuments();
    const confirmedRegistrations = await Registration.countDocuments({ status: 'CONFIRMED' });
    const pendingRegistrations = await Registration.countDocuments({ status: 'PENDING_PAYMENT' });
    const failedRegistrations = await Registration.countDocuments({ status: 'FAILED' });

    // Calculate verified revenue from captured payments
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'CAPTURED' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amountInr' } } }
    ]);
    const totalRevenueInr = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Breakdown by category
    const categoryStats = await Category.find().select('name slug distanceKm priceInr registeredCount maxCapacity');

    // T-shirt size distribution for logistics
    const tShirtStats = await Registration.aggregate([
      { $match: { status: 'CONFIRMED' } },
      { $group: { _id: '$participant.tShirtSize', count: { $sum: 1 } } }
    ]);

    // Gender breakdown
    const genderStats = await Registration.aggregate([
      { $match: { status: 'CONFIRMED' } },
      { $group: { _id: '$participant.gender', count: { $sum: 1 } } }
    ]);

    // Recent 10 registrations
    const recentRegistrations = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('registrationId participant.fullName categorySnapshot status amountDueInr createdAt confirmedAt');

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalRegistrations,
          confirmedRegistrations,
          pendingRegistrations,
          failedRegistrations,
          totalRevenueInr
        },
        categoryStats,
        tShirtStats,
        genderStats,
        recentRegistrations
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search and filter participants with pagination
 * GET /api/v1/admin/participants
 */
const getParticipants = async (req, res, next) => {
  try {
    const {
      search,
      category,
      status,
      tShirtSize,
      page = 1,
      limit = 25,
      startDate,
      endDate
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (tShirtSize) {
      filter['participant.tShirtSize'] = tShirtSize;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { registrationId: searchRegex },
        { 'participant.fullName': searchRegex },
        { 'participant.email': searchRegex },
        { 'participant.phone': searchRegex },
        { bibNumber: searchRegex }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Registration.countDocuments(filter);

    const participants = await Registration.find(filter)
      .populate('category', 'name slug distanceKm priceInr')
      .populate('paymentId', 'razorpayPaymentId razorpayOrderId status method verifiedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      data: participants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get complete participant details by Mongo ID
 * GET /api/v1/admin/participants/:id
 */
const getParticipantDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const participant = await Registration.findById(id)
      .populate('category')
      .populate('paymentId');

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: participant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export participants to CSV
 * GET /api/v1/admin/export-csv
 */
const exportParticipants = async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const registrations = await Registration.find(filter)
      .populate('paymentId')
      .sort({ createdAt: -1 });

    const csvData = exportRegistrationsToCsv(registrations);

    await logAdminAction({
      admin: req.admin,
      action: 'PARTICIPANT_EXPORT_CSV',
      resource: 'Registration',
      details: { recordCount: registrations.length, filter },
      req
    });

    const filename = `cycle_marathon_participants_${Date.now()}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};

/**
 * View administrative audit logs
 * GET /api/v1/admin/audit-logs
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, action } = req.query;
    const filter = {};
    if (action) filter.action = action;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await AuditLog.countDocuments(filter);

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getParticipants,
  getParticipantDetails,
  exportParticipants,
  getAuditLogs
};
