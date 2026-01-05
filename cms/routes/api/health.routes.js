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
    
    // Get all tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    res.json({
      products: products.rows[0].count,
      categories: categories.rows[0].count,
      brands: brands.rows[0].count,
      tables: tables.rows.map(r => r.table_name),
      database_url_set: !!process.env.DATABASE_URL
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
