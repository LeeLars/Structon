import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const User = {
  /**
   * Find user by ID
   */
  async findById(id) {
    const result = await pool.query(
      'SELECT id, email, role, is_active, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Find user by email (includes password_hash for auth)
   */
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  },

  /**
   * Get all users (admin only)
   */
  async findAll() {
    const result = await pool.query(
      'SELECT id, email, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  },

  /**
   * Create new user (admin only)
   */
  async create({ email, password, role = 'user' }) {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, role, is_active, created_at`,
      [email.toLowerCase(), password_hash, role]
    );
    return result.rows[0];
  },

  /**
   * Update user
   */
  async update(id, { email, password, role, is_active }) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email.toLowerCase());
    }
    if (password !== undefined) {
      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      updates.push(`password_hash = $${paramCount++}`);
      values.push(password_hash);
    }
    if (role !== undefined) {
      updates.push(`role = $${paramCount++}`);
      values.push(role);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} 
       RETURNING id, email, role, is_active, created_at, updated_at`,
      values
    );
    return result.rows[0] || null;
  },

  /**
   * Delete user
   */
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  },

  /**
   * Verify password
   */
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
};
