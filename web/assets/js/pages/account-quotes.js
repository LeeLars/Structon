/**
 * Structon Account Quotes Page
 * Handles quotes listing and filtering
 */

import { auth } from '../api/client.js';
import { checkAuth, getUser, logout } from '../auth.js';

let currentUser = null;
let userQuotes = [];
let currentFilter = 'all';

/**
 * Initialize quotes page
 */
async function initQuotesPage() {
  console.log('📄 Initializing quotes page...');
  
  const user = await checkAuth();
  
  if (!user) {
    window.location.href = '../login/?redirect=' + encodeURIComponent(window.location.pathname);
    return;
  }
  
  currentUser = user;
  updateUserInfo();
  await loadQuotes();
  setupEventListeners();
  setupMobileSidebar();
}

/**
 * Update user info in sidebar
 */
function updateUserInfo() {
  const avatarEl = document.getElementById('user-avatar');
  const nameEl = document.getElementById('user-name');
  const emailEl = document.getElementById('user-email');
  
  if (currentUser) {
    const initials = currentUser.email.substring(0, 2).toUpperCase();
    if (avatarEl) avatarEl.textContent = initials;
    if (nameEl) nameEl.textContent = currentUser.company_name || currentUser.email.split('@')[0];
    if (emailEl) emailEl.textContent = currentUser.email;
  }
}

/**
 * Load quotes
 */
async function loadQuotes() {
  try {
    // Try API first
    try {
      const response = await auth.get('/quotes/my');
      if (response.quotes) {
        userQuotes = response.quotes;
      }
    } catch (e) {
      // Fallback to localStorage
      const stored = localStorage.getItem(`structon_quotes_${currentUser.email}`);
      userQuotes = stored ? JSON.parse(stored) : [];
    }
    
    renderQuotes();
  } catch (error) {
    console.error('Error loading quotes:', error);
    renderQuotes();
  }
}

/**
 * Render quotes table
 */
function renderQuotes() {
  const tbody = document.getElementById('quotes-tbody');
  const emptyState = document.getElementById('quotes-empty');
  const tableContainer = document.querySelector('.data-table-container');
  
  // Filter quotes
  let filtered = userQuotes;
  if (currentFilter !== 'all') {
    filtered = userQuotes.filter(q => q.status === currentFilter);
  }
  
  if (filtered.length === 0) {
    if (tableContainer) tableContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  
  if (tableContainer) tableContainer.style.display = 'block';
  if (emptyState) emptyState.style.display = 'none';
  
  if (tbody) {
    tbody.innerHTML = filtered.map((quote, index) => `
      <tr>
        <td><strong>#OFF-${String(quote.id || index + 1).padStart(4, '0')}</strong></td>
        <td>${escapeHtml(quote.product_name || 'Algemene aanvraag')}</td>
        <td><span class="status-badge ${quote.status}">${getStatusLabel(quote.status)}</span></td>
        <td>${formatDate(quote.created_at)}</td>
        <td>
          <button class="btn-dashboard btn-dashboard-secondary btn-dashboard-sm" onclick="viewQuote(${quote.id || index})">
            Bekijk
          </button>
        </td>
      </tr>
    `).join('');
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderQuotes();
    });
  });
  
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await logout();
    });
  }
}

/**
 * Setup mobile sidebar
 */
function setupMobileSidebar() {
  const sidebar = document.getElementById('dashboard-sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
  if (overlay && sidebar) {
    overlay.addEventListener('click', () => sidebar.classList.remove('open'));
  }
}

/**
 * View quote details
 */
window.viewQuote = function(quoteId) {
  // For now, show alert. In production, open modal or navigate to detail page
  const quote = userQuotes.find(q => q.id === quoteId) || userQuotes[quoteId];
  if (quote) {
    alert(`Offerte Details:\n\nProduct: ${quote.product_name || 'Algemene aanvraag'}\nStatus: ${getStatusLabel(quote.status)}\nBericht: ${quote.message || 'Geen bericht'}\nDatum: ${formatDate(quote.created_at)}`);
  }
};

function getStatusLabel(status) {
  const labels = {
    'new': 'Nieuw',
    'processing': 'In behandeling',
    'quoted': 'Offerte ontvangen',
    'won': 'Geaccepteerd',
    'lost': 'Afgewezen'
  };
  return labels[status] || status;
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', initQuotesPage);
