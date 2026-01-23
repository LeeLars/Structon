import { pool } from '../config/database.js';

export const Product = {
  /**
   * Get all active products with optional filters
   */
  async findAll(filters = {}) {
    let query = `
      SELECT p.*, 
             c.title as category_title, c.slug as category_slug,
             sc.title as subcategory_title, sc.slug as subcategory_slug,
             b.title as brand_title, b.slug as brand_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.is_active = true
    `;
    const values = [];
    let paramCount = 1;

    // Category filter
    if (filters.category_id) {
      query += ` AND p.category_id = $${paramCount++}`;
      values.push(filters.category_id);
    }
    if (filters.category_slug) {
      query += ` AND c.slug = $${paramCount++}`;
      values.push(filters.category_slug);
    }

    // Subcategory filter
    if (filters.subcategory_id) {
      query += ` AND p.subcategory_id = $${paramCount++}`;
      values.push(filters.subcategory_id);
    }
    if (filters.subcategory_slug) {
      query += ` AND sc.slug = $${paramCount++}`;
      values.push(filters.subcategory_slug);
    }

    // Brand filter
    if (filters.brand_id) {
      query += ` AND p.brand_id = $${paramCount++}`;
      values.push(filters.brand_id);
    }
    if (filters.brand_slug) {
      query += ` AND b.slug = $${paramCount++}`;
      values.push(filters.brand_slug);
    }

    // Attachment type filter
    if (filters.attachment_type) {
      query += ` AND p.attachment_type = $${paramCount++}`;
      values.push(filters.attachment_type);
    }

    // Excavator weight range filter
    if (filters.excavator_weight) {
      query += ` AND p.excavator_weight_min <= $${paramCount} AND p.excavator_weight_max >= $${paramCount++}`;
      values.push(filters.excavator_weight);
    }

    // Volume range filter
    if (filters.volume_min) {
      query += ` AND p.volume >= $${paramCount++}`;
      values.push(filters.volume_min);
    }
    if (filters.volume_max) {
      query += ` AND p.volume <= $${paramCount++}`;
      values.push(filters.volume_max);
    }

    // Width filter
    if (filters.width) {
      query += ` AND p.width = $${paramCount++}`;
      values.push(filters.width);
    }

    // Featured filter
    if (filters.is_featured) {
      query += ` AND p.is_featured = true`;
    }

    // Search
    if (filters.search) {
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount++})`;
      values.push(`%${filters.search}%`);
    }

    // Sorting
    const sortOptions = {
      'title_asc': 'p.title ASC',
      'title_desc': 'p.title DESC',
      'newest': 'p.created_at DESC',
      'oldest': 'p.created_at ASC'
    };
    query += ` ORDER BY ${sortOptions[filters.sort] || 'p.created_at DESC'}`;

    // Pagination
    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      values.push(filters.limit);
    }
    if (filters.offset) {
      query += ` OFFSET $${paramCount++}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  },

  /**
   * Find product by ID
   */
  async findById(id) {
    const result = await pool.query(`
      SELECT p.*, 
             c.title as category_title, c.slug as category_slug,
             sc.title as subcategory_title, sc.slug as subcategory_slug,
             b.title as brand_title, b.slug as brand_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = $1
    `, [id]);
    
    if (!result.rows[0]) return null;

    // Get sectors for this product
    const sectors = await pool.query(`
      SELECT s.* FROM sectors s
      JOIN product_sectors ps ON ps.sector_id = s.id
      WHERE ps.product_id = $1
    `, [id]);

    return { ...result.rows[0], sectors: sectors.rows };
  },

  /**
   * Find product by slug
   */
  async findBySlug(slug) {
    const result = await pool.query(`
      SELECT p.*, 
             c.title as category_title, c.slug as category_slug,
             sc.title as subcategory_title, sc.slug as subcategory_slug,
             b.title as brand_title, b.slug as brand_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.slug = $1
    `, [slug]);
    
    if (!result.rows[0]) return null;

    const sectors = await pool.query(`
      SELECT s.* FROM sectors s
      JOIN product_sectors ps ON ps.sector_id = s.id
      WHERE ps.product_id = $1
    `, [result.rows[0].id]);

    return { ...result.rows[0], sectors: sectors.rows };
  },

  /**
   * Create product
   */
  async create(data) {
    const {
      title, slug, description, category_id, subcategory_id, brand_id,
      excavator_weight_min, excavator_weight_max, width, volume, weight,
      attachment_type, cloudinary_images, specs, stock_quantity, is_featured, is_active, sector_ids
    } = data;

    const result = await pool.query(`
      INSERT INTO products (
        title, slug, description, category_id, subcategory_id, brand_id,
        excavator_weight_min, excavator_weight_max, width, volume, weight,
        attachment_type, cloudinary_images, specs, stock_quantity, is_featured, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      title, slug, description, category_id, subcategory_id, brand_id,
      excavator_weight_min, excavator_weight_max, width, volume, weight,
      attachment_type, JSON.stringify(cloudinary_images || []), JSON.stringify(specs || {}),
      stock_quantity || 0, is_featured || false, is_active !== false // Default to true
    ]);

    const product = result.rows[0];

    // Add sector relations
    if (sector_ids && sector_ids.length > 0) {
      const sectorValues = sector_ids.map((sid, i) => `($1, $${i + 2})`).join(', ');
      await pool.query(
        `INSERT INTO product_sectors (product_id, sector_id) VALUES ${sectorValues}`,
        [product.id, ...sector_ids]
      );
    }

    return this.findById(product.id);
  },

  /**
   * Update product
   */
  async update(id, data) {
    const {
      title, slug, description, category_id, subcategory_id, brand_id,
      excavator_weight_min, excavator_weight_max, width, volume, weight,
      attachment_type, cloudinary_images, specs, stock_quantity, is_active, is_featured, sector_ids
    } = data;

    const updates = [];
    const values = [];
    let paramCount = 1;

    const fields = {
      title, slug, description, category_id, subcategory_id, brand_id,
      excavator_weight_min, excavator_weight_max, width, volume, weight,
      attachment_type, stock_quantity, is_active, is_featured
    };

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates.push(`${key} = $${paramCount++}`);
        values.push(value);
      }
    }

    if (cloudinary_images !== undefined) {
      updates.push(`cloudinary_images = $${paramCount++}`);
      values.push(JSON.stringify(cloudinary_images));
    }
    if (specs !== undefined) {
      updates.push(`specs = $${paramCount++}`);
      values.push(JSON.stringify(specs));
    }

    if (updates.length > 0) {
      values.push(id);
      await pool.query(
        `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramCount}`,
        values
      );
    }

    // Update sector relations
    if (sector_ids !== undefined) {
      await pool.query('DELETE FROM product_sectors WHERE product_id = $1', [id]);
      if (sector_ids.length > 0) {
        const sectorValues = sector_ids.map((sid, i) => `($1, $${i + 2})`).join(', ');
        await pool.query(
          `INSERT INTO product_sectors (product_id, sector_id) VALUES ${sectorValues}`,
          [id, ...sector_ids]
        );
      }
    }

    return this.findById(id);
  },

  /**
   * Delete product
   */
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  },

  /**
   * Get featured products
   */
  async findFeatured(limit = 6) {
    return this.findAll({ is_featured: true, limit });
  },

  /**
   * Get products by sector
   */
  async findBySector(sectorId) {
    const result = await pool.query(`
      SELECT p.*, 
             c.title as category_title, c.slug as category_slug,
             b.title as brand_title, b.slug as brand_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      JOIN product_sectors ps ON ps.product_id = p.id
      WHERE ps.sector_id = $1 AND p.is_active = true
      ORDER BY p.created_at DESC
    `, [sectorId]);
    return result.rows;
  },

  /**
   * Get filter options (for frontend filter UI)
   */
  async getFilterOptions() {
    const [attachmentTypes, widths, volumeRange, weightRange] = await Promise.all([
      pool.query('SELECT DISTINCT attachment_type FROM products WHERE attachment_type IS NOT NULL AND is_active = true ORDER BY attachment_type'),
      pool.query('SELECT DISTINCT width FROM products WHERE width IS NOT NULL AND is_active = true ORDER BY width'),
      pool.query('SELECT MIN(volume) as min, MAX(volume) as max FROM products WHERE volume IS NOT NULL AND is_active = true'),
      pool.query('SELECT MIN(excavator_weight_min) as min, MAX(excavator_weight_max) as max FROM products WHERE is_active = true')
    ]);

    return {
      attachment_types: attachmentTypes.rows.map(r => r.attachment_type),
      widths: widths.rows.map(r => r.width),
      volume: volumeRange.rows[0],
      excavator_weight: weightRange.rows[0]
    };
  },

  /**
   * Count products with filters
   */
  async count(filters = {}) {
    let query = `
      SELECT COUNT(*)::int as count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.is_active = true
    `;
    const values = [];
    let paramCount = 1;

    if (filters.category_id) {
      query += ` AND p.category_id = $${paramCount++}`;
      values.push(filters.category_id);
    }
    if (filters.category_slug) {
      query += ` AND c.slug = $${paramCount++}`;
      values.push(filters.category_slug);
    }

    if (filters.subcategory_id) {
      query += ` AND p.subcategory_id = $${paramCount++}`;
      values.push(filters.subcategory_id);
    }
    if (filters.subcategory_slug) {
      query += ` AND sc.slug = $${paramCount++}`;
      values.push(filters.subcategory_slug);
    }

    if (filters.brand_id) {
      query += ` AND p.brand_id = $${paramCount++}`;
      values.push(filters.brand_id);
    }

    if (filters.attachment_type) {
      query += ` AND p.attachment_type = $${paramCount++}`;
      values.push(filters.attachment_type);
    }

    if (filters.excavator_weight) {
      query += ` AND p.excavator_weight_min <= $${paramCount} AND p.excavator_weight_max >= $${paramCount++}`;
      values.push(filters.excavator_weight);
    }

    if (filters.volume_min) {
      query += ` AND p.volume >= $${paramCount++}`;
      values.push(filters.volume_min);
    }
    if (filters.volume_max) {
      query += ` AND p.volume <= $${paramCount++}`;
      values.push(filters.volume_max);
    }

    if (filters.width) {
      query += ` AND p.width = $${paramCount++}`;
      values.push(filters.width);
    }

    if (filters.is_featured === true) {
      query += ` AND p.is_featured = true`;
    }

    if (filters.search) {
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount++})`;
      values.push(`%${filters.search}%`);
    }

    const result = await pool.query(query, values);
    return result.rows[0].count;
  }
};
