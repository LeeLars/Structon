/**
 * Simple in-memory cache middleware for API responses
 * For production, consider Redis or similar
 */

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Cache middleware for GET requests
 * @param {number} duration - Cache duration in milliseconds (default: 5 minutes)
 */
export function cacheMiddleware(duration = CACHE_DURATION) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and query params
    const cacheKey = req.originalUrl || req.url;
    
    // Check if we have cached response
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() < cached.expiresAt) {
      // Return cached response
      return res.json(cached.data);
    }

    // Store original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = function(data) {
      // Cache the response
      cache.set(cacheKey, {
        data,
        expiresAt: Date.now() + duration
      });

      // Call original json function
      return originalJson(data);
    };

    next();
  };
}

/**
 * Clear cache for specific pattern or all
 * @param {string} pattern - URL pattern to clear (optional)
 */
export function clearCache(pattern = null) {
  if (pattern) {
    // Clear specific pattern
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    // Clear all cache
    cache.clear();
  }
}

/**
 * Periodic cache cleanup (remove expired entries)
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now >= value.expiresAt) {
      cache.delete(key);
    }
  }
}, 60 * 1000); // Run every minute

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}
