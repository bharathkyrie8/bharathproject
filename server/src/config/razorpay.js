const Razorpay = require('razorpay');
const env = require('./env');

let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (razorpayInstance) {
    return razorpayInstance;
  }

  const { keyId, keySecret } = env.razorpay;

  if (!keyId || !keySecret || keyId.includes('placeholder')) {
    console.warn('[Razorpay] Valid RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured yet. Running in mock/sandbox validation mode.');
    // In dev/mock mode, provide a stub instance so the server starts cleanly
    return {
      isMock: true,
      orders: {
        create: async (options) => {
          console.log('[Razorpay MOCK] Order created with options:', options);
          return {
            id: `order_mock_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            entity: 'order',
            amount: options.amount,
            amount_paid: 0,
            amount_due: options.amount,
            currency: options.currency || 'INR',
            receipt: options.receipt,
            status: 'created',
            attempts: 0,
            notes: options.notes || {},
            created_at: Math.floor(Date.now() / 1000)
          };
        },
        fetch: async (orderId) => {
          return {
            id: orderId,
            entity: 'order',
            status: 'created'
          };
        }
      },
      payments: {
        fetch: async (paymentId) => {
          return {
            id: paymentId,
            status: 'captured',
            amount: 50000
          };
        }
      }
    };
  }

  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });

  return razorpayInstance;
};

module.exports = { getRazorpayInstance };
