/**
 * Structon - Main JavaScript
 * Global functionality for all pages
 */

import { initAuth } from './auth.js';

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAuth();
  initCmsLink();
});

/**
 * CMS Admin Link - Auto-detect URL
 */
function initCmsLink() {
  const cmsLinks = document.querySelectorAll('.cms-admin-icon');
  const hostname = window.location.hostname;
  
  // Determine CMS URL based on environment
  const cmsUrl = (hostname === 'localhost' || hostname === '127.0.0.1')
    ? 'http://localhost:4000/cms/'
    : 'https://structon-cms.up.railway.app/cms/';
  
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

export function createProductCard(product, isLoggedIn = false) {
  // Use product image, or random stock photo based on product id
  const stockIndex = product.id ? product.id.charCodeAt(0) % STOCK_PHOTOS.length : 0;
  const imageUrl = product.cloudinary_images?.[0]?.url 
    || STOCK_PHOTOS[stockIndex];
  
  const productUrl = window.location.pathname.includes('/pages/')
    ? `product.html?id=${product.slug || product.id}`
    : `pages/product.html?id=${product.slug || product.id}`;

  // Specs formatting (e.g. 34 kg | 42 liter)
  const specs = [];
  if (product.weight) specs.push(`${product.weight} kg`);
  if (product.volume) specs.push(`${product.volume} liter`);
  if (product.width) specs.push(`${product.width}mm`); // of 1 meter als tekst
  // Attachment type (CW00) vaak in titel, maar kan ook hier

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
      <button class="btn-outline btn-full add-to-cart" data-id="${product.id}">
        In winkelwagen
      </button>
    `;
  } else {
    // Niet ingelogd: Offerte aanvragen knop, geen prijs
    footerHtml = `
      <a href="/contact/?product=${product.slug || product.id}" class="btn-outline btn-full">
        Offerte aanvragen
      </a>
    `;
  }

  return `
    <article class="product-card clean-card" data-product-id="${product.id}">
      <a href="${productUrl}" class="product-card-image">
        <img src="${imageUrl}" alt="${product.title}" loading="lazy">
      </a>
      <div class="product-card-divider"></div>
      <div class="product-card-content">
        <h3 class="product-card-title">
          <a href="${productUrl}">${product.title}</a>
        </h3>
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
