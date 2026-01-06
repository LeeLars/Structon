/**
 * Structon Account Settings Page
 */

import { auth } from '../api/client.js';
import { checkAuth, getUser, logout } from '../auth.js';

let currentUser = null;

async function initSettingsPage() {
  const user = await checkAuth();
  
  if (!user) {
    window.location.href = '../login/?redirect=' + encodeURIComponent(window.location.pathname);
    return;
  }
  
  currentUser = user;
  updateUserInfo();
  loadUserData();
  setupEventListeners();
  setupMobileSidebar();
  setupTabs();
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

function loadUserData() {
  // Load saved profile data from localStorage
  const profile = JSON.parse(localStorage.getItem(`structon_profile_${currentUser.email}`) || '{}');
  
  // Populate form fields
  document.getElementById('email').value = currentUser.email;
  document.getElementById('first-name').value = profile.firstName || '';
  document.getElementById('last-name').value = profile.lastName || '';
  document.getElementById('phone').value = profile.phone || '';
  document.getElementById('company-name').value = profile.companyName || '';
  document.getElementById('vat-number').value = profile.vatNumber || '';
  document.getElementById('kvk-number').value = profile.kvkNumber || '';
  document.getElementById('address').value = profile.address || '';
  document.getElementById('postal-code').value = profile.postalCode || '';
  document.getElementById('city').value = profile.city || '';
  document.getElementById('country').value = profile.country || 'BE';
  
  // Load notification preferences
  const notifications = JSON.parse(localStorage.getItem(`structon_notifications_${currentUser.email}`) || '{}');
  document.getElementById('notify-quotes').checked = notifications.quotes !== false;
  document.getElementById('notify-orders').checked = notifications.orders !== false;
  document.getElementById('notify-newsletter').checked = notifications.newsletter === true;
}

function setupTabs() {
  const tabs = document.querySelectorAll('.settings-tab');
  const panels = document.querySelectorAll('.settings-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`panel-${targetTab}`).classList.add('active');
    });
  });
}

function setupEventListeners() {
  // Profile form
  document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProfile();
  });
  
  // Company form
  document.getElementById('company-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveCompany();
  });
  
  // Password form
  document.getElementById('password-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    changePassword();
  });
  
  // Notifications
  document.getElementById('save-notifications')?.addEventListener('click', saveNotifications);
  
  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await logout();
  });
}

function saveProfile() {
  const profile = JSON.parse(localStorage.getItem(`structon_profile_${currentUser.email}`) || '{}');
  
  profile.firstName = document.getElementById('first-name').value;
  profile.lastName = document.getElementById('last-name').value;
  profile.phone = document.getElementById('phone').value;
  
  localStorage.setItem(`structon_profile_${currentUser.email}`, JSON.stringify(profile));
  showToast('Profiel opgeslagen', 'success');
}

function saveCompany() {
  const profile = JSON.parse(localStorage.getItem(`structon_profile_${currentUser.email}`) || '{}');
  
  profile.companyName = document.getElementById('company-name').value;
  profile.vatNumber = document.getElementById('vat-number').value;
  profile.kvkNumber = document.getElementById('kvk-number').value;
  profile.address = document.getElementById('address').value;
  profile.postalCode = document.getElementById('postal-code').value;
  profile.city = document.getElementById('city').value;
  profile.country = document.getElementById('country').value;
  
  localStorage.setItem(`structon_profile_${currentUser.email}`, JSON.stringify(profile));
  showToast('Bedrijfsgegevens opgeslagen', 'success');
}

async function changePassword() {
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (newPassword !== confirmPassword) {
    showToast('Wachtwoorden komen niet overeen', 'error');
    return;
  }
  
  if (newPassword.length < 8) {
    showToast('Wachtwoord moet minimaal 8 tekens zijn', 'error');
    return;
  }
  
  try {
    await auth.patch('/auth/password', {
      currentPassword,
      newPassword
    });
    
    showToast('Wachtwoord gewijzigd', 'success');
    document.getElementById('password-form').reset();
  } catch (error) {
    showToast(error.message || 'Fout bij wijzigen wachtwoord', 'error');
  }
}

function saveNotifications() {
  const notifications = {
    quotes: document.getElementById('notify-quotes').checked,
    orders: document.getElementById('notify-orders').checked,
    newsletter: document.getElementById('notify-newsletter').checked
  };
  
  localStorage.setItem(`structon_notifications_${currentUser.email}`, JSON.stringify(notifications));
  showToast('Voorkeuren opgeslagen', 'success');
}

function showToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#236773'};
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
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

document.addEventListener('DOMContentLoaded', initSettingsPage);
