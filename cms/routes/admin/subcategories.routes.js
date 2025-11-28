import { Router } from 'express';
import { Subcategory } from '../../models/index.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/subcategories
 * Get all subcategories (including inactive)
 */
router.get('/', async (req, res, next) => {
  try {
    const { category_id } = req.query;
    
    const subcategories = category_id
      ? await Subcategory.findByCategoryId(category_id, true)
      : await Subcategory.findAll(true);
      
    res.json({ subcategories });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/subcategories
 * Create subcategory
 */
router.post('/', async (req, res, next) => {
  try {
    const { 
      category_id, 
      title, 
      slug, 
      description, 
      tonnage_min, 
      tonnage_max, 
      sort_order 
    } = req.body;

    if (!category_id) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const subcategorySlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await Subcategory.findBySlug(category_id, subcategorySlug);
    if (existing) {
      return res.status(400).json({ error: 'A subcategory with this slug already exists in this category' });
    }

    const subcategory = await Subcategory.create({
      category_id,
      title,
      slug: subcategorySlug,
      description,
      tonnage_min,
      tonnage_max,
      sort_order
    });

    res.status(201).json({ subcategory });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/admin/subcategories/:id
 * Update subcategory
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const { 
      title, 
      slug, 
      description, 
      tonnage_min, 
      tonnage_max, 
      sort_order, 
      is_active 
    } = req.body;

    const existing = await Subcategory.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await Subcategory.findBySlug(existing.category_id, slug);
      if (slugExists) {
        return res.status(400).json({ error: 'A subcategory with this slug already exists in this category' });
      }
    }

    const subcategory = await Subcategory.update(req.params.id, {
      title,
      slug,
      description,
      tonnage_min,
      tonnage_max,
      sort_order,
      is_active
    });

    res.json({ subcategory });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/subcategories/:id
 * Delete subcategory
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Subcategory.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    res.json({ success: true, message: 'Subcategory deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
