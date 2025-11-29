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
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        window.location.href = '/cms/';
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
      method: 'PUT',
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
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type, browser will set it with boundary
        credentials: 'include',
      });

      if (response.status === 401) {
        window.location.href = '/cms/';
        throw new Error('Unauthorized');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
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
