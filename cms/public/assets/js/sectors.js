/**
 * Sectors Management Page
 */

import { apiClient } from './api-client.js';

let allSectors = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initEventListeners();
  loadSectors();
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
  document.getElementById('search-sectors')?.addEventListener('input', (e) => {
    filterSectors(e.target.value);
  });

  // Add sector button
  document.getElementById('add-sector-btn')?.addEventListener('click', () => {
    showAddSectorModal();
  });
}

/**
 * Load sectors from API
 */
async function loadSectors() {
  try {
    const response = await apiClient('/api/sectors');
    allSectors = response.sectors || response || [];
    renderSectors();
  } catch (error) {
    console.error('Error loading sectors:', error);
    showError('Kon sectoren niet laden');
    // Show empty state
    allSectors = [];
    renderSectors();
  }
}

/**
 * Render sectors table
 */
function renderSectors() {
  const tbody = document.querySelector('#sectors-table tbody');
  if (!tbody) return;

  if (allSectors.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          <p>Geen sectoren gevonden</p>
          <button class="btn btn-primary" onclick="location.reload()">Sector Toevoegen</button>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = allSectors.map(sector => `
    <tr>
      <td>
        ${sector.image_url ? `<img src="${sector.image_url}" alt="${sector.title}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 10px; vertical-align: middle;">` : ''}
        <strong>${sector.title}</strong>
      </td>
      <td><code>${sector.slug}</code></td>
      <td>${sector.description ? sector.description.substring(0, 80) + '...' : '-'}</td>
      <td><span class="badge badge-${sector.is_active ? 'success' : 'secondary'}">${sector.is_active ? 'Actief' : 'Inactief'}</span></td>
      <td class="text-right">
        <button class="btn-icon" onclick="editSector('${sector.id}')" title="Bewerken">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="btn-icon" onclick="toggleSectorStatus('${sector.id}', ${!sector.is_active})" title="${sector.is_active ? 'Deactiveren' : 'Activeren'}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${sector.is_active ? 
              '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>' :
              '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
            }
          </svg>
        </button>
        <button class="btn-icon btn-danger" onclick="deleteSector('${sector.id}')" title="Verwijderen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
}

/**
 * Filter sectors by search term
 */
function filterSectors(searchTerm) {
  const term = searchTerm.toLowerCase();
  const filtered = allSectors.filter(sector => 
    sector.title.toLowerCase().includes(term) ||
    sector.slug.toLowerCase().includes(term) ||
    (sector.description && sector.description.toLowerCase().includes(term))
  );
  
  // Temporarily update allSectors for rendering
  const temp = allSectors;
  allSectors = filtered;
  renderSectors();
  allSectors = temp;
}

/**
 * Show add sector modal
 */
function showAddSectorModal() {
  alert('Sector toevoegen functionaliteit nog niet geïmplementeerd');
}

/**
 * Show error message
 */
function showError(message) {
  alert(message);
}

// Global functions for inline onclick
window.editSector = (id) => {
  alert(`Sector ${id} bewerken (nog niet geïmplementeerd)`);
};

window.toggleSectorStatus = async (id, newStatus) => {
  try {
    await apiClient(`/api/sectors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: newStatus })
    });
    loadSectors();
  } catch (error) {
    showError('Kon status niet wijzigen');
  }
};

window.deleteSector = async (id) => {
  if (!confirm('Weet je zeker dat je deze sector wilt verwijderen?')) return;
  
  try {
    await apiClient(`/api/sectors/${id}`, { method: 'DELETE' });
    loadSectors();
  } catch (error) {
    showError('Kon sector niet verwijderen');
  }
};
