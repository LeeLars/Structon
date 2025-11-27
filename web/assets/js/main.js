/**
 * Structon - Main JavaScript
 * Global functionality for all pages
 */

import { initAuth } from './auth.js';

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAuth();
});

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
export function createProductCard(product) {
  const imageUrl = product.cloudinary_images?.[0]?.url 
    || 'https://via.placeholder.com/400x400?text=Geen+Afbeelding';
  
  const productUrl = window.location.pathname.includes('/pages/')
    ? `product.html?id=${product.slug || product.id}`
    : `pages/product.html?id=${product.slug || product.id}`;

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
          <div class="product-price-section price-locked">
            <span class="price-locked">Login voor prijs</span>
          </div>
          <a href="${productUrl}" class="btn btn-secondary btn-sm btn-arrow">Meer info</a>
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
