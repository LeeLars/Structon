/**
 * Login Modal Component
 * Popup login form that can be triggered from any page
 */

// Create modal HTML
function createLoginModal() {
  const modal = document.createElement('div');
  modal.id = 'login-modal';
  modal.className = 'login-modal';
  modal.innerHTML = `
    <div class="login-modal-backdrop" onclick="closeLoginModal()"></div>
    <div class="login-modal-content">
      <button class="login-modal-close" onclick="closeLoginModal()" aria-label="Sluiten">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="login-modal-header">
        <div class="login-modal-logo">
          <img src="https://res.cloudinary.com/dchrgzyb4/image/upload/v1764264700/Logo-transparant_neticz.png" alt="Structon">
        </div>
        <h2 class="login-modal-title">Klant Login</h2>
        <p class="login-modal-subtitle">Log in om prijzen te bekijken en bestellingen te plaatsen.</p>
      </div>
      
      <div id="login-modal-alert" class="login-modal-alert" style="display: none;"></div>
      
      <form class="login-modal-form" id="login-modal-form">
        <div class="form-group">
          <label for="login-email" class="form-label">E-mailadres</label>
          <input 
            type="email" 
            id="login-email" 
            name="email" 
            class="form-input" 
            placeholder="uw@email.nl"
            required
            autocomplete="email"
          >
        </div>
        
        <div class="form-group">
          <label for="login-password" class="form-label">Wachtwoord</label>
          <input 
            type="password" 
            id="login-password" 
            name="password" 
            class="form-input" 
            placeholder="••••••••"
            required
            autocomplete="current-password"
          >
        </div>
        
        <button type="submit" class="btn-login" id="login-modal-submit">
          Inloggen
        </button>
      </form>
      
      <div class="login-modal-footer">
        <a href="#" id="forgot-password-modal-link">Wachtwoord vergeten?</a>
      </div>
      
      <div class="login-modal-info">
        Nog geen klant? <a href="/contact/">Neem contact op</a>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Setup form submission
  const form = document.getElementById('login-modal-form');
  form.addEventListener('submit', handleLoginSubmit);
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLoginModal();
  });
}

// Open modal
function openLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus first input
    setTimeout(() => {
      document.getElementById('login-email')?.focus();
    }, 100);
  }
}

// Close modal
function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Clear form
    document.getElementById('login-modal-form')?.reset();
    const alert = document.getElementById('login-modal-alert');
    if (alert) alert.style.display = 'none';
  }
}

// Handle form submission
async function handleLoginSubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const submitBtn = document.getElementById('login-modal-submit');
  const alertEl = document.getElementById('login-modal-alert');
  
  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Bezig...';
  
  try {
    // Determine API base URL
    const hostname = window.location.hostname;
    const apiBase = (hostname === 'localhost' || hostname === '127.0.0.1')
      ? 'http://localhost:4000/api'
      : 'https://structon-production.up.railway.app/api';
    
    const response = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Success
      alertEl.className = 'login-modal-alert success';
      alertEl.textContent = 'Succesvol ingelogd! Pagina wordt herladen...';
      alertEl.style.display = 'block';
      
      // Store token if provided
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Reload page after short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      // Error
      alertEl.className = 'login-modal-alert error';
      alertEl.textContent = data.message || 'Ongeldige inloggegevens';
      alertEl.style.display = 'block';
    }
  } catch (error) {
    console.error('Login error:', error);
    alertEl.className = 'login-modal-alert error';
    alertEl.textContent = 'Er ging iets mis. Probeer het later opnieuw.';
    alertEl.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Inloggen';
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  createLoginModal();
  
  // Attach click handler to login buttons
  document.querySelectorAll('[data-login-trigger], #login-btn, .login-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openLoginModal();
    });
  });
});

// Export functions for global use
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
