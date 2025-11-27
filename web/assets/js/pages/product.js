/**
 * Structon - Product Detail Page JavaScript
 */

import { products } from '../api/client.js';
import { createProductCard, showLoading, showError } from '../main.js';
import { loadProductPrice } from '../pricing.js';
import { isLoggedIn } from '../auth.js';

let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  initPage();
});

/**
 * Initialize page
 */
async function initPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    showProductNotFound();
    return;
  }

  await loadProduct(productId);
}

/**
 * Load product details
 */
async function loadProduct(id) {
  const container = document.getElementById('product-detail');
  if (!container) return;

  showLoading(container);

  try {
    const data = await products.getById(id);
    currentProduct = data.product;

    if (!currentProduct) {
      showProductNotFound();
      return;
    }

    // Update page
    document.title = `${currentProduct.title} | Structon`;
    document.getElementById('breadcrumb-product').textContent = currentProduct.title;
    
    if (currentProduct.category_title) {
      const categoryLink = document.getElementById('breadcrumb-category-link');
      categoryLink.textContent = currentProduct.category_title;
      categoryLink.href = `category.html?cat=${currentProduct.category_slug}`;
    }

    // Render product
    renderProduct(currentProduct);

    // Show action section
    document.getElementById('product-action-section').style.display = 'block';

    // Load related products
    loadRelatedProducts();

  } catch (error) {
    console.error('Error loading product:', error);
    showError(container, 'Kon product niet laden.');
  }
}

/**
 * Render product details
 */
function renderProduct(product) {
  const container = document.getElementById('product-detail');
  
  const images = product.cloudinary_images || [];
  const mainImage = images[0]?.url || 'https://via.placeholder.com/600x600?text=Geen+Afbeelding';

  container.innerHTML = `
    <div class="product-gallery">
      <div class="product-main-image">
        <img src="${mainImage}" alt="${product.title}" id="main-product-image">
      </div>
      ${images.length > 1 ? `
        <div class="product-thumbnails">
          ${images.map((img, i) => `
            <button class="product-thumbnail ${i === 0 ? 'active' : ''}" data-image="${img.url}">
              <img src="${img.url}" alt="${product.title} ${i + 1}">
            </button>
          `).join('')}
        </div>
      ` : ''}
    </div>

    <div class="product-info">
      <span class="product-category">${product.category_title || 'Product'}</span>
      <h1 class="product-title">${product.title}</h1>
      
      ${product.description ? `
        <p class="product-description">${product.description}</p>
      ` : ''}

      <div class="specs-section">
        <h3 class="specs-title">Specificaties</h3>
        <table class="specs-table">
          <tbody>
            ${product.volume ? `<tr><th>Inhoud</th><td>${product.volume} liter</td></tr>` : ''}
            ${product.width ? `<tr><th>Breedte</th><td>${product.width} mm</td></tr>` : ''}
            ${product.weight ? `<tr><th>Gewicht</th><td>${product.weight} kg</td></tr>` : ''}
            ${product.attachment_type ? `<tr><th>Ophanging</th><td>${product.attachment_type}</td></tr>` : ''}
            ${product.excavator_weight_min && product.excavator_weight_max ? `
              <tr><th>Graafmachine klasse</th><td>${formatWeight(product.excavator_weight_min)} - ${formatWeight(product.excavator_weight_max)}</td></tr>
            ` : ''}
            ${product.brand_title ? `<tr><th>Merk</th><td>${product.brand_title}</td></tr>` : ''}
            ${renderExtraSpecs(product.specs)}
          </tbody>
        </table>
      </div>

      <div class="product-price-section price-locked" id="price-section" data-product-id="${product.id}">
        <div class="product-price">Login voor prijs</div>
        <p class="login-prompt">
          <a href="login.html">Log in</a> om prijzen te bekijken en te bestellen.
        </p>
      </div>
    </div>
  `;

  // Setup thumbnail clicks
  setupThumbnails();

  // Load price if logged in
  const priceSection = document.getElementById('price-section');
  if (priceSection) {
    loadProductPrice(product.id, priceSection);
  }
}

/**
 * Setup thumbnail image switching
 */
function setupThumbnails() {
  const thumbnails = document.querySelectorAll('.product-thumbnail');
  const mainImage = document.getElementById('main-product-image');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update active state
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      // Update main image
      mainImage.src = thumb.dataset.image;
    });
  });
}

/**
 * Render extra specs from JSON
 */
function renderExtraSpecs(specs) {
  if (!specs || typeof specs !== 'object') return '';

  return Object.entries(specs)
    .map(([key, value]) => `<tr><th>${formatSpecKey(key)}</th><td>${value}</td></tr>`)
    .join('');
}

/**
 * Format spec key for display
 */
function formatSpecKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format weight in kg or ton
 */
function formatWeight(kg) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} ton`;
  }
  return `${kg} kg`;
}

/**
 * Load related products
 */
async function loadRelatedProducts() {
  if (!currentProduct?.category_id) return;

  const container = document.getElementById('related-products');
  const section = document.getElementById('related-section');
  if (!container || !section) return;

  try {
    const data = await products.getAll({
      category_id: currentProduct.category_id,
      limit: 4
    });

    // Filter out current product
    const related = (data.products || []).filter(p => p.id !== currentProduct.id);

    if (related.length > 0) {
      section.style.display = 'block';
      container.innerHTML = related.slice(0, 4).map(createProductCard).join('');
    }
  } catch (error) {
    console.error('Error loading related products:', error);
  }
}

/**
 * Show product not found
 */
function showProductNotFound() {
  const container = document.getElementById('product-detail');
  container.innerHTML = `
    <div class="product-not-found" style="grid-column: 1/-1;">
      <h2>Product niet gevonden</h2>
      <p>Het opgevraagde product bestaat niet of is niet meer beschikbaar.</p>
      <a href="category.html" class="btn btn-primary">Bekijk alle producten</a>
    </div>
  `;
}
