/**
 * Quotes Management Page
 * Handles quote requests from CMS API
 */

console.log('[QUOTES] Script loaded');

import api from './api-client.js?v=3';

console.log('[QUOTES] API client imported');

let allQuotes = [];
let currentFilter = 'all';
let searchTerm = '';

// Initialize
console.log('[QUOTES] Setting up DOMContentLoaded listener');

document.addEventListener('DOMContentLoaded', () => {
  console.log('[QUOTES] DOM loaded, initializing...');
  initializeData();
  initEventListeners();
});

/**
 * Initialize data from CMS API
 */
async function initializeData() {
  console.log('[QUOTES] initializeData called');
  
  // Show loading state
  const tableBody = document.querySelector('#quotes-table tbody');
  if (tableBody) {
    tableBody.innerHTML = '<tr><td colspan="5" class="loading-state">Offertes laden...</td></tr>';
  }
  
  // Load from API
  try {
    console.log('[QUOTES] Attempting API call...');
    const response = await api.get('/quotes');
    console.log('[QUOTES] API response:', response);
    
    if (response?.quotes) {
      allQuotes = response.quotes;
    } else if (Array.isArray(response)) {
      allQuotes = response;
    } else {
      allQuotes = [];
    }
    console.log(`✅ Loaded ${allQuotes.length} quotes from CMS`);
    updateStats();
  } catch (error) {
    console.error('❌ Error loading quotes:', error);
    allQuotes = [];
  }
  
  renderQuotes();
  console.log('[QUOTES] Initial render complete');
}

/**
 * Update Dashboard Statistics
 */
function updateStats() {
  const total = allQuotes.length;
  const newQuotes = allQuotes.filter(q => q.status === 'new').length;
  const openQuotes = allQuotes.filter(q => ['new', 'processing', 'quoted'].includes(q.status)).length;
  const wonQuotes = allQuotes.filter(q => q.status === 'won').length;
  const lostQuotes = allQuotes.filter(q => q.status === 'lost').length;
  const closedQuotes = wonQuotes + lostQuotes;
  
  // Calculate conversion rate (won / closed * 100)
  const conversion = closedQuotes > 0 ? Math.round((wonQuotes / closedQuotes) * 100) : 0;

  // Animate numbers
  animateValue('stat-total', total);
  animateValue('stat-new', newQuotes);
  animateValue('stat-open', openQuotes);
  document.getElementById('stat-conversion').textContent = `${conversion}%`;
}

function animateValue(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('cms_token');
    window.location.href = '/cms/login.html';
  });

  // Search
  document.getElementById('search-quotes')?.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderQuotes();
  });

  // Status filters
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.status;
      renderQuotes();
    });
  });
  
  // Close drawer on overlay click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('drawer-overlay')) {
      closeQuoteDrawer();
    }
  });
  
  // Escape key to close drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuoteDrawer();
    }
  });
}


/**
 * Render quotes table
 */
