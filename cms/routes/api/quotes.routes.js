/**
 * Public Quotes API Routes
 * Allows website visitors to submit quote requests
 */

import { Router } from 'express';
import { query } from '../../config/database.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

/**
 * POST /api/quotes
 * Submit a new quote request (PUBLIC - no auth required)
 */
router.post('/', async (req, res) => {
  try {
    const { 
      product_id, 
      product_name, 
      customer_name, 
      customer_email, 
      customer_phone, 
      message 
    } = req.body;

    // Validation
    if (!customer_name || !customer_email) {
      return res.status(400).json({ 
        error: 'Naam en email zijn verplicht' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return res.status(400).json({ 
        error: 'Ongeldig emailadres' 
      });
    }

    // Insert quote
    const result = await query(`
      INSERT INTO quotes (product_id, product_name, customer_name, customer_email, customer_phone, message, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'new')
      RETURNING id, created_at
    `, [
      product_id || null,
      product_name || null,
      customer_name,
      customer_email,
      customer_phone || null,
      message || null
    ]);

    console.log(`📧 New quote request from ${customer_email} for ${product_name || 'general inquiry'}`);

    res.status(201).json({
      success: true,
      message: 'Offerte aanvraag ontvangen',
      quote_id: result.rows[0].id,
      created_at: result.rows[0].created_at
    });

  } catch (error) {
    console.error('Quote submission error:', error);
    res.status(500).json({ 
      error: 'Er is een fout opgetreden. Probeer het later opnieuw.' 
    });
  }
});

/**
 * GET /api/quotes (Protected - admin only)
 * Get all quotes for CMS
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT q.*, p.title as product_title 
      FROM quotes q
      LEFT JOIN products p ON q.product_id = p.id
    `;
    
    const params = [];
    
    if (status) {
      sql += ' WHERE q.status = $1';
      params.push(status);
    }
    
    sql += ' ORDER BY q.created_at DESC';
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await query(sql, params);
    
    // Get total count
    let countSql = 'SELECT COUNT(*) FROM quotes';
    if (status) {
      countSql += ' WHERE status = $1';
    }
    const countResult = await query(countSql, status ? [status] : []);
    
    res.json({
      quotes: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
  } catch (error) {
    console.error('Get quotes error:', error);
    if (error.message.includes('does not exist')) {
      return res.json({ quotes: [], total: 0 });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * PUT /api/quotes/:id (Protected - admin only)
 * Update quote status
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['new', 'processing', 'quoted', 'won', 'lost'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Ongeldige status' });
    }
    
    const result = await query(`
      UPDATE quotes 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Offerte niet gevonden' });
    }
    
    res.json({ quote: result.rows[0] });
    
  } catch (error) {
    console.error('Update quote error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * DELETE /api/quotes/:id (Protected - admin only)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM quotes WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Offerte niet gevonden' });
    }
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Delete quote error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
