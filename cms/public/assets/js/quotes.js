/**
 * Quotes Management Page
 * Handles quote requests with demo data fallback
 */

console.log('[QUOTES] Script loaded');

import api from './api-client.js?v=3';

console.log('[QUOTES] API client imported');

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
console.log('[QUOTES] Setting up DOMContentLoaded listener');

document.addEventListener('DOMContentLoaded', () => {
  console.log('[QUOTES] DOM loaded, initializing...');
  console.log('[QUOTES] Demo quotes count:', DEMO_QUOTES.length);
  initializeData();
  initEventListeners();
});

/**
 * Initialize with demo data immediately
 */
async function initializeData() {
  console.log('[QUOTES] initializeData called');
  
  // Load demo data immediately
  allQuotes = [...DEMO_QUOTES];
  console.log('[QUOTES] Demo data loaded:', allQuotes.length, 'quotes');
  
  renderQuotes();
  console.log('[QUOTES] Initial render complete');
  
  // Try API in background
  try {
    console.log('[QUOTES] Attempting API call...');
    const response = await api.get('/sales/quotes');
    console.log('[QUOTES] API response:', response);
    
    if (response?.quotes?.length > 0 || (Array.isArray(response) && response.length > 0)) {
      allQuotes = response.quotes || response;
      console.log('[QUOTES] Using API data:', allQuotes.length, 'quotes');
      renderQuotes();
    }
  } catch (error) {
    console.log('[QUOTES] API unavailable, using demo data:', error.message);
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
