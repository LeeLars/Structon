import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { apiLimiter } from '../../middleware/rateLimit.js';
import { env } from '../../config/env.js';

const router = Router();

// Configure Cloudinary at startup (will use env vars)
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret
});

// Log configuration status
console.log('☁️ Cloudinary config:', {
  cloudName: env.cloudinary.cloudName || 'NOT SET',
  apiKey: env.cloudinary.apiKey ? '***' + env.cloudinary.apiKey.slice(-4) : 'NOT SET',
  apiSecret: env.cloudinary.apiSecret ? '***' : 'NOT SET'
});

/**
 * Check if Cloudinary is configured (runtime check)
 */
function isCloudinaryConfigured() {
  return !!(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);
}

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
router.post('/images', apiLimiter, upload.array('images', 10), async (req, res) => {
  console.log('📤 Upload request received');
  
  try {
    // Check if files were received
    if (!req.files || req.files.length === 0) {
      console.log('❌ No files in request');
      return res.status(400).json({ error: 'No images provided' });
    }

    console.log(`📷 Processing ${req.files.length} file(s)`);

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      console.error('❌ Cloudinary not configured');
      return res.status(503).json({ 
        error: 'Cloudinary niet geconfigureerd',
        message: 'Afbeeldingen uploaden is tijdelijk niet beschikbaar. Configureer CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY en CLOUDINARY_API_SECRET in de environment variabelen.'
      });
    }

    // Upload each image to Cloudinary
    const uploadPromises = req.files.map((file, index) => {
      console.log(`📤 Uploading file ${index + 1}: ${file.originalname} (${file.size} bytes)`);
      
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
              console.error(`❌ Cloudinary upload error for file ${index + 1}:`, error.message);
              reject(error);
            } else {
              console.log(`✅ File ${index + 1} uploaded: ${result.public_id}`);
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

    console.log(`✅ All ${images.length} images uploaded successfully`);

    res.json({
      success: true,
      images,
      count: images.length
    });
  } catch (error) {
    console.error('❌ Image upload error:', error.message);
    
    // Return user-friendly error
    let errorMessage = 'Er is een fout opgetreden bij het uploaden.';
    
    if (error.message?.includes('Invalid')) {
      errorMessage = 'Ongeldige Cloudinary configuratie. Controleer de API credentials.';
    } else if (error.message?.includes('File size')) {
      errorMessage = 'Bestand is te groot. Maximum is 5MB.';
    } else if (error.http_code === 401) {
      errorMessage = 'Cloudinary authenticatie mislukt. Controleer API key en secret.';
    }
    
    return res.status(500).json({
      error: errorMessage,
      details: error.message
    });
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
