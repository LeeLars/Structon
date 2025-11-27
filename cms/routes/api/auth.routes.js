import { Router } from 'express';
import { User } from '../../models/User.js';
import { authenticate, generateToken, setAuthCookie, clearAuthCookie } from '../../middleware/auth.js';
import { loginLimiter } from '../../middleware/rateLimit.js';

const router = Router();

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated. Contact support.' });
    }

    // Verify password
    const isValid = await User.verifyPassword(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);
    
    // Set HTTP-only cookie
    setAuthCookie(res, token);

    // Return user data (without password)
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token // Also return token for clients that prefer header auth
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Clear auth cookie
 */
router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

/**
 * POST /api/auth/password-reset-request
 * Request password reset (placeholder - needs email service)
 */
router.post('/password-reset-request', loginLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Always return success to prevent email enumeration
    // In production, this would send an email if user exists
    res.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
