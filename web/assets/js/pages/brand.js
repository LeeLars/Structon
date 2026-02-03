/**
 * Structon - Brand Page JavaScript
 * Shows random relevant products for each brand
 */

import { products } from '../api/client.js';
import { createProductCardHorizontal, showLoading, showError } from '../main.js';
import { BRAND_DATA } from '../data/brand-data.js?v=6';
import { loadProductPrices } from '../pricing.js';

// Brand page state
let currentBrand = null;
let currentBrandId = null;
let currentBrandTitle = null;
const PRODUCTS_TO_SHOW = 12;

// Check if user is logged in
const isLoggedIn = localStorage.getItem('authToken') !== null;

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
  console.log('🚀 initBrandPage called');
  
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
 */
async function loadBrandProducts() {
  const container = document.getElementById('products-grid');
  console.log('🔍 Looking for products-grid container:', container);
  
  if (!container) {
    console.error('❌ products-grid container not found!');
    return;
  }
  
  showLoading(container);
  console.log('⏳ Loading products from API...');
  
  try {
    // Fetch all products
    const data = await products.getAll({ limit: 100 });
    console.log('📦 API Response:', data);
    
    let allProducts = data.items || data.products || [];
    
    // If data is an array directly
    if (Array.isArray(data)) {
      allProducts = data;
    }
    
    console.log(`✅ Loaded ${allProducts.length} products for ${currentBrand}`);
    
    if (allProducts.length === 0) {
      console.warn('⚠️ No products returned from API');
      container.innerHTML = '<div class="no-results">Geen producten gevonden.</div>';
      return;
    }
    
    // Shuffle and take random products
    const shuffled = shuffleArray(allProducts);
    const displayProducts = shuffled.slice(0, PRODUCTS_TO_SHOW);
    
    console.log(`✅ Showing ${displayProducts.length} random products`);
    
    renderProducts(displayProducts);
    
  } catch (error) {
    console.error('❌ Error loading brand products:', error);
    console.error('Error details:', error.message, error.stack);
    showError(container, 'Kon producten niet laden. Probeer het later opnieuw.');
  }
}

/**
 * Render products
 */
function renderProducts(productsToRender) {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  if (productsToRender.length === 0) {
    container.innerHTML = '<div class="no-results">Geen producten beschikbaar.</div>';
    return;
  }
  
  container.className = 'products-list';
  container.innerHTML = productsToRender.map(product => 
    createProductCardHorizontal(product, isLoggedIn)
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

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-brand]')) {
    initBrandPage();
  }
});
