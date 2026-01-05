/**
 * Simple Login Handler
 * Uses auth-simple.js for authentication
 */

import auth from './auth-simple.js';

// Check if already logged in
if (auth.isAuthenticated()) {
  console.log('✅ Already authenticated, redirecting to products...');
  window.location.href = '/cms/products.html';
}

// Handle login form
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  const errorEl = document.getElementById('login-error');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Clear previous error
      if (errorEl) {
        errorEl.style.display = 'none';
        errorEl.textContent = '';
      }

      try {
        console.log('🔐 Attempting login...');
        const result = await auth.login(email, password);
        
        console.log('✅ Login successful:', result.user.email);
        
        // Redirect to products page
        window.location.href = '/cms/products.html';
      } catch (error) {
        console.error('❌ Login failed:', error);
        
        if (errorEl) {
          errorEl.textContent = error.message;
          errorEl.style.display = 'block';
        }
      }
    });
  }
});
