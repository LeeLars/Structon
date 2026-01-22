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
    
    // Create categories (alleen hoofdcategorieën - Slotenbakken is subcategorie van Graafbakken)
    const categories = [
      { title: 'Graafbakken', slug: 'graafbakken', description: 'Professionele graafbakken voor alle graafmachines.' },
      { title: 'Sloop- en sorteergrijpers', slug: 'sloop-sorteergrijpers', description: 'Grijpers voor sloop en recycling.' },
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

// Seed subcategories endpoint
router.post('/debug/seed-subcategories', async (req, res) => {
  if (!pool) {
    return res.json({ error: 'No database configured' });
  }
  
  try {
    // Get category IDs
    const catResult = await pool.query('SELECT id, slug FROM categories');
    const categoryMap = {};
    catResult.rows.forEach(row => categoryMap[row.slug] = row.id);
    
    if (Object.keys(categoryMap).length === 0) {
      return res.json({ error: 'No categories found. Run /debug/seed first.' });
    }
    
    // Subcategories per category (matching header navigation)
    const subcategories = [
      // Graafbakken subcategories
      { title: 'Slotenbakken', slug: 'slotenbakken', category_slug: 'graafbakken', sort_order: 1 },
      { title: 'Dieplepelbakken', slug: 'dieplepelbakken', category_slug: 'graafbakken', sort_order: 2 },
      { title: 'Sleuvenbakken', slug: 'sleuvenbakken', category_slug: 'graafbakken', sort_order: 3 },
      { title: 'Kantelbakken', slug: 'kantelbakken', category_slug: 'graafbakken', sort_order: 4 },
      { title: 'Rioolbakken', slug: 'rioolbakken', category_slug: 'graafbakken', sort_order: 5 },
      { title: 'Trapezium Bakken', slug: 'trapezium-bakken', category_slug: 'graafbakken', sort_order: 6 },
      { title: 'Grondverzet Bakken', slug: 'grondverzet-bakken', category_slug: 'graafbakken', sort_order: 7 },
      { title: 'Plantenbakken', slug: 'plantenbakken', category_slug: 'graafbakken', sort_order: 8 },
      
      // Sloop- en sorteergrijpers subcategories
      { title: 'Sorteergrijpers', slug: 'sorteergrijpers', category_slug: 'sloop-sorteergrijpers', sort_order: 1 },
      { title: 'Sloopgrijpers', slug: 'sloopgrijpers', category_slug: 'sloop-sorteergrijpers', sort_order: 2 },
      { title: 'Puingrijpers', slug: 'puingrijpers', category_slug: 'sloop-sorteergrijpers', sort_order: 3 },
      { title: 'Houtgrijpers', slug: 'houtgrijpers', category_slug: 'sloop-sorteergrijpers', sort_order: 4 },
      { title: 'Steengrijpers', slug: 'steengrijpers', category_slug: 'sloop-sorteergrijpers', sort_order: 5 },
      
      // Overige subcategories
      { title: 'Ripper Tanden', slug: 'ripper-tanden', category_slug: 'overige', sort_order: 1 },
      { title: 'Hydraulische Hamers', slug: 'hydraulische-hamers', category_slug: 'overige', sort_order: 2 },
      { title: 'Egaliseerbalken', slug: 'egaliseerbalken', category_slug: 'overige', sort_order: 3 },
      { title: 'Verdichtingsplaten', slug: 'verdichtingsplaten', category_slug: 'overige', sort_order: 4 },
      { title: 'Rupsbanden', slug: 'rupsbanden', category_slug: 'overige', sort_order: 5 },
      { title: 'Slijttanden', slug: 'slijttanden', category_slug: 'overige', sort_order: 6 }
    ];
    
    let created = 0;
    for (const sub of subcategories) {
      const categoryId = categoryMap[sub.category_slug];
      if (!categoryId) continue;
      
      // Check if subcategory already exists
      const existing = await pool.query(
        'SELECT id FROM subcategories WHERE slug = $1',
        [sub.slug]
      );
      
      if (existing.rows.length === 0) {
        await pool.query(`
          INSERT INTO subcategories (title, slug, category_id, sort_order, is_active)
          VALUES ($1, $2, $3, $4, true)
        `, [sub.title, sub.slug, categoryId, sub.sort_order]);
        created++;
      }
    }
    
    const subCount = await pool.query('SELECT COUNT(*)::int as count FROM subcategories');
    
    res.json({
      success: true,
      message: `Subcategories seeded successfully`,
      subcategories: subCount.rows[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add sample products endpoint
router.post('/debug/seed-products', async (req, res) => {
  if (!pool) {
    return res.json({ error: 'No database configured' });
  }
  
  try {
    // Get category IDs
    const catResult = await pool.query('SELECT id, slug FROM categories');
    const categoryMap = {};
    catResult.rows.forEach(row => categoryMap[row.slug] = row.id);
    
    if (Object.keys(categoryMap).length === 0) {
      return res.json({ error: 'No categories found. Run /debug/seed first.' });
    }
    
    // Sample products matching the CMS screenshot
    const products = [
      {
        title: 'Slotenbak 600mm CW30',
        slug: 'slotenbak-600mm-cw30',
        description: 'Professionele slotenbak voor graafmachines van 8-15 ton.',
        category_slug: 'slotenbakken',
        excavator_weight_min: 8000,
        excavator_weight_max: 15000,
        width: 600,
        volume: 120,
        weight: 85,
        attachment_type: 'CW30',
        stock_quantity: 5,
        price: 2450.00,
        is_featured: true
      },
      {
        title: 'Graafbak 1200mm CW40',
        slug: 'graafbak-1200mm-cw40',
        description: 'Zware graafbak voor grote graafmachines.',
        category_slug: 'graafbakken',
        excavator_weight_min: 15000,
        excavator_weight_max: 40000,
        width: 1200,
        volume: 450,
        weight: 280,
        attachment_type: 'CW40',
        stock_quantity: 3,
        price: 2945.00,
        is_featured: false
      },
      {
        title: 'Sorteergrijper 800mm',
        slug: 'sorteergrijper-800mm',
        description: 'Veelzijdige sorteergrijper voor sloop en recycling.',
        category_slug: 'sloop-sorteergrijpers',
        excavator_weight_min: 8000,
        excavator_weight_max: 25000,
        width: 800,
        volume: null,
        weight: 450,
        attachment_type: 'S50',
        stock_quantity: 2,
        price: 3200.00,
        is_featured: true
      },
      {
        title: 'Plantenbak 400mm CW10',
        slug: 'plantenbak-400mm-cw10',
        description: 'Compacte plantenbak voor kleine graafmachines.',
        category_slug: 'overige',
        excavator_weight_min: 1500,
        excavator_weight_max: 8000,
        width: 400,
        volume: 45,
        weight: 35,
        attachment_type: 'CW10',
        stock_quantity: 8,
        price: 1875.00,
        is_featured: false
      },
      {
        title: 'Rioolbak 300mm CW20',
        slug: 'rioolbak-300mm-cw20',
        description: 'Smalle rioolbak voor precisiewerk.',
        category_slug: 'slotenbakken',
        excavator_weight_min: 3000,
        excavator_weight_max: 8000,
        width: 300,
        volume: 60,
        weight: 55,
        attachment_type: 'CW20',
        stock_quantity: 0,
        price: 1250.00,
        is_featured: false
      }
    ];
    
    let created = 0;
    for (const product of products) {
      const categoryId = categoryMap[product.category_slug];
      if (!categoryId) continue;
      
      const result = await pool.query(`
        INSERT INTO products (
          title, slug, description, category_id,
          excavator_weight_min, excavator_weight_max, width, volume, weight,
          attachment_type, stock_quantity, is_featured, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
        ON CONFLICT (slug) DO UPDATE SET is_active = true
        RETURNING id
      `, [
        product.title, product.slug, product.description, categoryId,
        product.excavator_weight_min, product.excavator_weight_max,
        product.width, product.volume, product.weight,
        product.attachment_type, product.stock_quantity, product.is_featured
      ]);
      
      // Add price
      if (result.rows[0] && product.price) {
        await pool.query(`
          INSERT INTO product_prices (product_id, price)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [result.rows[0].id, product.price]);
      }
      created++;
    }
    
    const count = await pool.query('SELECT COUNT(*)::int as count FROM products WHERE is_active = true');
    
    res.json({
      success: true,
      message: `Created ${created} products`,
      total_active_products: count.rows[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug auth endpoint
router.get('/debug/auth', async (req, res) => {
  const token = req.cookies?.auth_token;
  
  res.json({
    hasCookie: !!token,
    cookieValue: token ? `${token.substring(0, 20)}...` : null,
    headers: {
      authorization: req.headers.authorization || null,
      cookie: req.headers.cookie ? 'present' : 'missing'
    }
  });
});

// Debug cloudinary config endpoint
router.get('/debug/cloudinary', async (req, res) => {
  const { env } = await import('../../config/env.js');
  
  res.json({
    configured: !!(env.cloudinary?.cloudName && env.cloudinary?.apiKey && env.cloudinary?.apiSecret),
    cloudName: env.cloudinary?.cloudName ? `${env.cloudinary.cloudName.substring(0, 4)}...` : null,
    hasApiKey: !!env.cloudinary?.apiKey,
    hasApiSecret: !!env.cloudinary?.apiSecret
  });
});

// Debug product creation endpoint
router.post('/debug/test-product', async (req, res) => {
  try {
    const { pool } = await import('../../config/database.js');
    
    // Test simple product insert
    const result = await pool.query(`
      INSERT INTO products (
        title, slug, excavator_weight_min, excavator_weight_max, 
        width, attachment_type, stock_quantity, is_active, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      'Debug Test Product',
      'debug-test-product-' + Date.now(),
      1.5,
      3,
      200,
      'CW05',
      10,
      true,
      false
    ]);
    
    res.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      code: error.code
    });
  }
});

export default router;
