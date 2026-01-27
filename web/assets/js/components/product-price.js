/**
 * Product Price Display
 * Shows prices only to authenticated users
 * Fetches price from secure API endpoint
 */

(function() {
  'use strict';

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:4000/api'
    : 'https://structon-production.up.railway.app/api';

  /**
   * Check if user is authenticated
   * @returns {string|null} Auth token or null
   */
  function getAuthToken() {
    return localStorage.getItem('structon_auth_token') || localStorage.getItem('auth_token');
  }

  /**
   * Format price for display
   * @param {number} price - Price in EUR
   * @param {string} currency - Currency code
   * @returns {string} Formatted price
   */
  function formatPrice(price, currency = 'EUR') {
    return new Intl.NumberFormat('nl-BE', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  /**
   * Fetch product price from API
   * @param {string} productId - Product UUID
   * @param {string} token - Auth token
   * @returns {Promise<object|null>} Price data or null
   */
  async function fetchProductPrice(productId, token) {
    try {
      const response = await fetch(`${API_BASE}/products/${productId}/price`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          return null;
        }
        throw new Error('Failed to fetch price');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching product price:', error);
      return null;
    }
  }

  /**
   * Initialize price display on product page
   */
  async function initProductPrice() {
    const priceContainer = document.getElementById('product-price-container');
    if (!priceContainer) return;

    const token = getAuthToken();
    if (!token) {
      // User not logged in - keep price hidden
      return;
    }

    const productId = priceContainer.dataset.productId;
    if (!productId) return;

    // Show container while loading
    priceContainer.style.display = 'block';

    const priceData = await fetchProductPrice(productId, token);

    const priceElement = document.getElementById('product-price');
    if (!priceElement) return;

    if (priceData && priceData.price !== null) {
      priceElement.innerHTML = `
        <span class="price-amount">${formatPrice(priceData.price, priceData.currency || 'EUR')}</span>
        <span class="price-vat">excl. BTW</span>
      `;
    } else {
      // Price not available for this product
      priceElement.innerHTML = `
        <span class="price-unavailable">Prijs op aanvraag</span>
      `;
    }
  }

  /**
   * Initialize price display on product cards/lists
   */
  async function initProductCardPrices() {
    const token = getAuthToken();
    if (!token) return;

    // Find all product cards with price placeholders
    const priceElements = document.querySelectorAll('[data-product-price-id]');
    if (priceElements.length === 0) return;

    // Fetch prices for all products
    for (const el of priceElements) {
      const productId = el.dataset.productPriceId;
      if (!productId) continue;

      const priceData = await fetchProductPrice(productId, token);

      if (priceData && priceData.price !== null) {
        el.innerHTML = `<span class="card-price">${formatPrice(priceData.price, priceData.currency || 'EUR')}</span>`;
        el.style.display = 'block';
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initProductPrice();
      initProductCardPrices();
    });
  } else {
    initProductPrice();
    initProductCardPrices();
  }

  // Export for use in other scripts
  window.productPrice = {
    init: initProductPrice,
    initCards: initProductCardPrices,
    getAuthToken,
    formatPrice
  };
})();
