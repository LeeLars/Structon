/**
 * Simple Token-Based Authentication
 * Clean implementation without cookie confusion
 */

const AUTH_API = 'https://structon-production.up.railway.app/api';
const TOKEN_KEY = 'structon_auth_token';

class SimpleAuth {
  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Store token
   */
  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      console.log('✅ Token stored');
    } else {
      localStorage.removeItem(TOKEN_KEY);
      console.log('🗑️ Token removed');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Get stored user data
   */
  getUser() {
    try {
      const userData = localStorage.getItem('structon_user');
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Store user data
   */
  setUser(user) {
    if (user) {
      localStorage.setItem('structon_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('structon_user');
    }
  }

  /**
   * Login
   */
  async login(email, password) {
    try {
      const response = await fetch(`${AUTH_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role !== 'admin') {
        throw new Error('Geen admin rechten');
      }

      // Store token and user data
      this.setToken(data.token);
      this.setUser(data.user);

      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout
   */
  logout() {
    this.setToken(null);
    this.setUser(null);
    window.location.href = '/cms/login.html';
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    const token = this.getToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const url = `${AUTH_API}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (response.status === 401) {
        // Token expired or invalid
        this.setToken(null);
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload files
   */
  async upload(endpoint, formData) {
    const token = this.getToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const url = `${AUTH_API}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - browser sets it with boundary
        },
        body: formData
      });

      const data = await response.json();

      if (response.status === 401) {
        this.setToken(null);
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        // Extract meaningful error message
        const errorMsg = data.message || data.error || 'Upload failed';
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error('Upload error:', error);
      // Re-throw with cleaner message if it's a network error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Kan geen verbinding maken met de server. Controleer je internetverbinding.');
      }
      throw error;
    }
  }
}

// Export singleton instance
const auth = new SimpleAuth();
export default auth;
