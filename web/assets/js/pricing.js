/**
 * Structon Pricing Module
 * Handles dynamic price loading for authenticated users
 */

import { products } from './api/client.js';
import { isLoggedIn, getUser } from './auth.js';

function _prLocale() { const m = window.location.pathname.match(/\/(be-nl|nl-nl|be-fr|de-de)\//); return m ? m[1] : 'be-nl'; }
const _prT = {
  'be-nl': { exclVat:'excl. BTW', loading:'Laden...', quantity:'Aantal:', addToQuote:'Toevoegen aan Offerte', addToOrder:'Toevoegen aan Bestelling', loginForPrice:'Login voor prijs', logIn:'Log in', loginToView:'om prijzen te bekijken en te bestellen.', priceOnRequest:'Prijs op aanvraag', contactUs:'Neem contact op', contactForQuote:'Neem contact met ons op voor een offerte.', contactForProduct:'Neem contact met ons op voor dit product.', requestQuote:'Offerte Aanvragen', contactAction:'Contact Opnemen', priceUnavailable:'Prijs niet beschikbaar', errorRetry:'Er is een fout opgetreden. Probeer het later opnieuw.' },
  'nl-nl': { exclVat:'excl. BTW', loading:'Laden...', quantity:'Aantal:', addToQuote:'Toevoegen aan Offerte', addToOrder:'Toevoegen aan Bestelling', loginForPrice:'Login voor prijs', logIn:'Log in', loginToView:'om prijzen te bekijken en te bestellen.', priceOnRequest:'Prijs op aanvraag', contactUs:'Neem contact op', contactForQuote:'Neem contact met ons op voor een offerte.', contactForProduct:'Neem contact met ons op voor dit product.', requestQuote:'Offerte Aanvragen', contactAction:'Contact Opnemen', priceUnavailable:'Prijs niet beschikbaar', errorRetry:'Er is een fout opgetreden. Probeer het later opnieuw.' },
  'be-fr': { exclVat:'HTVA', loading:'Chargement...', quantity:'Quantit\u00e9 :', addToQuote:'Ajouter au devis', addToOrder:'Ajouter \u00e0 la commande', loginForPrice:'Connectez-vous pour le prix', logIn:'Connectez-vous', loginToView:'pour consulter les prix et commander.', priceOnRequest:'Prix sur demande', contactUs:'Contactez-nous', contactForQuote:'Contactez-nous pour un devis.', contactForProduct:'Contactez-nous pour ce produit.', requestQuote:'Demander un devis', contactAction:'Nous contacter', priceUnavailable:'Prix non disponible', errorRetry:'Une erreur s\'est produite. R\u00e9essayez plus tard.' },
  'de-de': { exclVat:'zzgl. MwSt.', loading:'Laden...', quantity:'Menge:', addToQuote:'Zum Angebot hinzuf\u00fcgen', addToOrder:'Zur Bestellung hinzuf\u00fcgen', loginForPrice:'Anmelden f\u00fcr Preis', logIn:'Anmelden', loginToView:'um Preise einzusehen und zu bestellen.', priceOnRequest:'Preis auf Anfrage', contactUs:'Kontaktieren Sie uns', contactForQuote:'Kontaktieren Sie uns f\u00fcr ein Angebot.', contactForProduct:'Kontaktieren Sie uns f\u00fcr dieses Produkt.', requestQuote:'Angebot anfordern', contactAction:'Kontakt aufnehmen', priceUnavailable:'Preis nicht verf\u00fcgbar', errorRetry:'Ein Fehler ist aufgetreten. Versuchen Sie es sp\u00e4ter erneut.' }
};
function _pr(k) { const l = _prLocale(); return (_prT[l] && _prT[l][k]) || _prT['be-nl'][k] || k; }

/**
 * Format price in EUR
 */
export function formatPrice(price, currency = 'EUR') {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currency
  }).format(price);
}

/**
 * Load price for a single product
 */
