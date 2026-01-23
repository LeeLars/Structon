/**
 * Structon Account Page
 * Handles account management functionality
 */

import { getUser, logout } from '../auth.js';

// State
let currentSection = 'dashboard';
let userData = null;

/**
 * Initialize account page
 */
async function init() {
  // Get user data
  userData = getUser();
  
  // For demo purposes, create mock user if not authenticated
  if (!userData) {
    userData = {
      email: 'demo@structon.be',
      name: 'Demo Gebruiker',
      role: 'customer'
    };
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
    loadDashboard();
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
    const name = userData.name || userData.email.split('@')[0];
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
      loadDashboard();
      break;
    case 'bestellingen':
      loadOrders();
      break;
    case 'offertes':
      loadQuotes();
      break;
    case 'favorieten':
      loadFavorites();
      break;
    case 'adressen':
      loadAddresses();
      break;
    case 'profiel':
      loadProfile();
      break;
  }
}

/**
 * Load dashboard
 */
async function loadDashboard() {
  // Update stats (mock data for now)
  document.getElementById('total-orders').textContent = '12';
  document.getElementById('pending-quotes').textContent = '3';
  document.getElementById('total-favorites').textContent = '8';
  
  // Load recent orders (mock data)
  const recentOrdersContainer = document.getElementById('recent-orders');
  if (recentOrdersContainer) {
    recentOrdersContainer.innerHTML = `
      <div style="padding: 16px; border-bottom: 1px solid #f3f4f6;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div>
            <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">Bestelling #ORD-2024-001</div>
            <div style="font-size: 13px; color: #6b7280;">3 producten</div>
          </div>
          <span style="background: #d1fae5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Geleverd</span>
        </div>
        <div style="font-size: 14px; color: #374151;">€ 2.450,00</div>
      </div>
      <div style="padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div>
            <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">Bestelling #ORD-2024-002</div>
            <div style="font-size: 13px; color: #6b7280;">1 product</div>
          </div>
          <span style="background: #dbeafe; color: #2563eb; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Verzonden</span>
        </div>
        <div style="font-size: 14px; color: #374151;">€ 890,00</div>
      </div>
    `;
  }
  
  // Load pending quotes (mock data)
  const pendingQuotesContainer = document.getElementById('pending-quotes-list');
  if (pendingQuotesContainer) {
    pendingQuotesContainer.innerHTML = `
      <div style="padding: 16px; border-bottom: 1px solid #f3f4f6;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div>
            <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">Offerte #QUO-2024-015</div>
            <div style="font-size: 13px; color: #6b7280;">Graafbak 600mm</div>
          </div>
          <span style="background: #fef3c7; color: #d97706; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">In behandeling</span>
        </div>
        <div style="font-size: 13px; color: #9ca3af;">Aangevraagd op 15 jan 2025</div>
      </div>
      <div style="padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div>
            <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">Offerte #QUO-2024-014</div>
            <div style="font-size: 13px; color: #6b7280;">Sloophamer 2000kg</div>
          </div>
          <span style="background: #e0e7ff; color: #4f46e5; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Verzonden</span>
        </div>
        <div style="font-size: 13px; color: #9ca3af;">Aangevraagd op 12 jan 2025</div>
      </div>
    `;
  }
}

/**
 * Load orders
 */
async function loadOrders() {
  // TODO: Implement orders loading from API
  console.log('Loading orders...');
}

/**
 * Load quotes
 */
async function loadQuotes() {
  // TODO: Implement quotes loading from API
  console.log('Loading quotes...');
}

/**
 * Load favorites
 */
async function loadFavorites() {
  // TODO: Implement favorites loading from API
  console.log('Loading favorites...');
}

/**
 * Load addresses
 */
async function loadAddresses() {
  // Load user addresses
  const billingAddress = document.getElementById('billing-address');
  const shippingAddress = document.getElementById('shipping-address');
  
  // Mock data - replace with API call
  if (billingAddress) {
    billingAddress.innerHTML = `
      <div style="font-size: 14px; color: #374151; line-height: 1.6;">
        <div style="font-weight: 600; margin-bottom: 4px;">Structon BV</div>
        <div>Industrieweg 123</div>
        <div>2030 Antwerpen</div>
        <div>België</div>
        <div style="margin-top: 8px;">BTW: BE0123456789</div>
      </div>
    `;
  }
  
  if (shippingAddress) {
    shippingAddress.innerHTML = `
      <div style="font-size: 14px; color: #374151; line-height: 1.6;">
        <div style="font-weight: 600; margin-bottom: 4px;">Structon BV</div>
        <div>Industrieweg 123</div>
        <div>2030 Antwerpen</div>
        <div>België</div>
      </div>
    `;
  }
}

/**
 * Load profile
 */
async function loadProfile() {
  // Pre-fill form with user data
  if (userData) {
    const firstnameInput = document.getElementById('profile-firstname');
    const lastnameInput = document.getElementById('profile-lastname');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const companyInput = document.getElementById('profile-company');
    const vatInput = document.getElementById('profile-vat');
    
    if (firstnameInput && userData.firstname) firstnameInput.value = userData.firstname;
    if (lastnameInput && userData.lastname) lastnameInput.value = userData.lastname;
    if (emailInput && userData.email) emailInput.value = userData.email;
    if (phoneInput && userData.phone) phoneInput.value = userData.phone;
    if (companyInput && userData.company) companyInput.value = userData.company;
    if (vatInput && userData.vat) vatInput.value = userData.vat;
  }
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
  const formData = new FormData(form);
  
  // TODO: Send to API
  console.log('Updating profile...', Object.fromEntries(formData));
  
  // Show success message
  showNotification('Profiel succesvol bijgewerkt', 'success');
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
  
  // TODO: Send to API
  console.log('Changing password...');
  
  // Show success message
  showNotification('Wachtwoord succesvol gewijzigd', 'success');
  form.reset();
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

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  // Create notification element
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
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
