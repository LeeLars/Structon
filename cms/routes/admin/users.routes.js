import { Router } from 'express';
import { User } from '../../models/index.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/users
 * Get all users
 */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/users/:id
 * Get user by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/users
 * Create new user
 */
router.post('/', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if email already exists
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Validate role
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' });
    }

    const user = await User.create({ email, password, role: role || 'user' });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/admin/users/:id
 * Update user
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const { email, password, role, is_active } = req.body;

    // Prevent admin from deactivating themselves
    if (req.params.id === req.user.id && is_active === false) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Check if email is taken by another user
      const existing = await User.findByEmail(email);
      if (existing && existing.id !== req.params.id) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Validate password if provided
    if (password && password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Validate role if provided
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.update(req.params.id, { email, password, role, is_active });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user
 */
router.delete('/:id', async (req, res, next) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const deleted = await User.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
