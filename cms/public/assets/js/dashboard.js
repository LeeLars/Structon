/**
 * CMS Dashboard - Load real statistics from API
 */

import auth from './auth-simple.js';

// Check authentication
if (!auth.isAuthenticated()) {
  window.location.href = '/cms/login.html';
}

// API Base URL
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000/api'
  : 'https://structon-production.up.railway.app/api';

/**
 * Fetch data from API with auth
 */
async function fetchAPI(endpoint) {
  try {
    const response = await auth.request(endpoint);
    return response;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return null;
  }
}

/**
 * Load dashboard statistics
 */
async function loadDashboardStats() {
  console.log('📊 Loading dashboard statistics...');
  
  // Update user name in welcome header
  const user = auth.getUser();
  if (user) {
    const welcomeHeader = document.querySelector('.welcome-header h1');
    if (welcomeHeader) {
      welcomeHeader.textContent = `Welkom terug, ${user.name || user.email.split('@')[0]}`;
    }
    const sidebarUserName = document.getElementById('sidebar-user-name');
    if (sidebarUserName) {
      sidebarUserName.textContent = user.name || user.email.split('@')[0];
    }
  }

  // Use the dedicated sales/stats endpoint for dashboard data
  const statsData = await fetchAPI('/sales/stats');
  
  console.log('📊 Stats data received:', statsData);

  if (statsData) {
    // Update Products stat
    const productsEl = document.getElementById('stat-products');
    if (productsEl) {
      productsEl.textContent = statsData.products || 0;
    }

    // Update Quotes stat
    const quotesEl = document.getElementById('stat-quotes');
    const quotesBadge = document.getElementById('stat-quotes-badge');
    const quotesChange = document.getElementById('stat-quotes-change');
    if (quotesEl) quotesEl.textContent = statsData.quotes || 0;
    if (quotesBadge) quotesBadge.textContent = statsData.quotes > 0 ? `${statsData.quotes} nieuw` : 'Geen';
    if (quotesChange) quotesChange.textContent = statsData.quotes > 0 ? 'Laatste 30 dagen' : 'Geen nieuwe offertes';

    // Update Orders stat
    const ordersEl = document.getElementById('stat-orders');
    const ordersBadge = document.getElementById('stat-orders-badge');
    const ordersChange = document.getElementById('stat-orders-change');
    if (ordersEl) ordersEl.textContent = statsData.orders || 0;
    if (ordersBadge) ordersBadge.textContent = statsData.orders > 0 ? `${statsData.orders} nieuw` : 'Geen';
    if (ordersChange) ordersChange.textContent = statsData.orders > 0 ? 'Laatste 30 dagen' : 'Geen nieuwe bestellingen';

    // Update Users/Customers stat
    const usersEl = document.getElementById('stat-users');
    const usersBadge = document.getElementById('stat-users-badge');
    const usersChange = document.getElementById('stat-users-change');
    if (usersEl) usersEl.textContent = statsData.customers || 0;
    if (usersBadge) usersBadge.textContent = 'Uniek';
    if (usersChange) usersChange.textContent = 'Unieke klanten';
  } else {
    // Set all to 0 if no data
    const elements = ['stat-products', 'stat-quotes', 'stat-orders', 'stat-users'];
    elements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '0';
    });
  }

  console.log('✅ Dashboard statistics loaded');
}

/**
 * Load recent activity
 */
async function loadRecentActivity() {
  const activityList = document.querySelector('.activity-list');
  if (!activityList) return;

  // Fetch recent quotes as activity using the sales endpoint
  const quotes = await fetchAPI('/sales/quotes');
  
  console.log('📋 Recent quotes:', quotes);
  
  if (quotes && Array.isArray(quotes) && quotes.length > 0) {
    const recentQuotes = quotes.slice(0, 4);
    
    activityList.innerHTML = recentQuotes.map(quote => {
      const timeAgo = getTimeAgo(new Date(quote.created_at));
      return `
        <div class="activity-item">
          <div class="activity-icon ${quote.status === 'new' ? '' : 'success'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            </svg>
          </div>
          <div class="activity-content">
            <p><strong>${quote.customer_name || quote.customer_email || 'Klant'}</strong> heeft een offerte aangevraagd${quote.product_title ? ` voor ${quote.product_title}` : ''}</p>
            <span>${timeAgo}</span>
          </div>
        </div>
      `;
    }).join('');
  } else {
    // Show empty state
    activityList.innerHTML = `
      <div class="activity-item">
        <div class="activity-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="activity-content">
          <p>Nog geen recente activiteit</p>
          <span>Offertes en bestellingen verschijnen hier</span>
        </div>
      </div>
    `;
  }
}

/**
 * Get human-readable time ago string
 */
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Zojuist';
  if (diffMins < 60) return `${diffMins} minuten geleden`;
  if (diffHours < 24) return `${diffHours} uur geleden`;
  if (diffDays === 1) return 'Gisteren';
  if (diffDays < 7) return `${diffDays} dagen geleden`;
  return date.toLocaleDateString('nl-NL');
}

/**
 * Setup logout button
 */
function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🚪 Logging out...');
      
      // Clear all possible auth tokens
      localStorage.removeItem('structon_auth_token');
      localStorage.removeItem('structon_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('cms_token');
      
      // Redirect to login
      window.location.href = '/cms/login.html';
    });
  }
}

/**
 * Initialize dashboard
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing CMS Dashboard...');
  
  setupLogout();
  await loadDashboardStats();
  await loadRecentActivity();
  
  console.log('✅ Dashboard ready');
});
