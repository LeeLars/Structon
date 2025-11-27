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
    // Continue with logout even if API fails
  }
  currentUser = null;
  updateAuthUI(false);
  
  // Redirect to home
  window.location.href = '/';
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
      loginBtn.addEventListener('click', handleAccountClick);
    } else {
      loginBtn.innerHTML = `<span>Inloggen</span>`;
      loginBtn.href = 'pages/login.html';
      // Check if we're in pages folder
      if (window.location.pathname.includes('/pages/')) {
        loginBtn.href = 'login.html';
      }
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
