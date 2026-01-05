/**
 * Auth Check - Protect CMS pages
 * Redirects to login if not authenticated
 */

import auth from './auth-simple.js';

// Check authentication
if (!auth.isAuthenticated()) {
  console.log('❌ Not authenticated, redirecting to login...');
  window.location.href = '/cms/';
} else {
  console.log('✅ Authenticated');
}

// Add logout handler
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Weet je zeker dat je wilt uitloggen?')) {
        auth.logout();
      }
    });
  }
});
