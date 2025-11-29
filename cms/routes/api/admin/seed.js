/**
 * Database Seeding Endpoint
 * POST /api/admin/seed - Seed database with demo data
 */

import express from 'express';
import { pool } from '../../../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * Seed database with demo data
 */
router.post('/', async (req, res) => {
  try {
    console.log('🌱 Seeding database via API...');
    
    // Path: /cms/routes/api/admin/seed.js -> /cms/database/migrations/
    // Go up 3 levels: admin -> api -> routes -> cms, then into database/migrations
    const seedPath = path.join(__dirname, '../../../database/migrations/007_seed_demo_data.sql');
    console.log('Seed file path:', seedPath);
    
    // Read seed SQL
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    // Execute seed
    await pool.query(seedSQL);
    
    // Verify counts
    const [categories, brands, products] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM categories'),
      pool.query('SELECT COUNT(*) FROM brands'),
      pool.query('SELECT COUNT(*) FROM products')
    ]);
    
    const result = {
      success: true,
      message: 'Database seeded successfully',
      counts: {
        categories: parseInt(categories.rows[0].count),
        brands: parseInt(brands.rows[0].count),
        products: parseInt(products.rows[0].count)
      }
    };
    
    console.log('✅ Seed complete:', result.counts);
    res.json(result);
    
  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Check database status
 */
router.get('/status', async (req, res) => {
  try {
    const [categories, brands, products] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM categories'),
      pool.query('SELECT COUNT(*) FROM brands'),
      pool.query('SELECT COUNT(*) FROM products')
    ]);
    
    res.json({
      categories: parseInt(categories.rows[0].count),
      brands: parseInt(brands.rows[0].count),
      products: parseInt(products.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
