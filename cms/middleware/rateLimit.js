import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for login attempts
 * 5 attempts per 15 minutes
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    error: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP + email for more granular limiting
    return `${req.ip}-${req.body?.email || 'unknown'}`;
  }
});

/**
 * General API rate limiter
 * 100 requests per minute
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    error: 'Too many requests. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Strict rate limiter for sensitive operations
 * 10 requests per minute
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'Rate limit exceeded for this operation.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
