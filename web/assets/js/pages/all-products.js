/**
 * All Products Page
 * Displays all available products with filters
 * Also handles single product detail view when ?id= parameter is present
 */

import { products } from '../api/client.js';
import { createProductCardHorizontal, showLoading, showError, showNoResults, escapeHtml } from '../main.js';
import { initFilters, getActiveFilters } from '../filters.js';
import { initPagination, updatePagination, getOffset, getItemsPerPage } from '../pagination.js';

let allProducts = [];
let currentProduct = null;

// Check if user is logged in
const isLoggedIn = localStorage.getItem('authToken') !== null;

document.addEventListener('DOMContentLoaded', () => {
  initPage();
});

/**
 * Initialize page
 */
async function initPage() {
  // Check if we're viewing a single product
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  
  if (productId) {
    // Show single product detail view
    await loadSingleProduct(productId);
  } else {
    // Show products list
    initFilters(handleFilterChange);
    await loadProducts();
  }
}

/**
 * Load products
 */
async function loadProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  showLoading(container);

  try {
    const filters = getActiveFilters();
    filters.limit = getItemsPerPage();
    filters.offset = getOffset();

    console.log('🔍 Loading products with filters:', filters);
    const data = await products.getAll(filters);
    
    console.log('📦 Products API Response:', {
      total: data.total,
      itemsCount: data.items?.length || 0,
      items: data.items
    });
    
    allProducts = data.items || [];
    const total = data.total || allProducts.length;

    // Update count
    document.getElementById('products-count').textContent = total;

    // Initialize/update pagination
    initPagination(total, handlePageChange);

    // Render products
    renderProducts(allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    showError(container, 'Kon producten niet laden. Probeer het later opnieuw.');
  }
}

/**
 * Render products with horizontal cards
 */
function renderProducts(productList) {
  const container = document.getElementById('products-grid');
  if (!container) return;

  if (productList.length === 0) {
    showNoResults(container, 'Geen producten gevonden met de huidige filters.');
    return;
  }

  // Use horizontal card layout
  container.className = 'products-list';
  container.innerHTML = productList.map(product => 
    createProductCardHorizontal(product, isLoggedIn)
  ).join('');
}

/**
 * Handle filter change
 */
function handleFilterChange(filters) {
  loadProducts();
}

/**
 * Handle page change
 */
function handlePageChange(page, offset) {
  loadProducts();
}

/**
 * Load single product detail view
 */
