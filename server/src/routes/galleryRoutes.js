const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getGallery,
  getAllGalleryAdmin,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadImage
} = require('../controllers/galleryController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// Setup Multer memory storage for direct Cloudinary streaming
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Public route to view gallery
router.get('/', getGallery);

// Admin routes
router.get('/admin/all', authenticateAdmin, getAllGalleryAdmin);
router.post('/upload', authenticateAdmin, upload.single('image'), uploadImage);
router.post('/', authenticateAdmin, addGalleryItem);
router.put('/:id', authenticateAdmin, updateGalleryItem);
router.delete('/:id', authenticateAdmin, deleteGalleryItem);

module.exports = router;
