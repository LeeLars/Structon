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
    // First try API call
    const response = await auth.me();
    
    // Handle null response (user not logged in)
    if (!response || !response.user) {
      // Check localStorage as fallback (for when cookies don't work cross-domain)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
          console.log('✅ User loaded from localStorage:', currentUser.email);
          updateAuthUI(true);
          return currentUser;
        } catch (e) {
          console.log('Invalid stored user data');
        }
      }
      
      currentUser = null;
      updateAuthUI(false);
      return null;
    }
    
    currentUser = response.user;
    
    // Store token and user if provided
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    console.log('✅ User authenticated via API:', currentUser.email);
    updateAuthUI(true);
    return currentUser;
  } catch (error) {
    console.log('Auth check API failed, checking localStorage...');
    
    // Check localStorage as fallback
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        currentUser = JSON.parse(storedUser);
        console.log('✅ User loaded from localStorage:', currentUser.email);
        updateAuthUI(true);
        return currentUser;
      } catch (e) {
        console.log('Invalid stored user data');
      }
    }
    
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
  localStorage.removeItem('refresh_token');
  
  // Clear session storage as well
  sessionStorage.clear();
  
  // Update UI
  updateAuthUI(false);
  
  // Determine base path and locale
  const path = window.location.pathname;
  let basePath = '/';
  let locale = 'be-nl';
  
  if (path.includes('/Structon/')) {
    basePath = '/Structon/';
  }
  
  // Detect current locale
  const locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de'];
  for (const loc of locales) {
    if (path.includes('/' + loc + '/')) {
      locale = loc;
      break;
    }
  }
  
  // Redirect to login page
  window.location.href = basePath + locale + '/login/';
}

/**
 * Handle account menu hover
 */
function handleAccountHover() {
  // Check if dropdown already exists
  let dropdown = document.getElementById('account-dropdown');
  
  if (!dropdown) {
    // Create dropdown
    createAccountDropdown();
  } else {
    // Show dropdown
    dropdown.classList.add('active');
  }
}

/**
 * Handle account menu leave
 */
function handleAccountLeave() {
  const dropdown = document.getElementById('account-dropdown');
  if (dropdown) {
    // Hide dropdown after small delay
    setTimeout(() => {
      if (!dropdown.matches(':hover')) {
        dropdown.classList.remove('active');
      }
    }, 100);
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
      .account-dropdown .account-dropdown-item,
      .account-dropdown .account-dropdown-item:visited {
        color: #374151;
      }
      .account-dropdown .account-dropdown-item span { color: currentColor; }
      .account-dropdown-item:hover {
        background: #f9fafb;
        color: #236773;
      }
      .account-dropdown-item:focus-visible {
        outline: 2px solid rgba(35, 103, 115, 0.45);
        outline-offset: 2px;
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
  const isAdmin = currentUser?.role === 'admin';
  
  // Different dropdown content for admin vs customer
  const adminDropdownContent = `
    <div class="account-dropdown-header">
      <div class="account-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="account-info">
        <div class="account-name">${currentUser?.email || 'Admin'}</div>
        <div class="account-role">Administrator</div>
      </div>
    </div>
    <div class="account-dropdown-divider"></div>
    <a href="https://structon-production.up.railway.app/cms/" class="account-dropdown-item" target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
      <span>CMS Dashboard</span>
    </a>
    <a href="https://structon-production.up.railway.app/cms/products" class="account-dropdown-item" target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      </svg>
      <span>Producten Beheren</span>
    </a>
    <a href="https://structon-production.up.railway.app/cms/quotes" class="account-dropdown-item" target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
      <span>Offertes Beheren</span>
    </a>
    <div class="account-dropdown-divider"></div>
    <button class="account-dropdown-item" id="logout-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      <span>Uitloggen</span>
    </button>
  `;
  
  const customerDropdownContent = `
    <div class="account-dropdown-header">
      <div class="account-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="account-info">
        <div class="account-name">${currentUser?.email || 'Klant'}</div>
        <div class="account-role">Klant</div>
      </div>
    </div>
    <div class="account-dropdown-divider"></div>
    <a href="${basePath}/account/#dashboard" class="account-dropdown-item">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
      <span>Dashboard</span>
    </a>
    <a href="${basePath}/account/#bestellingen" class="account-dropdown-item">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      <span>Bestellingen</span>
    </a>
    <a href="${basePath}/account/#offertes" class="account-dropdown-item">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
      </svg>
      <span>Offertes</span>
    </a>
    <a href="${basePath}/account/#favorieten" class="account-dropdown-item">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span>Favorieten</span>
    </a>
    <div class="account-dropdown-divider"></div>
    <a href="${basePath}/account/#profiel" class="account-dropdown-item">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span>Profiel</span>
    </a>
    <div class="account-dropdown-divider"></div>
    <button class="account-dropdown-item" id="logout-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      <span>Uitloggen</span>
    </button>
  `;
  
  const dropdown = document.createElement('div');
  dropdown.id = 'account-dropdown';
  dropdown.className = 'account-dropdown active';
  dropdown.innerHTML = isAdmin ? adminDropdownContent : customerDropdownContent;
  
  // Insert after login button
  loginBtn.parentNode.insertBefore(dropdown, loginBtn.nextSibling);
  
  // Add logout handler
  const logoutBtn = dropdown.querySelector('#logout-btn');
  logoutBtn.addEventListener('click', logout);
  
  // Add hover handlers to keep dropdown open
  dropdown.addEventListener('mouseenter', () => {
    dropdown.classList.add('active');
  });
  
  dropdown.addEventListener('mouseleave', () => {
    dropdown.classList.remove('active');
  });
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
      // Add account dropdown hover listeners
      newBtn.addEventListener('mouseenter', handleAccountHover);
      newBtn.addEventListener('mouseleave', handleAccountLeave);
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Admin goes to CMS, customer goes to /account
        if (currentUser?.role === 'admin') {
          window.location.href = 'https://structon-production.up.railway.app/cms/';
        } else {
          const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
          window.location.href = `${basePath}/account/`;
        }
      });
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
