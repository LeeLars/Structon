/**
 * Orders Management Page
 */

import { apiClient } from './api-client.js';

let allOrders = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initEventListeners();
  loadOrders();
});

/**
 * Check authentication
 */
function checkAuth() {
  const token = localStorage.getItem('cms_token');
  if (!token) {
    window.location.href = '/cms/login.html';
    return;
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
    filterOrders(e.target.value);
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
 * Load orders from API
 */
async function loadOrders() {
  try {
    const response = await apiClient('/api/sales/orders');
    allOrders = response.orders || [];
    renderOrders();
  } catch (error) {
    console.error('Error loading orders:', error);
    showError('Kon bestellingen niet laden');
    // Show empty state
    allOrders = [];
    renderOrders();
  }
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
    filtered = allOrders.filter(order => order.status === currentFilter);
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
 * Filter orders by search term
 */
function filterOrders(searchTerm) {
  const term = searchTerm.toLowerCase();
  const filtered = allOrders.filter(order => 
    order.order_number.toLowerCase().includes(term) ||
    order.customer_name.toLowerCase().includes(term) ||
    order.customer_email.toLowerCase().includes(term)
  );
  
  // Temporarily update allOrders for rendering
  const temp = allOrders;
  allOrders = filtered;
  renderOrders();
  allOrders = temp;
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
