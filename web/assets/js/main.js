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

  // Button voor niet-ingelogde bezoekers: Offerte aanvragen (split button)
  // Button voor ingelogde bezoekers: Toevoegen aan winkelwagen
  const actionButton = isLoggedIn 
    ? `<a href="${productUrl}" class="btn-split btn-split-sm">
        <span class="btn-split-text">Bekijken</span>
        <span class="btn-split-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </span>
      </a>`
    : `<a href="/contact/?product=${product.slug || product.id}" class="btn-split btn-split-sm">
        <span class="btn-split-text">Offerte aanvragen</span>
        <span class="btn-split-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </span>
      </a>`;

  const priceSection = isLoggedIn
    ? `<span class="product-price">€${product.price_excl_vat || '0.00'}</span>`
    : `<span class="price-locked">Login voor prijs</span>`;

  return `
    <article class="product-card" data-product-id="${product.id}">
      <a href="${productUrl}" class="product-card-image">
        <img src="${imageUrl}" alt="${product.title}" loading="lazy">
      </a>
      <div class="product-card-content">
        <span class="product-card-category">${product.category_title || 'Product'}</span>
        <h3 class="product-card-title">
          <a href="${productUrl}">${product.title}</a>
        </h3>
        <p class="product-card-specs">
          ${product.volume ? `${product.volume}L` : ''} 
          ${product.width ? `• ${product.width}mm` : ''} 
          ${product.attachment_type ? `• ${product.attachment_type}` : ''}
        </p>
        <div class="product-card-footer">
          <div class="product-price-section">
            ${priceSection}
          </div>
          ${actionButton}
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
