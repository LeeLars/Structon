/**
 * API Client for Structon CMS
 * Handles all API requests with authentication
 */

// Detect API URL based on environment
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000/api';
  }
  
  // GitHub Pages or production
  return 'https://structon-production.up.railway.app/api';
};

const API_BASE_URL = getApiBaseUrl();

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Make authenticated request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for JWT
    };

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, { ...config, signal: controller.signal });
      clearTimeout(timeoutId);
      
      // Handle 401 Unauthorized - only redirect for auth endpoints
      if (response.status === 401) {
        // Don't redirect, just throw error so fallback data can be used
        throw new Error('Unauthorized');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',  // Use PATCH for partial updates
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Upload file
   */
  async upload(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Debug: Check if we have the auth cookie
    console.log('🔐 Upload auth check:', {
      url,
      hasCookie: document.cookie.includes('auth_token'),
      cookies: document.cookie || '(no cookies visible - httpOnly)'
    });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type, browser will set it with boundary
        credentials: 'include',
      });

      console.log('📥 Upload response status:', response.status);

      if (response.status === 401) {
        // Check if we need to re-authenticate
        const authCheck = await fetch(`${this.baseURL}/auth/me`, { credentials: 'include' });
        console.log('🔐 Auth check status:', authCheck.status);
        throw new Error('Unauthorized - Please log in again');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const api = new APIClient();

/**
 * Keep-alive mechanism to prevent Railway cold starts
 * Pings the server every 4 minutes to keep it warm
 */
class KeepAlive {
  constructor() {
    this.interval = null;
    this.pingInterval = 4 * 60 * 1000; // 4 minutes
  }

  start() {
    if (this.interval) return;
    
    // Initial ping
    this.ping();
    
    // Set up interval
    this.interval = setInterval(() => this.ping(), this.pingInterval);
    
    // Also ping when page becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.ping();
      }
    });
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  async ping() {
    try {
      await fetch(`${API_BASE_URL.replace('/api', '')}/api/ping`, {
        method: 'GET',
        cache: 'no-store'
      });
    } catch (error) {
      // Silent fail - just trying to keep server warm
    }
  }
}

// Start keep-alive when in CMS
const keepAlive = new KeepAlive();
if (window.location.pathname.startsWith('/cms')) {
  keepAlive.start();
}

export default api;
export { keepAlive };
