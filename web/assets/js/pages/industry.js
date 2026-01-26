/**
 * Structon - Industry Page JavaScript
 * Coolblue-style industry pages with tonnage filters and inline product display
 */

import { products } from '../api/client.js';
import { createIndustryProductCard, showLoading, showError, showNoResults } from '../main.js';

// Industry page state
let currentIndustry = null;
let allProducts = [];
let filteredProducts = [];
let activeTonnageFilters = [];
let activeBucketTypeFilters = [];
let currentPage = 1;
const PRODUCTS_PER_PAGE = 12;

// Check if user is logged in
const isLoggedIn = localStorage.getItem('authToken') !== null;

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
  // Get industry from data attribute
  const industryContainer = document.querySelector('[data-industry]');
  const industrySlug = industryContainer?.dataset.industry;
  
  if (!industrySlug) {
    console.error('No industry specified');
    return;
  }
  
  currentIndustry = industrySlug;
  
  // Setup tonnage filter listeners
  setupTonnageFilters();
  
  // Setup bucket type filter listeners
  setupBucketTypeFilters();
  
  // Setup category tab listeners
  setupCategoryTabs();

  // Populate category tab counts
  loadCategoryTabCounts();
  
  // Load initial products
  loadIndustryProducts(getActiveCategoryFromTabs());
  
  // Load popular products for sidebar
  loadPopularProducts();
}

/**
 * Load popular products for the content area
 */
async function loadPopularProducts() {
  const container = document.getElementById('content-popular-products');
  if (!container) return;
  
  try {
    // Use industry config to find relevant categories
    const config = INDUSTRY_CONFIG[currentIndustry];
    const categories = config?.categories || ['graafbakken'];
    
    // Fetch a few products from these categories
    const data = await products.getAll({
      category_slug: categories[0], // Take first category as primary
      limit: 3 // Show 3 cards
    });
    
    const popularProducts = data.items || [];
    
    if (popularProducts.length > 0) {
      container.innerHTML = popularProducts.map(product => createIndustryProductCard(product)).join('');
    } else {
      container.style.display = 'none'; // Hide container if no products
    }
    
  } catch (error) {
    console.error('Error loading popular products:', error);
    container.innerHTML = '';
  }
}

/**
 * Setup tonnage filter buttons (model-btn style)
 */
function setupTonnageFilters() {
  const tonnageButtons = document.querySelectorAll('.model-btn[data-tonnage]');
  
  tonnageButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const tonnageValue = e.currentTarget.dataset.tonnage;
      
      // Toggle active state
      if (activeTonnageFilters.includes(tonnageValue)) {
        activeTonnageFilters = activeTonnageFilters.filter(t => t !== tonnageValue);
        button.classList.remove('active');
      } else {
        activeTonnageFilters.push(tonnageValue);
        button.classList.add('active');
      }
      
      currentPage = 1;
      updateUrlWithFilters();
      filterAndRenderProducts();
    });
  });
  
  parseUrlFilters();
}

/**
 * Setup bucket type filter checkboxes
 */
function setupBucketTypeFilters() {
  const bucketTypeCheckboxes = document.querySelectorAll('.bucket-type-filter input[type="checkbox"]');
  
  bucketTypeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const bucketType = e.target.value;
      
      if (e.target.checked) {
        if (!activeBucketTypeFilters.includes(bucketType)) {
          activeBucketTypeFilters.push(bucketType);
        }
      } else {
        activeBucketTypeFilters = activeBucketTypeFilters.filter(t => t !== bucketType);
      }
      
      currentPage = 1;
      updateUrlWithFilters();
      filterAndRenderProducts();
    });
  });
}

/**
 * Parse filters from URL query params
 */
function parseUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  
  const tonnage = params.get('tonnage');
  if (tonnage) {
    activeTonnageFilters = tonnage.split(',');
    activeTonnageFilters.forEach(t => {
      const button = document.querySelector(`.model-btn[data-tonnage="${t}"]`);
      if (button) button.classList.add('active');
    });
  }
  
  const bucketType = params.get('type');
  if (bucketType) {
    activeBucketTypeFilters = bucketType.split(',');
    activeBucketTypeFilters.forEach(t => {
      const checkbox = document.querySelector(`.bucket-type-filter input[value="${t}"]`);
      if (checkbox) checkbox.checked = true;
    });
  }
}

