import { Router } from 'express';
import { pool } from '../../config/database.js';
import { Product, ProductPrice } from '../../models/index.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { clearCache } from '../../middleware/cache.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/products
 * Get all products (including inactive)
 */
router.get('/', async (req, res, next) => {
  try {
    // Get all products without the is_active filter
    const result = await pool.query(`
      SELECT p.*, 
             c.title as category_title,
             sc.title as subcategory_title,
             b.title as brand_title,
             (SELECT price FROM product_prices pp 
              WHERE pp.product_id = p.id 
                AND pp.visible_for_user_id IS NULL
              ORDER BY pp.created_at DESC LIMIT 1) as current_price
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN brands b ON p.brand_id = b.id
      ORDER BY p.created_at DESC
    `);
    
    res.json({ products: result.rows });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/products
 * Create new product
 */
router.post('/', async (req, res, next) => {
  try {
    const {
      title, slug, description, category_id, subcategory_id, brand_id,
      excavator_weight_min, excavator_weight_max, width, volume, weight,
      attachment_type, cloudinary_images, specs, stock_quantity, is_featured, is_active, sector_ids,
      price
    } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Generate slug if not provided
    const productSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const existing = await Product.findBySlug(productSlug);
    if (existing) {
      return res.status(400).json({ error: 'A product with this slug already exists' });
    }

    // Validate attachment type
    const validAttachments = ['CW00', 'CW05', 'CW10', 'CW20', 'CW30', 'CW40', 'CW45', 'S40', 'S50', 'S60', 'S70', 'S80'];
    if (attachment_type && !validAttachments.includes(attachment_type)) {
      return res.status(400).json({ error: 'Invalid attachment type' });
    }

    const product = await Product.create({
      title,
      slug: productSlug,
      description,
      category_id,
      subcategory_id,
      brand_id,
      excavator_weight_min,
      excavator_weight_max,
      width,
      volume,
      weight,
      attachment_type,
      cloudinary_images,
      specs,
      stock_quantity,
      is_featured,
      is_active,
      sector_ids
    });

    // Set price if provided
    if (price !== undefined && price !== null) {
      await ProductPrice.setPrice(product.id, price);
    }

    // Clear products cache so frontend gets fresh data
    clearCache('/api/products');
    
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/admin/products/:id
 * Update product
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const {
      title, slug, description, category_id, subcategory_id, brand_id,
      excavator_weight_min, excavator_weight_max, width, volume, weight,
      attachment_type, cloudinary_images, specs, stock_quantity, is_active, is_featured, sector_ids,
      price
    } = req.body;

    // Check if product exists
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== existing.slug) {
      const slugExists = await Product.findBySlug(slug);
      if (slugExists) {
        return res.status(400).json({ error: 'A product with this slug already exists' });
      }
    }

    const product = await Product.update(req.params.id, {
      title,
      slug,
      description,
      category_id,
      subcategory_id,
      brand_id,
      excavator_weight_min,
      excavator_weight_max,
      width,
      volume,
      weight,
      attachment_type,
      cloudinary_images,
      specs,
      stock_quantity,
      is_active,
      is_featured,
      sector_ids
    });

    // Update price if provided
    if (price !== undefined && price !== null) {
      await ProductPrice.setPrice(product.id, price);
    }

    // Clear products cache so frontend gets fresh data
    clearCache('/api/products');
    
    res.json({ product });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/products/:id
 * Delete product
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Product.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Clear products cache so frontend gets fresh data
    clearCache('/api/products');
    
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
