/**
 * Structon Pricing Module
 * Handles dynamic price loading for authenticated users
 */

import { products } from './api/client.js';
import { isLoggedIn, getUser } from './auth.js';

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
    priceContainer.innerHTML = '<span class="loader-inline"><span class="loader-spinner-inline"></span> Laden...</span>';
    
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
        <div class="product-price-vat">excl. BTW</div>
      </div>
    `;
  } else {
    // Full price display for product detail page
    container.innerHTML = `
      <div class="product-price">
        ${formatPrice(data.price, data.currency)}
        <span class="product-price-vat">excl. BTW</span>
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
        <label for="quantity">Aantal:</label>
        <input type="number" id="quantity" class="quantity-input form-input" value="1" min="1" max="99">
      </div>
      <button class="btn btn-primary btn-lg btn-arrow" data-action="add-to-cart">
        <span class="guest-only-inline">Toevoegen aan Offerte</span>
        <span class="auth-only-inline">Toevoegen aan Bestelling</span>
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
    <div class="product-price">Login voor prijs</div>
    <p class="login-prompt">
      <a href="#" class="login-trigger">Log in</a> om prijzen te bekijken en te bestellen.
    </p>
  `;
}

/**
 * Render quote required message
 */
function renderQuoteRequired(container) {
  container.innerHTML = `
    <div class="product-price">
      <span class="guest-only-inline">Prijs op aanvraag</span>
      <span class="auth-only-inline">Neem contact op</span>
    </div>
    <p class="quote-prompt">
      <span class="guest-only-inline">Neem contact met ons op voor een offerte.</span>
      <span class="auth-only-inline">Neem contact met ons op voor dit product.</span>
    </p>
    <a href="/offerte-aanvragen/" class="btn btn-primary">
      <span class="guest-only-inline">Offerte Aanvragen</span>
      <span class="auth-only-inline">Contact Opnemen</span>
    </a>
  `;
}

/**
 * Render price error
 */
function renderPriceError(container) {
  container.innerHTML = `
    <div class="product-price text-muted">Prijs niet beschikbaar</div>
    <p class="error-prompt">
      Er is een fout opgetreden. Probeer het later opnieuw.
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
