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
    
    // Handle null response (user not logged in)
    if (!response || !response.user) {
      currentUser = null;
      updateAuthUI(false);
      return null;
    }
    
    currentUser = response.user;
    
    // Store token if provided (for API requests)
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    updateAuthUI(true);
    return currentUser;
  } catch (error) {
    console.log('Auth check: not logged in');
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
  
  // Inject CSS if not already present
  if (!document.getElementById('account-dropdown-styles')) {
    const style = document.createElement('style');
    style.id = 'account-dropdown-styles';
    style.textContent = `
      .account-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        min-width: 280px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.2s ease;
        z-index: 9999;
      }
      .account-dropdown.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      .account-dropdown-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
      }
      .account-avatar {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #236773 0%, #2d7f8d 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .account-avatar svg {
        width: 24px;
        height: 24px;
        stroke: #fff;
      }
      .account-info { flex: 1; min-width: 0; }
      .account-name {
        font-size: 14px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .account-role { font-size: 12px; color: #6b7280; }
      .account-dropdown-divider { height: 1px; background: #e5e7eb; }
      .account-dropdown-item {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 12px 16px;
        border: none;
        background: none;
        color: #374151;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .account-dropdown-item:hover {
        background: #f9fafb;
        color: #236773;
      }
      .account-dropdown-item svg {
        width: 18px;
        height: 18px;
        stroke: currentColor;
        flex-shrink: 0;
      }
      .account-dropdown-item:last-child { border-radius: 0 0 8px 8px; }
      .top-nav { position: relative; }
      .top-nav a { position: relative; }
    `;
    document.head.appendChild(style);
  }
  
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
      loginBtn.classList.remove('login-trigger');
      // Remove old listeners by cloning
      const newBtn = loginBtn.cloneNode(true);
      newBtn.id = 'login-btn';
      loginBtn.parentNode.replaceChild(newBtn, loginBtn);
      // Add account dropdown listener
      newBtn.addEventListener('click', handleAccountClick);
    } else {
      loginBtn.innerHTML = `<span>Inloggen</span>`;
      loginBtn.href = '#';
      loginBtn.classList.add('login-trigger');
      // Remove old listeners by cloning
      const newBtn = loginBtn.cloneNode(true);
      newBtn.id = 'login-btn';
      loginBtn.parentNode.replaceChild(newBtn, loginBtn);
      // Add login modal trigger
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof window.openLoginModal === 'function') {
          window.openLoginModal();
        } else {
          // Fallback: redirect to login page
          const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
          window.location.href = `${basePath}/login/`;
        }
      });
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
