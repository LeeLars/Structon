import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { apiLimiter } from '../../middleware/rateLimit.js';
import { env } from '../../config/env.js';

const router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

// All routes require authentication
router.use(authenticate, requireAdmin);

/**
 * POST /api/admin/upload/images
 * Upload images to Cloudinary
 */
router.post('/images', apiLimiter, upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    // Check if Cloudinary is configured
    if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
      return res.status(500).json({ 
        error: 'Cloudinary not configured',
        message: 'Image upload is not available. Please configure Cloudinary credentials.'
      });
    }

    // Upload each image to Cloudinary
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'structon/products',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto:good' }
            ]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height
              });
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    });

    const images = await Promise.all(uploadPromises);

    res.json({
      success: true,
      images,
      count: images.length
    });
  } catch (error) {
    console.error('Image upload error:', error);
    next(error);
  }
});

/**
 * DELETE /api/admin/upload/images/:publicId
 * Delete image from Cloudinary
 */
router.delete('/images/:publicId(*)', async (req, res, next) => {
  try {
    const publicId = req.params.publicId;

    if (!publicId) {
      return res.status(400).json({ error: 'Public ID required' });
    }

    // Check if Cloudinary is configured
    if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
      return res.status(500).json({ 
        error: 'Cloudinary not configured'
      });
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: 'Image deleted'
    });
  } catch (error) {
    console.error('Image delete error:', error);
    next(error);
  }
});

export default router;
