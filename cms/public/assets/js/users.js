/**
 * Users Page JavaScript
 */

import api from './api-client.js';

// Demo data
const DEMO_USERS = [
  {
    id: 'user-1',
    email: 'admin@structon.nl',
    role: 'admin',
    is_active: true,
    company_name: 'Structon BV',
    created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-2',
    email: 'info@jansengrondverzet.nl',
    role: 'user',
    is_active: true,
    company_name: 'Jansen Grondverzet BV',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-3',
    email: 'inkoop@devriesinfra.nl',
    role: 'user',
    is_active: true,
    company_name: 'De Vries Infra',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-4',
    email: 'pietersen@bouwbedrijf.nl',
    role: 'user',
    is_active: true,
    company_name: 'Bouwbedrijf Pietersen',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-5',
    email: 'info@groenwerk.nl',
    role: 'user',
    is_active: false,
    company_name: 'Groenwerk Nederland',
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let users = [];
let filteredUsers = [];

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
  loadUsers();
});

async function checkAuth() {
  const token = localStorage.getItem('cms_token');
  if (!token) {
    window.location.href = '/cms/login.html';
    return;
  }
}

function setupEventListeners() {
  document.getElementById('btn-new-user')?.addEventListener('click', () => openModal());
  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document.getElementById('cancel-user')?.addEventListener('click', closeModal);
  document.getElementById('user-form')?.addEventListener('submit', handleSubmit);
  document.getElementById('search-users')?.addEventListener('input', handleSearch);
  document.getElementById('filter-role')?.addEventListener('change', applyFilters);
  document.getElementById('filter-status')?.addEventListener('change', applyFilters);
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
}

async function loadUsers() {
  try {
    const data = await api.get('/admin/users');
    users = data.users || [];
    
    // Use demo data if no real data
    if (users.length === 0) {
      users = DEMO_USERS;
    }
    
    filteredUsers = [...users];
    renderUsers();
  } catch (error) {
    console.error('Error loading users:', error);
    // Use demo data on error
    users = DEMO_USERS;
    filteredUsers = [...users];
    renderUsers();
  }
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  applyFilters(query);
}

function applyFilters(searchQuery = null) {
  const search = searchQuery || document.getElementById('search-users')?.value.toLowerCase() || '';
  const role = document.getElementById('filter-role')?.value || '';
  const status = document.getElementById('filter-status')?.value || '';
  
  filteredUsers = users.filter(user => {
    const matchesSearch = !search || 
      user.email.toLowerCase().includes(search) ||
      (user.company_name && user.company_name.toLowerCase().includes(search));
    
    const matchesRole = !role || user.role === role;
    
    let matchesStatus = true;
    if (status === 'active') matchesStatus = user.is_active;
    if (status === 'inactive') matchesStatus = !user.is_active;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  renderUsers();
}

function renderUsers() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;
  
  if (filteredUsers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">Geen gebruikers gevonden</td></tr>';
    return;
  }
  
  tbody.innerHTML = filteredUsers.map(user => `
    <tr>
      <td>
        <div class="product-info">
          <div class="product-name">${escapeHtml(user.company_name || user.email.split('@')[0])}</div>
          ${user.company_name ? `<div class="product-slug">${escapeHtml(user.email)}</div>` : ''}
        </div>
      </td>
      <td>${escapeHtml(user.email)}</td>
      <td>
        <span class="status-badge ${user.role === 'admin' ? 'status-badge-featured' : 'status-badge-active'}">
          ${user.role === 'admin' ? 'Administrator' : 'Klant'}
        </span>
      </td>
      <td>
        <span class="status-badge ${user.is_active ? 'status-badge-active' : 'status-badge-inactive'}">
          <span class="status-dot"></span>
          ${user.is_active ? 'Actief' : 'Inactief'}
        </span>
      </td>
      <td>${formatDate(user.created_at)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-action btn-edit" onclick="editUser('${user.id}')" title="Bewerken">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="btn-action btn-delete" onclick="deleteUser('${user.id}')" title="Verwijderen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openModal(user = null) {
  const modal = document.getElementById('user-modal');
  const form = document.getElementById('user-form');
  const title = document.getElementById('modal-title');
  const passwordField = document.getElementById('user-password');
  
  if (user) {
    title.textContent = 'Gebruiker Bewerken';
    populateForm(user);
    passwordField.required = false;
    passwordField.placeholder = 'Laat leeg om niet te wijzigen';
  } else {
    title.textContent = 'Nieuwe Gebruiker';
    form.reset();
    passwordField.required = true;
    passwordField.placeholder = 'Min. 8 karakters';
  }
  
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('user-modal').style.display = 'none';
  document.getElementById('user-form').reset();
}

function populateForm(user) {
  document.getElementById('user-email').value = user.email || '';
  document.getElementById('user-company').value = user.company_name || '';
  document.getElementById('user-role').value = user.role || 'user';
  document.getElementById('user-active').checked = user.is_active;
  document.getElementById('user-password').value = '';
  
  document.getElementById('user-form').dataset.userId = user.id;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const userId = form.dataset.userId;
  const password = document.getElementById('user-password').value;
  
  const data = {
    email: document.getElementById('user-email').value,
    company_name: document.getElementById('user-company').value,
    role: document.getElementById('user-role').value,
    is_active: document.getElementById('user-active').checked,
  };
  
  // Only include password if provided
  if (password) {
    data.password = password;
  }
  
  try {
    if (userId) {
      await api.put(`/admin/users/${userId}`, data);
      showToast('Gebruiker bijgewerkt', 'success');
    } else {
      await api.post('/admin/users', data);
      showToast('Gebruiker toegevoegd', 'success');
    }
    
    closeModal();
    await loadUsers();
  } catch (error) {
    console.error('Error saving user:', error);
    showToast(error.message || 'Fout bij opslaan', 'error');
  }
}

window.editUser = async function(id) {
  try {
    const data = await api.get(`/admin/users/${id}`);
    openModal(data.user);
  } catch (error) {
    console.error('Error loading user:', error);
    showToast('Fout bij laden gebruiker', 'error');
  }
};

window.deleteUser = async function(id) {
  if (!confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) return;
  
  try {
    await api.delete(`/admin/users/${id}`);
    showToast('Gebruiker verwijderd', 'success');
    await loadUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
    showToast('Fout bij verwijderen', 'error');
  }
};

async function handleLogout() {
  try {
    await api.post('/auth/logout');
    window.location.href = '/cms/';
  } catch (error) {
    window.location.href = '/cms/';
  }
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
