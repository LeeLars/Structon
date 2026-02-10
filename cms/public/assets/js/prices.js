/**
 * Prices Page JavaScript
 */

import api from './api-client.js?v=3';

let prices = [];
let products = [];
let users = [];

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
  loadData();
});

async function checkAuth() {
  try {
    const data = await api.get('/auth/me');
    if (data.user.role !== 'admin') window.location.href = '/cms/';
  } catch (error) {
    window.location.href = '/cms/';
  }
}

function setupEventListeners() {
  document.getElementById('btn-new-price')?.addEventListener('click', () => openModal());
  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document.getElementById('cancel-price')?.addEventListener('click', closeModal);
  document.getElementById('price-form')?.addEventListener('submit', handleSubmit);
  document.getElementById('search-prices')?.addEventListener('input', handleSearch);
  document.getElementById('filter-type')?.addEventListener('change', applyFilters);
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
}

async function loadData() {
  try {
    const [pricesData, productsData, usersData] = await Promise.all([
      api.get('/admin/prices'),
      api.get('/admin/products'),
      api.get('/admin/users')
    ]);
    
    prices = pricesData.prices || [];
    products = productsData.products || [];
    users = usersData.users || [];
    
    populateSelects();
    renderPrices();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function populateSelects() {
  const productSelect = document.getElementById('price-product');
  const customerSelect = document.getElementById('price-customer');
  
  if (productSelect) {
    productSelect.innerHTML = '<option value="">Selecteer product</option>' +
      products.map(p => `<option value="${p.id}">${escapeHtml(p.title)}</option>`).join('');
  }
  
  if (customerSelect) {
    customerSelect.innerHTML = '<option value="">Alle klanten (standaard prijs)</option>' +
      users.filter(u => u.role === 'user').map(u => `<option value="${u.id}">${escapeHtml(u.email)}</option>`).join('');
  }
}

function renderPrices() {
  const tbody = document.getElementById('prices-tbody');
  if (!tbody) return;
  
  if (prices.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">Geen prijzen gevonden</td></tr>';
    return;
  }
  
  tbody.innerHTML = prices.map(price => `
    <tr>
      <td><strong>${escapeHtml(price.product_title || 'Onbekend product')}</strong></td>
      <td><strong>${formatPrice(price.price)}</strong></td>
      <td><span class="status-badge ${price.visible_for_user_id ? 'status-badge-featured' : 'status-badge-active'}">${price.visible_for_user_id ? 'Klant-specifiek' : 'Standaard'}</span></td>
      <td>${price.customer_email ? escapeHtml(price.customer_email) : '-'}</td>
      <td>${price.valid_from ? formatDate(price.valid_from) : '-'}</td>
      <td>${price.valid_until ? formatDate(price.valid_until) : 'Onbeperkt'}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-action btn-edit" onclick="editPrice('${price.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
          <button class="btn-action btn-delete" onclick="deletePrice('${price.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function handleSearch(e) {
  // TODO: Implement search
}

function applyFilters() {
  // TODO: Implement filters
}

function openModal(price = null) {
  const modal = document.getElementById('price-modal');
  const form = document.getElementById('price-form');
  const title = document.getElementById('modal-title');
  
  if (price) {
    title.textContent = 'Prijs Bewerken';
    populateForm(price);
  } else {
    title.textContent = 'Nieuwe Prijs';
    form.reset();
  }
  
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('price-modal').style.display = 'none';
  document.getElementById('price-form').reset();
}

function populateForm(price) {
  document.getElementById('price-product').value = price.product_id || '';
  document.getElementById('price-amount').value = price.price || '';
  document.getElementById('price-customer').value = price.visible_for_user_id || '';
  document.getElementById('price-valid-from').value = price.valid_from ? price.valid_from.split('T')[0] : '';
  document.getElementById('price-valid-until').value = price.valid_until ? price.valid_until.split('T')[0] : '';
  
  document.getElementById('price-form').dataset.priceId = price.id;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const priceId = form.dataset.priceId;
  
  const data = {
    product_id: document.getElementById('price-product').value,
    price: parseFloat(document.getElementById('price-amount').value),
    visible_for_user_id: document.getElementById('price-customer').value || null,
    valid_from: document.getElementById('price-valid-from').value || null,
    valid_until: document.getElementById('price-valid-until').value || null,
  };
  
  try {
    if (priceId) {
      await api.put(`/admin/prices/${priceId}`, data);
      showToast('Prijs bijgewerkt', 'success');
    } else {
      await api.post('/admin/prices', data);
      showToast('Prijs toegevoegd', 'success');
    }
    
    closeModal();
    await loadData();
  } catch (error) {
    console.error('Error saving price:', error);
    showToast(error.message || 'Fout bij opslaan', 'error');
  }
}

window.editPrice = async function(id) {
  try {
    const data = await api.get(`/admin/prices/${id}`);
    openModal(data.price);
  } catch (error) {
    console.error('Error loading price:', error);
    showToast('Fout bij laden prijs', 'error');
  }
};

window.deletePrice = async function(id) {
  if (!confirm('Weet je zeker dat je deze prijs wilt verwijderen?')) return;
  
  try {
    await api.delete(`/admin/prices/${id}`);
    showToast('Prijs verwijderd', 'success');
    await loadData();
  } catch (error) {
    console.error('Error deleting price:', error);
    showToast('Fout bij verwijderen', 'error');
  }
};

async function handleLogout() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.log('Logout API call failed, continuing anyway');
  }
  
  // Clear all auth tokens from localStorage
  localStorage.removeItem('structon_auth_token');
  localStorage.removeItem('structon_user');
  localStorage.removeItem('structon_user_email');
  localStorage.removeItem('structon_user_role');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('cms_token');
  sessionStorage.clear();
  
  window.location.href = '/cms/login.html';
}

function formatPrice(price) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('nl-NL');
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  if (window.showToast) window.showToast(message, type);
}
