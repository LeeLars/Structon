/**
 * Quotes Management Page
 * Handles quote requests with demo data fallback
 */

import api from './api-client.js';

// Demo data for when API has no data
const DEMO_QUOTES = [
  {
    id: 'Q-2024-001',
    reference: 'Q-2024-001',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    customer_name: 'Jansen Grondverzet BV',
    customer_email: 'info@jansengrondverzet.nl',
    customer_phone: '+31 6 12345678',
    product_title: 'Slotenbak 600mm CW30',
    status: 'new',
    message: 'Graag een offerte voor deze slotenbak met levering in regio Utrecht.'
  },
  {
    id: 'Q-2024-002',
    reference: 'Q-2024-002',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    customer_name: 'De Vries Infra',
    customer_email: 'inkoop@devriesinfra.nl',
    customer_phone: '+31 6 98765432',
    product_title: 'Graafbak 1200mm CW40',
    status: 'processing',
    message: 'Offerte aanvraag voor 2 stuks graafbakken.'
  },
  {
    id: 'Q-2024-003',
    reference: 'Q-2024-003',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    customer_name: 'Bouwbedrijf Pietersen',
    customer_email: 'pietersen@bouwbedrijf.nl',
    customer_phone: '+31 6 55544433',
    product_title: 'Sorteergrijper 800mm',
    status: 'quoted',
    message: 'Interesse in sorteergrijper voor Volvo EC220.'
  },
  {
    id: 'Q-2024-004',
    reference: 'Q-2024-004',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    customer_name: 'Groenwerk Nederland',
    customer_email: 'info@groenwerk.nl',
    customer_phone: '+31 6 11122233',
    product_title: 'Plantenbak 400mm CW10',
    status: 'won',
    message: 'Offerte voor plantenbak met snelwissel.'
  },
  {
    id: 'Q-2024-005',
    reference: 'Q-2024-005',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    customer_name: 'Aannemingsbedrijf Smit',
    customer_email: 'smit@aannemer.nl',
    customer_phone: '+31 6 99988877',
    product_title: 'Rioolbak 300mm',
    status: 'lost',
    message: 'Prijsopgave voor rioolbak.'
  }
];

let allQuotes = [];
let currentFilter = 'all';
let searchTerm = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initEventListeners();
  loadQuotes();
});

/**
 * Check authentication - allow demo mode without login
 */
function checkAuth() {
  const token = localStorage.getItem('cms_token');
  // Don't redirect - allow demo data to be shown
  if (!token) {
    console.log('No auth token - running in demo mode');
  }
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
 * Load quotes from API or use demo data
 */
async function loadQuotes() {
  const tableBody = document.querySelector('#quotes-table tbody');
  
  // Show loading state
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="loading-cell">
          <div class="loading-spinner"></div>
          <span>Aanvragen laden...</span>
        </td>
      </tr>
    `;
  }
  
  try {
    const response = await api.get('/sales/quotes');
    allQuotes = response.quotes || response || [];
    
    // Use demo data if no real data
    if (!allQuotes || allQuotes.length === 0) {
      console.log('No quotes from API, using demo data');
      allQuotes = DEMO_QUOTES;
    }
    
    renderQuotes();
  } catch (error) {
    console.error('Error loading quotes:', error);
    // Use demo data on error - don't redirect
    console.log('API error, using demo data');
    allQuotes = DEMO_QUOTES;
    renderQuotes();
  }
}

/**
 * Render quotes table
 */
function renderQuotes() {
  const tableBody = document.querySelector('#quotes-table tbody');
  if (!tableBody) return;

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
  const colors = { new: 'primary', processing: 'warning', quoted: 'info', won: 'success', lost: 'danger' };
  return colors[status] || 'secondary';
}

function getStatusLabel(status) {
  const labels = { new: 'Nieuw', processing: 'In behandeling', quoted: 'Geoffreerd', won: 'Gewonnen', lost: 'Verloren' };
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
    alert(`Offerte Details:\n\nReferentie: ${quote.reference || quote.id}\nKlant: ${quote.customer_name}\nEmail: ${quote.customer_email}\nProduct: ${quote.product_title}\nStatus: ${getStatusLabel(quote.status)}\n\nBericht:\n${quote.message || 'Geen bericht'}`);
  }
};

window.updateQuoteStatus = (id) => {
  const newStatus = prompt('Nieuwe status (new, processing, quoted, won, lost):');
  if (newStatus && ['new', 'processing', 'quoted', 'won', 'lost'].includes(newStatus)) {
    const quote = allQuotes.find(q => q.id === id);
    if (quote) {
      quote.status = newStatus;
      renderQuotes();
    }
  }
};
