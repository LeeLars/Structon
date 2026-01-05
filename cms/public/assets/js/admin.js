/**
 * Structon CMS Admin JavaScript
 * Dashboard functionality with new design
 */

import api, { keepAlive } from './api-client.js?v=3';
import { renderSidebar } from './sidebar.js?v=3';

const API_BASE = '/api';

// State
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Initialize sidebar first
  initializeSidebar('dashboard');
  
  // Start keep-alive immediately
  keepAlive.start();
  
  // Show loading state
  showPageLoading('Verbinden met server...');
  
  // Warm up the server with a ping first
  warmupServer().then(() => {
    checkAuth();
    setupEventListeners();
    updateSidebarUser();
  });
});

/**
 * Initialize the sidebar
 */
function initializeSidebar(activePage) {
  const container = document.getElementById('sidebar-container');
  if (container) {
    container.innerHTML = renderSidebar(activePage);
  }
}

/**
 * Warm up the server before making authenticated requests
 */
async function warmupServer() {
  try {
    const start = Date.now();
    await fetch(`${API_BASE}/ping`, { cache: 'no-store' });
    const elapsed = Date.now() - start;
    console.log(`Server warm-up: ${elapsed}ms`);
    
    // If it took more than 2 seconds, server was likely cold
    if (elapsed > 2000) {
      updateLoadingMessage('Server opgestart, data laden...');
    }
  } catch (error) {
    console.warn('Server warmup failed:', error);
  }
}

/**
 * Show page loading overlay
 */
function showPageLoading(message = 'Laden...') {
  // Check if loading overlay already exists
  let overlay = document.getElementById('page-loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'page-loading-overlay';
    overlay.className = 'page-loading';
    overlay.innerHTML = `
      <div class="loading-spinner"></div>
      <p id="loading-message">${message}</p>
    `;
    document.body.appendChild(overlay);
  }
}

/**
 * Update loading message
 */
function updateLoadingMessage(message) {
  const el = document.getElementById('loading-message');
  if (el) el.textContent = message;
}

/**
 * Hide page loading overlay
 */
function hidePageLoading() {
  const overlay = document.getElementById('page-loading-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 300);
  }
}

/**
 * Check authentication
 */
