import express from 'express';
import { query } from '../../config/database.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

// GET /api/sales/stats - Get dashboard stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get counts with fallback if tables don't exist
    let quotes = 0, orders = 0, products = 0, customers = 0;
    
    try {
      const quoteCount = await query('SELECT COUNT(*) FROM quotes WHERE created_at > NOW() - INTERVAL \'30 days\'');
      quotes = parseInt(quoteCount.rows[0].count);
    } catch (e) {
      console.warn('Quotes table not ready:', e.message);
    }
    
    try {
      const orderCount = await query('SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL \'30 days\'');
      orders = parseInt(orderCount.rows[0].count);
    } catch (e) {
      console.warn('Orders table not ready:', e.message);
    }
    
    try {
      const productCount = await query('SELECT COUNT(*) FROM products');
      products = parseInt(productCount.rows[0].count);
    } catch (e) {
      console.warn('Products table error:', e.message);
    }
    
    try {
      const customerCount = await query('SELECT COUNT(DISTINCT customer_email) FROM ((SELECT customer_email FROM quotes) UNION (SELECT customer_email FROM orders)) as customers');
      customers = parseInt(customerCount.rows[0].count);
    } catch (e) {
      console.warn('Customer count error:', e.message);
    }

    res.json({ quotes, orders, products, customers });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/sales/quotes - Get recent quotes
router.get('/quotes', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT q.*, p.title as product_title 
      FROM quotes q
      LEFT JOIN products p ON q.product_id = p.id
      ORDER BY q.created_at DESC 
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Quotes error:', error);
    // Return empty array if table doesn't exist yet
    if (error.message.includes('does not exist')) {
      return res.json([]);
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/sales/orders - Get recent orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    console.error('Orders error:', error);
    // Return empty array if table doesn't exist yet
    if (error.message.includes('does not exist')) {
      return res.json([]);
    }
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
