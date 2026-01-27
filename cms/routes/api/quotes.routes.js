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
      // Customer info
      customer_name, 
      customer_email, 
      customer_phone,
      company_name,
      vat_number,
      
      // Request details
      request_type,
      message,
      
      // Product info
      product_id, 
      product_name,
      product_category,
      product_slug,
      
      // Machine info
      machine_brand,
      machine_model,
      attachment_type,
      
      // Cart items (JSON array of products)
      cart_items,
      
      // Tracking
      source_page,
      industry,
      brand,
      
      // Reference
      slug
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

    // Generate reference number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const reference = `STR-${year}${month}-${random}`;

    // Insert quote with all fields
    const result = await query(`
      INSERT INTO quotes (
        customer_name, customer_email, customer_phone, company_name, vat_number,
        request_type, message,
        product_id, product_name, product_category, product_slug,
        machine_brand, machine_model, attachment_type,
        cart_items,
        source_page, industry, brand,
        reference, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 'new')
      RETURNING id, reference, created_at
    `, [
      customer_name,
      customer_email,
      customer_phone || null,
      company_name || null,
      vat_number || null,
      request_type || 'offerte',
      message || null,
      product_id || null,
      product_name || null,
      product_category || null,
      product_slug || null,
      machine_brand || null,
      machine_model || null,
      attachment_type || null,
      cart_items ? JSON.stringify(cart_items) : null,
      source_page || null,
      industry || null,
      brand || null,
      reference
    ]);

    const cartCount = cart_items ? (Array.isArray(cart_items) ? cart_items.length : 0) : 0;
    console.log(`📧 New quote request ${reference} from ${customer_email} (${company_name || 'no company'}) - ${cartCount} cart items`);

    res.status(201).json({
      success: true,
      message: 'Offerte aanvraag ontvangen',
      quote_id: result.rows[0].id,
      reference: result.rows[0].reference,
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
