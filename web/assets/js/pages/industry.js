/**
 * Structon - Industry Page JavaScript
 * Shows random relevant products for each industry
 */

import { products } from '../api/client.js';
import { createIndustryProductCard, showLoading, showError } from '../main.js';

// Industry page state
let currentIndustry = null;
const PRODUCTS_TO_SHOW = 12

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

// Industry configurations with recommended product categories
const INDUSTRY_CONFIG = {
  'grondwerkers': {
    name: 'Grondwerkers',
    categories: ['graafbakken', 'slotenbakken', 'rioolbakken'],
    keywords: ['grondverzet', 'graafwerk', 'uitgraven']
  },
  'afbraak-sloop': {
    name: 'Afbraak- en Sloopbedrijven',
    categories: ['sorteergrijpers', 'sloophamers', 'puinbakken'],
    keywords: ['sloop', 'afbraak', 'demolition']
  },
  'tuinaanleggers': {
    name: 'Tuinaanleggers',
    categories: ['graafbakken', 'slotenbakken', 'egalisatiebakken'],
    keywords: ['tuinaanleg', 'groenvoorziening', 'landscaping']
  },
  'wegenbouw': {
    name: 'Wegenbouwers',
    categories: ['graafbakken', 'slotenbakken', 'rioolbakken'],
    keywords: ['wegenbouw', 'infrastructuur', 'bestrating']
  },
  'recycling': {
    name: 'Recyclingbedrijven',
    categories: ['sorteergrijpers', 'puinbakken', 'zeefbakken'],
    keywords: ['recycling', 'afvalverwerking', 'sorteren']
  },
  'verhuur': {
    name: 'Verhuurbedrijven',
    categories: ['graafbakken', 'slotenbakken', 'sorteergrijpers'],
    keywords: ['verhuur', 'rental', 'machinepark']
  },
  'loonwerk-landbouw': {
    name: 'Loonwerk & Landbouw',
    categories: ['graafbakken', 'slotenbakken', 'mestbakken'],
    keywords: ['loonwerk', 'landbouw', 'agrarisch']
  },
  'baggerwerken': {
    name: 'Baggerwerken',
    categories: ['baggerbakken', 'slotenbakken', 'graafbakken'],
    keywords: ['baggeren', 'waterbouw', 'slibverwijdering']
  }
};

/**
 * Initialize industry page
 */
export function initIndustryPage() {
  const industryContainer = document.querySelector('[data-industry]');
  const industrySlug = industryContainer?.dataset.industry;
  
  if (!industrySlug) {
    console.error('No industry specified');
    return;
  }
  
  currentIndustry = industrySlug;
  
  // Load random products for this industry
  loadIndustryProducts();
}


/**
 * Load random products for current industry
 */
async function loadIndustryProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const config = INDUSTRY_CONFIG[currentIndustry];
    const categories = config?.categories || [];
    
    // Fetch products from relevant categories
    const data = await products.getAll({ limit: 100 });
    let allProducts = data.items || [];
    
    // Filter products by relevant categories if configured
    if (categories.length > 0) {
      allProducts = allProducts.filter(product => {
        const categorySlug = product.category_slug || '';
        return categories.some(cat => categorySlug.includes(cat));
      });
    }
    
    // Shuffle and take random products
    const shuffled = shuffleArray(allProducts);
    const displayProducts = shuffled.slice(0, PRODUCTS_TO_SHOW);
    
    console.log(`✅ Showing ${displayProducts.length} random products for ${currentIndustry}`);
    
    renderProducts(displayProducts);
    
  } catch (error) {
    console.error('Error loading industry products:', error);
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
  
  container.className = 'industry-products-grid';
  container.innerHTML = productsToRender.map(product => 
    createIndustryProductCard(product, isLoggedIn)
  ).join('');
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-industry]')) {
    initIndustryPage();
  }
});
