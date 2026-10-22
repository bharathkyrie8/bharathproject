const Gallery = require('../models/Gallery');
const { logAdminAction } = require('../services/auditService');

/**
 * Get published gallery images
 * GET /api/v1/gallery
 */
const getGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isPublished: true };
    if (category) {
      filter.category = category;
    }

    const items = await Gallery.find(filter).sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all gallery items (Admin)
 * GET /api/v1/gallery/admin/all
 */
const getAllGalleryAdmin = async (req, res, next) => {
  try {
    const items = await Gallery.find().sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add gallery image (Admin)
 * POST /api/v1/gallery
 */
const addGalleryItem = async (req, res, next) => {
  try {
    const { title, caption, category, imageUrl, thumbnailUrl, displayOrder, isPublished } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and image URL are required'
      });
    }

    const item = await Gallery.create({
      title,
      caption,
      category,
      imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
      displayOrder: displayOrder || 0,
      isPublished: isPublished !== undefined ? isPublished : true
    });

    await logAdminAction({
      admin: req.admin,
      action: 'GALLERY_ITEM_ADDED',
      resource: 'Gallery',
      resourceId: item._id,
      details: { title, category },
      req
    });

    res.status(201).json({
      success: true,
      message: 'Gallery item added successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update gallery item (Admin)
 * PUT /api/v1/gallery/:id
 */
const updateGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findByIdAndUpdate(id, req.body, { new: true });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    await logAdminAction({
      admin: req.admin,
      action: 'GALLERY_ITEM_UPDATED',
      resource: 'Gallery',
      resourceId: item._id,
      req
    });

    res.status(200).json({
      success: true,
      message: 'Gallery item updated',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete gallery item (Admin)
 * DELETE /api/v1/gallery/:id
 */
const deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    await logAdminAction({
      admin: req.admin,
      action: 'GALLERY_ITEM_DELETED',
      resource: 'Gallery',
      resourceId: id,
      req
    });

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Direct file upload to Cloudinary (Admin)
 * POST /api/v1/gallery/upload
 */
const uploadImage = async (req, res, next) => {
  try {
    const { uploadBufferToCloudinary } = require('../config/cloudinary');

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const folder = req.body.folder || 'cycle_marathon_gallery';
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGallery,
  getAllGalleryAdmin,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadImage
};
