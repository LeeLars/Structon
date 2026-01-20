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
    const response = await api.get('/sales/quotes');
    console.log('[QUOTES] API response:', response);
    
    if (response?.quotes) {
      allQuotes = response.quotes;
    } else if (Array.isArray(response)) {
      allQuotes = response;
    } else {
      allQuotes = [];
    }
    console.log(`✅ Loaded ${allQuotes.length} quotes from CMS`);
  } catch (error) {
    console.error('❌ Error loading quotes:', error);
    allQuotes = [];
  }
  
  renderQuotes();
  console.log('[QUOTES] Initial render complete');
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
    <tr>
      <td><strong>${quote.reference || quote.id}</strong></td>
      <td>
        <div>${formatDate(quote.created_at)}</div>
        <div class="text-muted small">${formatTime(quote.created_at)}</div>
      </td>
      <td>
        <div>${quote.customer_name}</div>
        <div class="text-muted small">${quote.customer_email}</div>
      </td>
      <td><span class="badge badge-${getStatusColor(quote.status)}">${getStatusLabel(quote.status)}</span></td>
      <td class="text-right">
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
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
        <button class="btn-icon" onclick="updateQuoteStatus('${quote.id}')" title="Status wijzigen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
}

function getStatusColor(status) {
  const colors = { new: 'success', processing: 'warning', quoted: 'secondary', won: 'success', lost: 'danger' };
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
    openQuoteModal(quote, 'view');
  }
};

window.updateQuoteStatus = (id) => {
  const quote = allQuotes.find(q => q.id === id);
  if (quote) {
    openQuoteModal(quote, 'status');
  }
};

/**
 * Open quote modal for viewing or status change
 */
function openQuoteModal(quote, mode = 'view') {
  // Create modal if it doesn't exist
  let modal = document.getElementById('quote-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quote-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="quote-modal-title">Offerte Details</h2>
          <button class="btn-close" onclick="closeQuoteModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body" id="quote-modal-body"></div>
        <div class="modal-footer" id="quote-modal-footer"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const title = document.getElementById('quote-modal-title');
  const body = document.getElementById('quote-modal-body');
  const footer = document.getElementById('quote-modal-footer');

  if (mode === 'view') {
    title.textContent = `Offerte ${quote.reference || quote.id}`;
    body.innerHTML = `
      <div class="quote-details">
        <div class="detail-row">
          <span class="detail-label">Referentie</span>
          <span class="detail-value">${quote.reference || quote.id}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Datum</span>
          <span class="detail-value">${formatDate(quote.created_at)} ${formatTime(quote.created_at)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Klant</span>
          <span class="detail-value">${quote.customer_name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value"><a href="mailto:${quote.customer_email}">${quote.customer_email}</a></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Telefoon</span>
          <span class="detail-value">${quote.customer_phone || '-'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Product</span>
          <span class="detail-value">${quote.product_title || '-'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="detail-value"><span class="badge badge-${getStatusColor(quote.status)}">${getStatusLabel(quote.status)}</span></span>
        </div>
        ${quote.message ? `
        <div class="detail-row full-width">
          <span class="detail-label">Bericht</span>
          <span class="detail-value">${quote.message}</span>
        </div>
        ` : ''}
      </div>
    `;
    footer.innerHTML = `
      <button class="btn btn-secondary" onclick="closeQuoteModal()">Sluiten</button>
      <button class="btn btn-primary" onclick="openQuoteModal(allQuotes.find(q => q.id === '${quote.id}'), 'status')">Status Wijzigen</button>
    `;
  } else if (mode === 'status') {
    title.textContent = 'Status Wijzigen';
    body.innerHTML = `
      <div class="status-selector">
        <p style="margin-bottom: 1rem; color: var(--col-text-muted);">Selecteer de nieuwe status voor offerte <strong>${quote.reference || quote.id}</strong></p>
        <div class="status-options" id="status-options">
          <label class="status-option ${quote.status === 'new' ? 'selected' : ''}">
            <input type="radio" name="quote-status" value="new" ${quote.status === 'new' ? 'checked' : ''}>
            <span class="status-option-badge badge badge-success">Nieuw</span>
          </label>
          <label class="status-option ${quote.status === 'processing' ? 'selected' : ''}">
            <input type="radio" name="quote-status" value="processing" ${quote.status === 'processing' ? 'checked' : ''}>
            <span class="status-option-badge badge badge-warning">In behandeling</span>
          </label>
          <label class="status-option ${quote.status === 'quoted' ? 'selected' : ''}">
            <input type="radio" name="quote-status" value="quoted" ${quote.status === 'quoted' ? 'checked' : ''}>
            <span class="status-option-badge badge badge-secondary">Offerte verstuurd</span>
          </label>
          <label class="status-option ${quote.status === 'won' ? 'selected' : ''}">
            <input type="radio" name="quote-status" value="won" ${quote.status === 'won' ? 'checked' : ''}>
            <span class="status-option-badge badge badge-success">Gewonnen</span>
          </label>
          <label class="status-option ${quote.status === 'lost' ? 'selected' : ''}">
            <input type="radio" name="quote-status" value="lost" ${quote.status === 'lost' ? 'checked' : ''}>
            <span class="status-option-badge badge badge-danger">Verloren</span>
          </label>
        </div>
      </div>
    `;
    footer.innerHTML = `
      <button class="btn btn-secondary" onclick="closeQuoteModal()">Annuleren</button>
      <button class="btn btn-primary" onclick="saveQuoteStatus('${quote.id}')">Opslaan</button>
    `;

    // Add click handlers for status options
    setTimeout(() => {
      document.querySelectorAll('.status-option').forEach(opt => {
        opt.addEventListener('click', () => {
          document.querySelectorAll('.status-option').forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          opt.querySelector('input').checked = true;
        });
      });
    }, 0);
  }

  modal.style.display = 'flex';
}

window.closeQuoteModal = () => {
  const modal = document.getElementById('quote-modal');
  if (modal) modal.style.display = 'none';
};

window.saveQuoteStatus = async (id) => {
  const selected = document.querySelector('input[name="quote-status"]:checked');
  if (!selected) return;

  const newStatus = selected.value;
  const quote = allQuotes.find(q => q.id === id);
  
  if (quote) {
    // Try API first
    try {
      await api.put(`/sales/quotes/${id}`, { status: newStatus });
    } catch (error) {
      console.log('API unavailable, updating locally');
    }
    
    quote.status = newStatus;
    renderQuotes();
    closeQuoteModal();
    
    // Show success toast
    if (window.showToast) {
      window.showToast('Status bijgewerkt', 'success');
    }
  }
};
