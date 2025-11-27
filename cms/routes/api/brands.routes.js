import { Router } from 'express';
import { Brand } from '../../models/index.js';

const router = Router();

/**
 * GET /api/brands
 * Get all active brands
 */
router.get('/', async (req, res, next) => {
  try {
    const withCount = req.query.count === 'true';
    
    const brands = withCount
      ? await Brand.findAllWithProductCount()
      : await Brand.findAll();

    res.json({ brands });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/brands/:slug
 * Get brand by slug
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const brand = await Brand.findBySlug(req.params.slug);
    
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json({ brand });
  } catch (error) {
    next(error);
  }
});

export default router;
