/**
 * Structon - Login Page JavaScript
 */

import { auth } from '../api/client.js';

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initForgotPassword();
});

/**
 * Initialize login form
 */
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('login-submit');
    const alert = document.getElementById('login-alert');

    // Validate
    if (!email || !password) {
      showAlert(alert, 'Vul alle velden in.', 'error');
      return;
    }

    // Show loading
    setLoading(submitBtn, true);
    hideAlert(alert);

    try {
      const response = await auth.login(email, password);
      
      console.log('📦 Login response:', response);

      // Store token and user data in localStorage
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        console.log('✅ Token stored');
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('✅ User data stored:', response.user.email);
      }

      // Success
      showAlert(alert, 'Inloggen gelukt! U wordt doorgestuurd...', 'success');

      // Redirect after short delay
      setTimeout(() => {
        // Check if there's a redirect URL
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '../account/';
        window.location.href = redirect;
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      showAlert(alert, error.message || 'Inloggen mislukt. Controleer uw gegevens.', 'error');
      setLoading(submitBtn, false);
    }
  });
}

/**
 * Initialize forgot password modal
 */
function initForgotPassword() {
  const link = document.getElementById('forgot-password-link');
  const modal = document.getElementById('forgot-password-modal');
  const closeBtn = document.getElementById('modal-close');
  const backdrop = modal?.querySelector('.modal-backdrop');
  const form = document.getElementById('forgot-password-form');

  if (!link || !modal) return;

  // Open modal
  link.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });

  // Close modal
  const closeModal = () => {
    modal.style.display = 'none';
  };

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  // Handle form submit
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('forgot-email').value.trim();
    const alert = document.getElementById('forgot-alert');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!email) {
      showAlert(alert, 'Vul uw e-mailadres in.', 'error');
      return;
    }

    setLoading(submitBtn, true);

    try {
      await auth.requestPasswordReset(email);
      showAlert(alert, 'Als dit e-mailadres bij ons bekend is, ontvangt u een e-mail met instructies.', 'success');
      
      // Clear form
      document.getElementById('forgot-email').value = '';

      // Close modal after delay
      setTimeout(closeModal, 3000);

    } catch (error) {
      showAlert(alert, 'Er is een fout opgetreden. Probeer het later opnieuw.', 'error');
    } finally {
      setLoading(submitBtn, false);
    }
  });
}

/**
 * Show alert message
 */
function showAlert(element, message, type) {
  if (!element) return;
  
  element.textContent = message;
  element.className = `alert alert-${type}`;
  element.style.display = 'block';
}

/**
 * Hide alert
 */
function hideAlert(element) {
  if (!element) return;
  element.style.display = 'none';
}

/**
 * Set loading state on button
 */
function setLoading(button, isLoading) {
  if (!button) return;

  const text = button.querySelector('.btn-text');
  const loading = button.querySelector('.btn-loading');

  if (isLoading) {
    button.disabled = true;
    if (text) text.style.display = 'none';
    if (loading) loading.style.display = 'flex';
  } else {
    button.disabled = false;
    if (text) text.style.display = 'inline';
    if (loading) loading.style.display = 'none';
  }
}
