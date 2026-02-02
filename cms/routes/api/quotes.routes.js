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
 * Get all quotes for CMS - ONLY offerte and maatwerk
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT q.*, p.title as product_title 
      FROM quotes q
      LEFT JOIN products p ON q.product_id = p.id
      WHERE q.request_type IN ('offerte', 'maatwerk')
    `;
    
    const params = [];
    
    if (status) {
      sql += ' AND q.status = $1';
      params.push(status);
    }
    
    sql += ' ORDER BY q.created_at DESC';
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await query(sql, params);
    
    // Parse cart_items JSON for each quote
    const quotes = result.rows.map(quote => {
      if (quote.cart_items && typeof quote.cart_items === 'string') {
        try {
          quote.cart_items = JSON.parse(quote.cart_items);
        } catch (e) {
          console.warn('Failed to parse cart_items for quote', quote.id);
          quote.cart_items = null;
        }
      }
      return quote;
    });
    
    // Get total count
    let countSql = "SELECT COUNT(*) FROM quotes WHERE request_type IN ('offerte', 'maatwerk')";
    const countParams = [];
    if (status) {
      countSql += ' AND status = $1';
      countParams.push(status);
    }
    const countResult = await query(countSql, countParams);
    
    res.json({
      quotes,
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
 * GET /api/requests (Protected - admin only)
 * Get all requests for CMS - ONLY contact, vraag, and dealer
 */
router.get('/requests', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT q.*, p.title as product_title 
      FROM quotes q
      LEFT JOIN products p ON q.product_id = p.id
      WHERE q.request_type IN ('contact', 'vraag', 'dealer')
    `;
    
    const params = [];
    
    if (status) {
      sql += ' AND q.status = $1';
      params.push(status);
    }
    
    sql += ' ORDER BY q.created_at DESC';
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await query(sql, params);
    
    // Parse cart_items JSON for each request
    const requests = result.rows.map(request => {
      if (request.cart_items && typeof request.cart_items === 'string') {
        try {
          request.cart_items = JSON.parse(request.cart_items);
        } catch (e) {
          console.warn('Failed to parse cart_items for request', request.id);
          request.cart_items = null;
        }
      }
      return request;
    });
    
    // Get total count
    let countSql = "SELECT COUNT(*) FROM quotes WHERE request_type IN ('contact', 'vraag', 'dealer')";
    const countParams = [];
    if (status) {
      countSql += ' AND status = $1';
      countParams.push(status);
    }
    const countResult = await query(countSql, countParams);
    
    res.json({
      requests,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
  } catch (error) {
    console.error('Get requests error:', error);
    if (error.message.includes('does not exist')) {
      return res.json({ requests: [], total: 0 });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * PUT /api/quotes/:id (Protected - admin only)
 * Update quote status or mark as viewed
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, viewed } = req.body;
    
    const validStatuses = ['new', 'processing', 'quoted', 'won', 'lost'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Ongeldige status' });
    }
    
    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    
    if (viewed !== undefined) {
      updates.push(`viewed = $${paramCount}`);
      values.push(viewed);
      paramCount++;
      
      if (viewed) {
        updates.push(`viewed_at = CURRENT_TIMESTAMP`);
      }
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    
    const result = await query(`
      UPDATE quotes 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);
    
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
