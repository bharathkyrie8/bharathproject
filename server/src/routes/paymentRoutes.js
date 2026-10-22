const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  verifyPayment,
  handlePaymentFailure,
  handleWebhook,
  getUpiDetails,
  submitUpiPaymentProof,
  adminVerifyUpiPayment,
  adminRejectUpiPayment,
  getPendingUpiVerifications
} = require('../controllers/paymentController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Razorpay endpoints
router.post('/verify', verifyPayment);
router.post('/failed', handlePaymentFailure);
router.post('/webhook', handleWebhook);

// Direct UPI (Solution 2) endpoints
router.get('/upi-details', getUpiDetails);
router.post('/submit-upi-proof', upload.single('screenshot'), submitUpiPaymentProof);

// Admin UPI verification endpoints
router.get('/admin/pending-verifications', authenticateAdmin, getPendingUpiVerifications);
router.post('/admin/verify-upi', authenticateAdmin, adminVerifyUpiPayment);
router.post('/admin/reject-upi', authenticateAdmin, adminRejectUpiPayment);

module.exports = router;
