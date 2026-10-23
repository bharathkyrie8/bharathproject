const express = require('express');
const router = express.Router();
const {
  getCategories,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { validateCategory, validateUpdateCategory } = require('../validators/categoryValidator');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// Public route to view active categories
router.get('/', getCategories);

// Admin routes
router.get('/admin/all', authenticateAdmin, getAllCategoriesAdmin);
router.post('/', authenticateAdmin, validateCategory, createCategory);
router.put('/:id', authenticateAdmin, validateUpdateCategory, updateCategory);
router.delete('/:id', authenticateAdmin, deleteCategory);

module.exports = router;
