import { Router } from 'express';
import { ProductPrice, Product } from '../../models/index.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/prices
 * Get all products with their current prices
 */
router.get('/', async (req, res, next) => {
  try {
    const products = await ProductPrice.getAllWithProducts();
    res.json({ products });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/prices/:productId
 * Get price history for a product
 */
router.get('/:productId', async (req, res, next) => {
  try {
    const prices = await ProductPrice.findByProduct(req.params.productId);
    res.json({ prices });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/prices
 * Set price for a product
 */
router.post('/', async (req, res, next) => {
  try {
    const { product_id, price, user_id, valid_until } = req.body;

    // Validation
    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({ error: 'Price is required' });
    }

    // Validate price format (€ regex: positive number, max 2 decimals)
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(price.toString()) || parseFloat(price) < 0) {
      return res.status(400).json({ 
        error: 'Invalid price format. Must be a positive number with max 2 decimals (e.g., 1234.56)' 
      });
    }

    // Check if product exists
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const priceRecord = await ProductPrice.setPrice(product_id, price, {
      userId: user_id,
      validUntil: valid_until
    });

    res.status(201).json({ price: priceRecord });
  } catch (error) {
    if (error.message.includes('Invalid price format')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * POST /api/admin/prices/bulk
 * Set prices for multiple products
 */
router.post('/bulk', async (req, res, next) => {
  try {
    const { prices } = req.body;

    if (!Array.isArray(prices) || prices.length === 0) {
      return res.status(400).json({ error: 'Prices array is required' });
    }

    // Validate all prices first
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    for (const { productId, price } of prices) {
      if (!productId || price === undefined) {
        return res.status(400).json({ error: 'Each price entry must have productId and price' });
      }
      if (!priceRegex.test(price.toString()) || parseFloat(price) < 0) {
        return res.status(400).json({ 
          error: `Invalid price format for product ${productId}` 
        });
      }
    }

    const results = await ProductPrice.bulkSetPrices(prices);
    res.json({ success: true, count: results.length });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/admin/prices/:id
 * Update a price record
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const { price, valid_until } = req.body;

    const updated = await ProductPrice.update(req.params.id, {
      price,
      validUntil: valid_until
    });

    if (!updated) {
      return res.status(404).json({ error: 'Price record not found' });
    }

    res.json({ price: updated });
  } catch (error) {
    if (error.message.includes('Invalid price format')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * DELETE /api/admin/prices/:id
 * Delete a price record
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await ProductPrice.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Price record not found' });
    }

    res.json({ success: true, message: 'Price deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
