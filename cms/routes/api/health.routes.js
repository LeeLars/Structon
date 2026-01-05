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

// Debug endpoint - check products status (temporary)
router.get('/debug/products', async (req, res) => {
  if (!pool) {
    return res.json({ error: 'No database configured' });
  }
  
  try {
    const [total, active, inactive] = await Promise.all([
      pool.query('SELECT COUNT(*)::int as count FROM products'),
      pool.query('SELECT COUNT(*)::int as count FROM products WHERE is_active = true'),
      pool.query('SELECT COUNT(*)::int as count FROM products WHERE is_active = false OR is_active IS NULL')
    ]);
    
    // Get sample of products with their is_active status
    const sample = await pool.query(`
      SELECT id, title, slug, is_active, is_featured, category_id 
      FROM products 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    res.json({
      total: total.rows[0].count,
      active: active.rows[0].count,
      inactive: inactive.rows[0].count,
      sample: sample.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
