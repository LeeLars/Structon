import { Router } from 'express';
import { Sector } from '../../models/index.js';

const router = Router();

/**
 * GET /api/sectors
 * Get all active sectors
 */
router.get('/', async (req, res, next) => {
  try {
    const withCount = req.query.count === 'true';
    
    const sectors = withCount
      ? await Sector.findAllWithProductCount()
      : await Sector.findAll();

    res.json({ sectors });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/sectors/:slug
 * Get sector by slug
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const sector = await Sector.findBySlug(req.params.slug);
    
    if (!sector) {
      return res.status(404).json({ error: 'Sector not found' });
    }

    res.json({ sector });
  } catch (error) {
    next(error);
  }
});

export default router;
