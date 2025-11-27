import { pool } from '../config/database.js';

export const Category = {
  /**
   * Get all active categories
   */
  async findAll(includeInactive = false) {
    const query = includeInactive
      ? 'SELECT * FROM categories ORDER BY sort_order, title'
      : 'SELECT * FROM categories WHERE is_active = true ORDER BY sort_order, title';
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Find category by ID
   */
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Find category by slug
   */
  async findBySlug(slug) {
    const result = await pool.query(
      'SELECT * FROM categories WHERE slug = $1',
      [slug]
    );
    return result.rows[0] || null;
  },

  /**
   * Create category
   */
  async create({ title, slug, description, image_url, sort_order = 0 }) {
    const result = await pool.query(
      `INSERT INTO categories (title, slug, description, image_url, sort_order) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [title, slug, description, image_url, sort_order]
    );
    return result.rows[0];
  },

  /**
   * Update category
   */
  async update(id, { title, slug, description, image_url, sort_order, is_active }) {
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
    if (sort_order !== undefined) {
      updates.push(`sort_order = $${paramCount++}`);
      values.push(sort_order);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    const result = await pool.query(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  /**
   * Delete category
   */
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  },

  /**
   * Get category with product count
   */
  async findAllWithProductCount() {
    const result = await pool.query(`
      SELECT c.*, COUNT(p.id)::int as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.sort_order, c.title
    `);
    return result.rows;
  }
};
