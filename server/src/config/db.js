const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async (customUri) => {
  const uri = customUri || env.mongodbUri;
  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} / database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    if (env.nodeEnv !== 'test') {
      // In test mode we don't want to kill the test runner process
      console.error('[MongoDB] Critical connection failure. Please check your MONGODB_URI.');
    }
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed successfully.');
  } catch (error) {
    console.error(`[MongoDB] Error disconnecting: ${error.message}`);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected to database.');
});

module.exports = { connectDB, disconnectDB };
