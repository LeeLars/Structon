/**
 * Structon Auth Module
 * Handles authentication state and UI updates
 */

import { auth } from './api/client.js';

// Auth state
let currentUser = null;
let isChecking = false;

/**
 * Check if user is authenticated
 */
export async function checkAuth() {
  if (isChecking) return currentUser;
  isChecking = true;

  try {
    const response = await auth.me();
    currentUser = response.user;
    updateAuthUI(true);
    return currentUser;
  } catch (error) {
    currentUser = null;
    updateAuthUI(false);
    return null;
  } finally {
    isChecking = false;
  }
}

/**
 * Get current user
 */
export function getUser() {
  return currentUser;
}

/**
 * Check if user is logged in
 */
export function isLoggedIn() {
  return currentUser !== null;
}

/**
 * Check if user is admin
 */
export function isAdmin() {
  return currentUser?.role === 'admin';
}

/**
 * Login user
 */
export async function login(email, password) {
  const response = await auth.login(email, password);
  currentUser = response.user;
  updateAuthUI(true);
  return response;
}

/**
 * Logout user
 */
export async function logout() {
  try {
    await auth.logout();
  } catch (error) {
    console.error('Logout API error:', error);
    // Continue with logout even if API fails
  }
  
  // Clear all auth data
  currentUser = null;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  
  // Update UI
  updateAuthUI(false);
  
  // Determine base path
  const basePath = window.location.pathname.includes('/Structon/') ? '/Structon/' : '/';
  
  // Redirect to home
  window.location.href = basePath;
}

/**
 * Handle account menu click
 */
function handleAccountClick(e) {
  e.preventDefault();
  
  // Check if dropdown already exists
  let dropdown = document.getElementById('account-dropdown');
  
  if (dropdown) {
    // Toggle visibility
    dropdown.classList.toggle('active');
  } else {
    // Create dropdown
    createAccountDropdown();
  }
}

/**
 * Create account dropdown menu
 */
function createAccountDropdown() {
  const loginBtn = document.getElementById('login-btn');
  if (!loginBtn) return;
  
  const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
  
  const dropdown = document.createElement('div');
  dropdown.id = 'account-dropdown';
  dropdown.className = 'account-dropdown active';
  dropdown.innerHTML = `
    <div class="account-dropdown-header">
      <div class="account-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="account-info">
        <div class="account-name">${currentUser?.email || 'Gebruiker'}</div>
        <div class="account-role">${currentUser?.role === 'admin' ? 'Administrator' : 'Klant'}</div>
      </div>
    </div>
    <div class="account-dropdown-divider"></div>
    <a href="${basePath}/account/" class="account-dropdown-item">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span>Mijn Account</span>
    </a>
    <button class="account-dropdown-item" id="logout-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      <span>Uitloggen</span>
    </button>
  `;
  
  // Insert after login button
  loginBtn.parentNode.insertBefore(dropdown, loginBtn.nextSibling);
  
  // Add logout handler
  const logoutBtn = dropdown.querySelector('#logout-btn');
  logoutBtn.addEventListener('click', logout);
  
  // Close dropdown when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closeDropdown(e) {
      if (!dropdown.contains(e.target) && e.target !== loginBtn) {
        dropdown.classList.remove('active');
        setTimeout(() => {
          if (dropdown.parentNode) {
            dropdown.parentNode.removeChild(dropdown);
          }
        }, 200);
        document.removeEventListener('click', closeDropdown);
      }
    });
  }, 100);
}

/**
 * Update UI based on auth state
 */
function updateAuthUI(isAuthenticated) {
  // Update login button
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    if (isAuthenticated) {
      loginBtn.innerHTML = `<span>Mijn Account</span>`;
      loginBtn.href = '#';
      // Remove old listeners
      const newBtn = loginBtn.cloneNode(true);
      loginBtn.parentNode.replaceChild(newBtn, loginBtn);
      // Add new listener
      newBtn.addEventListener('click', handleAccountClick);
    } else {
      loginBtn.innerHTML = `<span>Inloggen</span>`;
      const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
      loginBtn.href = `${basePath}/login/`;
      // Remove click handler
      const newBtn = loginBtn.cloneNode(true);
      loginBtn.parentNode.replaceChild(newBtn, loginBtn);
    }
  }

  // Update price visibility
  updatePriceVisibility(isAuthenticated);

  // Dispatch custom event
  window.dispatchEvent(new CustomEvent('authStateChanged', {
    detail: { isAuthenticated, user: currentUser }
  }));
}

/**
 * Update price visibility based on auth state
 */
function updatePriceVisibility(isAuthenticated) {
  const priceElements = document.querySelectorAll('.price-locked');
  
  priceElements.forEach(el => {
    if (isAuthenticated) {
      el.classList.remove('price-locked');
      // Price will be loaded by pricing.js
    } else {
      el.classList.add('price-locked');
      // Show login required message
      const priceDisplay = el.querySelector('.product-price');
      if (priceDisplay) {
        priceDisplay.textContent = 'Login voor prijs';
      }
    }
  });
}

/**
 * Handle account button click
 */
function handleAccountClick(e) {
  e.preventDefault();
  
  // Simple dropdown or redirect to account page
  if (confirm('Wilt u uitloggen?')) {
    logout();
  }
}

/**
 * Initialize auth on page load
 */
export function initAuth() {
  checkAuth();
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
