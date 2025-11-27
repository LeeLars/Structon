import { Router } from 'express';
import { Category } from '../../models/index.js';

const router = Router();

/**
 * GET /api/categories
 * Get all active categories
 */
router.get('/', async (req, res, next) => {
  try {
    const withCount = req.query.count === 'true';
    
    const categories = withCount
      ? await Category.findAllWithProductCount()
      : await Category.findAll();

    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/categories/:slug
 * Get category by slug
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findBySlug(req.params.slug);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    next(error);
  }
});

export default router;
