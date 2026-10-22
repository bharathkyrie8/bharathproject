const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./src/config/env');
const { connectDB, disconnectDB } = require('./src/config/db');
const { generalLimiter } = require('./src/middleware/rateLimiter');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const apiRoutes = require('./src/routes');

const app = express();

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing (Supports local development, Netlify, and Render)
const allowedOrigins = [
  env.clientUrl,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server proxy)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Razorpay-Signature']
  })
);

// Capture raw body for Razorpay Webhook signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.jwt.cookieSecret));

// Serve static public folder for QR codes and assets
const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')));

// HTTP Request Logger
if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting on API endpoints
app.use('/api', generalLimiter);

// Welcome Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Salem Cycle Marathon 2026 Official Registration API',
    documentation: '/api/v1/health',
    status: 'ONLINE'
  });
});

// Mount V1 API Routes
app.use('/api/v1', apiRoutes);
app.use('/api', apiRoutes); // Alias for convenience

// 404 & Centralized Error Handler
app.use(notFound);
app.use(errorHandler);

// Server Startup
let server = null;

if (require.main === module) {
  const startServer = async () => {
    try {
      await connectDB();
      server = app.listen(env.port, () => {
        console.log(`=======================================================`);
        console.log(` 🚴 SALEM CYCLE MARATHON 2026 API SERVER`);
        console.log(` Port: ${env.port} | Mode: ${env.nodeEnv}`);
        console.log(` Base API: http://localhost:${env.port}/api/v1`);
        console.log(` Health Check: http://localhost:${env.port}/api/v1/health`);
        console.log(`=======================================================`);
      });
    } catch (err) {
      console.error('Server startup failed:', err.message);
      process.exit(1);
    }
  };

  startServer();

  // Graceful Shutdown
  const shutdown = async () => {
    console.log('\n[Server] Graceful shutdown initiated...');
    if (server) {
      server.close(async () => {
        await disconnectDB();
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = app;
