/**
 * Structon Account Page
 * Handles customer account functionality
 * ONLY uses real data from API - NO mock/demo data
 */

import { getUser, logout, checkAuth } from '../auth.js';
import { orders, quotes, favorites, addresses, account } from '../api/client.js';

// State
let currentSection = 'dashboard';
let userData = null;

/**
 * Initialize account page
 */
async function init() {
  // Check authentication - redirect to login if not authenticated
  userData = await checkAuth();
  
  if (!userData) {
    // Redirect to login
    const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
    const currentPath = window.location.pathname;
    window.location.href = `${basePath}/login/?redirect=${encodeURIComponent(currentPath)}`;
    return;
  }
  
  // Update user info in sidebar
  updateUserInfo();
  
  // Setup navigation
  setupNavigation();
  
  // Setup logout button
  setupLogout();
  
  // Load initial section from hash or default to dashboard
  const hash = window.location.hash.slice(1);
  if (hash) {
    switchSection(hash);
  } else {
    switchSection('dashboard');
  }
  
  // Setup forms
  setupForms();
}

/**
 * Update user info display
 */
function updateUserInfo() {
  const usernameEl = document.getElementById('account-username');
  const emailEl = document.getElementById('account-email');
  
  if (usernameEl && userData) {
    const name = userData.name || userData.firstname || userData.email.split('@')[0];
    usernameEl.textContent = name;
  }
  
  if (emailEl && userData) {
    emailEl.textContent = userData.email;
  }
}

/**
 * Setup navigation
 */
function setupNavigation() {
  const navItems = document.querySelectorAll('.account-nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      if (section) {
        switchSection(section);
        window.location.hash = section;
      }
    });
  });
  
  // Handle "view all" links in dashboard
  const viewAllLinks = document.querySelectorAll('.link-view-all');
  viewAllLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      if (section) {
        switchSection(section);
        window.location.hash = section;
      }
    });
  });
}

/**
 * Switch to a section
 */
