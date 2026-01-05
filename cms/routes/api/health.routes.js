import { Router } from 'express';
import { pool } from '../../config/database.js';

const router = Router();

// Basic health check - always responds
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: pool ? 'configured' : 'not configured'
  });
});

// Deep health check - includes database connectivity
router.get('/health/deep', async (req, res) => {
  // Check if database is configured
  if (!pool) {
    return res.status(503).json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      database: {
        configured: false,
        error: 'DATABASE_URL not set'
      },
      uptime: process.uptime()
    });
  }

  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    const dbLatency = Date.now() - start;
    
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        configured: true,
        connected: true,
        latency: `${dbLatency}ms`
      },
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: {
        configured: true,
        connected: false,
        error: error.message
      },
      uptime: process.uptime()
    });
  }
});

// Ping endpoint - minimal response for keep-alive
router.get('/ping', (req, res) => {
  res.send('pong');
});

// Debug endpoint - check database status (temporary)
router.get('/debug/products', async (req, res) => {
  if (!pool) {
    return res.json({ error: 'No database configured' });
  }
  
  try {
    const [products, categories, brands] = await Promise.all([
      pool.query('SELECT COUNT(*)::int as count FROM products'),
      pool.query('SELECT COUNT(*)::int as count FROM categories'),
      pool.query('SELECT COUNT(*)::int as count FROM brands')
    ]);
    
    res.json({
      products: products.rows[0].count,
      categories: categories.rows[0].count,
      brands: brands.rows[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed endpoint - populate database with initial data (only works if empty)
router.post('/debug/seed', async (req, res) => {
  if (!pool) {
    return res.json({ error: 'No database configured' });
  }
  
  try {
    // Check if database already has data
    const existing = await pool.query('SELECT COUNT(*)::int as count FROM categories');
    if (existing.rows[0].count > 0) {
      return res.json({ error: 'Database already has data. Seed skipped.', categories: existing.rows[0].count });
    }
    
    // Create categories
    const categories = [
      { title: 'Graafbakken', slug: 'graafbakken', description: 'Professionele graafbakken voor alle graafmachines.' },
      { title: 'Slotenbakken', slug: 'slotenbakken', description: 'Smalle bakken voor het graven van sloten.' },
      { title: 'Sloop- en sorteergrijpers', slug: 'sloop-sorteergrijpers', description: 'Grijpers voor sloop en recycling.' },
      { title: 'Adapterstukken', slug: 'adapters', description: 'Snelwissels en adapters.' },
      { title: 'Overige', slug: 'overige', description: 'Overige aanbouwdelen.' }
    ];
    
    for (const cat of categories) {
      await pool.query(`
        INSERT INTO categories (title, slug, description, is_active)
        VALUES ($1, $2, $3, true)
        ON CONFLICT (slug) DO NOTHING
      `, [cat.title, cat.slug, cat.description]);
    }
    
    // Create brands
    const brands = [
      { title: 'Caterpillar', slug: 'caterpillar' },
      { title: 'Komatsu', slug: 'komatsu' },
      { title: 'Volvo', slug: 'volvo' },
      { title: 'Hitachi', slug: 'hitachi' },
      { title: 'Liebherr', slug: 'liebherr' },
      { title: 'JCB', slug: 'jcb' }
    ];
    
    for (const brand of brands) {
      await pool.query(`
        INSERT INTO brands (title, slug, is_active)
        VALUES ($1, $2, true)
        ON CONFLICT (slug) DO NOTHING
      `, [brand.title, brand.slug]);
    }
    
    // Get counts
    const [catCount, brandCount] = await Promise.all([
      pool.query('SELECT COUNT(*)::int as count FROM categories'),
      pool.query('SELECT COUNT(*)::int as count FROM brands')
    ]);
    
    res.json({
      success: true,
      message: 'Database seeded successfully',
      categories: catCount.rows[0].count,
      brands: brandCount.rows[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
