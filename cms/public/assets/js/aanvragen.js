/**
 * Structon CMS - Aanvragen (Dealer & Contact Requests)
 * Handles dealer applications and contact form submissions
 */

import api from './api-client.js';

// State
let allRequests = [];
let currentFilter = 'all';
let currentRequestIndex = 0;

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('📋 Aanvragen page initialized');
  
  // Load requests
  await loadRequests();
  
  // Setup event listeners
  setupEventListeners();
  
  // Setup auto-refresh every 30 seconds
  setInterval(loadRequests, 30000);
});

/**
 * Load all requests (dealer + contact + vraag)
 */
async function loadRequests() {
  try {
    // Fetch all requests (contact, vraag, dealer) from new endpoint
    const response = await api.get('/quotes/requests');
    
    // Response contains { requests: [...], total: X }
    allRequests = response.requests || [];
    
    // Sort by date (newest first)
    allRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Update UI
    updateStats();
    renderRequests();
    updateNotificationBadge();
    
  } catch (error) {
    console.error('Failed to load requests:', error);
    showError('Kon aanvragen niet laden');
  }
}

/**
 * Update statistics cards
 */
function updateStats() {
  const total = allRequests.length;
  const today = allRequests.filter(r => isToday(r.created_at)).length;
  const open = allRequests.filter(r => r.status === 'new' || r.status === 'pending').length;
  
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-new').textContent = today;
  document.getElementById('stat-open').textContent = open;
}

/**
 * Update notification badge in sidebar
 */
