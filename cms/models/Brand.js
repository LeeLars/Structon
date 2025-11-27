import { pool } from '../config/database.js';

export const Brand = {
  /**
   * Get all active brands
   */
  async findAll(includeInactive = false) {
    const query = includeInactive
      ? 'SELECT * FROM brands ORDER BY title'
      : 'SELECT * FROM brands WHERE is_active = true ORDER BY title';
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Find brand by ID
   */
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM brands WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Find brand by slug
   */
  async findBySlug(slug) {
    const result = await pool.query(
      'SELECT * FROM brands WHERE slug = $1',
      [slug]
    );
    return result.rows[0] || null;
  },

  /**
   * Create brand
   */
  async create({ title, slug, logo_url }) {
    const result = await pool.query(
      `INSERT INTO brands (title, slug, logo_url) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [title, slug, logo_url]
    );
    return result.rows[0];
  },

  /**
   * Update brand
   */
  async update(id, { title, slug, logo_url, is_active }) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (slug !== undefined) {
      updates.push(`slug = $${paramCount++}`);
      values.push(slug);
    }
    if (logo_url !== undefined) {
      updates.push(`logo_url = $${paramCount++}`);
      values.push(logo_url);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    const result = await pool.query(
      `UPDATE brands SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  /**
   * Delete brand
   */
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM brands WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  },

  /**
   * Get brands with product count
   */
  async findAllWithProductCount() {
    const result = await pool.query(`
      SELECT b.*, COUNT(p.id)::int as product_count
      FROM brands b
      LEFT JOIN products p ON p.brand_id = b.id AND p.is_active = true
      WHERE b.is_active = true
      GROUP BY b.id
      ORDER BY b.title
    `);
    return result.rows;
  }
};
