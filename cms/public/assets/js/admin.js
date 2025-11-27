/**
 * Structon CMS Admin JavaScript
 * Dashboard functionality with new design
 */

import api from './api-client.js';

const API_BASE = '/api';

// State
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
  updateSidebarUser();
});

/**
 * Check authentication
 */
async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include'
    });

    if (!response.ok) {
      showLoginModal();
      return;
    }

    const data = await response.json();
    currentUser = data.user;

    if (currentUser.role !== 'admin') {
      alert('Geen admin rechten');
      showLoginModal();
      return;
    }

    // Update UI
    updateSidebarUser();
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
      userInfo.textContent = currentUser.email;
    }
    
    // Load dashboard data
    loadDashboardData();

  } catch (error) {
    console.error('Auth check failed:', error);
    showLoginModal();
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Login form
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

/**
 * Handle login
 */
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('login-error');

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.user.role !== 'admin') {
      throw new Error('Geen admin rechten');
    }

    currentUser = data.user;
    hideLoginModal();
    updateSidebarUser();
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
      userInfo.textContent = currentUser.email;
    }
    loadDashboardData();

  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.style.display = 'block';
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
  }

  currentUser = null;
  showLoginModal();
}

/**
 * Show login modal
 */
function showLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

/**
 * Hide login modal
 */
function hideLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Load dashboard data
 */
async function loadDashboardData() {
  try {
    // Load stats in parallel
    const [productsRes, categoriesRes, brandsRes, usersRes] = await Promise.all([
      fetch(`${API_BASE}/products`),
      fetch(`${API_BASE}/categories`),
      fetch(`${API_BASE}/brands`),
      fetch(`${API_BASE}/admin/users`, { credentials: 'include' })
    ]);

    const products = await productsRes.json();
    const categories = await categoriesRes.json();
    const brands = await brandsRes.json();
    
    // Update stats
    document.getElementById('stat-products').textContent = products.total || products.products?.length || 0;
    document.getElementById('stat-categories').textContent = categories.categories?.length || 0;
    document.getElementById('stat-brands').textContent = brands.brands?.length || 0;

    if (usersRes.ok) {
      const users = await usersRes.json();
      document.getElementById('stat-users').textContent = users.users?.length || 0;
    }

    // Load recent products table
    loadRecentProducts(products.products || []);

  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

/**
 * Load recent products table
 */
function loadRecentProducts(products) {
  const tbody = document.querySelector('#recent-products tbody');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="loading-cell">Geen producten gevonden</td></tr>';
    return;
  }

  // Show first 5 products
  const recent = products.slice(0, 5);

  tbody.innerHTML = recent.map(product => `
    <tr>
      <td>
        <strong>${escapeHtml(product.title)}</strong>
        <br><small style="color: var(--text-muted)">${product.slug}</small>
      </td>
      <td>${escapeHtml(product.category_title || '-')}</td>
      <td>${product.current_price ? formatPrice(product.current_price) : '-'}</td>
      <td>
        <span class="badge ${product.is_active ? 'badge-success' : 'badge-error'}">
          ${product.is_active ? 'Actief' : 'Inactief'}
        </span>
      </td>
      <td>
        <a href="/cms/products.html?id=${product.id}" class="btn btn-secondary btn-sm">Bewerken</a>
      </td>
    </tr>
  `).join('');
}

/**
 * Format price
 */
function formatPrice(price) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * API helper for admin requests
 */
async function adminFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

/**
 * Update sidebar user info
 */
function updateSidebarUser() {
  const sidebarUserName = document.getElementById('sidebar-user-name');
  if (sidebarUserName && currentUser) {
    sidebarUserName.textContent = currentUser.email.split('@')[0];
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Add to body
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Confirm dialog
 */
function confirm(message) {
  return window.confirm(message);
}

// Export for use in other admin pages
window.adminFetch = adminFetch;
window.formatPrice = formatPrice;
window.escapeHtml = escapeHtml;
window.showToast = showToast;
window.confirmAction = confirm;
window.currentUser = () => currentUser;