export async function loadProductPrice(productId, priceContainer) {
  if (!isLoggedIn()) {
    renderLockedPrice(priceContainer);
    return null;
  }

  try {
    priceContainer.innerHTML = '<span class="loader-inline"><span class="loader-spinner-inline"></span> ' + _pr('loading') + '</span>';
    
    const data = await products.getPrice(productId);
    
    if (data.price !== null) {
      renderPrice(priceContainer, data);
    } else {
      renderQuoteRequired(priceContainer);
    }
    
    return data;
  } catch (error) {
    console.error('Error loading price:', error);
    renderPriceError(priceContainer);
    return null;
  }
}

/**
 * Load prices for multiple products
 */
export async function loadProductPrices(productElements) {
  if (!isLoggedIn()) {
    productElements.forEach(el => {
      const priceContainer = el.querySelector('.product-price-section');
      if (priceContainer) {
        renderLockedPrice(priceContainer);
      }
    });
    return;
  }

  const promises = Array.from(productElements).map(async (el) => {
    const productId = el.dataset.productId;
    const priceContainer = el.querySelector('.product-price-section');
    
    if (productId && priceContainer) {
      return loadProductPrice(productId, priceContainer);
    }
  });

  await Promise.all(promises);
}

/**
 * Render price display
 */
function renderPrice(container, data) {
  container.classList.remove('price-locked');
  
  // Check if this is a grid card (compact view) or detail page (full view)
  const isGridCard = container.closest('.product-card-horizontal') !== null;
  
  if (isGridCard) {
    // Compact price display for product grid
    container.innerHTML = `
      <div class="product-price-compact">
        <div class="product-price-amount">${formatPrice(data.price, data.currency)}</div>
        <div class="product-price-vat">${_pr('exclVat')}</div>
      </div>
    `;
  } else {
    // Full price display for product detail page
    container.innerHTML = `
      <div class="product-price">
        ${formatPrice(data.price, data.currency)}
        <span class="product-price-vat">${_pr('exclVat')}</span>
      </div>
      ${renderAddToCart(data)}
    `;
  }
}

/**
 * Render add to cart button
 */
function renderAddToCart(data) {
  return `
    <div class="product-actions">
      <div class="quantity-selector">
        <label for="quantity">${_pr('quantity')}</label>
        <input type="number" id="quantity" class="quantity-input form-input" value="1" min="1" max="99">
      </div>
      <button class="btn btn-primary btn-lg btn-arrow" data-action="add-to-cart">
        <span class="guest-only-inline">${_pr('addToQuote')}</span>
        <span class="auth-only-inline">${_pr('addToOrder')}</span>
      </button>
    </div>
  `;
}

/**
 * Render locked price (not logged in)
 */
function renderLockedPrice(container) {
  container.classList.add('price-locked');
  
  container.innerHTML = `
    <div class="product-price">${_pr('loginForPrice')}</div>
    <p class="login-prompt">
      <a href="#" class="login-trigger">${_pr('logIn')}</a> ${_pr('loginToView')}
    </p>
  `;
}

/**
 * Render quote required message
 */
function renderQuoteRequired(container) {
  container.innerHTML = `
    <div class="product-price">
      <span class="guest-only-inline">${_pr('priceOnRequest')}</span>
      <span class="auth-only-inline">${_pr('contactUs')}</span>
    </div>
    <p class="quote-prompt">
      <span class="guest-only-inline">${_pr('contactForQuote')}</span>
      <span class="auth-only-inline">${_pr('contactForProduct')}</span>
    </p>
    <a href="/offerte-aanvragen/" class="btn btn-primary">
      <span class="guest-only-inline">${_pr('requestQuote')}</span>
      <span class="auth-only-inline">${_pr('contactAction')}</span>
    </a>
  `;
}

/**
 * Render price error
 */
function renderPriceError(container) {
  container.innerHTML = `
    <div class="product-price text-muted">${_pr('priceUnavailable')}</div>
    <p class="error-prompt">
      ${_pr('errorRetry')}
    </p>
  `;
}

/**
 * Initialize pricing on auth state change
 */
window.addEventListener('authStateChanged', (e) => {
  const { isAuthenticated } = e.detail;
  
  // Reload prices when auth state changes
  const productElements = document.querySelectorAll('[data-product-id]');
  if (productElements.length > 0) {
    loadProductPrices(productElements);
  }
});
