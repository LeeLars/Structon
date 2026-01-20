/**
 * All Products Page
 * Displays all available products with filters
 * Also handles single product detail view when ?id= parameter is present
 */

import { products } from '../api/client.js';
import { createProductCardHorizontal, createProductCard, createIndustryProductCard, showLoading, showError, showNoResults, escapeHtml } from '../main.js';
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
 * Render product detail view - PRO Version
 */
function renderProductDetail(product, container) {
  // Inject custom styles for the pro layout
  injectProStyles();

  const images = product.cloudinary_images || [];
  const mainImage = images[0]?.url || 'https://via.placeholder.com/600x600?text=Geen+Afbeelding';
  
  // Build specs arrays
  const keySpecs = [];
  if (product.weight) keySpecs.push({ label: 'Gewicht', value: `${product.weight} kg`, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>' }); // Using heart as placeholder, ideally weight icon
  if (product.width) keySpecs.push({ label: 'Breedte', value: `${product.width} mm`, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20"/><path d="M5 9v6"/><path d="M19 9v6"/></svg>' });
  if (product.volume) keySpecs.push({ label: 'Inhoud', value: `${product.volume} L`, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' });
  if (product.attachment_type) keySpecs.push({ label: 'Ophanging', value: product.attachment_type, icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' });

  // Fix icons for weight (scale)
  if (keySpecs.find(s => s.label === 'Gewicht')) {
     keySpecs.find(s => s.label === 'Gewicht').icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="M5 8h14"/><path d="M2 18h20"/></svg>';
  }

  const allSpecs = [];
  if (product.id) allSpecs.push({ label: 'Artikelnummer', value: product.id.substring(0, 8).toUpperCase() });
  if (product.category_title) allSpecs.push({ label: 'Categorie', value: product.category_title });
  if (product.brand_title) allSpecs.push({ label: 'Merk', value: product.brand_title });
  if (product.weight) allSpecs.push({ label: 'Gewicht', value: `${product.weight} kg` });
  if (product.width) allSpecs.push({ label: 'Breedte', value: `${product.width} mm` });
  if (product.volume) allSpecs.push({ label: 'Inhoud (SAE)', value: `${product.volume} liter` });
  if (product.attachment_type) allSpecs.push({ label: 'Ophanging', value: product.attachment_type });
  if (product.excavator_weight_min && product.excavator_weight_max) {
    allSpecs.push({ 
      label: 'Machine klasse', 
      value: `${parseFloat(product.excavator_weight_min).toFixed(1)} - ${parseFloat(product.excavator_weight_max).toFixed(1)} ton` 
    });
  }

  // Quote URL
  const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
  const quoteParams = new URLSearchParams();
  quoteParams.set('product_id', product.id);
  quoteParams.set('product_name', product.title);
  if (product.category_title) quoteParams.set('product_category', product.category_title);
  const quoteUrl = `${basePath}/offerte-aanvragen/?${quoteParams.toString()}`;

  // Build HTML
  container.innerHTML = `
    <div class="pro-product-page">
      <!-- Breadcrumbs -->
      <nav class="pro-breadcrumbs">
        <a href="./">Home</a>
        <span class="separator">/</span>
        <a href="./">Producten</a>
        ${product.category_title ? `
          <span class="separator">/</span>
          <span class="current">${escapeHtml(product.category_title)}</span>
        ` : ''}
        <span class="separator">/</span>
        <span class="current">${escapeHtml(product.title)}</span>
      </nav>

      <!-- Header Section -->
      <div class="pro-header">
        <h1 class="pro-title">${escapeHtml(product.title)}</h1>
      </div>

      <div class="pro-grid">
        <!-- 1. Gallery Column -->
        <div class="pro-col-gallery">
          <div class="main-image-wrapper">
            <img src="${mainImage}" alt="${escapeHtml(product.title)}" id="main-product-image">
          </div>
          ${images.length > 1 ? `
            <div class="thumbnail-list">
              ${images.map((img, i) => `
                <button class="thumb-btn ${i === 0 ? 'active' : ''}" data-image="${img.url}">
                  <img src="${img.url}" alt="Thumbnail ${i + 1}">
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- 2. Details Column -->
        <div class="pro-col-details">
          <!-- Price Block -->
          <div class="price-block">
            ${isLoggedIn ? `
              <div class="price-row">
                <span class="price-amount">€${product.price_excl_vat || '0.00'}</span>
                <span class="price-suffix">excl. BTW</span>
              </div>
            ` : `
              <div class="price-request">Prijs op aanvraag</div>
            `}
          </div>

          <!-- Key Specs Grid -->
          <div class="key-specs-grid">
            ${keySpecs.map(spec => `
              <div class="key-spec-item">
                <span class="spec-icon">${spec.icon}</span>
                <span class="spec-label">${spec.label}</span>
                <span class="spec-value">${spec.value}</span>
              </div>
            `).join('')}
          </div>

          <!-- Brand Compatibility -->
          ${product.brand_title ? `
            <div class="brand-compatibility">
              <h4 class="compatibility-title">Compatibel met</h4>
              <div class="compatibility-brands">
                <span class="brand-tag">${escapeHtml(product.brand_title)}</span>
              </div>
              <p class="compatibility-note">Deze kraanbak is speciaal ontworpen voor ${escapeHtml(product.brand_title)} machines.</p>
            </div>
          ` : ''}

          <!-- Description Snippet -->
          ${product.description ? `
            <div class="pro-description">
              <p>${escapeHtml(product.description).substring(0, 150)}...</p>
              <a href="#full-specs" class="read-more-link">Bekijk alle specificaties ↓</a>
            </div>
          ` : ''}

          <!-- CTAs -->
          <div class="pro-actions">
            ${isLoggedIn ? `
              <button class="btn-primary btn-lg btn-block icon-btn" onclick="addToCart('${product.id}', '${escapeHtml(product.title)}')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                In Winkelwagen
              </button>
            ` : ''}
            <a href="${quoteUrl}" id="btn-request-quote" class="btn-split btn-split-lg" style="width: 100%; text-decoration: none;">
              <span class="btn-split-text">Offerte Aanvragen</span>
              <span class="btn-split-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </a>
          </div>
        </div>

        <!-- 3. Sidebar Column (Expert & Trust) -->
        <div class="pro-col-sidebar">
          <!-- Expert Box -->
          <div class="expert-box">
            <div class="expert-header">
              <div class="expert-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#236773" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div class="expert-info">
                <strong>Arno Vermeersch</strong>
                <span>External Sales</span>
              </div>
            </div>
            <p class="expert-text">Twijfel je over de juiste ophanging of maat? Neem contact op met onze specialist.</p>
            <a href="tel:+32469702138" class="expert-phone">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              +32 469 70 21 38
            </a>
            <a href="mailto:arno.vermeersch@structon.be" class="expert-email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              arno.vermeersch@structon.be
            </a>
          </div>
        </div>
      </div>

      <!-- Full Specs & Details Section -->
      <div id="full-specs" class="pro-details-section">
        <div class="tabs-header">
          <button class="tab-btn active" data-target="specs">Specificaties</button>
          <button class="tab-btn" data-target="desc">Omschrijving</button>
        </div>
        
        <div id="tab-specs" class="tab-content active">
          <h3 class="specs-title">Technische Specificaties</h3>
          <table class="pro-specs-table">
            <tbody>
              ${allSpecs.map((s, i) => `
                <tr class="${i % 2 === 0 ? 'bg-gray' : ''}">
                  <th>${s.label}</th>
                  <td>${s.value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div id="tab-desc" class="tab-content" style="display: none;">
          <h3 class="specs-title">Product Omschrijving</h3>
          <div class="pro-description-content">
            <p>${escapeHtml(product.description || 'Geen omschrijving beschikbaar.')}</p>
          </div>
        </div>
      </div>

      <!-- Featured Products Section -->
      <div class="related-section">
        <h2 class="related-title">Uitgelichte Producten</h2>
        <div id="related-products-grid" class="related-grid">
          <!-- Zal worden gevuld door loadFeaturedProducts -->
          <div style="padding: 20px; text-align: center; color: #94a3b8;">Laden...</div>
        </div>
      </div>
    </div>
  `;
  
  // Setup handlers
  setupThumbnailHandlers();
  setupTabHandlers();
  loadFeaturedProducts(product);
}

/**
 * Setup tab switching handlers
 */
function setupTabHandlers() {
  const tabs = document.querySelectorAll('.tab-btn');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      
      // Show target content
      const targetId = `tab-${tab.dataset.target}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
        // Add simple animation
        targetContent.style.opacity = '0';
        setTimeout(() => targetContent.style.opacity = '1', 10);
        targetContent.style.transition = 'opacity 0.3s ease';
      }
    });
  });
}

/**
 * Load featured products
 */
async function loadFeaturedProducts(currentProduct) {
  const container = document.getElementById('related-products-grid');
  if (!container) return;

  try {
    // Fetch featured products
    const filters = {
      is_featured: true,
      limit: 5 // Fetch 5 to have a buffer if we filter out the current one
    };

    const data = await products.getAll(filters);
    let featured = data.items || [];

    // Filter out current product
    featured = featured.filter(p => p.id !== currentProduct.id).slice(0, 4);

    // If no featured products, fall back to same category
    if (featured.length === 0) {
      const categoryFilters = {
        limit: 5
      };
      if (currentProduct.category_id) {
        categoryFilters.category_id = currentProduct.category_id;
      }
      const categoryData = await products.getAll(categoryFilters);
      featured = (categoryData.items || []).filter(p => p.id !== currentProduct.id).slice(0, 4);
    }

    if (featured.length === 0) {
      const section = document.querySelector('.related-section');
      if (section) section.style.display = 'none';
      return;
    }

    // Render using Industry Card style
    container.innerHTML = featured.map(p => createIndustryProductCard(p, isLoggedIn)).join('');
    
  } catch (error) {
    console.error('Error loading featured products:', error);
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #94a3b8;">Kon uitgelichte producten niet laden.</div>';
  }
}

/**
 * Inject Custom CSS for Pro Product Layout
 */
function injectProStyles() {
  if (document.getElementById('pro-product-styles')) return;

  const style = document.createElement('style');
  style.id = 'pro-product-styles';
  style.textContent = `
    /* Pro Product Layout Variables */
    :root {
      --pro-primary: #236773;
      --pro-bg-light: #f8fafc;
      --pro-border: #e2e8f0;
      --pro-text: #334155;
      --pro-text-dark: #0f172a;
    }

    .pro-product-page {
      font-family: 'Inter', -apple-system, sans-serif;
      max-width: 1400px;
      margin: 0 auto;
      color: var(--pro-text);
      animation: fadeIn 0.3s ease;
    }

    /* Breadcrumbs */
    .pro-breadcrumbs {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
      font-size: 0.9rem;
      color: #64748b;
    }
    .pro-breadcrumbs a {
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s;
    }
    .pro-breadcrumbs a:hover {
      color: var(--pro-primary);
    }
    .pro-breadcrumbs .separator {
      color: #cbd5e1;
    }
    .pro-breadcrumbs .current {
      color: var(--pro-text-dark);
      font-weight: 500;
    }

    /* Header */
    .pro-header { margin-bottom: 32px; }
    .back-link { display: none; } /* Hidden in favor of breadcrumbs */
    .pro-title { font-size: 2.5rem; font-weight: 800; color: var(--pro-text-dark); margin: 0; line-height: 1.1; letter-spacing: -0.02em; text-transform: uppercase; }

    /* Grid Layout */
    .pro-grid {
      display: grid;
      grid-template-columns: 45% 30% 25%; /* 3 Column Layout */
      gap: 32px;
      margin-bottom: 64px;
    }

    /* Column 1: Gallery */
    .pro-col-gallery { display: flex; flex-direction: column; gap: 16px; }
    .main-image-wrapper { 
      background: white; border: 1px solid var(--pro-border); border-radius: 12px; padding: 24px; 
      position: relative; width: 100%; height: 500px; display: flex; align-items: center; justify-content: center;
    }
    .main-image-wrapper img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; }
    
    .thumbnail-list { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px; }
    .thumb-btn { 
      width: 80px; height: 80px; border: 2px solid var(--pro-border); border-radius: 8px; 
      padding: 4px; background: white; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
    }
    .thumb-btn:hover, .thumb-btn.active { border-color: var(--pro-primary); }
    .thumb-btn img { width: 100%; height: 100%; object-fit: contain; }

    /* Column 2: Details */
    .pro-col-details { display: flex; flex-direction: column; gap: 24px; }
    .price-block { border-bottom: 1px solid var(--pro-border); padding-bottom: 20px; }
    .price-amount { font-size: 2.2rem; font-weight: 700; color: var(--pro-primary); }
    .price-suffix { font-size: 0.9rem; color: #64748b; margin-left: 4px; }
    .price-request { font-size: 1.5rem; font-weight: 600; color: var(--pro-text-dark); }
    
    .key-specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .key-spec-item { background: var(--pro-bg-light); padding: 12px; border-radius: 8px; display: flex; flex-direction: column; gap: 2px; }
    .spec-icon { color: var(--pro-primary); display: flex; align-items: center; margin-bottom: 4px; }
    .spec-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    .spec-value { font-weight: 600; color: var(--pro-text-dark); font-size: 0.95rem; }

    .pro-description p { color: #475569; line-height: 1.6; font-size: 0.95rem; margin-bottom: 8px; }
    .read-more-link { color: var(--pro-primary); text-decoration: none; font-size: 0.9rem; font-weight: 600; border-bottom: 1px dashed var(--pro-primary); }
    
    /* Brand Compatibility */
    .brand-compatibility { background: var(--pro-bg-light); padding: 20px; border-radius: 12px; border-left: 4px solid var(--pro-primary); }
    .compatibility-title { font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .compatibility-brands { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
    .brand-tag { display: inline-block; background: white; border: 2px solid var(--pro-primary); color: var(--pro-primary); padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 0.9rem; }
    .compatibility-note { font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.5; }
    
    .pro-actions { display: flex; flex-direction: column; gap: 12px; margin-top: 0; }
    .btn-block { width: 100%; justify-content: flex-start; }
    .icon-btn { display: flex; align-items: center; justify-content: flex-start; gap: 8px; }
    #btn-request-quote { justify-content: flex-start !important; }

    /* Column 3: Sidebar */
    .pro-col-sidebar { display: flex; flex-direction: column; gap: 24px; }
    .expert-box { background: white; border: 1px solid var(--pro-border); border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .expert-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .expert-avatar { width: 48px; height: 48px; background: #e0f2f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .expert-info { display: flex; flex-direction: column; }
    .expert-info strong { font-size: 1.1rem; color: var(--pro-text-dark); }
    .expert-info span { font-size: 0.9rem; color: #64748b; }
    .expert-text { font-size: 0.9rem; color: #475569; margin-bottom: 16px; line-height: 1.5; }
    .expert-phone, .expert-email { display: block; text-decoration: none; color: var(--pro-primary); font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; transition: opacity 0.2s; }
    .expert-phone:hover, .expert-email:hover { opacity: 0.8; }

    /* Bottom Section */
    .pro-details-section { border-top: 1px solid var(--pro-border); padding-top: 48px; margin-bottom: 64px; }
    .tabs-header { display: flex; gap: 24px; border-bottom: 2px solid var(--pro-border); margin-bottom: 32px; }
    .tab-btn { background: none; border: none; padding: 0 0 16px 0; font-size: 1.1rem; font-weight: 500; color: #64748b; cursor: pointer; position: relative; }
    .tab-btn.active { color: var(--pro-primary); font-weight: 700; }
    .tab-btn.active::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px; background: var(--pro-primary); }
    
    .specs-title { margin-bottom: 24px; font-size: 1.5rem; color: var(--pro-text-dark); }
    .pro-specs-table { width: 100%; max-width: 800px; border-collapse: collapse; }
    .pro-specs-table tr { border-bottom: 1px solid var(--pro-border); }
    .pro-specs-table tr.bg-gray { background: #f8fafc; }
    .pro-specs-table th { text-align: left; padding: 12px 16px; color: #64748b; font-weight: 500; width: 40%; }
    .pro-specs-table td { padding: 12px 16px; color: var(--pro-text-dark); font-weight: 600; }
    
    .pro-description-content { max-width: 800px; line-height: 1.8; color: #334155; }

    /* Featured Products */
    .related-section { border-top: 1px solid var(--pro-border); padding-top: 48px; margin-top: 48px; }
    .related-title { font-size: 1.8rem; margin-bottom: 32px; color: var(--pro-text-dark); font-weight: 700; text-transform: uppercase; }
    .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px; }

    /* Responsive */
    @media (max-width: 1100px) {
      .pro-grid { grid-template-columns: 1fr 1fr; }
      .pro-col-sidebar { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    }
    @media (max-width: 768px) {
      .pro-grid { grid-template-columns: 1fr; gap: 32px; }
      .pro-col-sidebar { grid-template-columns: 1fr; }
      .pro-title { font-size: 1.8rem; }
      .key-specs-grid { grid-template-columns: 1fr 1fr; }
      .related-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
    }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(style);
}

/**
 * Setup thumbnail click handlers for image gallery
 */
function setupThumbnailHandlers() {
  const thumbnails = document.querySelectorAll('.thumb-btn');
  const mainImage = document.getElementById('main-product-image');
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update main image
      mainImage.src = thumb.dataset.image;
      
      // Update active state
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}
