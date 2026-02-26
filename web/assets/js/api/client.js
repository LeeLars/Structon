/**
 * Structon API Client
 * Handles all communication with the CMS API
 * ONLY uses data from CMS - NO demo data fallback
 * Optimized with caching and request deduplication
 */

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

console.log('🔗 API Client initialized');
console.log('📍 API Base URL:', API_BASE);

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
 * Normalize API response to consistent format
 */
function normalizeProductsResponse(data) {
  // Handle different response shapes from API
  if (!data || typeof data !== 'object') {
    return { items: [], total: 0, limit: 12, offset: 0 };
  }

  // API returns { products: [], total: X, limit: Y, offset: Z }
  // Frontend expects { items: [], total: X, limit: Y, offset: Z }
  return {
    items: data.products || data.items || [],
    total: data.total || 0,
    limit: data.limit || 12,
    offset: data.offset || 0
  };
}

/**
 * Show user-friendly error message
 */
function showApiError(endpoint, error) {
  // Only log to console, never show error message to end users
  console.error(`❌ API Error [${endpoint}]:`, error.message);
  
  // Error messages are disabled in production - users should never see CMS connection errors
  // The site will gracefully fall back to cached data or show empty states
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
      console.log(`🌐 API Request: ${endpoint}`);
      
      // Attempt fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, { ...config, signal: controller.signal });
      clearTimeout(timeoutId);

      console.log(`✅ API Response [${endpoint}]:`, response.status);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }

      // Cache successful GET responses
      if (isGetRequest) {
        setCacheResponse(cacheKey, data);
      }

      console.log(`📦 Data received [${endpoint}]:`, Array.isArray(data) ? `${data.length} items` : 'object');
      return data;
      
    } catch (error) {
      console.error(`❌ API Request failed [${endpoint}]:`, error.message);
      
      // Show error to user
      showApiError(endpoint, error);
      
      // Always throw the error so calling code can handle it properly
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
    try {
      return await request('/auth/me');
    } catch (error) {
      // 401 is expected when not logged in - return null without side effects
      if (error.message.includes('401') || error.message.includes('Authentication required')) {
        console.log('User not authenticated (this is normal)');
        return null;
      }
      throw error;
    }
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
    const response = await request(`/products${query ? `?${query}` : ''}`);
    return normalizeProductsResponse(response);
  },

  async getById(id) {
    return request(`/products/${id}`);
  },

  async getBySlug(slug) {
    return request(`/products/${slug}`);
  },

  async getFeatured(limit = 6) {
    const response = await request(`/products/featured?limit=${limit}`);
    // Featured endpoint returns { products: [] } - normalize to items
    return normalizeProductsResponse(response);
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
 * Subcategories API
 */
export const subcategories = {
  async getAll() {
    return request('/subcategories');
  },

  async getByCategoryId(categoryId) {
    return request(`/subcategories?category_id=${categoryId}`);
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

/**
 * Quotes API - For submitting quote requests from website
 */
export const quotes = {
  /**
   * Submit a new quote request
   */
  async submit(quoteData) {
    return request('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData)
    });
  },

  /**
   * Get quotes for current user (customer account)
   */
  async getMyQuotes(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return request(`/account/quotes${params ? `?${params}` : ''}`);
  }
};

/**
 * Orders API - Customer account orders
 */
export const orders = {
  /**
   * Get orders for current user
   */
  async getMyOrders(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return request(`/account/orders${params ? `?${params}` : ''}`);
  },

  /**
   * Get single order by ID
   */
  async getById(orderId) {
    return request(`/account/orders/${orderId}`);
  }
};

/**
 * Favorites API - Customer saved products
 */
export const favorites = {
  /**
   * Get favorites for current user
   */
  async getMyFavorites() {
    return request('/account/favorites');
  },

  /**
   * Add product to favorites
   */
  async add(productId) {
    return request('/account/favorites', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId })
    });
  },

  /**
   * Remove product from favorites
   */
  async remove(productId) {
    return request(`/account/favorites/${productId}`, {
      method: 'DELETE'
    });
  }
};

/**
 * Addresses API - Customer addresses
 */
export const addresses = {
  /**
   * Get addresses for current user
   */
  async getMyAddresses() {
    return request('/account/addresses');
  },

  /**
   * Update address
   */
  async update(addressType, addressData) {
    return request(`/account/addresses/${addressType}`, {
      method: 'PUT',
      body: JSON.stringify(addressData)
    });
  }
};

/**
 * Account API - Customer profile
 */
export const account = {
  /**
   * Get account dashboard stats
   */
  async getDashboard() {
    return request('/account/dashboard');
  },

  /**
   * Update profile
   */
  async updateProfile(profileData) {
    return request('/account/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    return request('/account/password', {
      method: 'PUT',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
  }
};

/**
 * Blogs API
 */
export const blogs = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/blogs${query ? `?${query}` : ''}`);
  },

  async getBySlug(slug) {
    return request(`/blogs/${slug}`);
  }
};

/**
 * Notifications API - For sending email notifications from forms
 */
export const notifications = {
  /**
   * Send form notification email
   */
  async sendEmail({ to, subject, body, replyTo, formType }) {
    return request('/notifications/email', {
      method: 'POST',
      body: JSON.stringify({ to, subject, body, replyTo, formType })
    });
  }
};

// Default export with all APIs
export default {
  auth,
  products,
  categories,
  subcategories,
  brands,
  sectors,
  navigation,
  quotes,
  orders,
  favorites,
  addresses,
  account,
  blogs,
  notifications
};
