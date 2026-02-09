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
  // Generate a fresh token for the user
  // This helps when user is authenticated via cookie but localStorage was cleared
  const token = generateToken(req.user.id);
  
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    },
    token // Include token so frontend can store it
  });
});

/**
 * POST /api/auth/change-password
 * Change password for authenticated user
 */
router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Get user with password hash
    const user = await User.findByEmail(req.user.email);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValid = await User.verifyPassword(currentPassword, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    await User.update(user.id, { password: newPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    // Handle validation errors from User.validatePassword
    if (error.message.includes('Password must')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * POST /api/auth/password-reset-request
 * Request password reset (legacy endpoint - redirects to forgot-password)
 */
router.post('/password-reset-request', loginLimiter, async (req, res, next) => {
  // Redirect to new endpoint
  req.url = '/forgot-password';
  return router.handle(req, res, next);
});

/**
 * POST /api/auth/forgot-password
 * Request password reset - sends email with reset link
 */
router.post('/forgot-password', loginLimiter, async (req, res, next) => {
  try {
    const { email, locale = 'be-nl', resetUrl } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findByEmail(email);
    
    if (!user) {
      // Return 404 so frontend can show "email not found" message
      return res.status(404).json({ error: 'Email not found' });
    }

    // Generate reset token
    const result = await User.setResetToken(email);
    
    if (!result) {
      return res.status(500).json({ error: 'Failed to generate reset token' });
    }

    // Build reset URL
    const baseUrl = resetUrl || 'https://leelars.github.io/Structon/' + locale + '/';
    const fullResetUrl = `${baseUrl}?reset_token=${result.token}`;

    // Send email
    const { sendPasswordResetEmail } = await import('../../services/email.service.js');
    await sendPasswordResetEmail({
      email: user.email,
      resetUrl: fullResetUrl,
      locale
    });

    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    next(error);
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password using token from email
 */
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    // Reset password
    const user = await User.resetPassword(token, password);
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    // Handle validation errors from User.validatePassword
    if (error.message.includes('Password must')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Reset password error:', error);
    next(error);
  }
});

export default router;
