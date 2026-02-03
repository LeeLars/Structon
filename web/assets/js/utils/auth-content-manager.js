/**
 * Auth Content Manager
 * Automatically transforms "offerte" terminology to "bestelling/aanvraag" for logged-in users
 * Uses DOM manipulation to update text without modifying source files
 */

// Content mapping: guest text -> logged-in text
const CONTENT_MAP = {
  // Dutch (be-nl, nl-nl)
  'Offerte Aanvragen': 'Bestelling Plaatsen',
  'Offerte aanvragen': 'Bestelling plaatsen',
  'offerte aanvragen': 'bestelling plaatsen',
  'OFFERTE AANVRAGEN': 'BESTELLING PLAATSEN',
  'Toevoegen aan offerte': 'Toevoegen aan bestelling',
  'toevoegen aan offerte': 'toevoegen aan bestelling',
  'TOEVOEGEN AAN OFFERTE': 'TOEVOEGEN AAN BESTELLING',
  'Toegevoegd aan offerte': 'Toegevoegd aan bestelling',
  'UW OFFERTE': 'UW BESTELLING',
  'Uw offerte': 'Uw bestelling',
  'uw offerte': 'uw bestelling',
  'UW OFFERTE MANDJE': 'UW BESTELLING',
  'Offerte mandje': 'Bestelling',
  'offerte mandje': 'bestelling',
  'Vraag een offerte aan': 'Plaats uw bestelling',
  'vraag een offerte aan': 'plaats uw bestelling',
  'Prijs op aanvraag': 'Bekijk prijs',
  'Login voor prijs': 'Prijs zichtbaar',
  
  // French (be-fr)
  'Demander un devis': 'Passer commande',
  'demander un devis': 'passer commande',
  'Ajouter au devis': 'Ajouter au panier',
  'VOTRE DEVIS': 'VOTRE COMMANDE',
  'Votre devis': 'Votre commande',
  
  // German (de-de)
  'Angebot anfordern': 'Bestellung aufgeben',
  'Zum Angebot hinzufügen': 'Zum Warenkorb hinzufügen',
  'IHR ANGEBOT': 'IHR WARENKORB',
  'Ihr Angebot': 'Ihr Warenkorb'
};

// Selectors to target for text replacement
// Note: quote-cart elements are excluded because they have their own guest-only/auth-only spans
const TARGET_SELECTORS = [
  '.cta-title',
  '.cta-text',
  '.brand-cta-banner-title',
  '.nav-link-cta',
  'button[type="submit"]',
  '.product-cta-section .btn-split-text',
  '.product-sticky-cta .btn-split-text',
  '#add-to-quote .btn-split-text',
  '#add-to-quote-sticky .btn-split-text'
];

/**
 * Check if user is logged in
 */
function isLoggedIn() {
  return document.body.classList.contains('is-logged-in');
}

/**
 * Replace text content if it matches a key in the content map
 */
function replaceText(element) {
  if (!element || !element.textContent) return;
  
  const originalText = element.textContent.trim();
  
  // Check for exact match first
  if (CONTENT_MAP[originalText]) {
    element.textContent = CONTENT_MAP[originalText];
    return;
  }
  
  // Check for partial matches (for longer text containing key phrases)
  for (const [guestText, authText] of Object.entries(CONTENT_MAP)) {
    if (originalText.includes(guestText)) {
      element.textContent = originalText.replace(guestText, authText);
      return;
    }
  }
}

/**
 * Process all targeted elements on the page
 */
function processPage() {
  if (!isLoggedIn()) return;
  
  // Process all targeted selectors
  TARGET_SELECTORS.forEach(selector => {
    document.querySelectorAll(selector).forEach(replaceText);
  });
  
  // Also process elements with specific data attributes
  document.querySelectorAll('[data-auth-text]').forEach(el => {
    el.textContent = el.dataset.authText;
  });
}

/**
 * Set up MutationObserver to handle dynamically loaded content
 */
function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    if (!isLoggedIn()) return;
    
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Process the new node and its children
          TARGET_SELECTORS.forEach(selector => {
            if (node.matches && node.matches(selector)) {
              replaceText(node);
            }
            node.querySelectorAll && node.querySelectorAll(selector).forEach(replaceText);
          });
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

/**
 * Initialize the auth content manager
 */
function init() {
  // Listen for auth state changes
  window.addEventListener('authStateChanged', (e) => {
    if (e.detail.isAuthenticated) {
      document.body.classList.add('is-logged-in');
      processPage();
    } else {
      document.body.classList.remove('is-logged-in');
      // Optionally reload page to reset text (or implement reverse mapping)
    }
  });
  
  // Process page on load if already logged in
  if (isLoggedIn()) {
    processPage();
  }
  
  // Set up observer for dynamic content
  setupObserver();
}

// Export for module usage
export { init, processPage, replaceText, CONTENT_MAP };

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
