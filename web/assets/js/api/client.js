/**
 * Structon API Client
 * Handles all communication with the CMS API
 * Optimized with caching and request deduplication
 */

import { DEMO_PRODUCTS, DEMO_CATEGORIES, DEMO_BRANDS } from './demo-data.js';

// API Base URL - automatically detects environment
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000/api';
  }
  
  // Production (GitHub Pages or custom domain)
  return 'https://structon-production.up.railway.app/api';
};

const API_BASE = getApiBaseUrl();

// Export for use in other modules
export const API_BASE_URL = API_BASE;

// ============================================
// REQUEST CACHING & DEDUPLICATION
// ============================================

// In-memory cache for API responses
const responseCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Pending requests map for deduplication
const pendingRequests = new Map();

/**
 * Get cached response if valid
 */
function getCachedResponse(key) {
  const cached = responseCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }
  responseCache.delete(key);
  return null;
}

/**
 * Set cache response
 */
function setCacheResponse(key, data, duration = CACHE_DURATION) {
  responseCache.set(key, {
    data,
    expiresAt: Date.now() + duration
  });
}

/**
 * Clear cache (useful after mutations)
 */
export function clearApiCache(pattern = null) {
  if (pattern) {
    for (const key of responseCache.keys()) {
      if (key.includes(pattern)) {
        responseCache.delete(key);
      }
    }
  } else {
    responseCache.clear();
  }
}

/**
 * Helper: Get demo data based on endpoint
 */
function getDemoDataForEndpoint(endpoint) {
  console.log(`⚠️ Using DEMO DATA for: ${endpoint}`);
  
  // Products - Featured
  if (endpoint.includes('/products/featured')) {
    return DEMO_PRODUCTS.slice(0, 6);
  }
  
  // Products - Single product by ID or Slug
  if (endpoint.includes('/products/') && !endpoint.includes('filters') && !endpoint.includes('?')) {
    const idOrSlug = endpoint.split('/products/')[1].split('?')[0];
    const product = DEMO_PRODUCTS.find(p => p.id == idOrSlug || p.slug == idOrSlug);
    return product || DEMO_PRODUCTS[0];
  }
  
  // Products - List (with filters)
  if (endpoint.includes('/products')) {
    // Parse query params to filter
    let filteredProducts = [...DEMO_PRODUCTS];
    
    // Extract category filter from URL
    const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
    const categoryFilter = urlParams.get('category');
    
    if (categoryFilter) {
      filteredProducts = filteredProducts.filter(p => 
        p.category_slug === categoryFilter || 
        p.category_slug?.includes(categoryFilter)
      );
    }
    
    // Return in expected format: { products: [...], total: N }
    return {
      products: filteredProducts,
      total: filteredProducts.length
    };
  }

  // Categories - Single
  if (endpoint.includes('/categories/') && !endpoint.includes('?')) {
    const slug = endpoint.split('/categories/')[1];
    const category = DEMO_CATEGORIES.find(c => c.slug === slug);
    return category ? { category } : { category: DEMO_CATEGORIES[0] };
  }
  
  // Categories - List
  if (endpoint.includes('/categories')) {
    return DEMO_CATEGORIES;
  }

  // Brands
  if (endpoint.includes('/brands')) {
    return DEMO_BRANDS;
  }
  
  // Navigation (fallback menu)
  if (endpoint.includes('/navigation/menu-structure')) {
    return DEMO_CATEGORIES.map(c => ({
      title: c.title,
      slug: c.slug,
      type: 'category',
      children: []
    }));
  }

  return null;
}

/**
 * Make API request with error handling, caching, and fallback
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const cacheKey = `${options.method || 'GET'}:${endpoint}`;
  const isGetRequest = !options.method || options.method === 'GET';
  
  // Check cache for GET requests
  if (isGetRequest) {
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Check for pending request (deduplication)
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }
  }
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include', // Include cookies for auth
    ...options
  };

  // Create the request promise
  const requestPromise = (async () => {
    try {
      // Attempt fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      const response = await fetch(url, { ...config, signal: controller.signal });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }
      
      // If empty array returned, also use demo data (assuming DB is empty)
      if (Array.isArray(data) && data.length === 0) {
        const demo = getDemoDataForEndpoint(endpoint);
        if (demo) {
          // Cache demo data too
          if (isGetRequest) setCacheResponse(cacheKey, demo);
          return demo;
        }
      }

      // Cache successful GET responses
      if (isGetRequest) {
        setCacheResponse(cacheKey, data);
      }

      return data;
    } catch (error) {
      console.warn(`API Error [${endpoint}]:`, error.message);
      
      // Fallback to DEMO DATA
      const demoData = getDemoDataForEndpoint(endpoint);
      if (demoData) {
        // Cache demo data for faster subsequent loads
        if (isGetRequest) setCacheResponse(cacheKey, demoData, 60000); // 1 min for demo
        return demoData;
      }

      throw error;
    } finally {
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
    }
  })();

  // Store pending request for deduplication
  if (isGetRequest) {
    pendingRequests.set(cacheKey, requestPromise);
  }

  return requestPromise;
}

/**
 * Auth API
 */
export const auth = {
  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async logout() {
    return request('/auth/logout', { method: 'POST' });
  },

  async me() {
    return request('/auth/me');
  },

  async requestPasswordReset(email) {
    return request('/auth/password-reset-request', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

/**
 * Products API
 */
export const products = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const query = params.toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },

  async getById(id) {
    return request(`/products/${id}`);
  },

  async getBySlug(slug) {
    return request(`/products/${slug}`);
  },

  async getFeatured(limit = 6) {
    return request(`/products/featured?limit=${limit}`);
  },

  async getFilters() {
    return request('/products/filters');
  },

  async getPrice(productId) {
    return request(`/products/${productId}/price`);
  },

  async getBySector(sectorId) {
    return request(`/products/sector/${sectorId}`);
  }
};

/**
 * Categories API
 */
export const categories = {
  async getAll(withCount = false) {
    return request(`/categories${withCount ? '?count=true' : ''}`);
  },

  async getBySlug(slug) {
    return request(`/categories/${slug}`);
  }
};

/**
 * Brands API
 */
export const brands = {
  async getAll(withCount = false) {
    return request(`/brands${withCount ? '?count=true' : ''}`);
  },

  async getBySlug(slug) {
    return request(`/brands/${slug}`);
  }
};

/**
 * Sectors API
 */
export const sectors = {
  async getAll(withCount = false) {
    return request(`/sectors${withCount ? '?count=true' : ''}`);
  },

  async getBySlug(slug) {
    return request(`/sectors/${slug}`);
  }
};

/**
 * Navigation/Menu API
 */
export const navigation = {
  async getMenuStructure() {
    return request('/navigation/menu-structure');
  },

  async getMenuByCategory(categorySlug) {
    return request(`/navigation/menu/${categorySlug}`);
  }
};

// Default export with all APIs
export default {
  auth,
  products,
  categories,
  brands,
  sectors,
  navigation
};
