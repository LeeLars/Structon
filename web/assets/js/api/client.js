/**
 * Structon API Client
 * Handles all communication with the CMS API
 */

// API Base URL - change for production
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000/api'
  : 'https://your-railway-app.railway.app/api';

/**
 * Make API request with error handling
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
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
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

// Default export with all APIs
export default {
  auth,
  products,
  categories,
  brands,
  sectors
};
