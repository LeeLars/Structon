import { Router } from 'express';
import { Sector } from '../../models/index.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/sectors
 */
router.get('/', async (req, res, next) => {
  try {
    const sectors = await Sector.findAll(true);
    res.json({ sectors });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/sectors
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, slug, description, image_url } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const sectorSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await Sector.findBySlug(sectorSlug);
    if (existing) {
      return res.status(400).json({ error: 'A sector with this slug already exists' });
    }

    const sector = await Sector.create({ title, slug: sectorSlug, description, image_url });
    res.status(201).json({ sector });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/admin/sectors/:id
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const { title, slug, description, image_url, is_active } = req.body;

    const existing = await Sector.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Sector not found' });
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await Sector.findBySlug(slug);
      if (slugExists) {
        return res.status(400).json({ error: 'A sector with this slug already exists' });
      }
    }

    const sector = await Sector.update(req.params.id, { title, slug, description, image_url, is_active });
    res.json({ sector });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/sectors/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Sector.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Sector not found' });
    }
    res.json({ success: true, message: 'Sector deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