async function loadSingleProduct(productId) {
  // Hide filters sidebar and show full width content
  const sidebar = document.getElementById('filters-sidebar');
  const toolbar = document.querySelector('.products-toolbar');
  const pagination = document.getElementById('pagination');
  const container = document.getElementById('products-grid');
  
  if (sidebar) sidebar.style.display = 'none';
  if (toolbar) toolbar.style.display = 'none';
  if (pagination) pagination.style.display = 'none';
  
  // Update page layout for full width
  const layout = document.querySelector('.category-layout');
  if (layout) layout.style.gridTemplateColumns = '1fr';
  
  if (!container) return;
  
  showLoading(container);
  
  try {
    console.log('🔍 Loading product with ID/slug:', productId);
    const data = await products.getById(productId);
    console.log('📦 Product API Response:', data);
    
    currentProduct = data.product;
    
    if (!currentProduct) {
      console.error('❌ Product not found in API response');
      showProductNotFound(container);
      return;
    }
    
    console.log('✅ Product loaded successfully:', currentProduct.title);
    
    // Update page title and breadcrumb
    document.title = `${currentProduct.title} | Structon`;
    
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <a href="../index.html">Home</a>
        <span>/</span>
        <a href="./">Producten</a>
        <span>/</span>
        <span aria-current="page">${escapeHtml(currentProduct.title)}</span>
      `;
    }
    
    // Update hero
    const heroTitle = document.querySelector('.page-title');
    const heroSubtitle = document.querySelector('.page-subtitle');
    if (heroTitle) heroTitle.textContent = currentProduct.title.toUpperCase();
    if (heroSubtitle) heroSubtitle.textContent = currentProduct.category_title || 'Product';
    
    // Render product detail
    renderProductDetail(currentProduct, container);
    
  } catch (error) {
    console.error('❌ Error loading product:', error);
    console.error('Product ID/Slug:', productId);
    
    // Check if it's a 404 (product not found)
    if (error.message && (error.message.includes('404') || error.message.includes('not found'))) {
      showProductNotFound(container);
    } else {
      showError(container, 'Kon product niet laden. Probeer het later opnieuw.');
    }
  }
}

/**
 * Show product not found message
 */
function showProductNotFound(container) {
  container.innerHTML = `
    <div class="no-results" style="text-align: center; padding: 60px 20px;">
      <h2 style="margin-bottom: 16px;">Product niet gevonden</h2>
      <p style="margin-bottom: 24px;">Het product dat u zoekt bestaat niet of is niet meer beschikbaar.</p>
      <a href="./" class="btn btn-primary">Bekijk alle producten</a>
    </div>
  `;
}

/**
 * Render product detail view
 */
function renderProductDetail(product, container) {
  const images = product.cloudinary_images || [];
  const mainImage = images[0]?.url || 'https://via.placeholder.com/600x600?text=Geen+Afbeelding';
  
  // Build specs table
  const specs = [];
  if (product.volume) specs.push({ label: 'Inhoud', value: `${product.volume} liter` });
  if (product.width) specs.push({ label: 'Breedte', value: `${product.width} mm` });
  if (product.weight) specs.push({ label: 'Gewicht', value: `${product.weight} kg` });
  if (product.attachment_type) specs.push({ label: 'Ophanging', value: product.attachment_type });
  if (product.excavator_weight_min && product.excavator_weight_max) {
    specs.push({ 
      label: 'Graafmachine klasse', 
      value: `${parseFloat(product.excavator_weight_min).toFixed(1)} - ${parseFloat(product.excavator_weight_max).toFixed(1)} ton` 
    });
  }
  if (product.brand_title) specs.push({ label: 'Merk', value: product.brand_title });
  
  const specsHtml = specs.length > 0 ? `
    <div class="specs-section" style="margin-top: 32px;">
      <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 16px; text-transform: uppercase;">Specificaties</h3>
      <table class="specs-table" style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${specs.map(s => `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <th style="text-align: left; padding: 12px 0; font-weight: 500; color: #6b7280; width: 40%;">${s.label}</th>
              <td style="text-align: left; padding: 12px 0; font-weight: 600;">${s.value}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';
  
  // Build quote URL
  const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
  const quoteParams = new URLSearchParams();
  quoteParams.set('product_id', product.id);
  quoteParams.set('product_name', product.title);
  if (product.category_title) quoteParams.set('product_category', product.category_title);
  const quoteUrl = `${basePath}/offerte-aanvragen/?${quoteParams.toString()}`;
  
  container.innerHTML = `
    <div class="product-detail-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;">
      <!-- Product Gallery -->
      <div class="product-gallery">
        <div class="product-main-image" style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
          <img src="${mainImage}" alt="${escapeHtml(product.title)}" id="main-product-image" style="width: 100%; height: auto; object-fit: contain;">
        </div>
        ${images.length > 1 ? `
          <div class="product-thumbnails" style="display: flex; gap: 12px; flex-wrap: wrap;">
            ${images.map((img, i) => `
              <button class="product-thumbnail ${i === 0 ? 'active' : ''}" data-image="${img.url}" style="width: 80px; height: 80px; border: 2px solid ${i === 0 ? '#236773' : '#e5e7eb'}; border-radius: 8px; overflow: hidden; cursor: pointer; padding: 4px; background: #fff;">
                <img src="${img.url}" alt="${escapeHtml(product.title)} ${i + 1}" style="width: 100%; height: 100%; object-fit: cover;">
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
      
      <!-- Product Info -->
      <div class="product-info">
        <span class="product-category" style="display: inline-block; background: #e0f2f1; color: #236773; padding: 4px 12px; border-radius: 4px; font-size: 14px; font-weight: 600; margin-bottom: 12px;">${escapeHtml(product.category_title || 'Product')}</span>
        <h1 class="product-title" style="font-size: 32px; font-weight: 700; margin-bottom: 16px; text-transform: uppercase;">${escapeHtml(product.title)}</h1>
        
        ${product.description ? `
          <p class="product-description" style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">${escapeHtml(product.description)}</p>
        ` : ''}
        
        ${specsHtml}
        
        <!-- Price Section -->
        <div class="product-price-section" style="margin-top: 32px; padding: 24px; background: #f9fafb; border-radius: 12px;">
          ${isLoggedIn ? `
            <div class="product-price" style="font-size: 28px; font-weight: 700; color: #236773;">€${product.price_excl_vat || '0.00'},- <span style="font-size: 14px; font-weight: 400; color: #6b7280;">excl. BTW</span></div>
          ` : `
            <div class="product-price" style="font-size: 20px; font-weight: 600; color: #374151;">Prijs op aanvraag</div>
            <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">Neem contact met ons op voor een offerte.</p>
          `}
        </div>
        
        <!-- Action Buttons -->
        <div class="product-actions" style="margin-top: 24px; display: flex; gap: 16px; flex-wrap: wrap;">
          <a href="${quoteUrl}" class="btn-split" style="flex: 1; min-width: 200px; text-decoration: none;">
            <span class="btn-split-text">Offerte Aanvragen</span>
            <span class="btn-split-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
          </a>
          <a href="./" class="btn btn-secondary" style="padding: 12px 24px;">Terug naar producten</a>
        </div>
      </div>
    </div>
  `;
  
  // Setup thumbnail click handlers
  setupThumbnailHandlers();
}

/**
 * Setup thumbnail click handlers for image gallery
 */
function setupThumbnailHandlers() {
  const thumbnails = document.querySelectorAll('.product-thumbnail');
  const mainImage = document.getElementById('main-product-image');
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update main image
      mainImage.src = thumb.dataset.image;
      
      // Update active state
      thumbnails.forEach(t => t.style.borderColor = '#e5e7eb');
      thumb.style.borderColor = '#236773';
    });
  });
}
