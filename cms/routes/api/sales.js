import express from 'express';
import { query } from '../../config/database.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

// GET /api/sales/stats - Get dashboard stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get counts
    const quoteCount = await query('SELECT COUNT(*) FROM quotes WHERE created_at > NOW() - INTERVAL \'30 days\'');
    const orderCount = await query('SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL \'30 days\'');
    const productCount = await query('SELECT COUNT(*) FROM products');
    const customerCount = await query('SELECT COUNT(DISTINCT customer_email) FROM ((SELECT customer_email FROM quotes) UNION (SELECT customer_email FROM orders)) as customers');

    res.json({
      quotes: parseInt(quoteCount.rows[0].count),
      orders: parseInt(orderCount.rows[0].count),
      products: parseInt(productCount.rows[0].count),
      customers: parseInt(customerCount.rows[0].count)
    });
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
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
