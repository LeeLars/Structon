/**
 * Login Modal Component
 * Popup login form that can be triggered from any page
 * Includes forgot password flow with email verification
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

// Get base path for links
function getLocalePath() {
  const path = window.location.pathname;
  let basePath = '';
  
  if (path.includes('/Structon/')) {
    basePath = '/Structon/';
  } else {
    basePath = '/';
  }
  
  const locale = detectLocale();
  return basePath + locale + '/';
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
    backToLogin: 'Terug naar inloggen',
    resetPassword: 'Wachtwoord resetten',
    resetTitle: 'Wachtwoord Vergeten',
    resetSubtitle: 'Voer uw e-mailadres in en we sturen u een link om uw wachtwoord te resetten.',
    sendResetLink: 'Verstuur reset link',
    sending: 'Versturen...',
    newPassword: 'Nieuw wachtwoord',
    confirmPassword: 'Bevestig wachtwoord',
    setNewPassword: 'Nieuw wachtwoord instellen',
    saving: 'Opslaan...',
    errors: {
      fillAll: 'Vul alle velden in.',
      invalid: 'Ongeldige inloggegevens. Controleer uw e-mail en wachtwoord.',
      connection: 'Kan geen verbinding maken met de server. Probeer het later opnieuw.',
      success: 'Succesvol ingelogd! Pagina wordt herladen...',
      emailNotFound: 'Dit e-mailadres is niet gevonden in ons systeem.',
      resetSent: 'Een e-mail met reset instructies is verzonden naar uw e-mailadres. Dit kan 2-3 minuten duren.',
      resendEmail: 'Nieuwe mail aanvragen',
      invalidEmail: 'Voer een geldig e-mailadres in.',
      passwordMismatch: 'Wachtwoorden komen niet overeen.',
      passwordTooShort: 'Wachtwoord moet minimaal 8 tekens bevatten.',
      resetSuccess: 'Uw wachtwoord is succesvol gewijzigd. U kunt nu inloggen.',
      resetFailed: 'Kon wachtwoord niet resetten. Probeer het opnieuw of neem contact op.',
      invalidToken: 'Deze reset link is ongeldig of verlopen. Vraag een nieuwe aan.'
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
    backToLogin: 'Terug naar inloggen',
    resetPassword: 'Wachtwoord resetten',
    resetTitle: 'Wachtwoord Vergeten',
    resetSubtitle: 'Voer uw e-mailadres in en we sturen u een link om uw wachtwoord te resetten.',
    sendResetLink: 'Verstuur reset link',
    sending: 'Versturen...',
    newPassword: 'Nieuw wachtwoord',
    confirmPassword: 'Bevestig wachtwoord',
    setNewPassword: 'Nieuw wachtwoord instellen',
    saving: 'Opslaan...',
    errors: {
      fillAll: 'Vul alle velden in.',
      invalid: 'Ongeldige inloggegevens. Controleer uw e-mail en wachtwoord.',
      connection: 'Kan geen verbinding maken met de server. Probeer het later opnieuw.',
      success: 'Succesvol ingelogd! Pagina wordt herladen...',
      emailNotFound: 'Dit e-mailadres is niet gevonden in ons systeem.',
      resetSent: 'Een e-mail met reset instructies is verzonden naar uw e-mailadres. Dit kan 2-3 minuten duren.',
      resendEmail: 'Nieuwe mail aanvragen',
      invalidEmail: 'Voer een geldig e-mailadres in.',
      passwordMismatch: 'Wachtwoorden komen niet overeen.',
      passwordTooShort: 'Wachtwoord moet minimaal 8 tekens bevatten.',
      resetSuccess: 'Uw wachtwoord is succesvol gewijzigd. U kunt nu inloggen.',
      resetFailed: 'Kon wachtwoord niet resetten. Probeer het opnieuw of neem contact op.',
      invalidToken: 'Deze reset link is ongeldig of verlopen. Vraag een nieuwe aan.'
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
    backToLogin: 'Retour à la connexion',
    resetPassword: 'Réinitialiser le mot de passe',
    resetTitle: 'Mot de Passe Oublié',
    resetSubtitle: 'Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.',
    sendResetLink: 'Envoyer le lien',
    sending: 'Envoi...',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    setNewPassword: 'Définir le nouveau mot de passe',
    saving: 'Enregistrement...',
    errors: {
      fillAll: 'Veuillez remplir tous les champs.',
      invalid: 'Identifiants invalides. Vérifiez votre e-mail et mot de passe.',
      connection: 'Impossible de se connecter au serveur. Réessayez plus tard.',
      success: 'Connexion réussie! La page va se recharger...',
      emailNotFound: 'Cette adresse e-mail n\'a pas été trouvée dans notre système.',
      resetSent: 'Un e-mail avec les instructions de réinitialisation a été envoyé. Cela peut prendre 2-3 minutes.',
      resendEmail: 'Demander un nouvel e-mail',
      invalidEmail: 'Veuillez entrer une adresse e-mail valide.',
      passwordMismatch: 'Les mots de passe ne correspondent pas.',
      passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères.',
      resetSuccess: 'Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.',
      resetFailed: 'Impossible de réinitialiser le mot de passe. Réessayez ou contactez-nous.',
      invalidToken: 'Ce lien de réinitialisation est invalide ou expiré. Demandez-en un nouveau.'
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
    backToLogin: 'Zurück zur Anmeldung',
    resetPassword: 'Passwort zurücksetzen',
    resetTitle: 'Passwort Vergessen',
    resetSubtitle: 'Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.',
    sendResetLink: 'Reset-Link senden',
    sending: 'Wird gesendet...',
    newPassword: 'Neues Passwort',
    confirmPassword: 'Passwort bestätigen',
    setNewPassword: 'Neues Passwort festlegen',
    saving: 'Speichern...',
    errors: {
      fillAll: 'Bitte füllen Sie alle Felder aus.',
      invalid: 'Ungültige Anmeldedaten. Überprüfen Sie Ihre E-Mail und Ihr Passwort.',
      connection: 'Keine Verbindung zum Server möglich. Bitte versuchen Sie es später erneut.',
      success: 'Erfolgreich angemeldet! Seite wird neu geladen...',
      emailNotFound: 'Diese E-Mail-Adresse wurde in unserem System nicht gefunden.',
      resetSent: 'Eine E-Mail mit Anweisungen zum Zurücksetzen wurde gesendet. Dies kann 2-3 Minuten dauern.',
      resendEmail: 'Neue E-Mail anfordern',
      invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      passwordMismatch: 'Die Passwörter stimmen nicht überein.',
      passwordTooShort: 'Das Passwort muss mindestens 8 Zeichen enthalten.',
      resetSuccess: 'Ihr Passwort wurde erfolgreich geändert. Sie können sich jetzt anmelden.',
      resetFailed: 'Passwort konnte nicht zurückgesetzt werden. Versuchen Sie es erneut oder kontaktieren Sie uns.',
      invalidToken: 'Dieser Reset-Link ist ungültig oder abgelaufen. Fordern Sie einen neuen an.'
    }
  }
};

const currentLocale = detectLocale();
const t = translations[currentLocale];

// Current view state: 'login', 'forgot', 'reset'
let currentView = 'login';

// Get API base URL
function getApiBase() {
  const hostname = window.location.hostname;
  return (hostname === 'localhost' || hostname === '127.0.0.1')
    ? 'http://localhost:4000/api'
    : 'https://structon-production.up.railway.app/api';
}

// Create modal HTML
function createLoginModal() {
  const contactPath = getLocalePath() + 'contact/';
  
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
      
      <!-- LOGIN VIEW -->
      <div id="login-view" class="modal-view active">
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
                placeholder="********"
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
          <a href="#" id="forgot-password-link">${t.forgotPassword}</a>
        </div>
        
        <div class="login-modal-info">
          ${t.noAccount} <a href="${contactPath}">${t.contact}</a>
        </div>
      </div>
      
      <!-- FORGOT PASSWORD VIEW -->
      <div id="forgot-view" class="modal-view">
        <div class="login-modal-header">
          <div class="login-modal-logo">
            <img src="https://res.cloudinary.com/dchrgzyb4/image/upload/v1764264700/Logo-transparant_neticz.png" alt="Structon">
          </div>
          <h2 class="login-modal-title">${t.resetTitle}</h2>
          <p class="login-modal-subtitle">${t.resetSubtitle}</p>
        </div>
        
        <div id="forgot-modal-alert" class="login-modal-alert" style="display: none;"></div>
        
        <form class="login-modal-form" id="forgot-password-form">
          <div class="form-group">
            <label for="forgot-email" class="form-label">${t.email}</label>
            <input 
              type="email" 
              id="forgot-email" 
              name="email" 
              class="form-input" 
              placeholder="uw@email.nl"
              required
              autocomplete="email"
            >
          </div>
          
          <button type="submit" class="btn-login" id="forgot-submit">
            ${t.sendResetLink}
          </button>
        </form>
        
        <div class="login-modal-footer">
          <a href="#" id="back-to-login-link">${t.backToLogin}</a>
        </div>
      </div>
      
      <!-- RESET PASSWORD VIEW (shown after clicking email link) -->
      <div id="reset-view" class="modal-view">
        <div class="login-modal-header">
          <div class="login-modal-logo">
            <img src="https://res.cloudinary.com/dchrgzyb4/image/upload/v1764264700/Logo-transparant_neticz.png" alt="Structon">
          </div>
          <h2 class="login-modal-title">${t.resetPassword}</h2>
          <p class="login-modal-subtitle">${t.resetSubtitle}</p>
        </div>
        
        <div id="reset-modal-alert" class="login-modal-alert" style="display: none;"></div>
        
        <form class="login-modal-form" id="reset-password-form">
          <div class="form-group">
            <label for="reset-password" class="form-label">${t.newPassword}</label>
            <div class="password-input-wrapper">
              <input 
                type="password" 
                id="reset-password" 
                name="password" 
                class="form-input" 
                placeholder="********"
                required
                minlength="8"
              >
              <button type="button" class="password-toggle" id="reset-password-toggle" aria-label="${t.showPassword}">
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
          
          <div class="form-group">
            <label for="reset-password-confirm" class="form-label">${t.confirmPassword}</label>
            <div class="password-input-wrapper">
              <input 
                type="password" 
                id="reset-password-confirm" 
                name="password_confirm" 
                class="form-input" 
                placeholder="********"
                required
                minlength="8"
              >
            </div>
          </div>
          
          <input type="hidden" id="reset-token" name="token" value="">
          
          <button type="submit" class="btn-login" id="reset-submit">
            ${t.setNewPassword}
          </button>
        </form>
        
        <div class="login-modal-footer">
          <a href="#" id="reset-back-to-login-link">${t.backToLogin}</a>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Setup password toggles
  setupPasswordToggle();
  setupResetPasswordToggle();
  
  // Setup form submissions
  document.getElementById('login-modal-form').addEventListener('submit', handleLoginSubmit);
  document.getElementById('forgot-password-form').addEventListener('submit', handleForgotSubmit);
  document.getElementById('reset-password-form').addEventListener('submit', handleResetSubmit);
  
  // Setup view switching
  document.getElementById('forgot-password-link').addEventListener('click', (e) => {
    e.preventDefault();
    showView('forgot');
  });
  
  document.getElementById('back-to-login-link').addEventListener('click', (e) => {
    e.preventDefault();
    showView('login');
  });
  
  document.getElementById('reset-back-to-login-link').addEventListener('click', (e) => {
    e.preventDefault();
    showView('login');
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLoginModal();
  });
  
  // Check for reset token in URL
  checkForResetToken();
}

// Show specific view
function showView(view) {
  currentView = view;
  
  // Hide all views
  document.querySelectorAll('.modal-view').forEach(v => v.classList.remove('active'));
  
  // Show requested view
  const viewEl = document.getElementById(view + '-view');
  if (viewEl) {
    viewEl.classList.add('active');
  }
  
  // Clear alerts
  document.querySelectorAll('.login-modal-alert').forEach(a => a.style.display = 'none');
  
  // Focus first input
  setTimeout(() => {
    if (view === 'login') {
      document.getElementById('login-email')?.focus();
    } else if (view === 'forgot') {
      document.getElementById('forgot-email')?.focus();
    } else if (view === 'reset') {
      document.getElementById('reset-password')?.focus();
    }
  }, 100);
}

// Check URL for reset token or login trigger
function checkForResetToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get('reset_token');
  const loginTrigger = urlParams.get('login');
  
  if (resetToken) {
    // Store token and show reset view
    document.getElementById('reset-token').value = resetToken;
    openLoginModal();
    showView('reset');
    
    // Clean URL
    const url = new URL(window.location);
    url.searchParams.delete('reset_token');
    window.history.replaceState({}, '', url);
  } else if (loginTrigger === 'true') {
    // Open login modal when login=true parameter is present
    openLoginModal();
    
    // Clean URL
    const url = new URL(window.location);
    url.searchParams.delete('login');
    window.history.replaceState({}, '', url);
  }
}

// Open modal
function openLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Show login view by default
    showView('login');
  }
}

// Setup password toggle functionality for login form
function setupPasswordToggle() {
  const toggleBtn = document.getElementById('password-toggle');
  const passwordInput = document.getElementById('login-password');
  
  if (!toggleBtn || !passwordInput) return;
  
  toggleBtn.addEventListener('click', () => {
    const eyeIcon = toggleBtn.querySelector('.eye-icon');
    const eyeOffIcon = toggleBtn.querySelector('.eye-off-icon');
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    
    if (eyeIcon && eyeOffIcon) {
      eyeIcon.style.display = isPassword ? 'none' : 'block';
      eyeOffIcon.style.display = isPassword ? 'block' : 'none';
    }
    
    toggleBtn.setAttribute('aria-label', isPassword ? t.hidePassword : t.showPassword);
  });
}

// Setup password toggle for reset form
function setupResetPasswordToggle() {
  const toggleBtn = document.getElementById('reset-password-toggle');
  const passwordInput = document.getElementById('reset-password');
  
  if (!toggleBtn || !passwordInput) return;
  
  toggleBtn.addEventListener('click', () => {
    const eyeIcon = toggleBtn.querySelector('.eye-icon');
    const eyeOffIcon = toggleBtn.querySelector('.eye-off-icon');
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
    // Clear all forms
    document.getElementById('login-modal-form')?.reset();
    document.getElementById('forgot-password-form')?.reset();
    document.getElementById('reset-password-form')?.reset();
    // Hide all alerts
    document.querySelectorAll('.login-modal-alert').forEach(a => a.style.display = 'none');
    // Reset to login view
    showView('login');
  }
}

// Handle login form submission
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
    const apiBase = getApiBase();
    console.log('Attempting login to:', apiBase);
    
    const response = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log('Login response:', response.status, data);
    
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
      console.error('Login failed:', data);
      alertEl.className = 'login-modal-alert error';
      alertEl.textContent = data.error || data.message || t.errors.invalid;
      alertEl.style.display = 'block';
    }
    
  } catch (error) {
    console.error('Login error:', error);
    alertEl.className = 'login-modal-alert error';
    alertEl.textContent = t.errors.connection;
    alertEl.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = t.loginBtn;
  }
}

// Handle forgot password form submission
async function handleForgotSubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('forgot-email').value.trim();
  const submitBtn = document.getElementById('forgot-submit');
  const alertEl = document.getElementById('forgot-modal-alert');
  
  // Validate email
  if (!email) {
    alertEl.className = 'login-modal-alert error';
    alertEl.textContent = t.errors.invalidEmail;
    alertEl.style.display = 'block';
    return;
  }
  
  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = t.sending;
  alertEl.style.display = 'none';
  
  try {
    const apiBase = getApiBase();
    console.log('Requesting password reset for:', email);
    
    const response = await fetch(`${apiBase}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email,
        locale: currentLocale,
        resetUrl: window.location.origin + window.location.pathname
      })
    });
    
    const data = await response.json();
    console.log('Forgot password response:', response.status, data);
    
    if (response.ok) {
      // Success - show message with resend button
      alertEl.className = 'login-modal-alert success';
      alertEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <p style="margin: 0;">${t.errors.resetSent}</p>
          <button id="resend-reset-email" class="btn-text" style="align-self: flex-start; padding: 8px 16px; background: rgba(35, 103, 115, 0.1); border-radius: 6px; color: #236773; font-weight: 600; display: none;">
            ${t.errors.resendEmail}
          </button>
        </div>
      `;
      alertEl.style.display = 'block';
      
      // Show resend button after 3 minutes
      setTimeout(() => {
        const resendBtn = document.getElementById('resend-reset-email');
        if (resendBtn) {
          resendBtn.style.display = 'inline-block';
          resendBtn.addEventListener('click', () => {
            // Re-submit the form
            handleForgotSubmit(e);
            resendBtn.style.display = 'none';
          });
        }
      }, 180000); // 3 minutes
      
      // Clear form
      document.getElementById('forgot-password-form').reset();
      
    } else if (response.status === 404) {
      // Email not found
      alertEl.className = 'login-modal-alert error';
      alertEl.textContent = t.errors.emailNotFound;
      alertEl.style.display = 'block';
    } else {
      // Other error
      alertEl.className = 'login-modal-alert error';
      alertEl.textContent = data.error || data.message || t.errors.connection;
      alertEl.style.display = 'block';
    }
    
  } catch (error) {
    console.error('Forgot password error:', error);
    alertEl.className = 'login-modal-alert error';
    alertEl.textContent = t.errors.connection;
    alertEl.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = t.sendResetLink;
  }
}

// Handle reset password form submission
async function handleResetSubmit(e) {
  e.preventDefault();
  
  const password = document.getElementById('reset-password').value;
  const passwordConfirm = document.getElementById('reset-password-confirm').value;
  const token = document.getElementById('reset-token').value;
  const submitBtn = document.getElementById('reset-submit');
  const alertEl = document.getElementById('reset-modal-alert');
  
  // Validate
  if (!password || !passwordConfirm) {
    alertEl.className = 'login-modal-alert error';
    alertEl.textContent = t.errors.fillAll;
    alertEl.style.display = 'block';
    return;
  }
  
  if (password.length < 8) {
    alertEl.className = 'login-modal-alert error';
    alertEl.textContent = t.errors.passwordTooShort;
    alertEl.style.display = 'block';
    return;
  }
  
  if (password !== passwordConfirm) {
    alertEl.className = 'login-modal-alert error';
    alertEl.textContent = t.errors.passwordMismatch;
    alertEl.style.display = 'block';
    return;
  }
  
  if (!token) {
    alertEl.className = 'login-modal-alert error';
    alertEl.textContent = t.errors.invalidToken;
    alertEl.style.display = 'block';
    return;
  }
  
  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = t.saving;
  alertEl.style.display = 'none';
  
  try {
    const apiBase = getApiBase();
    console.log('Resetting password with token');
    
    const response = await fetch(`${apiBase}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, password })
    });
    
    const data = await response.json();
    console.log('Reset password response:', response.status, data);
    
    if (response.ok) {
      // Success!
      alertEl.className = 'login-modal-alert success';
      alertEl.textContent = t.errors.resetSuccess;
      alertEl.style.display = 'block';
      
      // Clear form and switch to login after delay
      document.getElementById('reset-password-form').reset();
      
      setTimeout(() => {
        showView('login');
      }, 2000);
      
    } else if (response.status === 400 || response.status === 401) {
      // Invalid or expired token
      alertEl.className = 'login-modal-alert error';
      alertEl.textContent = t.errors.invalidToken;
      alertEl.style.display = 'block';
    } else {
      // Other error
      alertEl.className = 'login-modal-alert error';
      alertEl.textContent = data.error || data.message || t.errors.resetFailed;
      alertEl.style.display = 'block';
    }
    
  } catch (error) {
    console.error('Reset password error:', error);
    alertEl.className = 'login-modal-alert error';
    alertEl.textContent = t.errors.connection;
    alertEl.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = t.setNewPassword;
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
