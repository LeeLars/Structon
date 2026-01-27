/**
 * Login Modal Component
 * Popup login form that can be triggered from any page
 */

// Detect current locale from URL
function detectLocale() {
  const path = window.location.pathname;
  if (path.includes('/be-nl/')) return 'be-nl';
  if (path.includes('/nl-nl/')) return 'nl-nl';
  if (path.includes('/be-fr/')) return 'be-fr';
  if (path.includes('/de-de/')) return 'de-de';
  return 'be-nl'; // default
}

// Translations for login modal
const translations = {
  'be-nl': {
    title: 'Klant Login',
    subtitle: 'Log in om prijzen te bekijken en bestellingen te plaatsen.',
    email: 'E-mailadres',
    password: 'Wachtwoord',
    loginBtn: 'Inloggen',
    loggingIn: 'Bezig...',
    forgotPassword: 'Wachtwoord vergeten?',
    noAccount: 'Nog geen klant?',
    contact: 'Neem contact op',
    showPassword: 'Wachtwoord tonen',
    hidePassword: 'Wachtwoord verbergen',
    errors: {
      fillAll: 'Vul alle velden in.',
      invalid: 'Ongeldige inloggegevens. Controleer uw e-mail en wachtwoord.',
      connection: 'Kan geen verbinding maken met de server. Probeer het later opnieuw.',
      success: 'Succesvol ingelogd! Pagina wordt herladen...'
    }
  },
  'nl-nl': {
    title: 'Klant Login',
    subtitle: 'Log in om prijzen te bekijken en bestellingen te plaatsen.',
    email: 'E-mailadres',
    password: 'Wachtwoord',
    loginBtn: 'Inloggen',
    loggingIn: 'Bezig...',
    forgotPassword: 'Wachtwoord vergeten?',
    noAccount: 'Nog geen klant?',
    contact: 'Neem contact op',
    showPassword: 'Wachtwoord tonen',
    hidePassword: 'Wachtwoord verbergen',
    errors: {
      fillAll: 'Vul alle velden in.',
      invalid: 'Ongeldige inloggegevens. Controleer uw e-mail en wachtwoord.',
      connection: 'Kan geen verbinding maken met de server. Probeer het later opnieuw.',
      success: 'Succesvol ingelogd! Pagina wordt herladen...'
    }
  },
  'be-fr': {
    title: 'Connexion Client',
    subtitle: 'Connectez-vous pour voir les prix et passer des commandes.',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    loginBtn: 'Se connecter',
    loggingIn: 'En cours...',
    forgotPassword: 'Mot de passe oublié?',
    noAccount: 'Pas encore client?',
    contact: 'Contactez-nous',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    errors: {
      fillAll: 'Veuillez remplir tous les champs.',
      invalid: 'Identifiants invalides. Vérifiez votre e-mail et mot de passe.',
      connection: 'Impossible de se connecter au serveur. Réessayez plus tard.',
      success: 'Connexion réussie! La page va se recharger...'
    }
  },
  'de-de': {
    title: 'Kunden-Login',
    subtitle: 'Melden Sie sich an, um Preise zu sehen und Bestellungen aufzugeben.',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    loginBtn: 'Anmelden',
    loggingIn: 'Wird geladen...',
    forgotPassword: 'Passwort vergessen?',
    noAccount: 'Noch kein Kunde?',
    contact: 'Kontakt aufnehmen',
    showPassword: 'Passwort anzeigen',
    hidePassword: 'Passwort verbergen',
    errors: {
      fillAll: 'Bitte füllen Sie alle Felder aus.',
      invalid: 'Ungültige Anmeldedaten. Überprüfen Sie Ihre E-Mail und Ihr Passwort.',
      connection: 'Keine Verbindung zum Server möglich. Bitte versuchen Sie es später erneut.',
      success: 'Erfolgreich angemeldet! Seite wird neu geladen...'
    }
  }
};

const currentLocale = detectLocale();
const t = translations[currentLocale];

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
        <h2 class="login-modal-title">${t.title}</h2>
        <p class="login-modal-subtitle">${t.subtitle}</p>
      </div>
      
      <div id="login-modal-alert" class="login-modal-alert" style="display: none;"></div>
      
      <form class="login-modal-form" id="login-modal-form">
        <div class="form-group">
          <label for="login-email" class="form-label">${t.email}</label>
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
          <label for="login-password" class="form-label">${t.password}</label>
          <div class="password-input-wrapper">
            <input 
              type="password" 
              id="login-password" 
              name="password" 
              class="form-input" 
              placeholder="••••••••"
              required
              autocomplete="current-password"
            >
            <button type="button" class="password-toggle" id="password-toggle" aria-label="${t.showPassword}">
              <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg class="eye-off-icon" style="display: none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <button type="submit" class="btn-login" id="login-modal-submit">
          ${t.loginBtn}
        </button>
      </form>
      
      <div class="login-modal-footer">
        <a href="#" id="forgot-password-modal-link">${t.forgotPassword}</a>
      </div>
      
      <div class="login-modal-info">
        ${t.noAccount} <a href="/contact/">${t.contact}</a>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Setup password toggle
  setupPasswordToggle();
  
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

// Setup password toggle functionality
function setupPasswordToggle() {
  const toggleBtn = document.getElementById('password-toggle');
  const passwordInput = document.getElementById('login-password');
  const eyeIcon = toggleBtn?.querySelector('.eye-icon');
  const eyeOffIcon = toggleBtn?.querySelector('.eye-off-icon');
  
  if (!toggleBtn || !passwordInput) return;
  
  toggleBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    
    if (eyeIcon && eyeOffIcon) {
      eyeIcon.style.display = isPassword ? 'none' : 'block';
      eyeOffIcon.style.display = isPassword ? 'block' : 'none';
    }
    
    toggleBtn.setAttribute('aria-label', isPassword ? t.hidePassword : t.showPassword);
  });
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
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const submitBtn = document.getElementById('login-modal-submit');
  const alertEl = document.getElementById('login-modal-alert');
  
  // Validate
  if (!email || !password) {
    alertEl.className = 'login-modal-alert error';
    alertEl.textContent = t.errors.fillAll;
    alertEl.style.display = 'block';
    return;
  }
  
  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = t.loggingIn;
  alertEl.style.display = 'none';
  
  try {
    // Determine API base URL
    const hostname = window.location.hostname;
    const apiBase = (hostname === 'localhost' || hostname === '127.0.0.1')
      ? 'http://localhost:4000/api'
      : 'https://structon-production.up.railway.app/api';
    
    console.log('🔐 Attempting login to:', apiBase);
    
    const response = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log('📦 Login response:', response.status, data);
    
    if (response.ok && data.user) {
      // Success!
      alertEl.className = 'login-modal-alert success';
      alertEl.textContent = t.errors.success;
      alertEl.style.display = 'block';
      
      // Store token and user data
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Close modal and reload after short delay
      setTimeout(() => {
        closeLoginModal();
        window.location.reload();
      }, 1000);
      
    } else {
      // Error from server
      console.error('❌ Login failed:', data);
      alertEl.className = 'login-modal-alert error';
      alertEl.textContent = data.error || data.message || t.errors.invalid;
      alertEl.style.display = 'block';
    }
    
  } catch (error) {
    console.error('❌ Login error:', error);
    alertEl.className = 'login-modal-alert error';
    alertEl.textContent = t.errors.connection;
    alertEl.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = t.loginBtn;
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
