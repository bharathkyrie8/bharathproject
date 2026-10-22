const AuditLog = require('../models/AuditLog');

const logAdminAction = async ({ admin, action, resource, resourceId = null, details = {}, req = null }) => {
  try {
    const ipAddress = req ? req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress : null;
    const userAgent = req ? req.headers['user-agent'] : null;

    await AuditLog.create({
      action,
      adminId: admin ? admin._id : null,
      adminEmail: admin ? admin.email : 'SYSTEM',
      resource,
      resourceId,
      details,
      ipAddress,
      userAgent
    });
  } catch (error) {
    console.error('[AuditService] Failed to record audit log entry:', error.message);
  }
};

module.exports = {
  logAdminAction
};
