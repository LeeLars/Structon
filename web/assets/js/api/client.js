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
 * Show user-friendly error message
 */
function showApiError(endpoint, error) {
  console.error(`❌ API Error [${endpoint}]:`, error.message);
  
  // Show user-friendly message (only once per session)
  if (sessionStorage.getItem('api-error-shown')) return;
  sessionStorage.setItem('api-error-shown', 'true');
  
  const message = document.createElement('div');
  message.className = 'api-error-toast';
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 400px;
  `;
  message.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>Kan geen verbinding maken met CMS. Probeer later opnieuw.</span>
  `;
  
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 5000);
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
      
      // Return empty data structure based on endpoint
      if (endpoint.includes('/products')) {
        return { products: [], total: 0 };
      }
      if (endpoint.includes('/categories') || endpoint.includes('/brands')) {
        return [];
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
