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
  
  // Use absolute path with dynamic base for GitHub Pages compatibility
  const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
  const productUrl = `${basePath}/producten/?id=${product.slug || product.id}`;

  // Build specs list (Grid Layout with Icons)
  const specsHtml = `
    <div class="key-specs-grid">
      ${product.weight ? `
        <div class="key-spec-item">
          <span class="spec-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"></path><path d="M5 8h14"></path><path d="M2 18h20"></path></svg>
          </span>
          <span class="spec-label">Gewicht</span>
          <span class="spec-value">${product.weight} kg</span>
        </div>` : ''}
      
      ${product.volume ? `
        <div class="key-spec-item">
          <span class="spec-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </span>
          <span class="spec-label">Inhoud</span>
          <span class="spec-value">${product.volume} L</span>
        </div>` : ''}
      
      ${product.width ? `
        <div class="key-spec-item">
          <span class="spec-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20"></path><path d="M5 9v6"></path><path d="M19 9v6"></path></svg>
          </span>
          <span class="spec-label">Breedte</span>
          <span class="spec-value">${product.width} mm</span>
        </div>` : ''}

      ${product.excavator_weight_min && product.excavator_weight_max ? `
        <div class="key-spec-item">
          <span class="spec-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </span>
          <span class="spec-label">Klasse</span>
          <span class="spec-value">${parseFloat(product.excavator_weight_min).toFixed(1).replace('.',',')}-${parseFloat(product.excavator_weight_max).toFixed(1).replace('.',',')}t</span>
        </div>` : ''}
      
      ${product.attachment_type ? `
        <div class="key-spec-item">
          <span class="spec-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          </span>
          <span class="spec-label">Ophanging</span>
          <span class="spec-value">${product.attachment_type}</span>
        </div>` : ''}
    </div>
  `;

  // Price display
  const priceHtml = isLoggedIn 
    ? `<div class="product-price-display">
         <div class="product-price-amount">€${formatPrice(product.price_excl_vat)},-</div>
       </div>`
    : `<div class="product-price-display">
         <!-- Price hidden for non-logged in users, or show 'Prijs op aanvraag' if desired -->
       </div>`;

  // Buttons - Structon Style (Alleen 'Meer info')
  // Common More Info button (Structon Standard)
  const moreInfoBtn = `
    <a href="${productUrl}" class="btn-split btn-split-sm" style="text-decoration: none;">
      <span class="btn-split-text">Meer info</span>
      <span class="btn-split-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </span>
    </a>
  `;

  // Als ingelogd: In winkelmandje + Meer info
  // Als niet ingelogd: ALLEEN Meer info (zoals gevraagd)
  let buttonsHtml;
  if (isLoggedIn) {
    buttonsHtml = `
      <div class="product-buttons" style="margin-top: 16px;">
        <button class="btn btn-primary" onclick="addToCart('${product.id}', '${escapeHtml(product.title)}')" style="width: 100%; justify-content: center;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="margin-right: 8px;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          In winkelmandje
        </button>
        ${moreInfoBtn}
      </div>
    `;
  } else {
    buttonsHtml = `
      <div class="product-buttons" style="margin-top: 16px;">
        ${moreInfoBtn}
      </div>
    `;
  }

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
 * Create Industry Product Card (Grid Layout)
 * Uses new universal .product-card design
 */
export function createIndustryProductCard(product, isLoggedIn = false) {
  const stockIndex = product.id ? product.id.charCodeAt(0) % STOCK_PHOTOS.length : 0;
  const imageUrl = product.cloudinary_images?.[0]?.url || STOCK_PHOTOS[stockIndex];
  
  // Use absolute path with dynamic base for GitHub Pages compatibility
  const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
  const productUrl = `${basePath}/producten/?id=${product.slug || product.id}`;

  // Build quote URL with pre-filled data
  const quoteParams = new URLSearchParams();
  quoteParams.set('product_id', product.id);
  quoteParams.set('product_name', product.title);
  if (product.category_slug) quoteParams.set('category', product.category_slug);
  
  const quoteUrl = `${basePath}/offerte-aanvragen/?${quoteParams.toString()}`;

  return `
    <article class="product-card" data-product-id="${product.id}">
      <a href="${productUrl}" class="product-card-image-wrapper">
        <img src="${imageUrl}" alt="${escapeHtml(product.title)}" loading="lazy">
      </a>
      
      <div class="product-card-divider"></div>
      
      <div class="product-card-content">
        <span class="product-card-category">${product.category_title || 'Product'}</span>
        
        <h3 class="product-card-title">
          <a href="${productUrl}">${escapeHtml(product.title)}</a>
        </h3>
        
        <p class="product-card-description">
          ${product.description ? escapeHtml(product.description.substring(0, 100)) : 'Hoogwaardig aanbouwdeel voor uw machine. Robuust en betrouwbaar.'}
        </p>
        
        <div class="product-card-actions">
          <a href="${quoteUrl}" class="btn-split btn-split-sm">
            <span class="btn-split-text">Offerte</span>
            <span class="btn-split-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
          </a>
          <a href="${productUrl}" class="btn-split btn-split-sm card-btn-secondary">
            <span class="btn-split-text">Info</span>
            <span class="btn-split-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </span>
          </a>
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
export function escapeHtml(text) {
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
  
  // Use absolute path with dynamic base for GitHub Pages compatibility
  const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
  const productUrl = `${basePath}/producten/?id=${product.slug || product.id}`;

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
      <a href="${productUrl}" class="btn-split btn-split-sm" style="width: 100%;">
        <span class="btn-split-text" style="flex: 1; justify-content: center;">In winkelwagen</span>
        <span class="btn-split-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></path></svg>
        </span>
      </a>
    `;
  } else {
    // Niet ingelogd: Prijs op aanvraag, offerte aanvragen button
    footerHtml = `
      <span class="product-price-label" style="display: block; margin-bottom: 8px;">Prijs op aanvraag</span>
      <a href="${window.location.pathname.includes('/Structon/') ? '/Structon' : ''}/offerte-aanvragen/?product=${product.slug || product.id}" class="btn-split btn-split-sm" style="width: 100%;">
        <span class="btn-split-text" style="flex: 1; justify-content: center;">Offerte Aanvragen</span>
        <span class="btn-split-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </span>
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
