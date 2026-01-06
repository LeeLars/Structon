/**
 * Structon Account Dashboard
 * Handles customer dashboard functionality and API integration
 */

import { auth, quotes } from '../api/client.js';
import { checkAuth, getUser, isLoggedIn, logout } from '../auth.js';

// Dashboard state
let currentUser = null;
let userQuotes = [];
let userFavorites = [];

/**
 * Initialize dashboard
 */
async function initDashboard() {
  console.log('🏠 Initializing account dashboard...');
  
  // Check authentication
  const user = await checkAuth();
  
  if (!user) {
    // Redirect to login if not authenticated
    console.log('❌ Not authenticated, redirecting to login...');
    window.location.href = '../login/?redirect=' + encodeURIComponent(window.location.pathname);
    return;
  }
  
  currentUser = user;
  console.log('✅ User authenticated:', user.email);
  
  // Update UI with user info
  updateUserInfo();
  
  // Load dashboard data
  await Promise.all([
    loadQuotes(),
    loadFavorites(),
    loadActivity()
  ]);
  
  // Setup event listeners
  setupEventListeners();
  
  // Setup mobile sidebar
  setupMobileSidebar();
}

/**
 * Update user info in sidebar
 */
function updateUserInfo() {
  const avatarEl = document.getElementById('user-avatar');
  const nameEl = document.getElementById('user-name');
  const emailEl = document.getElementById('user-email');
  const welcomeEl = document.getElementById('welcome-message');
  
  if (currentUser) {
    // Get initials from email
    const initials = currentUser.email.substring(0, 2).toUpperCase();
    
    if (avatarEl) avatarEl.textContent = initials;
    if (nameEl) nameEl.textContent = currentUser.company_name || currentUser.email.split('@')[0];
    if (emailEl) emailEl.textContent = currentUser.email;
    if (welcomeEl) {
      const greeting = getGreeting();
      welcomeEl.textContent = `${greeting}, ${currentUser.company_name || currentUser.email.split('@')[0]}`;
    }
  }
}

/**
 * Get time-based greeting
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Goedemorgen';
  if (hour < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

/**
 * Load user's quotes from API
 */
async function loadQuotes() {
  try {
    // For now, we'll use localStorage to store quotes by email
    // In production, this would be an API call filtered by user
    const storedQuotes = localStorage.getItem(`structon_quotes_${currentUser.email}`);
    userQuotes = storedQuotes ? JSON.parse(storedQuotes) : [];
    
    // Try to fetch from API if user has quotes
    try {
      const response = await auth.get('/quotes/my');
      if (response.quotes) {
        userQuotes = response.quotes;
      }
    } catch (e) {
      // API endpoint might not exist yet, use localStorage
      console.log('Using localStorage for quotes');
    }
    
    updateQuotesUI();
  } catch (error) {
    console.error('Error loading quotes:', error);
    updateQuotesUI();
  }
}

/**
 * Update quotes UI
 */
function updateQuotesUI() {
  const tbody = document.getElementById('quotes-tbody');
  const emptyState = document.getElementById('quotes-empty');
  const tableContainer = document.querySelector('#quotes-container .data-table-container');
  const statEl = document.getElementById('stat-quotes');
  const badgeEl = document.getElementById('quotes-count');
  
  // Count open quotes
  const openQuotes = userQuotes.filter(q => ['new', 'processing', 'quoted'].includes(q.status));
  
  if (statEl) statEl.textContent = openQuotes.length;
  if (badgeEl) {
    if (openQuotes.length > 0) {
      badgeEl.textContent = openQuotes.length;
      badgeEl.style.display = 'inline';
    } else {
      badgeEl.style.display = 'none';
    }
  }
  
  if (userQuotes.length === 0) {
    if (tableContainer) tableContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  
  if (tableContainer) tableContainer.style.display = 'block';
  if (emptyState) emptyState.style.display = 'none';
  
  if (tbody) {
    // Show last 5 quotes
    const recentQuotes = userQuotes.slice(0, 5);
    tbody.innerHTML = recentQuotes.map(quote => `
      <tr>
        <td>${escapeHtml(quote.product_name || 'Algemene aanvraag')}</td>
        <td><span class="status-badge ${quote.status}">${getStatusLabel(quote.status)}</span></td>
        <td>${formatDate(quote.created_at)}</td>
      </tr>
    `).join('');
  }
}

/**
 * Load user's favorites
 */
async function loadFavorites() {
  try {
    // Get favorites from localStorage
    const stored = localStorage.getItem('structon_favorites');
    userFavorites = stored ? JSON.parse(stored) : [];
    
    const statEl = document.getElementById('stat-favorites');
    const badgeEl = document.getElementById('favorites-count');
    
    if (statEl) statEl.textContent = userFavorites.length;
    if (badgeEl) {
      if (userFavorites.length > 0) {
        badgeEl.textContent = userFavorites.length;
        badgeEl.style.display = 'inline';
      } else {
        badgeEl.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
}

/**
 * Load recent activity
 */
async function loadActivity() {
  const feedEl = document.getElementById('activity-feed');
  const emptyEl = document.getElementById('activity-empty');
  
  // Combine quotes and other activities
  const activities = [];
  
  // Add quote activities
  userQuotes.forEach(quote => {
    activities.push({
      type: 'quote',
      text: `Offerte aangevraagd voor <strong>${escapeHtml(quote.product_name || 'product')}</strong>`,
      time: quote.created_at,
      icon: 'quote'
    });
  });
  
  // Sort by time
  activities.sort((a, b) => new Date(b.time) - new Date(a.time));
  
  if (activities.length === 0) {
    if (feedEl) feedEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  
  if (feedEl) {
    feedEl.style.display = 'block';
    feedEl.innerHTML = activities.slice(0, 5).map(activity => `
      <li class="activity-item">
        <div class="activity-icon ${activity.icon}">
          ${getActivityIcon(activity.icon)}
        </div>
        <div class="activity-content">
          <div class="activity-text">${activity.text}</div>
          <div class="activity-time">${formatRelativeTime(activity.time)}</div>
        </div>
      </li>
    `).join('');
  }
  if (emptyEl) emptyEl.style.display = 'none';
}

/**
 * Get activity icon SVG
 */
function getActivityIcon(type) {
  const icons = {
    quote: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
    order: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
    message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'
  };
  return icons[type] || icons.quote;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await logout();
    });
  }
}

/**
 * Setup mobile sidebar toggle
 */
function setupMobileSidebar() {
  const sidebar = document.getElementById('dashboard-sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
  
  if (overlay && sidebar) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }
}

/**
 * Get status label in Dutch
 */
function getStatusLabel(status) {
  const labels = {
    'new': 'Nieuw',
    'processing': 'In behandeling',
    'quoted': 'Offerte verzonden',
    'won': 'Geaccepteerd',
    'lost': 'Afgewezen',
    'pending': 'In afwachting',
    'paid': 'Betaald',
    'shipped': 'Verzonden',
    'completed': 'Afgerond',
    'cancelled': 'Geannuleerd'
  };
  return labels[status] || status;
}

/**
 * Format date
 */
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format relative time
 */
function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Zojuist';
  if (minutes < 60) return `${minutes} minuten geleden`;
  if (hours < 24) return `${hours} uur geleden`;
  if (days < 7) return `${days} dagen geleden`;
  
  return formatDate(dateStr);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initDashboard);

// Export for use in other modules
export { currentUser, userQuotes, userFavorites };
