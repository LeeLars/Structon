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
    priceContainer.innerHTML = '<span class="loading-price">Laden...</span>';
    
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
  container.innerHTML = `
    <div class="product-price">
      ${formatPrice(data.price, data.currency)}
      <span class="product-price-vat">excl. BTW</span>
    </div>
    ${renderStockStatus(data)}
    ${renderAddToCart(data)}
  `;
}

/**
 * Render stock status
 */
function renderStockStatus(data) {
  if (data.stock_quantity === undefined) return '';
  
  const inStock = data.in_stock;
  const statusClass = inStock ? 'in-stock' : 'out-of-stock';
  const statusText = inStock ? `Op voorraad (${data.stock_quantity})` : 'Niet op voorraad';
  
  return `<div class="product-stock ${statusClass}">${statusText}</div>`;
}

/**
 * Render add to cart button
 */
function renderAddToCart(data) {
  if (!data.in_stock) {
    return `<button class="btn btn-secondary" disabled>Niet beschikbaar</button>`;
  }
  
  return `
    <div class="product-actions">
      <div class="quantity-selector">
        <label for="quantity">Aantal:</label>
        <input type="number" id="quantity" class="quantity-input form-input" value="1" min="1" max="${data.stock_quantity}">
      </div>
      <button class="btn btn-primary btn-lg btn-arrow" data-action="add-to-cart">
        Toevoegen aan Offerte
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
      <a href="/login/">Log in</a> om prijzen te bekijken en te bestellen.
    </p>
  `;
}

/**
 * Render quote required message
 */
function renderQuoteRequired(container) {
  container.innerHTML = `
    <div class="product-price">Prijs op aanvraag</div>
    <p class="quote-prompt">
      Neem contact met ons op voor een offerte.
    </p>
    <a href="contact.html" class="btn btn-primary">Offerte Aanvragen</a>
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