function renderQuotes() {
  console.log('[QUOTES] renderQuotes called');
  const tableBody = document.querySelector('#quotes-table tbody');
  
  if (!tableBody) {
    console.error('[QUOTES] Table body not found!');
    return;
  }
  
  console.log('[QUOTES] Table body found, rendering', allQuotes.length, 'quotes');

  let filtered = allQuotes;
  
  // Apply status filter
  if (currentFilter !== 'all') {
    filtered = allQuotes.filter(quote => quote.status === currentFilter);
  }
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(quote => 
      (quote.customer_name?.toLowerCase().includes(searchTerm)) ||
      (quote.customer_email?.toLowerCase().includes(searchTerm)) ||
      (quote.reference?.toLowerCase().includes(searchTerm)) ||
      (quote.product_title?.toLowerCase().includes(searchTerm))
    );
  }

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <p>Geen offertes gevonden</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(quote => `
    <tr onclick="viewQuote('${quote.id}')" style="cursor: pointer;">
      <td><strong>${quote.reference || quote.id}</strong></td>
      <td>
        <div>${formatDate(quote.created_at)}</div>
        <div class="text-muted small">${formatTime(quote.created_at)}</div>
      </td>
      <td>
        <div class="font-medium">${quote.customer_name}</div>
        <div class="text-muted small">${quote.company_name || ''}</div>
      </td>
      <td><span class="badge badge-${getStatusColor(quote.status)}">${getStatusLabel(quote.status)}</span></td>
      <td class="text-right" onclick="event.stopPropagation()">
        ${quote.customer_phone ? `
        <a href="https://wa.me/${quote.customer_phone.replace(/[^0-9+]/g, '')}" class="btn-icon" title="WhatsApp" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </a>
        <a href="tel:${quote.customer_phone}" class="btn-icon" title="Bellen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </a>
        ` : ''}
        <a href="mailto:${quote.customer_email}" class="btn-icon" title="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </a>
        <button class="btn-icon" onclick="viewQuote('${quote.id}')" title="Bekijken">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
}

function getStatusColor(status) {
  const colors = { new: 'success', processing: 'warning', quoted: 'info', won: 'success', lost: 'danger' };
  return colors[status] || 'secondary';
}

function getStatusLabel(status) {
  const labels = { new: 'Nieuw', processing: 'In behandeling', quoted: 'Offerte verstuurd', won: 'Gewonnen', lost: 'Verloren' };
  return labels[status] || status;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

// Global functions for inline onclick
window.viewQuote = (id) => {
  const quote = allQuotes.find(q => q.id === id);
  if (quote) {
    openQuoteDrawer(quote);
  }
};

window.updateQuoteStatus = (id) => {
  const quote = allQuotes.find(q => q.id === id);
  if (quote) {
    openQuoteDrawer(quote);
  }
};

/**
 * Open Quote Drawer (Slide-over)
 */
function openQuoteDrawer(quote) {
  // Create drawer if it doesn't exist
  let drawer = document.getElementById('quote-drawer');
  let overlay = document.getElementById('drawer-overlay');
  
  if (!drawer) {
    overlay = document.createElement('div');
    overlay.id = 'drawer-overlay';
    overlay.className = 'drawer-overlay';
    document.body.appendChild(overlay);
    
    drawer = document.createElement('div');
    drawer.id = 'quote-drawer';
    drawer.className = 'drawer';
    document.body.appendChild(drawer);
  }
  
  // Populate Drawer
  drawer.innerHTML = `
    <div class="drawer-header">
      <div>
        <h2 class="drawer-title">Offerte ${quote.reference || quote.id}</h2>
        <p class="drawer-subtitle">Aangevraagd op ${formatDate(quote.created_at)} om ${formatTime(quote.created_at)}</p>
      </div>
      <button class="btn-icon" onclick="closeQuoteDrawer()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    
    <div class="drawer-content">
      <!-- Status Actions -->
      <div class="detail-section">
        <div class="detail-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Status & Opvolging
        </div>
        <div class="status-actions">
          <button class="status-btn ${quote.status === 'new' ? 'active' : ''}" onclick="saveQuoteStatus('${quote.id}', 'new')">Nieuw</button>
          <button class="status-btn ${quote.status === 'processing' ? 'active' : ''}" onclick="saveQuoteStatus('${quote.id}', 'processing')">In behandeling</button>
          <button class="status-btn ${quote.status === 'quoted' ? 'active' : ''}" onclick="saveQuoteStatus('${quote.id}', 'quoted')">Offerte verstuurd</button>
          <button class="status-btn ${quote.status === 'won' ? 'active' : ''}" onclick="saveQuoteStatus('${quote.id}', 'won')">Gewonnen</button>
          <button class="status-btn ${quote.status === 'lost' ? 'active' : ''}" onclick="saveQuoteStatus('${quote.id}', 'lost')">Verloren</button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="comm-actions">
        ${quote.customer_phone ? `
        <a href="https://wa.me/${quote.customer_phone.replace(/[^0-9+]/g, '')}" target="_blank" class="comm-btn comm-whatsapp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          WhatsApp
        </a>
        <a href="tel:${quote.customer_phone}" class="comm-btn comm-phone">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Bellen
        </a>
        ` : ''}
        <a href="mailto:${quote.customer_email}" class="comm-btn comm-email">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          E-mail
        </a>
      </div>

      <!-- Customer Details -->
      <div class="detail-section">
        <div class="detail-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Klantgegevens
        </div>
        <div class="detail-grid">
          <div class="detail-item">
            <label>Naam</label>
            <div>${quote.customer_name}</div>
          </div>
          ${quote.company_name ? `
          <div class="detail-item">
            <label>Bedrijf</label>
            <div>${quote.company_name}</div>
          </div>
          ` : ''}
          <div class="detail-item">
            <label>E-mail</label>
            <div><a href="mailto:${quote.customer_email}">${quote.customer_email}</a></div>
          </div>
          <div class="detail-item">
            <label>Telefoon</label>
            <div>${quote.customer_phone || '-'}</div>
          </div>
          ${quote.vat_number ? `
          <div class="detail-item">
            <label>BTW Nummer</label>
            <div>${quote.vat_number}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Product Details -->
      <div class="detail-section">
        <div class="detail-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          Aanvraag Details
        </div>
        <div class="detail-grid">
          <div class="detail-item full-width">
            <label>Product / Onderwerp</label>
            <div>${quote.product_title || quote.product_name || 'Algemene aanvraag'}</div>
          </div>
          ${quote.machine_brand ? `
          <div class="detail-item">
            <label>Machine Merk</label>
            <div>${quote.machine_brand}</div>
          </div>
          ` : ''}
          ${quote.machine_model ? `
          <div class="detail-item">
            <label>Machine Model</label>
            <div>${quote.machine_model}</div>
          </div>
          ` : ''}
          ${quote.attachment_type ? `
          <div class="detail-item">
            <label>Aansluiting</label>
            <div>${quote.attachment_type}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Message -->
      ${quote.message ? `
      <div class="detail-section">
        <div class="detail-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          Bericht
        </div>
        <div style="background: var(--col-bg); padding: 1rem; border-radius: 8px; font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap;">${quote.message}</div>
      </div>
      ` : ''}
    </div>
    
    <div class="drawer-footer">
      <button class="btn btn-secondary" onclick="closeQuoteDrawer()">Sluiten</button>
    </div>
  `;
  
  // Show drawer with animation
  requestAnimationFrame(() => {
    overlay.classList.add('open');
    drawer.classList.add('open');
  });
}

window.closeQuoteDrawer = () => {
  const drawer = document.getElementById('quote-drawer');
  const overlay = document.getElementById('drawer-overlay');
  
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    
    // Remove from DOM after animation
    setTimeout(() => {
      // drawer.remove(); 
      // overlay.remove();
      // Don't remove to keep DOM elements for next time, just hide
    }, 300);
  }
};

window.saveQuoteStatus = async (id, newStatus) => {
  const quote = allQuotes.find(q => q.id === id);
  if (!quote) return;
  
  // Optimistic update
  const oldStatus = quote.status;
  quote.status = newStatus;
  
  // Update UI immediately
  renderQuotes();
  updateStats();
  
  // Re-render drawer actions to show new active state
  openQuoteDrawer(quote); // Refreshes content
  
  try {
    await api.put(`/sales/quotes/${id}`, { status: newStatus });
    
    if (window.showToast) {
      window.showToast('Status bijgewerkt', 'success');
    }
  } catch (error) {
    console.error('Failed to update status:', error);
    // Revert on error
    quote.status = oldStatus;
    renderQuotes();
    updateStats();
    openQuoteDrawer(quote);
    
    if (window.showToast) {
      window.showToast('Fout bij updaten status', 'error');
    }
  }
};
