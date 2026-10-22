const cloudinary = require('cloudinary').v2;
const env = require('./env');

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true
});

/**
 * Upload a local file path or base64 data to Cloudinary using upload_preset
 */
const uploadToCloudinary = async (file, folder = 'cycle_marathon_2026') => {
  const preset = env.cloudinary.uploadPreset || 'notevalot';
  return cloudinary.uploader.unsigned_upload(file, preset);
};

/**
 * Upload a buffer (from Multer memory storage) to Cloudinary
 */
const uploadBufferToCloudinary = (buffer, folder = 'cycle_marathon_2026') => {
  return new Promise((resolve, reject) => {
    const preset = env.cloudinary.uploadPreset || 'notevalot';
    const uploadStream = cloudinary.uploader.upload_stream(
      { upload_preset: preset },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  uploadBufferToCloudinary
};
