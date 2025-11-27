import { Router } from 'express';
import { Category } from '../../models/index.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/categories
 * Get all categories (including inactive)
 */
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll(true);
    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/categories
 * Create category
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, slug, description, image_url, sort_order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const categorySlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await Category.findBySlug(categorySlug);
    if (existing) {
      return res.status(400).json({ error: 'A category with this slug already exists' });
    }

    const category = await Category.create({
      title,
      slug: categorySlug,
      description,
      image_url,
      sort_order
    });

    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/admin/categories/:id
 * Update category
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const { title, slug, description, image_url, sort_order, is_active } = req.body;

    const existing = await Category.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await Category.findBySlug(slug);
      if (slugExists) {
        return res.status(400).json({ error: 'A category with this slug already exists' });
      }
    }

    const category = await Category.update(req.params.id, {
      title,
      slug,
      description,
      image_url,
      sort_order,
      is_active
    });

    res.json({ category });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/categories/:id
 * Delete category
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Category.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
