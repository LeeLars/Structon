/**
 * Structon Account Orders Page
 */

import { auth } from '../api/client.js';
import { checkAuth, getUser, logout } from '../auth.js';

let currentUser = null;
let userOrders = [];
let currentFilter = 'all';

async function initOrdersPage() {
  const user = await checkAuth();
  
  if (!user) {
    window.location.href = '../login/?redirect=' + encodeURIComponent(window.location.pathname);
    return;
  }
  
  currentUser = user;
  updateUserInfo();
  await loadOrders();
  setupEventListeners();
  setupMobileSidebar();
}

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

async function loadOrders() {
  try {
    // Try API first
    try {
      const response = await auth.get('/orders/my');
      if (response.orders) {
        userOrders = response.orders;
      }
    } catch (e) {
      // Fallback to localStorage
      const stored = localStorage.getItem(`structon_orders_${currentUser.email}`);
      userOrders = stored ? JSON.parse(stored) : [];
    }
    
    renderOrders();
  } catch (error) {
    console.error('Error loading orders:', error);
    renderOrders();
  }
}

function renderOrders() {
  const tbody = document.getElementById('orders-tbody');
  const emptyState = document.getElementById('orders-empty');
  const tableContainer = document.getElementById('orders-table-container');
  
  let filtered = userOrders;
  if (currentFilter !== 'all') {
    filtered = userOrders.filter(o => o.status === currentFilter);
  }
  
  if (filtered.length === 0) {
    if (tableContainer) tableContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  
  if (tableContainer) tableContainer.style.display = 'block';
  if (emptyState) emptyState.style.display = 'none';
  
  if (tbody) {
    tbody.innerHTML = filtered.map(order => {
      const items = order.items || [];
      const itemCount = items.length;
      const itemNames = items.slice(0, 2).map(i => i.name || 'Product').join(', ');
      const moreItems = itemCount > 2 ? ` +${itemCount - 2} meer` : '';
      
      return `
        <tr>
          <td><strong>${order.order_number || '#' + order.id}</strong></td>
          <td>${escapeHtml(itemNames)}${moreItems}</td>
          <td>€${formatPrice(order.total_amount)}</td>
          <td><span class="status-badge ${order.status}">${getStatusLabel(order.status)}</span></td>
          <td>${formatDate(order.created_at)}</td>
          <td>
            <button class="btn-dashboard btn-dashboard-secondary btn-dashboard-sm" onclick="viewOrder('${order.id}')">
              Bekijk
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
}

function setupEventListeners() {
  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderOrders();
    });
  });
  
  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await logout();
  });
}

window.viewOrder = function(orderId) {
  const order = userOrders.find(o => o.id === orderId || o.order_number === orderId);
  if (order) {
    const items = (order.items || []).map(i => `- ${i.name || 'Product'} x${i.quantity || 1}`).join('\n');
    alert(`Bestelling ${order.order_number || order.id}\n\nStatus: ${getStatusLabel(order.status)}\nTotaal: €${formatPrice(order.total_amount)}\n\nProducten:\n${items || 'Geen items'}`);
  }
};

function getStatusLabel(status) {
  const labels = {
    'pending': 'In behandeling',
    'paid': 'Betaald',
    'processing': 'Wordt verwerkt',
    'shipped': 'Verzonden',
    'completed': 'Afgerond',
    'cancelled': 'Geannuleerd'
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

function formatPrice(amount) {
  if (!amount) return '0,00';
  return parseFloat(amount).toFixed(2).replace('.', ',');
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

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

document.addEventListener('DOMContentLoaded', initOrdersPage);
