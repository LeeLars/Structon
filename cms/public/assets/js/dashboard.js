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

  // Load all stats in parallel
  const [productsData, quotesData, usersData, ordersData] = await Promise.all([
    fetchAPI('/admin/products?limit=1'),
    fetchAPI('/admin/quotes'),
    fetchAPI('/admin/users'),
    fetchAPI('/admin/orders')
  ]);

  // Update Products stat
  if (productsData) {
    const total = productsData.total || productsData.products?.length || 0;
    document.getElementById('stat-products').textContent = total;
  } else {
    document.getElementById('stat-products').textContent = '0';
  }

  // Update Quotes stat
  if (quotesData) {
    const quotes = quotesData.quotes || quotesData || [];
    const total = Array.isArray(quotes) ? quotes.length : (quotesData.total || 0);
    const newQuotes = Array.isArray(quotes) ? quotes.filter(q => q.status === 'new' || q.status === 'pending').length : 0;
    
    document.getElementById('stat-quotes').textContent = total;
    document.getElementById('stat-quotes-badge').textContent = newQuotes > 0 ? `${newQuotes} nieuw` : 'Geen';
    document.getElementById('stat-quotes-change').innerHTML = newQuotes > 0 
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline></svg> ${newQuotes} wachtend op reactie`
      : 'Alle offertes afgehandeld';
  } else {
    document.getElementById('stat-quotes').textContent = '0';
    document.getElementById('stat-quotes-badge').textContent = '-';
    document.getElementById('stat-quotes-change').textContent = 'Geen data';
  }

  // Update Users stat
  if (usersData) {
    const users = usersData.users || usersData || [];
    const total = Array.isArray(users) ? users.length : (usersData.total || 0);
    const activeUsers = Array.isArray(users) ? users.filter(u => u.is_active).length : total;
    
    document.getElementById('stat-users').textContent = total;
    document.getElementById('stat-users-badge').textContent = `${activeUsers} actief`;
    document.getElementById('stat-users-change').textContent = `${activeUsers} actieve accounts`;
  } else {
    document.getElementById('stat-users').textContent = '0';
    document.getElementById('stat-users-badge').textContent = '-';
    document.getElementById('stat-users-change').textContent = 'Geen data';
  }

  // Update Orders stat
  if (ordersData) {
    const orders = ordersData.orders || ordersData || [];
    const total = Array.isArray(orders) ? orders.length : (ordersData.total || 0);
    const pendingOrders = Array.isArray(orders) ? orders.filter(o => o.status === 'pending' || o.status === 'processing').length : 0;
    
    document.getElementById('stat-orders').textContent = total;
    document.getElementById('stat-orders-badge').textContent = pendingOrders > 0 ? `${pendingOrders} open` : 'Geen';
    document.getElementById('stat-orders-change').innerHTML = pendingOrders > 0
      ? `${pendingOrders} in behandeling`
      : 'Alle bestellingen verwerkt';
  } else {
    document.getElementById('stat-orders').textContent = '0';
    document.getElementById('stat-orders-badge').textContent = '-';
    document.getElementById('stat-orders-change').textContent = 'Geen data';
  }

  console.log('✅ Dashboard statistics loaded');
}

/**
 * Load recent activity
 */
async function loadRecentActivity() {
  const activityList = document.querySelector('.activity-list');
  if (!activityList) return;

  // Fetch recent quotes as activity
  const quotesData = await fetchAPI('/admin/quotes?limit=5&sort=created_at:desc');
  
  if (quotesData && quotesData.quotes && quotesData.quotes.length > 0) {
    const quotes = quotesData.quotes.slice(0, 4);
    
    activityList.innerHTML = quotes.map(quote => {
      const timeAgo = getTimeAgo(new Date(quote.created_at));
      return `
        <div class="activity-item">
          <div class="activity-icon ${quote.status === 'new' ? '' : 'success'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            </svg>
          </div>
          <div class="activity-content">
            <p><strong>${quote.customer_name || 'Klant'}</strong> heeft een offerte aangevraagd</p>
            <span>${timeAgo}</span>
          </div>
        </div>
      `;
    }).join('');
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
    logoutBtn.addEventListener('click', () => {
      auth.logout();
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
