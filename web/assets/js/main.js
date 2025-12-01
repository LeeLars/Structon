/**
 * Structon - Main JavaScript
 * Global functionality for all pages
 */

import { initAuth } from './auth.js';
import { initNavigation } from './navigation.js';
import { registerServiceWorker } from './sw-register.js';
import { initSitemap } from './sitemap.js';

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAuth();
  initCmsLink();
  initNavigation();
  initSitemap();
  
  // Register service worker for offline support and caching
  registerServiceWorker();
});

/**
 * CMS Admin Link - Auto-detect URL
 */
function initCmsLink() {
  const cmsLinks = document.querySelectorAll('.cms-admin-icon, .cms-lock-link');
  const hostname = window.location.hostname;
  
  // Determine CMS URL based on environment
  const cmsUrl = (hostname === 'localhost' || hostname === '127.0.0.1')
    ? 'http://localhost:4000/cms/'
    : 'https://structon-production.up.railway.app/cms/';
  
  cmsLinks.forEach(link => {
    link.href = cmsUrl;
  });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const navMobileClose = document.getElementById('nav-mobile-close');

  if (menuToggle && navMobile) {
    menuToggle.addEventListener('click', () => {
      navMobile.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (navMobileClose && navMobile) {
    navMobileClose.addEventListener('click', () => {
      navMobile.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  // Close on link click
  if (navMobile) {
    navMobile.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }
}

/**
 * Utility: Create product card HTML
 */
// Stock photos for products without images
const STOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop'
];

/**
 * Create HORIZONTAL product card (new design for product lists)
 * - Wide card with image left, specs middle, price/buttons right
 * - Price only visible when logged in
 * - "Voeg toe aan winkelmandje" when logged in
 * - "Vraag offerte aan" always visible
 */
export function createProductCardHorizontal(product, isLoggedIn = false) {
  const stockIndex = product.id ? product.id.charCodeAt(0) % STOCK_PHOTOS.length : 0;
  const imageUrl = product.cloudinary_images?.[0]?.url || STOCK_PHOTOS[stockIndex];
  
  const productUrl = window.location.pathname.includes('/pages/')
    ? `product.html?id=${product.slug || product.id}`
    : `pages/product.html?id=${product.slug || product.id}`;

  // Build specs list (Matching screenshot: Label | Value)
  const specsHtml = `
    <dl class="product-specs">
      ${product.weight ? `<dt>Gewicht</dt><dd>${product.weight} kg</dd>` : ''}
      ${product.volume ? `<dt>Inhoud</dt><dd>${product.volume} liter</dd>` : ''}
      ${product.width ? `<dt>Breedte</dt><dd>${product.width} mm</dd>` : ''}
      ${product.excavator_weight_min && product.excavator_weight_max ? 
        `<dt>Graafmachine klasse</dt><dd>${(product.excavator_weight_min/1000).toFixed(1).replace('.',',')} - ${(product.excavator_weight_max/1000).toFixed(1).replace('.',',')} ton</dd>` : ''}
      ${product.attachment_type ? `<dt>Ophanging</dt><dd>${product.attachment_type}</dd>` : ''}
    </dl>
  `;

  // Price display
  const priceHtml = isLoggedIn 
    ? `<div class="product-price-display">
         <div class="product-price-amount">€${formatPrice(product.price_excl_vat)},-</div>
       </div>`
    : `<div class="product-price-display">
         <!-- Price hidden for non-logged in users, or show 'Prijs op aanvraag' if desired -->
       </div>`;

  // Buttons - "Meer info" style from screenshot
  const buttonsHtml = `
    <div class="product-buttons">
      <a href="${productUrl}" class="btn-more-info-outline">
        Meer info
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </a>
    </div>
  `;

  // New Structure: Grid 300px | 1fr
  return `
    <article class="product-card-horizontal" data-product-id="${product.id}">
      <a href="${productUrl}" class="product-image">
        <img src="${imageUrl}" alt="${escapeHtml(product.title)}" loading="lazy">
      </a>
      
      <div class="product-info">
        <h3 class="product-title">
          <a href="${productUrl}">${escapeHtml(product.title)}</a>
        </h3>
        
        ${specsHtml}
        
        <div class="product-actions-wrapper">
          ${priceHtml}
          ${buttonsHtml}
        </div>
      </div>
    </article>
  `;
}

/**
 * Format price with Dutch formatting
 */
function formatPrice(price) {
  if (!price || price === 0) return '0,00';
  return parseFloat(price).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Add to cart function (placeholder - implement with actual cart logic)
 */
window.addToCart = function(productId, productTitle) {
  // Get current cart from localStorage
  let cart = JSON.parse(localStorage.getItem('structon_cart') || '[]');
  
  // Check if product already in cart
  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ id: productId, title: productTitle, quantity: 1 });
  }
  
  // Save cart
  localStorage.setItem('structon_cart', JSON.stringify(cart));
  
  // Show feedback
  showToast(`${productTitle} toegevoegd aan winkelmandje`);
  
  // Update cart icon if exists
  updateCartBadge();
};

/**
 * Show toast notification
 */
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Update cart badge count
 */
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('structon_cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

/**
 * Legacy: Create vertical product card (for homepage slider etc)
 */
export function createProductCard(product, isLoggedIn = false) {
  // Use product image, or random stock photo based on product id
  const stockIndex = product.id ? product.id.charCodeAt(0) % STOCK_PHOTOS.length : 0;
  const imageUrl = product.cloudinary_images?.[0]?.url 
    || STOCK_PHOTOS[stockIndex];
  
  const productUrl = window.location.pathname.includes('/pages/')
    ? `product.html?id=${product.slug || product.id}`
    : `pages/product.html?id=${product.slug || product.id}`;

  // Stock status logic
  const stock = product.stock || 0;
  let stockStatusHtml = '';
  if (stock > 5) {
    stockStatusHtml = '<span class="stock-status status-in-stock"><span class="status-dot"></span>Op voorraad</span>';
  } else if (stock > 0) {
    stockStatusHtml = '<span class="stock-status status-low-stock"><span class="status-dot"></span>Nog slechts enkele stuks</span>';
  } else {
    stockStatusHtml = '<span class="stock-status status-out-stock"><span class="status-dot"></span>Op bestelling</span>';
  }

  // Specs formatting (e.g. 34 kg | 42 liter)
  const specs = [];
  if (product.weight) specs.push(`${product.weight} kg`);
  if (product.volume) specs.push(`${product.volume} liter`);
  if (product.width) specs.push(`${product.width}mm`); // of 1 meter als tekst

  const specsHtml = specs.length > 0 
    ? `<p class="product-card-specs">${specs.join(' | ')}</p>`
    : '';

  // Footer content based on login state
  let footerHtml;
  
  if (isLoggedIn) {
    footerHtml = `
      <div class="product-price-row">
        <span class="product-price">€${product.price_excl_vat || '0.00'}</span>
        <span class="product-vat">,- excl. BTW</span>
      </div>
      <div class="product-footer-divider"></div>
      <a href="${productUrl}" class="btn-product-cta">
        In winkelwagen
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
      </a>
    `;
  } else {
    // Niet ingelogd: Prijs op aanvraag boven de lijn, offerte aanvragen button eronder
    footerHtml = `
      <span class="product-price-label">Prijs op aanvraag</span>
      <div class="product-footer-divider"></div>
      <a href="/contact/?product=${product.slug || product.id}" class="btn-product-cta">
        Offerte aanvragen
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </a>
    `;
  }

  return `
    <article class="product-card clean-card" data-product-id="${product.id}">
      <a href="${productUrl}" class="product-card-image">
        ${product.is_new ? '<span class="badge-new">Nieuw</span>' : ''}
        <img src="${imageUrl}" alt="${product.title}" loading="lazy">
      </a>
      <div class="product-card-divider"></div>
      <div class="product-card-content">
        <div class="product-header">
          <h3 class="product-card-title">
            <a href="${productUrl}">${product.title}</a>
          </h3>
          ${stockStatusHtml}
        </div>
        ${specsHtml}
        <div class="product-card-footer">
          ${footerHtml}
        </div>
      </div>
    </article>
  `;
}

/**
 * Utility: Show loading state
 */
export function showLoading(container) {
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `;
}

/**
 * Utility: Show error state
 */
export function showError(container, message = 'Er is een fout opgetreden.') {
  container.innerHTML = `
    <div class="no-results">
      <h3>Oeps!</h3>
      <p>${message}</p>
    </div>
  `;
}

/**
 * Utility: Show no results
 */
export function showNoResults(container, message = 'Geen producten gevonden.') {
  container.innerHTML = `
    <div class="no-results">
      <h3>Geen resultaten</h3>
      <p>${message}</p>
      <button class="btn btn-primary" onclick="window.location.reload()">Filters wissen</button>
    </div>
  `;
}
