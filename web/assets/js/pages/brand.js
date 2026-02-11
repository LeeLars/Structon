/**
 * Structon - Brand Page JavaScript
 * Shows random relevant products for each brand
 */

import { products } from '../api/client.js';
import { createProductCard, showLoading, showError } from '../main.js';
import { loadProductPrices } from '../pricing.js';

// Brand data loaded dynamically to prevent import errors from blocking product loading
let BRAND_DATA = {};

// Brand page state
let currentBrand = null;
let currentBrandId = null;
let currentBrandTitle = null;
let brandInitialized = false;
const PRODUCTS_TO_SHOW = 8;

// Check if user is logged in
const isLoggedIn = !!(localStorage.getItem('token') || localStorage.getItem('auth_token'));


/**
 * Shuffle array randomly
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Initialize brand page
 */
export async function initBrandPage() {
  if (brandInitialized) return;
  brandInitialized = true;
  
  // Try multiple ways to find brand
  const brandContainer = document.querySelector('[data-brand]') || document.querySelector('main[data-brand]');
  const brandSlug = brandContainer?.dataset?.brand || getBrandFromUrl();
  
  console.log('🔍 Brand slug:', brandSlug);
  
  if (!brandSlug) {
    console.error('No brand specified');
    return;
  }
  
  currentBrand = brandSlug;

  // Load brand data dynamically (non-blocking for product loading)
  try {
    const brandModule = await import('../data/brand-data.js?v=9');
    BRAND_DATA = brandModule.BRAND_DATA || {};
    const brandData = BRAND_DATA[brandSlug];
    if (brandData) {
      currentBrandId = brandSlug;
      currentBrandTitle = brandData.name;
    }
  } catch (err) {
    console.warn('Brand data could not be loaded:', err.message);
  }
  
  // Render model selector with links to products page
  renderModelSelector();
  
  // Load random products - always runs even if brand-data failed
  await loadBrandProducts();
}

/**
 * Get brand slug from URL path
 */
function getBrandFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/\/kraanbakken\/([^\/]+)/);
  return match ? match[1] : null;
}

/**
 * Load random products for current brand
 * Uses fallback products if API is unavailable
 */
async function loadBrandProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  // Clear any loading placeholder
  container.innerHTML = '';
  
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('timeout')), 6000)
    );
    
    const data = await Promise.race([
      products.getAll({ limit: 50 }),
      timeoutPromise
    ]);
    
    let allProducts = data.items || data.products || [];
    if (Array.isArray(data)) allProducts = data;
    
    if (allProducts.length > 0) {
      displayProducts = shuffleArray(allProducts).slice(0, PRODUCTS_TO_SHOW);
      renderProducts(displayProducts);
    } else {
      container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">Geen producten beschikbaar</div>';
    }
  } catch (error) {
    console.warn('Could not load brand products:', error);
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">Producten konden niet geladen worden</div>';
  }
}

/**
 * Render products in grid layout (same as home page featured products)
 */
function renderProducts(productsToRender) {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  const fallback = document.getElementById('products-fallback');
  
  if (productsToRender.length === 0) {
    if (fallback) fallback.style.display = 'block';
    return;
  }
  
  // Hide fallback link when products are shown
  if (fallback) fallback.style.display = 'none';
  
  // Render product cards directly into the container
  container.innerHTML = productsToRender.map(product => 
    createProductCard(product, isLoggedIn)
  ).join('');
  
  // Load prices for logged in users
  if (isLoggedIn) {
    loadProductPrices();
  }
}

/**
 * Update category intro text
 */
