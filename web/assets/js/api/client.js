/**
 * Structon API Client
 * Handles all communication with the CMS API
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
 * Make API request with error handling and fallback
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include', // Include cookies for auth
    ...options
  };

  try {
    // Attempt fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout for quick fallback
    
    const response = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }
    
    // If empty array returned, also use demo data (assuming DB is empty)
    if (Array.isArray(data) && data.length === 0) {
      const demo = getDemoDataForEndpoint(endpoint);
      if (demo) return demo;
    }

    return data;
  } catch (error) {
    console.warn(`API Error [${endpoint}]:`, error.message);
    
    // Fallback to DEMO DATA
    const demoData = getDemoDataForEndpoint(endpoint);
    if (demoData) {
      return demoData;
    }

    throw error;
  }
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