function updateNotificationBadge() {
  const badge = document.getElementById('requests-badge');
  const unhandled = allRequests.filter(r => r.status === 'new' || r.status === 'pending').length;
  
  if (badge) {
    if (unhandled > 0) {
      badge.textContent = unhandled;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
}

/**
 * Render requests table
 */
function renderRequests() {
  const tbody = document.getElementById('requests-tbody');
  const searchTerm = document.getElementById('search-requests').value.toLowerCase();
  
  // Filter requests
  let filtered = allRequests;
  
  // Filter by type
  if (currentFilter !== 'all') {
    filtered = filtered.filter(r => r.request_type === currentFilter);
  }
  
  // Filter by search
  if (searchTerm) {
    filtered = filtered.filter(r => 
      (r.customer_name?.toLowerCase().includes(searchTerm)) ||
      (r.customer_email?.toLowerCase().includes(searchTerm)) ||
      (r.company_name?.toLowerCase().includes(searchTerm)) ||
      (r.customer_phone?.toLowerCase().includes(searchTerm))
    );
  }
  
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p>Geen aanvragen gevonden</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = filtered.map((request, index) => `
    <tr onclick="viewRequest('${request.id}')" style="cursor: pointer;">
      <td>
        <span class="badge badge-${getRequestTypeBadge(request.request_type)}">
          ${getRequestTypeLabel(request.request_type)}
        </span>
      </td>
      <td>
        <div>${formatDate(request.created_at)}</div>
        <div class="text-muted small">${formatTime(request.created_at)}</div>
      </td>
      <td>
        <div class="font-medium">${request.customer_name || '-'}</div>
        <div class="text-muted small">${request.company_name || ''}</div>
      </td>
      <td>
        <div class="small">${request.customer_email || '-'}</div>
        <div class="text-muted small">${request.customer_phone || ''}</div>
      </td>
      <td><span class="badge badge-${getStatusColor(request.status)}">${getStatusLabel(request.status)}</span></td>
      <td class="text-right" onclick="event.stopPropagation()">
        ${request.customer_phone ? `
        <a href="https://wa.me/${request.customer_phone.replace(/[^0-9+]/g, '')}" class="btn-icon" title="WhatsApp" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </a>
        <a href="tel:${request.customer_phone}" class="btn-icon" title="Bellen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </a>
        ` : ''}
        <a href="mailto:${request.customer_email}" class="btn-icon" title="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </a>
        <button class="btn-icon" onclick="viewRequest('${request.id}')" title="Bekijken">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search
  const searchInput = document.getElementById('search-requests');
  if (searchInput) {
    searchInput.addEventListener('input', renderRequests);
  }
  
  // Filter pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', function() {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.type;
      renderRequests();
    });
  });
  
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('cms_token');
      window.location.href = '/cms/login.html';
    });
  }
}

/**
 * View request details in drawer
 */
window.viewRequest = (id) => {
  const request = allRequests.find(r => r.id == id);
  if (request) {
    openRequestDrawer(request);
  }
};

/**
 * Open request drawer
 */
function openRequestDrawer(request) {
  let drawer = document.getElementById('request-drawer');
  let overlay = document.getElementById('drawer-overlay');
  
  if (!drawer) {
    overlay = document.createElement('div');
    overlay.id = 'drawer-overlay';
    overlay.className = 'drawer-overlay';
    document.body.appendChild(overlay);
    
    drawer = document.createElement('div');
    drawer.id = 'request-drawer';
    drawer.className = 'drawer';
    document.body.appendChild(drawer);
  }
  
  const typeLabels = {
    dealer: 'Dealer Aanvraag',
    contact: 'Contact Formulier',
    vraag: 'Vraag'
  };
  const typeLabel = typeLabels[request.request_type] || 'Aanvraag';
  
  // Get current index for navigation and store it globally
  const currentIndex = allRequests.findIndex(r => r.id == request.id);
  currentRequestIndex = currentIndex; // Update global index for navigation
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allRequests.length - 1;
  
  drawer.innerHTML = `
    <div class="drawer-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button class="btn-icon" onclick="navigateRequest(-1)" ${!hasPrev ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div>
          <h2 class="drawer-title">${typeLabel} ${request.reference || '#' + request.id}</h2>
          <p class="drawer-subtitle">Ontvangen op ${formatDate(request.created_at)} om ${formatTime(request.created_at)}</p>
        </div>
        <button class="btn-icon" onclick="navigateRequest(1)" ${!hasNext ? 'disabled style="opacity: 0.3; cursor: not-allowed;"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn-icon" onclick="deleteRequest('${request.id}')" title="Verwijderen" style="color: var(--color-error);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
        <button class="btn-icon" onclick="closeRequestDrawer()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
    
    <div class="drawer-content">
      <!-- Status Actions -->
      <div class="detail-section">
        <div class="detail-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Status & Opvolging
        </div>
        <div class="status-actions">
          <button class="status-btn ${request.status === 'new' || request.status === 'pending' ? 'active' : ''}" onclick="saveRequestStatus('${request.id}', 'pending')">Nieuw</button>
          <button class="status-btn ${request.status === 'processing' ? 'active' : ''}" onclick="saveRequestStatus('${request.id}', 'processing')">In behandeling</button>
          <button class="status-btn ${request.status === 'completed' ? 'active' : ''}" onclick="saveRequestStatus('${request.id}', 'completed')">Afgehandeld</button>
          <button class="status-btn ${request.status === 'rejected' ? 'active' : ''}" onclick="saveRequestStatus('${request.id}', 'rejected')">Geweigerd</button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="comm-actions">
        ${request.customer_phone ? `
        <a href="https://wa.me/${request.customer_phone.replace(/[^0-9+]/g, '')}" target="_blank" class="comm-btn comm-whatsapp">
          <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
          WhatsApp
        </a>
        <a href="tel:${request.customer_phone}" class="comm-btn comm-phone">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Bellen
        </a>
        ` : ''}
        <a href="mailto:${request.customer_email}" class="comm-btn comm-email">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          E-mail
        </a>
      </div>

      <!-- Contact Details -->
      <div class="detail-section">
        <div class="detail-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Contactgegevens
        </div>
        <div class="detail-grid">
          <div class="detail-item">
            <label>Naam</label>
            <div>${request.customer_name || '-'}</div>
          </div>
          ${request.company_name ? `
          <div class="detail-item">
            <label>Bedrijf</label>
            <div>${request.company_name}</div>
          </div>
          ` : ''}
          <div class="detail-item">
            <label>E-mail</label>
            <div><a href="mailto:${request.customer_email}">${request.customer_email}</a></div>
          </div>
          <div class="detail-item">
            <label>Telefoon</label>
            <div>${request.customer_phone || '-'}</div>
          </div>
          ${request.address ? `
          <div class="detail-item full-width">
            <label>Adres</label>
            <div>${request.address}</div>
          </div>
          ` : ''}
          ${request.vat_number ? `
          <div class="detail-item">
            <label>BTW Nummer</label>
            <div>${request.vat_number}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Request Details -->
      ${request.request_type === 'dealer' ? `
      <div class="detail-section">
        <div class="detail-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          Dealer Informatie
        </div>
        <div class="detail-grid">
          ${request.business_type ? `
          <div class="detail-item">
            <label>Type Bedrijf</label>
            <div>${request.business_type}</div>
          </div>
          ` : ''}
          ${request.years_in_business ? `
          <div class="detail-item">
            <label>Jaren Actief</label>
            <div>${request.years_in_business}</div>
          </div>
          ` : ''}
          ${request.current_brands ? `
          <div class="detail-item full-width">
            <label>Huidige Merken</label>
            <div>${request.current_brands}</div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

      <!-- Message -->
      ${request.message ? `
      <div class="detail-section">
        <div class="detail-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          Bericht
        </div>
        <div style="background: var(--col-bg); padding: 1rem; border-radius: 8px; font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap;">${request.message}</div>
      </div>
      ` : ''}
    </div>
    
    <div class="drawer-footer">
      <button class="btn btn-secondary" onclick="closeRequestDrawer()">Sluiten</button>
    </div>
  `;
  
  requestAnimationFrame(() => {
    overlay.classList.add('open');
    drawer.classList.add('open');
  });
}

window.closeRequestDrawer = () => {
  const drawer = document.getElementById('request-drawer');
  const overlay = document.getElementById('drawer-overlay');
  
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
  }
};

window.saveRequestStatus = async (id, newStatus) => {
  const request = allRequests.find(r => r.id === id);
  if (!request) return;
  
  const oldStatus = request.status;
  request.status = newStatus;
  
  renderRequests();
  updateStats();
  updateNotificationBadge();
  openRequestDrawer(request);
  
  try {
    // All requests (contact, vraag, dealer) use the same quotes endpoint
    await api.put(`/quotes/${id}`, { status: newStatus });
    
    if (window.showToast) {
      window.showToast('Status bijgewerkt', 'success');
    }
  } catch (error) {
    console.error('Failed to update status:', error);
    request.status = oldStatus;
    renderRequests();
    updateStats();
    updateNotificationBadge();
    openRequestDrawer(request);
    
    if (window.showToast) {
      window.showToast('Fout bij updaten status', 'error');
    }
  }
};

// Helper functions
function getRequestTypeBadge(type) {
  const badges = {
    dealer: 'primary',
    contact: 'secondary',
    vraag: 'info'
  };
  return badges[type] || 'secondary';
}

function getRequestTypeLabel(type) {
  const labels = {
    dealer: 'Dealer',
    contact: 'Contact',
    vraag: 'Vraag'
  };
  return labels[type] || type;
}

function getStatusColor(status) {
  const colors = { 
    new: 'success', 
    pending: 'success',
    processing: 'warning', 
    completed: 'secondary', 
    rejected: 'danger' 
  };
  return colors[status] || 'secondary';
}

function getStatusLabel(status) {
  const labels = { 
    new: 'Nieuw',
    pending: 'Nieuw', 
    processing: 'In behandeling', 
    completed: 'Afgehandeld', 
    rejected: 'Geweigerd' 
  };
  return labels[status] || status;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

function isToday(dateString) {
  const today = new Date();
  const date = new Date(dateString);
  return date.toDateString() === today.toDateString();
}

function showError(message) {
  const tbody = document.getElementById('requests-tbody');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>${message}</p>
        </td>
      </tr>
    `;
  }
}

/**
 * Navigate to previous/next request
 */
window.navigateRequest = (direction) => {
  const currentRequest = allRequests[currentRequestIndex];
  if (!currentRequest) return;
  
  const newIndex = currentRequestIndex + direction;
  
  if (newIndex >= 0 && newIndex < allRequests.length) {
    currentRequestIndex = newIndex;
    const request = allRequests[newIndex];
    openRequestDrawer(request);
  }
};

/**
 * Delete a request
 */
window.deleteRequest = async (id) => {
  if (!confirm('Weet je zeker dat je deze aanvraag wilt verwijderen?')) {
    return;
  }
  
  try {
    await api.delete(`/quotes/${id}`);
    
    // Remove from local array
    const index = allRequests.findIndex(r => r.id == id);
    if (index > -1) {
      allRequests.splice(index, 1);
    }
    
    // Close drawer and refresh table
    closeRequestDrawer();
    renderRequests();
    updateStats();
    updateNotificationBadge();
    
    if (window.showToast) {
      window.showToast('Aanvraag verwijderd', 'success');
    }
  } catch (error) {
    console.error('Failed to delete request:', error);
    if (window.showToast) {
      window.showToast('Fout bij verwijderen', 'error');
    }
  }
};
