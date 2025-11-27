import { Router } from 'express';
import { Brand } from '../../models/index.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/brands
 */
router.get('/', async (req, res, next) => {
  try {
    const brands = await Brand.findAll(true);
    res.json({ brands });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/brands
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, slug, logo_url } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const brandSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await Brand.findBySlug(brandSlug);
    if (existing) {
      return res.status(400).json({ error: 'A brand with this slug already exists' });
    }

    const brand = await Brand.create({ title, slug: brandSlug, logo_url });
    res.status(201).json({ brand });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/admin/brands/:id
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const { title, slug, logo_url, is_active } = req.body;

    const existing = await Brand.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await Brand.findBySlug(slug);
      if (slugExists) {
        return res.status(400).json({ error: 'A brand with this slug already exists' });
      }
    }

    const brand = await Brand.update(req.params.id, { title, slug, logo_url, is_active });
    res.json({ brand });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/brands/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Brand.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json({ success: true, message: 'Brand deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