/**
 * Update URL with current filters
 */
function updateUrlWithFilters() {
  const params = new URLSearchParams(window.location.search);
  
  if (activeTonnageFilters.length > 0) {
    params.set('tonnage', activeTonnageFilters.join(','));
  } else {
    params.delete('tonnage');
  }
  
  if (activeBucketTypeFilters.length > 0) {
    params.set('type', activeBucketTypeFilters.join(','));
  } else {
    params.delete('type');
  }
  
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
}

/**
 * Setup category tabs
 */
function setupCategoryTabs() {
  const categoryTabs = document.querySelectorAll('.category-tab');

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const categorySlug = tab.dataset.category;
      updateCategoryIntro(categorySlug);
      
      currentPage = 1;
      loadIndustryProducts(categorySlug);
    });
  });
}

function getActiveCategoryFromTabs() {
  const active = document.querySelector('.category-tab.active');
  if (active?.dataset?.category) return active.dataset.category;
  const first = document.querySelector('.category-tab');
  return first?.dataset?.category || null;
}

async function loadCategoryTabCounts() {
  const categoryTabs = document.querySelectorAll('.category-tab');
  if (categoryTabs.length === 0) return;

  await Promise.all(
    Array.from(categoryTabs).map(async (tab) => {
      const categorySlug = tab.dataset.category;
      const countEl = tab.querySelector('.category-tab-count');
      if (!categorySlug || !countEl) return;

      try {
        // Fetch minimal payload but rely on API total
        const data = await products.getAll({ category_slug: categorySlug, limit: 1 });
        countEl.textContent = String(data.total ?? 0);
      } catch (e) {
        // Keep placeholder when API fails
        countEl.textContent = '0';
      }
    })
  );
}

/**
 * Update category intro text based on industry
 */
function updateCategoryIntro(categorySlug) {
  const introContainer = document.getElementById('category-intro');
  if (!introContainer) return;
  
  const config = INDUSTRY_CONFIG[currentIndustry];
  const industryName = config?.name || 'deze sector';
  
  const intros = {
    'graafbakken': {
      title: `Graafbakken voor ${industryName}`,
      text: `Robuuste graafbakken speciaal geselecteerd voor ${industryName.toLowerCase()}. Optimale prestaties voor uw dagelijkse werkzaamheden.`
    },
    'slotenbakken': {
      title: `Slotenbakken voor ${industryName}`,
      text: `Smalle slotenbakken voor precisiewerk. Ideaal voor kabels, leidingen en drainage in de ${industryName.toLowerCase()} sector.`
    },
    'sorteergrijpers': {
      title: `Sorteergrijpers voor ${industryName}`,
      text: `Krachtige sorteergrijpers voor het efficiënt sorteren en verplaatsen van materialen.`
    },
    'rioolbakken': {
      title: `Rioolbakken voor ${industryName}`,
      text: `Gespecialiseerde rioolbakken voor het aanleggen van rioleringen en drainage systemen.`
    }
  };
  
  const intro = intros[categorySlug] || intros['graafbakken'];
  
  introContainer.innerHTML = `
    <h3 class="category-intro-title">${intro.title}</h3>
    <p class="category-intro-text">${intro.text}</p>
  `;
}

/**
 * Load products for current industry
 */
async function loadIndustryProducts(categorySlug = null) {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  showLoading(container);
  
  try {
    const filters = {
      limit: 100
    };

    if (categorySlug) {
      filters.category_slug = categorySlug;
    }
    
    console.log('🔍 Loading industry products:', currentIndustry, filters);
    
    const data = await products.getAll(filters);
    allProducts = data.items || [];
    
    console.log(`✅ Loaded ${allProducts.length} products for industry: ${currentIndustry}`);
    
    filterAndRenderProducts();
    
  } catch (error) {
    console.error('Error loading industry products:', error);
    showError(container, 'Kon producten niet laden. Probeer het later opnieuw.');
  }
}

