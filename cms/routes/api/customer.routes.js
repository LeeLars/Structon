/**
 * Customer API Routes
 * Endpoints for customer dashboard - quotes, orders, profile
 */

import { Router } from 'express';
import { query } from '../../config/database.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

/**
 * GET /api/quotes/my
 * Get quotes for the logged-in customer (by email)
 */
router.get('/quotes/my', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    const result = await query(`
      SELECT id, product_id, product_name, customer_name, customer_email, 
             customer_phone, message, status, created_at, updated_at
      FROM quotes 
      WHERE customer_email = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [userEmail]);
    
    res.json({ quotes: result.rows });
  } catch (error) {
    console.error('Error fetching customer quotes:', error);
    res.status(500).json({ error: 'Fout bij ophalen offertes' });
  }
});

/**
 * GET /api/orders/my
 * Get orders for the logged-in customer (by email)
 */
router.get('/orders/my', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    const result = await query(`
      SELECT id, order_number, customer_name, customer_email, 
             total_amount, status, items, created_at, updated_at
      FROM orders 
      WHERE customer_email = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [userEmail]);
    
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Fout bij ophalen bestellingen' });
  }
});

/**
 * GET /api/customer/profile
 * Get customer profile data
 */
router.get('/customer/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user data
    const userResult = await query(`
      SELECT id, email, role, is_active, created_at
      FROM users WHERE id = $1
    `, [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }
    
    // Get customer profile if exists
    const profileResult = await query(`
      SELECT * FROM customer_profiles WHERE user_id = $1
    `, [userId]);
    
    res.json({
      user: userResult.rows[0],
      profile: profileResult.rows[0] || null
    });
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ error: 'Fout bij ophalen profiel' });
  }
});

/**
 * PATCH /api/customer/profile
 * Update customer profile
 */
router.patch('/customer/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      first_name, last_name, phone,
      company_name, vat_number, kvk_number,
      address, postal_code, city, country
    } = req.body;
    
    // Check if profile exists
    const existing = await query(
      'SELECT id FROM customer_profiles WHERE user_id = $1',
      [userId]
    );
    
    if (existing.rows.length === 0) {
      // Create new profile
      await query(`
        INSERT INTO customer_profiles 
        (user_id, first_name, last_name, phone, company_name, vat_number, kvk_number, address, postal_code, city, country)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [userId, first_name, last_name, phone, company_name, vat_number, kvk_number, address, postal_code, city, country]);
    } else {
      // Update existing profile
      await query(`
        UPDATE customer_profiles SET
          first_name = COALESCE($2, first_name),
          last_name = COALESCE($3, last_name),
          phone = COALESCE($4, phone),
          company_name = COALESCE($5, company_name),
          vat_number = COALESCE($6, vat_number),
          kvk_number = COALESCE($7, kvk_number),
          address = COALESCE($8, address),
          postal_code = COALESCE($9, postal_code),
          city = COALESCE($10, city),
          country = COALESCE($11, country),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
      `, [userId, first_name, last_name, phone, company_name, vat_number, kvk_number, address, postal_code, city, country]);
    }
    
    res.json({ success: true, message: 'Profiel bijgewerkt' });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    res.status(500).json({ error: 'Fout bij bijwerken profiel' });
  }
});

/**
 * GET /api/customer/stats
 * Get dashboard statistics for customer
 */
router.get('/customer/stats', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    // Get quote counts
    const quotesResult = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE status IN ('new', 'processing', 'quoted')) as open_quotes,
        COUNT(*) as total_quotes
      FROM quotes WHERE customer_email = $1
    `, [userEmail]);
    
    // Get order counts
    const ordersResult = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE status IN ('pending', 'processing', 'shipped')) as active_orders,
        COUNT(*) as total_orders
      FROM orders WHERE customer_email = $1
    `, [userEmail]);
    
    res.json({
      quotes: {
        open: parseInt(quotesResult.rows[0]?.open_quotes || 0),
        total: parseInt(quotesResult.rows[0]?.total_quotes || 0)
      },
      orders: {
        active: parseInt(ordersResult.rows[0]?.active_orders || 0),
        total: parseInt(ordersResult.rows[0]?.total_orders || 0)
      }
    });
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    res.status(500).json({ error: 'Fout bij ophalen statistieken' });
  }
});

export default router;
