import { Router } from 'express';
import { Subcategory } from '../../models/index.js';

const router = Router();

/**
 * GET /api/subcategories
 * Get all active subcategories (optionally filtered by category)
 */
router.get('/', async (req, res, next) => {
  try {
    const { category_id, category_slug, count } = req.query;
    const withCount = count === 'true';
    
    let subcategories;
    
    if (withCount && category_id) {
      subcategories = await Subcategory.findAllWithProductCount(category_id);
    } else if (category_id) {
      subcategories = await Subcategory.findByCategoryId(category_id);
    } else if (category_slug) {
      subcategories = await Subcategory.findByCategorySlug(category_slug);
    } else if (withCount) {
      subcategories = await Subcategory.findAllWithProductCount();
    } else {
      subcategories = await Subcategory.findAll();
    }

    res.json({ subcategories });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/subcategories/:id
 * Get subcategory by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    res.json({ subcategory });
  } catch (error) {
    next(error);
  }
});

export default router;
