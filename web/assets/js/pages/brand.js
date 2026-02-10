/**
 * Structon - Brand Page JavaScript
 * Shows random relevant products for each brand
 */

import { products } from '../api/client.js';
import { createProductCard, showLoading, showError } from '../main.js';
import { BRAND_DATA } from '../data/brand-data.js?v=7';
import { loadProductPrices } from '../pricing.js';

// Brand page state
let currentBrand = null;
let currentBrandId = null;
let currentBrandTitle = null;
let brandInitialized = false;
const PRODUCTS_TO_SHOW = 8;

// Check if user is logged in
const isLoggedIn = localStorage.getItem('authToken') !== null;

// Fallback products when API is unavailable
const FALLBACK_PRODUCTS = [
  {
    id: 'fb-1',
    title: 'Dieplepelbak 600mm',
    slug: 'dieplepelbak-600mm',
    description: 'Robuuste dieplepelbak voor grondverzet. Vervaardigd uit Hardox 450 staal.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'dieplepelbakken',
    weight: 85,
    volume: 120,
    width: 600,
    stock: 12,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831686/CM20190621-473fb-e9a23_umfdbh.jpg' }]
  },
  {
    id: 'fb-2',
    title: 'Slotenbak 400mm',
    slug: 'slotenbak-400mm',
    description: 'Smalle slotenbak voor precisiewerk. Ideaal voor kabels en leidingen.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'sleuvenbakken',
    weight: 65,
    volume: 80,
    width: 400,
    stock: 8,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831820/volvo_n1v8j7.jpg' }]
  },
  {
    id: 'fb-3',
    title: 'Rioolbak 300mm',
    slug: 'rioolbak-300mm',
    description: 'Gespecialiseerde rioolbak voor drainage en rioleringswerkzaamheden.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'rioolbakken',
    weight: 55,
    volume: 60,
    width: 300,
    stock: 5,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831686/CM20190621-473fb-e9a23_umfdbh.jpg' }]
  },
  {
    id: 'fb-4',
    title: 'Dieplepelbak 800mm',
    slug: 'dieplepelbak-800mm',
    description: 'Brede dieplepelbak voor grote grondverzet projecten.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'dieplepelbakken',
    weight: 120,
    volume: 180,
    width: 800,
    stock: 15,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831820/volvo_n1v8j7.jpg' }]
  },
  {
    id: 'fb-5',
    title: 'Sorteergrijper 600mm',
    slug: 'sorteergrijper-600mm',
    description: 'Krachtige sorteergrijper voor efficiënt sorteren en verplaatsen.',
    category_title: 'Sorteergrijpers',
    category_slug: 'sorteergrijpers',
    subcategory_slug: null,
    weight: 450,
    volume: null,
    width: 600,
    stock: 3,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831686/CM20190621-473fb-e9a23_umfdbh.jpg' }]
  },
  {
    id: 'fb-6',
    title: 'Slotenbak 500mm',
    slug: 'slotenbak-500mm',
    description: 'Veelzijdige slotenbak voor diverse grondwerkzaamheden.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'sleuvenbakken',
    weight: 75,
    volume: 95,
    width: 500,
    stock: 10,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831820/volvo_n1v8j7.jpg' }]
  },
  {
    id: 'fb-7',
    title: 'Dieplepelbak 1000mm',
    slug: 'dieplepelbak-1000mm',
    description: 'Extra brede dieplepelbak voor grootschalige projecten.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'dieplepelbakken',
    weight: 150,
    volume: 250,
    width: 1000,
    stock: 7,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831686/CM20190621-473fb-e9a23_umfdbh.jpg' }]
  },
  {
    id: 'fb-8',
    title: 'Rioolbak 450mm',
    slug: 'rioolbak-450mm',
    description: 'Professionele rioolbak voor drainage systemen.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'rioolbakken',
    weight: 70,
    volume: 85,
    width: 450,
    stock: 6,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831820/volvo_n1v8j7.jpg' }]
  }
];

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
  
  console.log('🔍 Brand container:', brandContainer);
  console.log('🔍 Brand slug:', brandSlug);
  
  if (!brandSlug) {
    console.error('❌ No brand specified');
    return;
  }
  
  currentBrand = brandSlug;

  const brandData = BRAND_DATA[brandSlug];
  if (brandData) {
    currentBrandId = brandSlug;
    currentBrandTitle = brandData.name;
    console.log('✅ Brand data loaded:', brandData.name);
  } else {
    console.warn('⚠️ Brand not found in BRAND_DATA:', brandSlug);
    console.log('📦 Available brands:', Object.keys(BRAND_DATA));
    currentBrandId = null;
    currentBrandTitle = null;
  }
  
  // Render model selector with links to products page
  renderModelSelector();
  
  // Load random products for this brand
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
  
  // Skip if products are already hardcoded in HTML
  if (container.querySelectorAll('.product-card').length > 0) return;
  
  // Then try to fetch real products from API
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('timeout')), 4000)
    );
    
    const data = await Promise.race([
      products.getAll({ limit: 50 }),
      timeoutPromise
    ]);
    
    let allProducts = data.items || data.products || [];
    if (Array.isArray(data)) allProducts = data;
    
    if (allProducts.length > 0) {
      // Replace fallback with real products
      const existing = container.querySelector('.products-grid');
      if (existing) existing.remove();
      displayProducts = shuffleArray(allProducts).slice(0, PRODUCTS_TO_SHOW);
      renderProducts(displayProducts);
    }
  } catch (error) {
    // Fallback already rendered, nothing to do
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
  
  // Render products grid
  const gridDiv = document.createElement('div');
  gridDiv.className = 'products-grid';
  gridDiv.innerHTML = productsToRender.map(product => 
    createProductCard(product, isLoggedIn)
  ).join('');
  
  container.appendChild(gridDiv);
  
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
