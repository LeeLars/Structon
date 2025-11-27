import { Router } from 'express';
import { Product, ProductPrice } from '../../models/index.js';
import { authenticate, optionalAuth } from '../../middleware/auth.js';

const router = Router();

/**
 * GET /api/products
 * Get all products (public, no prices)
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      category, category_id, brand_id, attachment_type,
      excavator_weight, volume_min, volume_max, width,
      search, sort, limit, offset, featured
    } = req.query;

    const filters = {
      category_slug: category,
      category_id,
      brand_id,
      attachment_type,
      excavator_weight: excavator_weight ? parseInt(excavator_weight) : undefined,
      volume_min: volume_min ? parseInt(volume_min) : undefined,
      volume_max: volume_max ? parseInt(volume_max) : undefined,
      width: width ? parseInt(width) : undefined,
      search,
      sort,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      is_featured: featured === 'true'
    };

    const [products, total] = await Promise.all([
      Product.findAll(filters),
      Product.count(filters)
    ]);

    res.json({
      products,
      total,
      limit: filters.limit,
      offset: filters.offset || 0
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/filters
 * Get available filter options
 */
router.get('/filters', async (req, res, next) => {
  try {
    const filters = await Product.getFilterOptions();
    res.json(filters);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/featured
 * Get featured products
 */
router.get('/featured', async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 6;
    const products = await Product.findFeatured(limit);
    res.json({ products });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/:id
 * Get single product by ID or slug (public, no price)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if it's a UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    const product = isUUID 
      ? await Product.findById(id)
      : await Product.findBySlug(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/:id/price
 * Get product price (authenticated users only)
 */
router.get('/:id/price', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get product first
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const product = isUUID 
      ? await Product.findById(id)
      : await Product.findBySlug(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get price (check for user-specific price first)
    const priceData = await ProductPrice.getCurrentPrice(product.id, req.user.id);

    if (!priceData) {
      return res.json({
        product_id: product.id,
        price: null,
        message: 'Price not available. Contact us for a quote.'
      });
    }

    res.json({
      product_id: product.id,
      price: parseFloat(priceData.price),
      currency: priceData.currency,
      stock_quantity: product.stock_quantity,
      in_stock: product.stock_quantity > 0
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/sector/:sectorId
 * Get products by sector
 */
router.get('/sector/:sectorId', async (req, res, next) => {
  try {
    const products = await Product.findBySector(req.params.sectorId);
    res.json({ products });
  } catch (error) {
    next(error);
  }
});

export default router;
