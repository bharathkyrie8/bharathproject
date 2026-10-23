const Category = require('../models/Category');
const { logAdminAction } = require('../services/auditService');
const { ensureDatabaseRestored } = require('../utils/autoRestore');

/**
 * Get active registration categories for public website
 * GET /api/v1/categories
 */
const getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, distanceKm: -1 });

    // Self-healing: If categories were deleted or missing, auto-restore immediately
    if (!categories || categories.length < 3) {
      await ensureDatabaseRestored();
      categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, distanceKm: -1 });
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all categories (Admin)
 * GET /api/v1/categories/admin/all
 */
const getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new category (Admin)
 * POST /api/v1/categories
 */
const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.validatedBody);

    await logAdminAction({
      admin: req.admin,
      action: 'CATEGORY_CREATED',
      resource: 'Category',
      resourceId: category._id,
      details: req.validatedBody,
      req
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing category (Admin)
 * PUT /api/v1/categories/:id
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.validatedBody, {
      new: true,
      runValidators: true
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await logAdminAction({
      admin: req.admin,
      action: 'CATEGORY_UPDATED',
      resource: 'Category',
      resourceId: category._id,
      details: req.validatedBody,
      req
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete / Deactivate a category (Admin)
 * DELETE /api/v1/categories/:id
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Soft delete / deactivate
    category.isActive = false;
    await category.save();

    await logAdminAction({
      admin: req.admin,
      action: 'CATEGORY_DEACTIVATED',
      resource: 'Category',
      resourceId: category._id,
      req
    });

    res.status(200).json({
      success: true,
      message: 'Category deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory
};