function updateCategoryIntro(categorySlug) {
  const introContainer = document.getElementById('category-intro');
  if (!introContainer) return;
  
  const brandName = currentBrandTitle || currentBrand;
  
  const intros = {
    'graafbakken': {
      title: `Graafbakken voor ${brandName}`,
      text: `Professionele graafbakken voor alle grondwerkzaamheden met uw ${brandName} graafmachine. Van lichte tuinwerkzaamheden tot zware grondverzet projecten. Alle bakken zijn vervaardigd met Hardox 450 slijtplaten voor maximale levensduur.`
    },
    'slotenbakken': {
      title: `Slotenbakken voor ${brandName}`,
      text: `Smalle slotenbakken voor precisiewerk met uw ${brandName} machine. Ideaal voor kabels, leidingen en drainage werkzaamheden.`
    },
    'rioolbakken': {
      title: `Rioolbakken voor ${brandName}`,
      text: `Gespecialiseerde rioolbakken voor het aanleggen van rioleringen en drainage systemen met uw ${brandName} graafmachine.`
    },
    'sorteergrijpers': {
      title: `Sorteergrijpers voor ${brandName}`,
      text: `Krachtige sorteergrijpers voor het efficiënt sorteren en verplaatsen van materialen met uw ${brandName} machine.`
    }
  };
  
  const intro = intros[categorySlug] || intros['graafbakken'];
  
  introContainer.innerHTML = `
    <h3 class="category-description-title">${intro.title}</h3>
    <p class="category-description-text">${intro.text}</p>
  `;
}

/**
 * Render model selector section
 */
function renderModelSelector() {
  const container = document.getElementById('model-selector-container');
  if (!container) {
    console.log('ℹ️ No model-selector-container found, skipping model selector');
    return;
  }
  
  const brandData = BRAND_DATA[currentBrand];
  if (!brandData || !brandData.modelCategories || brandData.modelCategories.length === 0) {
    console.warn('⚠️ No model categories found for brand:', currentBrand);
    // Hide the section instead of showing spinner
    const section = container.closest('.model-selector-section');
    if (section) {
      section.style.display = 'none';
    } else {
      container.innerHTML = '';
    }
    return;
  }
  
  const brandName = brandData.name || currentBrand;
  const productsUrl = getProductsPageUrl();
  
  let html = `
    <div class="model-selector-header">
      <h2 class="section-title">${brandData.modelSelectorTitle || `Modellen ${brandName}`}</h2>
      <p class="section-subtitle">${brandData.modelSelectorSubtitle || 'Klik op een model voor passende producten'}</p>
    </div>
    <div class="model-cards-grid">
  `;
  
  brandData.modelCategories.forEach(category => {
    html += `
      <div class="model-card">
        <h3 class="model-card-title">${category.title}</h3>
        <p class="model-card-subtitle">${category.subtitle}</p>
        <div class="model-buttons">
    `;
    
    category.models.forEach(model => {
      // Link to products page with brand filter
      const filterUrl = `${productsUrl}?brand=${currentBrand}`;
      html += `
        <a href="${filterUrl}" class="model-btn" data-model="${model.name}" data-tonnage="${model.tonnage}" data-cw="${model.cw}">
          ${model.name}
        </a>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  
  // Add "Bekijk alle producten" button
  html += `
    <div class="model-selector-cta">
      <a href="${productsUrl}?brand=${currentBrand}" class="btn-split btn-split-primary">
        <span class="btn-split-text">Bekijk alle ${brandName} producten</span>
        <span class="btn-split-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
      </a>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Show the section now that content is loaded
  const section = document.getElementById('model-selector-section');
  if (section) {
    section.style.display = 'block';
  }
  
  console.log('✅ Model selector rendered for', brandName);
}

/**
 * Get products page URL based on current locale
 */
function getProductsPageUrl() {
  const path = window.location.pathname;
  
  // Detect locale from path
  const localeMatch = path.match(/\/(be-nl|nl-nl|be-fr|de-de)\//);
  const locale = localeMatch ? localeMatch[1] : 'be-nl';
  
  // Build products URL
  if (path.includes('/Structon/')) {
    return `/Structon/${locale}/producten/`;
  }
  return `/${locale}/producten/`;
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  if (document.querySelector('[data-brand]')) {
    try {
      await initBrandPage();
    } catch (error) {
      console.error('❌ Brand page initialization failed:', error);
      // Remove all spinners on error
      document.querySelectorAll('.loading, .spinner').forEach(el => {
        el.style.display = 'none';
      });
    }
  }
});
