import { pool } from '../config/database.js';

export const ProductPrice = {
  /**
   * Get current price for a product
   * Returns the most recent valid price
   */
  async getCurrentPrice(productId, userId = null) {
    // First check for user-specific price
    if (userId) {
      const userPrice = await pool.query(`
        SELECT * FROM product_prices 
        WHERE product_id = $1 
          AND visible_for_user_id = $2
          AND (valid_until IS NULL OR valid_until > NOW())
        ORDER BY created_at DESC
        LIMIT 1
      `, [productId, userId]);
      
      if (userPrice.rows[0]) {
        return userPrice.rows[0];
      }
    }

    // Fall back to general price
    const result = await pool.query(`
      SELECT * FROM product_prices 
      WHERE product_id = $1 
        AND visible_for_user_id IS NULL
        AND (valid_until IS NULL OR valid_until > NOW())
      ORDER BY created_at DESC
      LIMIT 1
    `, [productId]);

    return result.rows[0] || null;
  },

  /**
   * Get all prices for a product (admin)
   */
  async findByProduct(productId) {
    const result = await pool.query(`
      SELECT pp.*, u.email as user_email
      FROM product_prices pp
      LEFT JOIN users u ON pp.visible_for_user_id = u.id
      WHERE pp.product_id = $1
      ORDER BY pp.created_at DESC
    `, [productId]);
    return result.rows;
  },

  /**
   * Set price for a product
   */
  async setPrice(productId, price, { userId = null, validUntil = null } = {}) {
    // Validate price format (max 2 decimals, positive)
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(price.toString()) || parseFloat(price) < 0) {
      throw new Error('Invalid price format. Must be a positive number with max 2 decimals.');
    }

    const result = await pool.query(`
      INSERT INTO product_prices (product_id, price, visible_for_user_id, valid_until)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [productId, price, userId, validUntil]);

    return result.rows[0];
  },

  /**
   * Update price
   */
  async update(id, { price, validUntil }) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (price !== undefined) {
      const priceRegex = /^\d+(\.\d{1,2})?$/;
      if (!priceRegex.test(price.toString()) || parseFloat(price) < 0) {
        throw new Error('Invalid price format');
      }
      updates.push(`price = $${paramCount++}`);
      values.push(price);
    }
    if (validUntil !== undefined) {
      updates.push(`valid_until = $${paramCount++}`);
      values.push(validUntil);
    }

    if (updates.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE product_prices SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  /**
   * Delete price
   */
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM product_prices WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  },

  /**
   * Get all products with their current prices (admin overview)
   */
  async getAllWithProducts() {
    const result = await pool.query(`
      SELECT p.id, p.title, p.slug,
             (SELECT price FROM product_prices pp 
              WHERE pp.product_id = p.id 
                AND pp.visible_for_user_id IS NULL
                AND (pp.valid_until IS NULL OR pp.valid_until > NOW())
              ORDER BY pp.created_at DESC LIMIT 1) as current_price
      FROM products p
      WHERE p.is_active = true
      ORDER BY p.title
    `);
    return result.rows;
  },

  /**
   * Bulk set prices
   */
  async bulkSetPrices(prices) {
    const results = [];
    for (const { productId, price } of prices) {
      const result = await this.setPrice(productId, price);
      results.push(result);
    }
    return results;
  }
};