/**
 * Filter products and render
 */
function filterAndRenderProducts() {
  filteredProducts = [...allProducts];
  
  // Apply tonnage filters
  if (activeTonnageFilters.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      return activeTonnageFilters.some(tonnage => {
        const range = parseTonnageRange(tonnage);
        if (!range) return false;
        
        const productMin = product.excavator_weight_min || 0;
        const productMax = product.excavator_weight_max || 100000;
        
        return productMax >= range.min && productMin <= range.max;
      });
    });
  }
  
  // Apply bucket type filters
  if (activeBucketTypeFilters.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const productCategory = product.category_slug || '';
      return activeBucketTypeFilters.some(type => productCategory.includes(type));
    });
  }
  
  updateProductCount(filteredProducts.length);
  renderProducts();
}

/**
 * Parse tonnage filter value to weight range in kg
 * Supports CMS tonnage ranges: 1.5-3, 3-8, 8-15, 15-25, 25-40, 40+
 */
function parseTonnageRange(tonnage) {
  const ranges = {
    // CMS tonnage ranges (in kg)
    '1.5-3': { min: 1500, max: 3000 },
    '3-8': { min: 3000, max: 8000 },
    '8-15': { min: 8000, max: 15000 },
    '15-25': { min: 15000, max: 25000 },
    '25-40': { min: 25000, max: 40000 },
    '40+': { min: 40000, max: 100000 },
    // Legacy ranges for backwards compatibility
    '0-2': { min: 0, max: 2000 },
    '2-5': { min: 2000, max: 5000 },
    '5-10': { min: 5000, max: 10000 },
    '10-15': { min: 10000, max: 15000 }
  };
  
  return ranges[tonnage] || null;
}

/**
 * Update product count display
 */
function updateProductCount(count) {
  const countEl = document.getElementById('products-count');
  if (countEl) {
    countEl.textContent = count;
  }
  
  const summaryEl = document.getElementById('filter-summary');
  if (summaryEl) {
    const filters = [];
    if (activeTonnageFilters.length > 0) {
      filters.push(activeTonnageFilters.map(t => `${t} ton`).join(', '));
    }
    if (activeBucketTypeFilters.length > 0) {
      filters.push(activeBucketTypeFilters.join(', '));
    }
    
    if (filters.length > 0) {
      summaryEl.innerHTML = `<span class="filter-active">Gefilterd op: ${filters.join(' | ')}</span>`;
    } else {
      summaryEl.innerHTML = '';
    }
  }
}

/**
 * Render products with inline display
 */
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  if (filteredProducts.length === 0) {
    showNoResults(container, 'Geen producten gevonden met de geselecteerde filters.');
    renderPagination(0);
    return;
  }
  
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const pageProducts = filteredProducts.slice(startIndex, endIndex);
  
  container.className = 'industry-products-grid';
  container.innerHTML = pageProducts.map(product => 
    createIndustryProductCard(product, isLoggedIn)
  ).join('');
  
  renderPagination(totalPages);
  
  if (currentPage > 1) {
    const productsSection = document.querySelector('.industry-products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/**
 * Render pagination controls
 */
function renderPagination(totalPages) {
  const paginationContainer = document.getElementById('pagination');
  if (!paginationContainer) return;
  
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }
  
  let html = '';
  
  html += `
    <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
  `;
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `
        <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += '<span class="pagination-ellipsis">...</span>';
    }
  }
  
  html += `
    <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  `;
  
  paginationContainer.innerHTML = html;
  
  paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (page && page !== currentPage && page >= 1 && page <= totalPages) {
        currentPage = page;
        renderProducts();
      }
    });
  });
}

/**
 * Clear all filters
 */
export function clearIndustryFilters() {
  activeTonnageFilters = [];
  activeBucketTypeFilters = [];
  
  document.querySelectorAll('.model-btn[data-tonnage]').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.querySelectorAll('.bucket-type-filter input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  
  updateUrlWithFilters();
  filterAndRenderProducts();
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-industry]')) {
    initIndustryPage();
  }
});

// Export for external use
window.clearIndustryFilters = clearIndustryFilters;
