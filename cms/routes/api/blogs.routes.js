import { Router } from 'express';
import { pool } from '../../config/database.js';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';

const router = Router();

// =============================================
// ADMIN ROUTES (must be defined BEFORE :slug)
// =============================================

/**
 * GET /api/blogs/admin/all - Get all blogs for admin (includes drafts)
 */
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, u.email as author_email
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      ORDER BY b.created_at DESC
    `);

    res.json({ blogs: result.rows });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

/**
 * GET /api/blogs/admin/:id - Get single blog by ID for admin
 */
router.get('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM blogs WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

/**
 * POST /api/blogs/admin - Create new blog
 */
router.post('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      featured_image,
      status = 'draft',
      meta_title,
      meta_description
    } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug and content are required' });
    }

    const published_at = status === 'published' ? new Date() : null;

    const result = await pool.query(`
      INSERT INTO blogs (title, slug, excerpt, content, featured_image, author_id, status, published_at, meta_title, meta_description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [title, slug, excerpt, content, featured_image, req.user.id, status, published_at, meta_title, meta_description]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating blog:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

/**
 * PUT /api/admin/blogs/:id - Update blog
 */
router.put('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      featured_image,
      status,
      meta_title,
      meta_description
    } = req.body;

    // Get current blog to check status change
    const currentBlog = await pool.query('SELECT status, published_at FROM blogs WHERE id = $1', [id]);
    if (currentBlog.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Set published_at if status changes to published
    let published_at = currentBlog.rows[0].published_at;
    if (status === 'published' && currentBlog.rows[0].status !== 'published') {
      published_at = new Date();
    }

    const result = await pool.query(`
      UPDATE blogs 
      SET title = $1, slug = $2, excerpt = $3, content = $4, featured_image = $5, 
          status = $6, published_at = $7, meta_title = $8, meta_description = $9, updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [title, slug, excerpt, content, featured_image, status, published_at, meta_title, meta_description, id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating blog:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

/**
 * DELETE /api/blogs/admin/:id - Delete blog
 */
router.delete('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// =============================================
// PUBLIC ROUTES (must be defined AFTER admin routes)
// =============================================

/**
 * GET /api/blogs - Get all published blogs (public)
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    const result = await pool.query(`
      SELECT b.*, u.email as author_email
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.status = 'published'
      ORDER BY b.published_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await pool.query(`
      SELECT COUNT(*) FROM blogs WHERE status = 'published'
    `);

    res.json({
      blogs: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

/**
 * GET /api/blogs/:slug - Get single blog by slug (public)
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await pool.query(`
      SELECT b.*, u.email as author_email
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.slug = $1 AND b.status = 'published'
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

export default router;