async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include'
    });

    if (!response.ok) {
      hidePageLoading();
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
    hidePageLoading();
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

    // Store token in localStorage for API requests
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      console.log('✅ Auth token saved to localStorage');
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

  // Clear token from localStorage
  localStorage.removeItem('auth_token');
  
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
 * Load all dashboard data
 */
async function loadDashboardData() {
  updateLoadingMessage('Dashboard laden...');
  
  try {
    await Promise.all([
      loadDashboardStats(),
      loadRecentQuotes()
    ]);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    // Always hide loading overlay when done
    hidePageLoading();
  }
}

/**
 * Load dashboard statistics from CMS API
 */
async function loadDashboardStats() {
  try {
    // Load all data in parallel with timeout
    const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));
    
    const [quotesRes, ordersRes, productsRes, usersRes] = await Promise.allSettled([
      Promise.race([api.get('/sales/quotes'), timeout(5000)]),
      Promise.race([api.get('/sales/orders'), timeout(5000)]),
      Promise.race([api.get('/admin/products'), timeout(5000)]),
      Promise.race([api.get('/admin/users'), timeout(5000)])
    ]);
    
    // Count quotes
    let quotesCount = 0;
    let newQuotesCount = 0;
    if (quotesRes.status === 'fulfilled' && quotesRes.value) {
      const quotes = quotesRes.value?.quotes || quotesRes.value || [];
      if (Array.isArray(quotes)) {
        quotesCount = quotes.length;
        newQuotesCount = quotes.filter(q => q.status === 'new').length;
      }
    }
    updateStat('stat-quotes', quotesCount);
    updateStat('stat-quotes-badge', newQuotesCount > 0 ? `+${newQuotesCount}` : '');
    updateStat('stat-quotes-change', `${newQuotesCount} nieuw`);
    
    // Count orders
    let ordersCount = 0;
    let pendingOrdersCount = 0;
    if (ordersRes.status === 'fulfilled' && ordersRes.value) {
      const orders = ordersRes.value?.orders || ordersRes.value || [];
      if (Array.isArray(orders)) {
        ordersCount = orders.length;
        pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'paid').length;
      }
    }
    updateStat('stat-orders', ordersCount);
    updateStat('stat-orders-badge', pendingOrdersCount > 0 ? `+${pendingOrdersCount}` : '');
    updateStat('stat-orders-change', `${pendingOrdersCount} in behandeling`);
    
    // Count products
    let productsCount = 0;
    if (productsRes.status === 'fulfilled' && productsRes.value) {
      const products = productsRes.value?.products || productsRes.value || [];
      if (Array.isArray(products)) {
        productsCount = products.length;
      }
    }
    updateStat('stat-products', productsCount);
    
    // Count users/customers
    let usersCount = 0;
    if (usersRes.status === 'fulfilled' && usersRes.value) {
      const users = usersRes.value?.users || usersRes.value || [];
      if (Array.isArray(users)) {
        usersCount = users.length;
      }
    }
    updateStat('stat-users', usersCount);
    updateStat('stat-users-badge', '');
    updateStat('stat-users-change', 'Geregistreerd');
    
    console.log(`✅ Dashboard stats loaded: ${quotesCount} quotes, ${ordersCount} orders, ${productsCount} products, ${usersCount} users`);
    
  } catch (error) {
    console.error('❌ Failed to load dashboard stats:', error);
    // Show zeros instead of fake data
    updateStat('stat-quotes', 0);
    updateStat('stat-quotes-badge', '');
    updateStat('stat-quotes-change', '0 nieuw');
    updateStat('stat-orders', 0);
    updateStat('stat-orders-badge', '');
    updateStat('stat-orders-change', '0 in behandeling');
    updateStat('stat-products', 0);
    updateStat('stat-users', 0);
    updateStat('stat-users-badge', '');
    updateStat('stat-users-change', 'Geregistreerd');
  }
}

/**
 * Load recent quotes
 */
async function loadRecentQuotes() {
  const tableBody = document.querySelector('#recent-quotes tbody');
  if (!tableBody) return;
  
  try {
    const quotes = await api.get('/sales/quotes');
    
    if (quotes.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">Geen recente aanvragen</td>
        </tr>
      `;
      return;
    }
    
    tableBody.innerHTML = quotes.map(quote => `
      <tr>
        <td>
          <div class="font-medium">${formatDate(quote.created_at)}</div>
          <div class="text-sm text-muted">${formatTime(quote.created_at)}</div>
        </td>
        <td>
          <div class="font-medium">${quote.customer_name}</div>
          <div class="text-sm text-muted">${quote.customer_email}</div>
        </td>
        <td>
          ${quote.product_title || quote.product_name || 'Algemene aanvraag'}
        </td>
        <td>
          <span class="badge badge-${getStatusColor(quote.status)}">${getStatusLabel(quote.status)}</span>
        </td>
        <td class="text-right">
          <button class="btn-icon btn-sm" onclick="viewQuote(${quote.id})" title="Bekijken">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </td>
      </tr>
    `).join('');
    
  } catch (error) {
    console.error('Failed to load quotes:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-error">Fout bij laden gegevens</td>
      </tr>
    `;
  }
}

function getStatusColor(status) {
  const colors = {
    new: 'primary',
    processing: 'warning',
    quoted: 'info',
    won: 'success',
    lost: 'error'
  };
  return colors[status] || 'secondary';
}

function getStatusLabel(status) {
  const labels = {
    new: 'Nieuw',
    processing: 'In behandeling',
    quoted: 'Geoffreerd',
    won: 'Gewonnen',
    lost: 'Verloren'
  };
  return labels[status] || status;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' });
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

function updateStat(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
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
 * Format price in EUR
 */
function formatPrice(price) {
  if (price === null || price === undefined) return '-';
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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
