import { pool } from '../config/database.js';

export const Subcategory = {
  /**
   * Get all active subcategories
   */
  async findAll(includeInactive = false) {
    const query = includeInactive
      ? 'SELECT * FROM subcategories ORDER BY sort_order, title'
      : 'SELECT * FROM subcategories WHERE is_active = true ORDER BY sort_order, title';
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Get subcategories by category ID
   */
  async findByCategoryId(categoryId, includeInactive = false) {
    const query = includeInactive
      ? 'SELECT * FROM subcategories WHERE category_id = $1 ORDER BY sort_order, tonnage_min'
      : 'SELECT * FROM subcategories WHERE category_id = $1 AND is_active = true ORDER BY sort_order, tonnage_min';
    const result = await pool.query(query, [categoryId]);
    return result.rows;
  },

  /**
   * Get subcategories by category slug
   */
  async findByCategorySlug(categorySlug, includeInactive = false) {
    const query = includeInactive
      ? `SELECT s.* FROM subcategories s
         JOIN categories c ON s.category_id = c.id
         WHERE c.slug = $1
         ORDER BY s.sort_order, s.tonnage_min`
      : `SELECT s.* FROM subcategories s
         JOIN categories c ON s.category_id = c.id
         WHERE c.slug = $1 AND s.is_active = true
         ORDER BY s.sort_order, s.tonnage_min`;
    const result = await pool.query(query, [categorySlug]);
    return result.rows;
  },

  /**
   * Find subcategory by ID
   */
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM subcategories WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Find subcategory by slug and category
   */
  async findBySlug(categoryId, slug) {
    const result = await pool.query(
      'SELECT * FROM subcategories WHERE category_id = $1 AND slug = $2',
      [categoryId, slug]
    );
    return result.rows[0] || null;
  },

  /**
   * Create subcategory
   */
  async create({ 
    category_id, 
    title, 
    slug, 
    description, 
    tonnage_min, 
    tonnage_max, 
    sort_order = 0 
  }) {
    const result = await pool.query(
      `INSERT INTO subcategories 
       (category_id, title, slug, description, tonnage_min, tonnage_max, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [category_id, title, slug, description, tonnage_min, tonnage_max, sort_order]
    );
    return result.rows[0];
  },

  /**
   * Update subcategory
   */
  async update(id, { 
    title, 
    slug, 
    description, 
    tonnage_min, 
    tonnage_max, 
    sort_order, 
    is_active 
  }) {
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
    if (tonnage_min !== undefined) {
      updates.push(`tonnage_min = $${paramCount++}`);
      values.push(tonnage_min);
    }
    if (tonnage_max !== undefined) {
      updates.push(`tonnage_max = $${paramCount++}`);
      values.push(tonnage_max);
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
      `UPDATE subcategories SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  /**
   * Delete subcategory
   */
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM subcategories WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  },

  /**
   * Get subcategory with product count
   */
  async findAllWithProductCount(categoryId = null) {
    const query = categoryId
      ? `SELECT s.*, COUNT(p.id)::int as product_count
         FROM subcategories s
         LEFT JOIN products p ON p.subcategory_id = s.id AND p.is_active = true
         WHERE s.is_active = true AND s.category_id = $1
         GROUP BY s.id
         ORDER BY s.sort_order, s.tonnage_min`
      : `SELECT s.*, COUNT(p.id)::int as product_count
         FROM subcategories s
         LEFT JOIN products p ON p.subcategory_id = s.id AND p.is_active = true
         WHERE s.is_active = true
         GROUP BY s.id
         ORDER BY s.sort_order, s.tonnage_min`;
    
    const params = categoryId ? [categoryId] : [];
    const result = await pool.query(query, params);
    return result.rows;
  }
};