function switchSection(sectionName) {
  currentSection = sectionName;
  
  // Update navigation active state
  document.querySelectorAll('.account-nav-item').forEach(item => {
    if (item.dataset.section === sectionName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Update content sections
  document.querySelectorAll('.account-section').forEach(section => {
    if (section.id === `section-${sectionName}`) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });
  
  // Load section data
  loadSectionData(sectionName);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Load section data
 */
async function loadSectionData(sectionName) {
  switch (sectionName) {
    case 'dashboard':
      await loadDashboard();
      break;
    case 'bestellingen':
      await loadOrders();
      break;
    case 'offertes':
      await loadQuotes();
      break;
    case 'favorieten':
      await loadFavorites();
      break;
    case 'adressen':
      await loadAddresses();
      break;
    case 'profiel':
      loadProfile();
      break;
  }
}

/**
 * Load dashboard with real data from API
 */
async function loadDashboard() {
  // Show loading state
  showLoadingState('total-orders');
  showLoadingState('pending-quotes');
  showLoadingState('total-favorites');
  
  try {
    // Fetch dashboard stats from API
    const dashboardData = await account.getDashboard();
    
    // Update stats with real data
    document.getElementById('total-orders').textContent = dashboardData.total_orders || '0';
    document.getElementById('pending-quotes').textContent = dashboardData.pending_quotes || '0';
    document.getElementById('total-favorites').textContent = dashboardData.total_favorites || '0';
    
    // Load recent orders
    await loadRecentOrders(dashboardData.recent_orders || []);
    
    // Load pending quotes
    await loadPendingQuotes(dashboardData.pending_quotes_list || []);
    
  } catch (error) {
    console.error('Error loading dashboard:', error);
    // Show zeros if API fails
    document.getElementById('total-orders').textContent = '0';
    document.getElementById('pending-quotes').textContent = '0';
    document.getElementById('total-favorites').textContent = '0';
    
    // Show empty states
    showEmptyState('recent-orders', 'Geen bestellingen gevonden');
    showEmptyState('pending-quotes-list', 'Geen openstaande offertes');
  }
}

/**
 * Load recent orders for dashboard
 */
async function loadRecentOrders(recentOrders) {
  const container = document.getElementById('recent-orders');
  if (!container) return;
  
  if (!recentOrders || recentOrders.length === 0) {
    showEmptyState('recent-orders', 'Nog geen bestellingen geplaatst');
    return;
  }
  
  container.innerHTML = recentOrders.map(order => `
    <div style="padding: 16px; border-bottom: 1px solid #e0e0e0;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
        <div>
          <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">Bestelling #${order.order_number}</div>
          <div style="font-size: 13px; color: #6b7280;">${order.item_count} product${order.item_count !== 1 ? 'en' : ''}</div>
        </div>
        ${getStatusBadge(order.status)}
      </div>
      <div style="font-size: 14px; color: #374151;">${formatPrice(order.total)}</div>
    </div>
  `).join('');
}

/**
 * Load pending quotes for dashboard
 */
async function loadPendingQuotes(pendingQuotes) {
  const container = document.getElementById('pending-quotes-list');
  if (!container) return;
  
  if (!pendingQuotes || pendingQuotes.length === 0) {
    showEmptyState('pending-quotes-list', 'Geen openstaande offertes');
    return;
  }
  
  container.innerHTML = pendingQuotes.map(quote => `
    <div style="padding: 16px; border-bottom: 1px solid #e0e0e0;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
        <div>
          <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">Offerte #${quote.quote_number}</div>
          <div style="font-size: 13px; color: #6b7280;">${quote.product_name || 'Meerdere producten'}</div>
        </div>
        ${getStatusBadge(quote.status)}
      </div>
      <div style="font-size: 13px; color: #9ca3af;">Aangevraagd op ${formatDate(quote.created_at)}</div>
    </div>
  `).join('');
}

/**
 * Load orders from API
 */
async function loadOrders() {
  const container = document.getElementById('orders-list');
  if (!container) return;
  
  // Show loading
  container.innerHTML = '<div class="loading-state"><p>Bestellingen laden...</p></div>';
  
  try {
    const ordersData = await orders.getMyOrders();
    const ordersList = ordersData.orders || ordersData || [];
    
    if (ordersList.length === 0) {
      showEmptyState('orders-list', 'Geen bestellingen gevonden');
      return;
    }
    
    container.innerHTML = ordersList.map(order => `
      <div class="order-item" style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
          <div>
            <div style="font-weight: 700; color: #111827; font-size: 16px; margin-bottom: 4px;">Bestelling #${order.order_number}</div>
            <div style="font-size: 14px; color: #6b7280;">Geplaatst op ${formatDate(order.created_at)}</div>
          </div>
          ${getStatusBadge(order.status)}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 14px; color: #374151;">${order.item_count} product${order.item_count !== 1 ? 'en' : ''}</div>
          <div style="font-weight: 600; color: #111827; font-size: 16px;">${formatPrice(order.total)}</div>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading orders:', error);
    showEmptyState('orders-list', 'Kon bestellingen niet laden');
  }
}

/**
 * Load quotes from API
 */
async function loadQuotes() {
  const container = document.getElementById('quotes-list');
  if (!container) return;
  
  // Show loading
  container.innerHTML = '<div class="loading-state"><p>Offertes laden...</p></div>';
  
  try {
    const quotesData = await quotes.getMyQuotes();
    const quotesList = quotesData.quotes || quotesData || [];
    
    if (quotesList.length === 0) {
      showEmptyState('quotes-list', 'Geen offertes gevonden');
      return;
    }
    
    container.innerHTML = quotesList.map(quote => `
      <div class="quote-item" style="padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
          <div>
            <div style="font-weight: 700; color: #111827; font-size: 16px; margin-bottom: 4px;">Offerte #${quote.quote_number}</div>
            <div style="font-size: 14px; color: #6b7280;">${quote.product_name || 'Meerdere producten'}</div>
          </div>
          ${getStatusBadge(quote.status)}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 13px; color: #9ca3af;">Aangevraagd op ${formatDate(quote.created_at)}</div>
          ${quote.total ? `<div style="font-weight: 600; color: #111827; font-size: 16px;">${formatPrice(quote.total)}</div>` : ''}
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading quotes:', error);
    showEmptyState('quotes-list', 'Kon offertes niet laden');
  }
}

/**
 * Load favorites from API
 */
async function loadFavorites() {
  const container = document.getElementById('favorites-grid');
  if (!container) return;
  
  // Show loading
  container.innerHTML = '<div class="loading-state"><p>Favorieten laden...</p></div>';
  
  try {
    const favoritesData = await favorites.getMyFavorites();
    const favoritesList = favoritesData.favorites || favoritesData || [];
    
    if (favoritesList.length === 0) {
      showEmptyState('favorites-grid', 'Nog geen favorieten toegevoegd');
      return;
    }
    
    const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
    
    container.innerHTML = favoritesList.map(product => `
      <div class="favorite-card" style="border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="height: 160px; background: #f9fafb; display: flex; align-items: center; justify-content: center;">
          ${product.image ? `<img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">` : '<span style="color: #9ca3af;">Geen afbeelding</span>'}
        </div>
        <div style="padding: 16px;">
          <div style="font-weight: 600; color: #111827; margin-bottom: 8px;">${product.name}</div>
          <div style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">${product.category || ''}</div>
          <div style="display: flex; gap: 8px;">
            <a href="${basePath}/producten/${product.slug}/" style="flex: 1; padding: 10px; background: #236773; color: white; text-align: center; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Bekijken</a>
            <button onclick="removeFavorite('${product.id}')" style="padding: 10px; background: transparent; border: 1px solid #e0e0e0; border-radius: 8px; cursor: pointer;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading favorites:', error);
    showEmptyState('favorites-grid', 'Kon favorieten niet laden');
  }
}

/**
 * Remove favorite
 */
window.removeFavorite = async function(productId) {
  try {
    await favorites.remove(productId);
    showNotification('Product verwijderd uit favorieten', 'success');
    await loadFavorites();
  } catch (error) {
    console.error('Error removing favorite:', error);
    showNotification('Kon product niet verwijderen', 'error');
  }
};

/**
 * Load addresses from API
 */
async function loadAddresses() {
  const billingContainer = document.getElementById('billing-address');
  const shippingContainer = document.getElementById('shipping-address');
  
  try {
    const addressesData = await addresses.getMyAddresses();
    
    // Billing address
    if (billingContainer) {
      const billing = addressesData.billing;
      if (billing && billing.street) {
        billingContainer.innerHTML = `
          <div style="font-size: 14px; color: #374151; line-height: 1.6;">
            ${billing.company ? `<div style="font-weight: 600; margin-bottom: 4px;">${billing.company}</div>` : ''}
            <div>${billing.street} ${billing.number || ''}</div>
            <div>${billing.postal_code} ${billing.city}</div>
            <div>${billing.country}</div>
            ${billing.vat ? `<div style="margin-top: 8px;">BTW: ${billing.vat}</div>` : ''}
          </div>
        `;
      } else {
        billingContainer.innerHTML = '<p class="address-empty">Nog geen factuuradres ingesteld</p>';
      }
    }
    
    // Shipping address
    if (shippingContainer) {
      const shipping = addressesData.shipping;
      if (shipping && shipping.street) {
        shippingContainer.innerHTML = `
          <div style="font-size: 14px; color: #374151; line-height: 1.6;">
            ${shipping.company ? `<div style="font-weight: 600; margin-bottom: 4px;">${shipping.company}</div>` : ''}
            <div>${shipping.street} ${shipping.number || ''}</div>
            <div>${shipping.postal_code} ${shipping.city}</div>
            <div>${shipping.country}</div>
          </div>
        `;
      } else {
        shippingContainer.innerHTML = '<p class="address-empty">Nog geen bezorgadres ingesteld</p>';
      }
    }
    
  } catch (error) {
    console.error('Error loading addresses:', error);
    if (billingContainer) billingContainer.innerHTML = '<p class="address-empty">Kon adres niet laden</p>';
    if (shippingContainer) shippingContainer.innerHTML = '<p class="address-empty">Kon adres niet laden</p>';
  }
}

/**
 * Load profile - pre-fill form with user data
 */
function loadProfile() {
  if (!userData) return;
  
  const fields = {
    'profile-firstname': userData.firstname || '',
    'profile-lastname': userData.lastname || '',
    'profile-email': userData.email || '',
    'profile-phone': userData.phone || '',
    'profile-company': userData.company || '',
    'profile-vat': userData.vat || ''
  };
  
  Object.entries(fields).forEach(([id, value]) => {
    const input = document.getElementById(id);
    if (input) input.value = value;
  });
}

/**
 * Setup forms
 */
function setupForms() {
  // Profile form
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleProfileUpdate(e.target);
    });
  }
  
  // Password form
  const passwordForm = document.getElementById('password-form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handlePasswordChange(e.target);
    });
  }
}

/**
 * Handle profile update
 */
async function handleProfileUpdate(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>Opslaan...</span>';
  submitBtn.disabled = true;
  
  try {
    const profileData = {
      firstname: document.getElementById('profile-firstname').value,
      lastname: document.getElementById('profile-lastname').value,
      email: document.getElementById('profile-email').value,
      phone: document.getElementById('profile-phone').value,
      company: document.getElementById('profile-company').value,
      vat: document.getElementById('profile-vat').value
    };
    
    await account.updateProfile(profileData);
    
    // Update local user data
    userData = { ...userData, ...profileData };
    updateUserInfo();
    
    showNotification('Profiel succesvol bijgewerkt', 'success');
  } catch (error) {
    console.error('Error updating profile:', error);
    showNotification('Kon profiel niet bijwerken', 'error');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

/**
 * Handle password change
 */
async function handlePasswordChange(form) {
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (newPassword !== confirmPassword) {
    showNotification('Wachtwoorden komen niet overeen', 'error');
    return;
  }
  
  if (newPassword.length < 8) {
    showNotification('Wachtwoord moet minimaal 8 tekens bevatten', 'error');
    return;
  }
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>Wijzigen...</span>';
  submitBtn.disabled = true;
  
  try {
    await account.changePassword(currentPassword, newPassword);
    showNotification('Wachtwoord succesvol gewijzigd', 'success');
    form.reset();
  } catch (error) {
    console.error('Error changing password:', error);
    showNotification('Kon wachtwoord niet wijzigen. Controleer uw huidige wachtwoord.', 'error');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

/**
 * Setup logout
 */
function setupLogout() {
  const logoutBtn = document.getElementById('sidebar-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await logout();
    });
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Show loading state
 */
function showLoadingState(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = '...';
}

/**
 * Show empty state
 */
function showEmptyState(containerId, message) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>${message}</p>
      </div>
    `;
  }
}

/**
 * Get status badge HTML
 */
function getStatusBadge(status) {
  const statusConfig = {
    'pending': { bg: '#fef3c7', color: '#d97706', label: 'In behandeling' },
    'processing': { bg: '#dbeafe', color: '#2563eb', label: 'Wordt verwerkt' },
    'shipped': { bg: '#e0e7ff', color: '#4f46e5', label: 'Verzonden' },
    'delivered': { bg: '#d1fae5', color: '#059669', label: 'Geleverd' },
    'cancelled': { bg: '#fee2e2', color: '#dc2626', label: 'Geannuleerd' },
    'quoted': { bg: '#e0e7ff', color: '#4f46e5', label: 'Offerte verzonden' },
    'accepted': { bg: '#d1fae5', color: '#059669', label: 'Geaccepteerd' },
    'rejected': { bg: '#fee2e2', color: '#dc2626', label: 'Afgewezen' },
    'expired': { bg: '#f3f4f6', color: '#6b7280', label: 'Verlopen' }
  };
  
  const config = statusConfig[status] || { bg: '#f3f4f6', color: '#6b7280', label: status };
  
  return `<span style="background: ${config.bg}; color: ${config.color}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${config.label}</span>`;
}

/**
 * Format price
 */
function formatPrice(amount) {
  if (!amount && amount !== 0) return '';
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

/**
 * Format date
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('nl-BE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#236773'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-size: 14px;
    font-weight: 500;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  });
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
