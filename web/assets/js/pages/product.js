/**
 * Structon - Product Detail Page JavaScript
 */

import { products, quotes } from '../api/client.js';
import { createProductCard, showLoading, showError } from '../main.js';
import { loadProductPrice } from '../pricing.js';
import { isLoggedIn } from '../auth.js';

let currentProduct = null;

/**
 * Build URL for quote request with all product details
 */
function buildQuoteUrl(product) {
  const params = new URLSearchParams();
  
  // Product identification
  if (product.id) params.set('product_id', product.id);
  if (product.slug) params.set('product', product.slug);
  if (product.title) params.set('product_name', product.title);
  
  // Product details for auto-fill
  if (product.category_title) params.set('product_category', product.category_title);
  if (product.brand_title) params.set('product_brand', product.brand_title);
  
  // Tonnage from excavator weight range (values are already in tons)
  if (product.excavator_weight_min && product.excavator_weight_max) {
    const minTon = Math.round(parseFloat(product.excavator_weight_min));
    const maxTon = Math.round(parseFloat(product.excavator_weight_max));
    params.set('product_tonnage', `${minTon}-${maxTon}`);
  }
  
  return `../offerte-aanvragen/?${params.toString()}`;
}

document.addEventListener('DOMContentLoaded', () => {
  initPage();
  setupQuoteForm();
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

    // Setup quote form with product info
    updateQuoteForm(currentProduct);

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
      
      <div class="product-cta-section" style="margin-top: 24px;">
        <a href="${buildQuoteUrl(product)}" class="btn-split usp-btn" style="width: 100%; justify-content: center;">
          <span class="btn-split-text">Offerte Aanvragen</span>
          <span class="btn-split-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </a>
        <p style="font-size: 0.85rem; color: #666; margin-top: 8px; text-align: center;">
          Alleen voor zakelijke klanten (B2B) • Betaling via factuur
        </p>
      </div>
    </div>
  `;

  // Add related products section container after product detail
  const existingRelatedSection = document.getElementById('related-section');
  if (!existingRelatedSection) {
    const relatedSectionHtml = `
      <section id="related-section" class="section" style="display: none; padding-top: var(--space-16); padding-bottom: var(--space-16);">
        <div class="container">
          <h2 style="font-size: var(--text-3xl); color: var(--color-primary); margin-bottom: var(--space-8); text-align: center;">GERELATEERDE PRODUCTEN</h2>
          <div id="related-products" class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-6);"></div>
        </div>
      </section>
    `;
    container.insertAdjacentHTML('afterend', relatedSectionHtml);
  }

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
    const related = (data.items || []).filter(p => p.id !== currentProduct.id);

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

/**
 * Setup quote form
 */
function setupQuoteForm() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('quote-submit');
    const successDiv = document.getElementById('quote-success');
    const errorDiv = document.getElementById('quote-error');
    
    // Reset states
    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verzenden...';

    try {
      const formData = {
        product_id: document.getElementById('quote-product-id').value || null,
        product_name: document.getElementById('quote-product-name').value || null,
        customer_name: document.getElementById('quote-name').value,
        customer_email: document.getElementById('quote-email').value,
        customer_phone: document.getElementById('quote-phone').value || null,
        message: document.getElementById('quote-message').value || null
      };

      console.log('📧 Submitting quote request:', formData);
      
      const result = await quotes.submit(formData);
      
      console.log('✅ Quote submitted successfully:', result);
      
      // Show success
      form.style.display = 'none';
      successDiv.style.display = 'block';
      
    } catch (error) {
      console.error('❌ Quote submission failed:', error);
      errorDiv.style.display = 'block';
      errorDiv.querySelector('p').textContent = error.message || 'Er is iets misgegaan. Probeer het later opnieuw.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Offerte Aanvragen';
    }
  });
}

/**
 * Update quote form with product info
 */
function updateQuoteForm(product) {
  const quoteSection = document.getElementById('quote-section');
  const productIdInput = document.getElementById('quote-product-id');
  const productNameInput = document.getElementById('quote-product-name');
  
  if (quoteSection && product) {
    quoteSection.style.display = 'block';
    
    if (productIdInput) productIdInput.value = product.id;
    if (productNameInput) productNameInput.value = product.title;
  }
}
