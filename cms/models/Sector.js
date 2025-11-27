import { pool } from '../config/database.js';

export const Sector = {
  /**
   * Get all active sectors
   */
  async findAll(includeInactive = false) {
    const query = includeInactive
      ? 'SELECT * FROM sectors ORDER BY title'
      : 'SELECT * FROM sectors WHERE is_active = true ORDER BY title';
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Find sector by ID
   */
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM sectors WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Find sector by slug
   */
  async findBySlug(slug) {
    const result = await pool.query(
      'SELECT * FROM sectors WHERE slug = $1',
      [slug]
    );
    return result.rows[0] || null;
  },

  /**
   * Create sector
   */
  async create({ title, slug, description, image_url }) {
    const result = await pool.query(
      `INSERT INTO sectors (title, slug, description, image_url) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [title, slug, description, image_url]
    );
    return result.rows[0];
  },

  /**
   * Update sector
   */
  async update(id, { title, slug, description, image_url, is_active }) {
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
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (image_url !== undefined) {
      updates.push(`image_url = $${paramCount++}`);
      values.push(image_url);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    const result = await pool.query(
      `UPDATE sectors SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  /**
   * Delete sector
   */
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM sectors WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  },

  /**
   * Get sectors with product count
   */
  async findAllWithProductCount() {
    const result = await pool.query(`
      SELECT s.*, COUNT(ps.product_id)::int as product_count
      FROM sectors s
      LEFT JOIN product_sectors ps ON ps.sector_id = s.id
      LEFT JOIN products p ON p.id = ps.product_id AND p.is_active = true
      WHERE s.is_active = true
      GROUP BY s.id
      ORDER BY s.title
    `);
    return result.rows;
  }
};
