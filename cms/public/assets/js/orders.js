/**
 * Orders Management Page
 * Handles orders with demo data fallback
 */

console.log('[ORDERS] Script loaded');

import api from './api-client.js?v=3';

console.log('[ORDERS] API client imported');

// Demo data for when API has no data
const DEMO_ORDERS = [
  {
    id: 'ORD-2024-001',
    order_number: 'ORD-2024-001',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    customer_name: 'Jansen Grondverzet BV',
    customer_email: 'info@jansengrondverzet.nl',
    total_amount: 2450.00,
    status: 'paid',
    items: [
      { product_title: 'Slotenbak 600mm CW30', quantity: 1, price: 2450.00 }
    ]
  },
  {
    id: 'ORD-2024-002',
    order_number: 'ORD-2024-002',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    customer_name: 'De Vries Infra',
    customer_email: 'inkoop@devriesinfra.nl',
    total_amount: 5890.00,
    status: 'shipped',
    items: [
      { product_title: 'Graafbak 1200mm CW40', quantity: 2, price: 2945.00 }
    ]
  },
  {
    id: 'ORD-2024-003',
    order_number: 'ORD-2024-003',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    customer_name: 'Bouwbedrijf Pietersen',
    customer_email: 'pietersen@bouwbedrijf.nl',
    total_amount: 3200.00,
    status: 'pending',
    items: [
      { product_title: 'Sorteergrijper 800mm', quantity: 1, price: 3200.00 }
    ]
  },
  {
    id: 'ORD-2024-004',
    order_number: 'ORD-2024-004',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    customer_name: 'Groenwerk Nederland',
    customer_email: 'info@groenwerk.nl',
    total_amount: 1875.00,
    status: 'completed',
    items: [
      { product_title: 'Plantenbak 400mm CW10', quantity: 1, price: 1875.00 }
    ]
  },
  {
    id: 'ORD-2024-005',
    order_number: 'ORD-2024-005',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    customer_name: 'Aannemingsbedrijf Smit',
    customer_email: 'smit@aannemer.nl',
    total_amount: 4500.00,
    status: 'completed',
    items: [
      { product_title: 'Rioolbak 300mm', quantity: 2, price: 1250.00 },
      { product_title: 'Graafbak 800mm CW20', quantity: 1, price: 2000.00 }
    ]
  }
];

let allOrders = [];
let currentFilter = 'all';
let searchTerm = '';

// Initialize
console.log('[ORDERS] Setting up DOMContentLoaded listener...');

document.addEventListener('DOMContentLoaded', () => {
  console.log('[ORDERS] DOM loaded, initializing...');
  
  try {
    initializeData();
    console.log('[ORDERS] initializeData completed');
  } catch (error) {
    console.error('[ORDERS] Error in initializeData:', error);
  }
  
  try {
    initEventListeners();
    console.log('[ORDERS] initEventListeners completed');
  } catch (error) {
    console.error('[ORDERS] Error in initEventListeners:', error);
  }
});

/**
 * Initialize with demo data immediately
 */
async function initializeData() {
  // Load demo data immediately
  allOrders = [...DEMO_ORDERS];
  renderOrders();
  
  // Try API in background
  try {
    console.log('[ORDERS] Trying API...');
    const response = await api.get('/sales/orders');
    console.log('[ORDERS] API response:', response);
    if (response?.orders?.length > 0 || (Array.isArray(response) && response.length > 0)) {
      allOrders = response.orders || response;
      renderOrders();
    }
  } catch (error) {
    console.log('[ORDERS] Using demo orders (API unavailable):', error.message);
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
  document.getElementById('search-orders')?.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderOrders();
  });

  // Status filters
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.status;
      renderOrders();
    });
  });
}

/**
 * Render orders table
 */
function renderOrders() {
  const tbody = document.querySelector('#orders-table tbody');
  if (!tbody) return;

  let filtered = allOrders;
  
  // Apply status filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(order => order.status === currentFilter);
  }
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(order => 
      order.order_number?.toLowerCase().includes(searchTerm) ||
      order.customer_name?.toLowerCase().includes(searchTerm) ||
      order.customer_email?.toLowerCase().includes(searchTerm)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>Geen bestellingen gevonden</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(order => `
    <tr>
      <td><strong>${order.order_number}</strong></td>
      <td>${formatDate(order.created_at)}</td>
      <td>
        <div>${order.customer_name}</div>
        <div class="text-muted small">${order.customer_email}</div>
      </td>
      <td><strong>€${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}</strong></td>
      <td><span class="badge badge-${getStatusColor(order.status)}">${getStatusLabel(order.status)}</span></td>
      <td class="text-right">
        <button class="btn-icon" onclick="viewOrder('${order.id}')" title="Bekijken">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
        <button class="btn-icon" onclick="updateOrderStatus('${order.id}')" title="Status wijzigen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
}

/**
 * Get status color
 */
function getStatusColor(status) {
  const colors = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger'
  };
  return colors[status] || 'secondary';
}

/**
 * Get status label
 */
function getStatusLabel(status) {
  const labels = {
    pending: 'In afwachting',
    paid: 'Betaald',
    shipped: 'Verzonden',
    completed: 'Voltooid',
    cancelled: 'Geannuleerd'
  };
  return labels[status] || status;
}

/**
 * Format date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Show error message
 */
function showError(message) {
  alert(message);
}

// Global functions for inline onclick
window.viewOrder = (id) => {
  alert(`Bestelling ${id} bekijken (nog niet geïmplementeerd)`);
};

window.updateOrderStatus = (id) => {
  alert(`Status wijzigen voor bestelling ${id} (nog niet geïmplementeerd)`);
};
