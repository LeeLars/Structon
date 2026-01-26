/**
 * Structon - Brand Page JavaScript
 * Coolblue-style brand pages with tonnage filters and inline product display
 */

import { products, brands } from '../api/client.js';
import { createProductCardHorizontal, showLoading, showError, showNoResults } from '../main.js';
import { BRAND_DATA } from '../data/brand-data.js?v=3';

// Brand page state
let currentBrand = null;
let currentBrandId = null;
let currentBrandTitle = null;
let allProducts = [];
let filteredProducts = [];
let activeTonnageFilters = [];
let activeBucketTypeFilters = [];
let activeModelFilter = null;
let activeCategory = null;
let currentPage = 1;
const PRODUCTS_PER_PAGE = 12;
const PREVIEW_PRODUCTS_LIMIT = 4; // Max products to show as preview

 function getProductWeightRangeKg(product) {
   const rawMin = product?.excavator_weight_min;
   const rawMax = product?.excavator_weight_max;

   const minNum = rawMin === null || rawMin === undefined || rawMin === '' ? null : Number(rawMin);
   const maxNum = rawMax === null || rawMax === undefined || rawMax === '' ? null : Number(rawMax);

   // API can return ton values as strings (e.g. "1.50") while filters use kg.
   // Heuristic: values < 200 are treated as tons.
   const minKg = Number.isFinite(minNum) ? (minNum < 200 ? minNum * 1000 : minNum) : 0;
   const maxKg = Number.isFinite(maxNum) ? (maxNum < 200 ? maxNum * 1000 : maxNum) : 100000;

   return { minKg, maxKg };
 }

// Check if user is logged in
const isLoggedIn = localStorage.getItem('authToken') !== null;

/**
 * Initialize brand page
 */
export async function initBrandPage() {
  // Get brand from data attribute or URL
  const brandContainer = document.querySelector('[data-brand]');
  const brandSlug = brandContainer?.dataset.brand || getBrandFromUrl();
  
  if (!brandSlug) {
    console.error('No brand specified');
    return;
  }
  
  currentBrand = brandSlug;

  // Get brand data from local brand-data.js instead of API
  const brandData = BRAND_DATA[brandSlug];
  if (brandData) {
    currentBrandId = brandSlug; // Use slug as ID for filtering
    currentBrandTitle = brandData.name;
    console.log('✅ Brand data loaded from brand-data.js:', brandData.name);
  } else {
    console.warn('⚠️ Brand not found in brand-data.js:', brandSlug);
    currentBrandId = null;
    currentBrandTitle = null;
  }

  // Setup tonnage filter listeners
  setupTonnageFilters();

  // Setup bucket type filter listeners
  setupBucketTypeFilters();

  // Setup category filter listeners
  setupCategoryFilters();
  
  // Load initial products
  loadBrandProducts();
}

// Category pill counts are now updated via updateCategoryCounts() after products load

/**
 * Get brand slug from URL path
 */
function getBrandFromUrl() {
  const path = window.location.pathname;
  // Extract brand from paths like /kraanbakken/caterpillar/
  const match = path.match(/\/kraanbakken\/([^\/]+)/);
  return match ? match[1] : null;
}

/**
 * Setup tonnage filter buttons (model-btn style)
 */
function setupTonnageFilters() {
  const tonnageButtons = document.querySelectorAll('.model-btn[data-tonnage]');

  if (tonnageButtons.length === 0) {
    // Still parse model filter from URL even if tonnage UI is not present
    parseUrlFilters();
    return;
  }
  
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
      
      // Reset to page 1 when filters change
      currentPage = 1;
      
      // Update URL with filters
      updateUrlWithFilters();
      
      // Filter and render products
      filterAndRenderProducts();
    });
  });
  
  // Parse initial filters from URL
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
 * Setup category filter pills
 */
function setupCategoryFilters() {
  const categoryPills = document.querySelectorAll('.category-pill');
  
  if (categoryPills.length === 0) {
    console.log('No category pills found');
    return;
  }
  
  categoryPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      
      const category = pill.dataset.category;
      
      // Toggle active state
      if (pill.classList.contains('active')) {
        // If clicking active pill, don't deactivate (always keep one active)
        return;
      } else {
        // Remove active from all pills
        categoryPills.forEach(p => p.classList.remove('active'));
        // Add active to clicked pill
        pill.classList.add('active');
        activeCategory = category;
      }
      
      // Reset to page 1 when filters change
      currentPage = 1;
      
      // Update URL with filters
      updateUrlWithFilters();
      
      // Update category description
      updateCategoryDescription(category);
      
      // Filter and render products
      filterAndRenderProducts();
      
      const productsSection = document.querySelector('.brand-products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Parse initial category from URL
  parseUrlFilters();
}

/**
 * Update category description based on selected category
 */
function updateCategoryDescription(category) {
  const categoryIntro = document.getElementById('category-intro');
  if (!categoryIntro) return;
  
  const brandName = currentBrandTitle || 'dit merk';
  
  const descriptions = {
    'graafbakken': {
      title: `Graafbakken voor ${brandName}`,
      text: `Professionele graafbakken voor alle grondwerkzaamheden met uw ${brandName} graafmachine. Van lichte tuinwerkzaamheden tot zware grondverzet projecten. Alle bakken zijn vervaardigd met Hardox 450 slijtplaten voor maximale levensduur.`
    },
    'slotenbakken': {
      title: `Slotenbakken voor ${brandName}`,
      text: `Speciale sleuvenbakken voor het graven van sleuven en fundaties met uw ${brandName} machine. Smalle uitvoeringen voor precisiewerk en brede varianten voor grotere sleuven.`
    },
    'rioolbakken': {
      title: `Rioolbakken voor ${brandName}`,
      text: `Professionele rioolbakken ontworpen voor uw ${brandName} graafmachine. Ideaal voor het graven van rioleringen, drainage en waterwerken.`
    },
    'sorteergrijpers': {
      title: `Sorteergrijpers voor ${brandName}`,
      text: `Hydraulische sorteergrijpers voor uw ${brandName} machine. Perfect voor sloop- en afvalverwerkingsprojecten. Robuust en betrouwbaar voor zwaar gebruik.`
    }
  };
  
  const desc = descriptions[category];
  if (desc) {
    categoryIntro.querySelector('.category-description-title').textContent = desc.title;
    categoryIntro.querySelector('.category-description-text').textContent = desc.text;
  }
}

/**
 * Setup Volvo model selector links
 */
function setupModelSelector() {
  const modelLinks = document.querySelectorAll('.model-link');
  if (modelLinks.length === 0) return;

  modelLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      setActiveModelFromLink(link);

      // Reset to page 1 when filters change
      currentPage = 1;

      // Update URL with filters
      updateUrlWithFilters();

      // Filter and render products
      filterAndRenderProducts();

      const productsSection = document.querySelector('.brand-products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function setActiveModelFromLink(linkEl) {
  // Clear active class
  document.querySelectorAll('.model-link.active').forEach(el => el.classList.remove('active'));
  linkEl.classList.add('active');

  const url = new URL(linkEl.getAttribute('href'), window.location.href);
  const model = url.searchParams.get('model');

  const tonnageTons = parseFloat(linkEl.dataset.tonnage);
  const tonnageKg = Number.isFinite(tonnageTons) ? Math.round(tonnageTons * 1000) : null;

  activeModelFilter = {
    model,
    tonnageKg,
    cw: linkEl.dataset.cw || null,
    type: linkEl.dataset.type || null
  };
}

/**
 * Parse filters from URL query params
 */
function parseUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  
  // Tonnage filters - now using model-btn elements
  const tonnage = params.get('tonnage');
  if (tonnage) {
    activeTonnageFilters = tonnage.split(',');
    
    // Add active class to corresponding buttons
    activeTonnageFilters.forEach(t => {
      const button = document.querySelector(`.model-btn[data-tonnage="${t}"]`);
      if (button) button.classList.add('active');
    });
  }
  
  // Bucket type filters
  const bucketType = params.get('type');
  if (bucketType) {
    activeBucketTypeFilters = bucketType.split(',');
    activeBucketTypeFilters.forEach(t => {
      const checkbox = document.querySelector(`.bucket-type-filter input[value="${t}"]`);
      if (checkbox) checkbox.checked = true;
    });
  }
  
  // Category filter
  const category = params.get('category');
  if (category) {
    activeCategory = category;
    
    // Add active class to corresponding pill
    const pill = document.querySelector(`.category-pill[data-category="${category}"]`);
    if (pill) {
      // Remove active from all pills
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    }
    
    // Update category description
    updateCategoryDescription(category);
  }
  
  // Model filter (from model selector links)
  const model = params.get('model');
  if (model) {
    // Highlight active model
    const modelLink = document.querySelector(`.model-link[href*="model=${model}"]`);
    if (modelLink) {
      setActiveModelFromLink(modelLink);
    } else {
      activeModelFilter = { model, tonnageKg: null, cw: null, type: null };
    }
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

  if (activeCategory) {
    params.set('category', activeCategory);
  } else {
    params.delete('category');
  }

  if (activeModelFilter?.model) {
    params.set('model', activeModelFilter.model);
  } else {
    params.delete('model');
  }
  
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
}

/**
 * Setup category tabs (Graafbakken, Slotenbakken, etc.)
 */
function setupCategoryTabs() {
  const categoryTabs = document.querySelectorAll('.category-tab');
  
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active state
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update intro text
      const categorySlug = tab.dataset.category;
      activeCategory = categorySlug;
      updateCategoryIntro(categorySlug);
      
      // Reset to page 1 when category changes
      currentPage = 1;
      filterAndRenderProducts();
    });
  });
}

/**
 * Update category intro text
 */
function updateCategoryIntro(categorySlug) {
  const introContainer = document.getElementById('category-intro');
  if (!introContainer) return;
  
  const intros = {
    'graafbakken': {
      title: 'Graafbakken',
      text: 'Professionele graafbakken voor alle grondwerkzaamheden. Van lichte tuinwerkzaamheden tot zware grondverzet projecten.'
    },
    'slotenbakken': {
      title: 'Slotenbakken',
      text: 'Smalle slotenbakken voor het graven van sleuven, kabels en leidingen. Beschikbaar in verschillende breedtes.'
    },
    'sorteergrijpers': {
      title: 'Sorteergrijpers',
      text: 'Krachtige sorteergrijpers voor het sorteren en verplaatsen van materialen. Ideaal voor sloop- en recyclingwerk.'
    },
    'rioolbakken': {
      title: 'Rioolbakken',
      text: 'Gespecialiseerde rioolbakken voor het leggen van rioleringen en drainage systemen.'
    }
  };
  
  const intro = intros[categorySlug] || intros['graafbakken'];

  const brandName = currentBrandTitle || (currentBrand ? currentBrand.charAt(0).toUpperCase() + currentBrand.slice(1) : '');
  
  introContainer.innerHTML = `
    <h3 class="category-intro-title">${intro.title}${brandName ? ` voor ${brandName}` : ''}</h3>
    <p class="category-intro-text">${intro.text}</p>
  `;
}

/**
 * Load products for current brand
 * Fetches all products and filters client-side based on compatible_brand_ids
 */
async function loadBrandProducts(categorySlug = null) {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  showLoading(container);
  
  try {
    // Load all products from API
    console.log('🔍 Loading all products for brand filtering...');
    const data = await products.getAll({ limit: 500 });
    let fetchedProducts = data.items || [];
    console.log(`� Fetched ${fetchedProducts.length} total products`);
    
    // Get brand ID from slug if we have a brand
    let brandId = null;
    if (currentBrand) {
      try {
        const brandData = await brands.getBySlug(currentBrand);
        brandId = brandData?.id || brandData?.brand?.id || null;
        console.log(`🏷️ Brand ID for ${currentBrand}:`, brandId);
      } catch (e) {
        console.warn('⚠️ Could not fetch brand ID, will show all-compatible products only');
      }
    }
    
    // Filter products based on compatible_brand_ids
    if (currentBrand) {
      allProducts = fetchedProducts.filter(product => {
        const compatibleBrands = product.specs?.compatible_brand_ids || product.compatible_brand_ids;
        
        // If compatible_brand_ids is "all", product works for all brands
        if (compatibleBrands === 'all') {
          return true;
        }
        
        // If it's an array, check if current brand ID is in it
        if (Array.isArray(compatibleBrands) && brandId) {
          return compatibleBrands.includes(brandId);
        }
        
        // Also check if brand slug matches directly (some products may use slugs)
        if (Array.isArray(compatibleBrands)) {
          return compatibleBrands.includes(currentBrand);
        }
        
        return false;
      });
      
      console.log(`✅ Filtered to ${allProducts.length} products compatible with ${currentBrand}`);
      
      // If no compatible products found, show all products as fallback
      if (allProducts.length === 0) {
        console.log('⚠️ No compatible products found, showing all products as fallback');
        allProducts = fetchedProducts;
      }
    } else {
      allProducts = fetchedProducts;
      console.log(`✅ Loaded ${allProducts.length} products (no brand filter)`);
    }

    // If user hasn't selected any filters yet, pick a sensible default bucket type
    // so the page shows suggestions immediately (like industry pages).
    ensureDefaultBrandSuggestions();
    
    // Update category counts
    updateCategoryCounts();
    
    // Apply filters and render
    filterAndRenderProducts();
    
  } catch (error) {
    console.error('Error loading brand products:', error);
    showError(container, 'Kon producten niet laden. Probeer het later opnieuw.');
  }
}

/**
 * Update category pill counts
 */
function updateCategoryCounts() {
  const categories = ['graafbakken', 'slotenbakken', 'rioolbakken', 'sorteergrijpers'];
  
  categories.forEach(category => {
    const count = allProducts.filter(product => product.category_slug === category).length;
    const countEl = document.getElementById(`count-${category}`);
    if (countEl) {
      countEl.textContent = count;
    }
  });
}

function ensureDefaultBrandSuggestions() {
  // Only auto-select if user hasn't chosen any filters yet
  if (activeTonnageFilters.length > 0) return;
  if (activeBucketTypeFilters.length > 0) return;
  if (activeModelFilter?.model) return;
  if (!Array.isArray(allProducts) || allProducts.length === 0) return;

  // Count products per category to prioritize categories with most products
  const categoryCounts = {};
  allProducts.forEach(p => {
    const slug = p.category_slug;
    if (slug) {
      categoryCounts[slug] = (categoryCounts[slug] || 0) + 1;
    }
  });

  // Preferred order, but only if they have products
  const preferredOrder = ['graafbakken', 'slotenbakken', 'rioolbakken', 'sorteergrijpers'];
  
  // Find first preferred category that has products
  let chosen = preferredOrder.find(slug => categoryCounts[slug] > 0);
  
  // If no preferred category has products, choose category with most products
  if (!chosen) {
    const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      chosen = sorted[0][0];
    }
  }
  
  if (!chosen) return;

  console.log(`✅ Auto-selecting default category: ${chosen} (${categoryCounts[chosen]} products)`);
  
  activeBucketTypeFilters = [chosen];
  const checkbox = document.querySelector(`.bucket-type-filter input[value="${chosen}"]`);
  if (checkbox) checkbox.checked = true;
  updateCategoryIntro(chosen);
}

/**
 * Filter products by tonnage, bucket type and render
 */
function filterAndRenderProducts() {
  // Start with all loaded brand products
  filteredProducts = [...allProducts];

  // Apply tonnage filters
  if (activeTonnageFilters.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      return activeTonnageFilters.some(tonnage => {
        const range = parseTonnageRange(tonnage);
        if (!range) return false;

        const { minKg: productMin, maxKg: productMax } = getProductWeightRangeKg(product);

        return productMax >= range.min && productMin <= range.max;
      });
    });
  }

  // Apply bucket type filters
  if (activeBucketTypeFilters.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      const productCategory = product.category_slug || '';
      return activeBucketTypeFilters.some(type => productCategory === type);
    });
  }

  // Apply category filter
  if (activeCategory) {
    filteredProducts = filteredProducts.filter(product => {
      const productCategory = product.category_slug || '';
      return productCategory === activeCategory;
    });
  }

  // Apply model filter (Volvo model selector - if still present on some pages)
  if (activeModelFilter?.model) {
    const modelWeight = activeModelFilter.tonnageKg;
    const modelCw = activeModelFilter.cw;

    filteredProducts = filteredProducts.filter(product => {
      const { minKg: productMin, maxKg: productMax } = getProductWeightRangeKg(product);

      const weightOk = modelWeight ? (productMax >= modelWeight && productMin <= modelWeight) : true;
      const cwOk = modelCw ? product.attachment_type === modelCw : true;

      return weightOk && cwOk;
    });
  }
  
  // Update product count
  updateProductCount(filteredProducts.length);
  
  // Render products with pagination
  renderProducts();
}

/**
 * Parse tonnage filter value to weight range in kg
 * Supports CMS tonnage ranges: 1.5-3, 3-8, 8-15, 15-25, 25-40, 40+
 * Also supports brand-specific tonnages (exact values)
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
  
  // Check if it's a predefined range
  if (ranges[tonnage]) {
    return ranges[tonnage];
  }
  
  // Handle brand-specific exact tonnage values (e.g., "1.7", "12.5", "37")
  const exactTonnage = parseFloat(tonnage);
  if (!isNaN(exactTonnage)) {
    const tonnageKg = exactTonnage * 1000;
    // Create a small range around the exact value (±500kg)
    return { min: tonnageKg - 500, max: tonnageKg + 500 };
  }
  
  return null;
}

/**
 * Update product count display
 */
function updateProductCount(count) {
  const countEl = document.getElementById('products-count');
  if (countEl) {
    countEl.textContent = count;
  }
  
  // Update filter summary
  const summaryEl = document.getElementById('filter-summary');
  if (summaryEl) {
    const parts = [];

    if (activeTonnageFilters.length > 0) {
      parts.push(`Tonnage: ${activeTonnageFilters.map(t => `${t} ton`).join(', ')}`);
    }

    if (activeBucketTypeFilters.length > 0) {
      const typeNames = activeBucketTypeFilters.map(t => {
        return t.charAt(0).toUpperCase() + t.slice(0, -2); // Remove 'en' and capitalize
      });
      parts.push(`Type: ${typeNames.join(', ')}`);
    }

    summaryEl.innerHTML = parts.length > 0
      ? `<span class="filter-active">Gefilterd op: ${parts.join(' | ')}</span>`
      : '';
  }
}

function updateCategoryTabCounts(productsForCounts) {
  const tabs = document.querySelectorAll('.category-tab');
  if (tabs.length === 0) return;

  const counts = {};
  productsForCounts.forEach(p => {
    const slug = p.category_slug;
    if (!slug) return;
    counts[slug] = (counts[slug] || 0) + 1;
  });

  tabs.forEach(tab => {
    const slug = tab.dataset.category;
    const countEl = document.getElementById(`count-${slug}`);
    if (countEl) {
      countEl.textContent = counts[slug] ?? 0;
    }
  });
}

/**
 * Render products with inline display (no external links)
 * Shows max 4 products as preview with link to all products
 */
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;
  
  if (filteredProducts.length === 0) {
    showNoResults(container, 'Geen producten gevonden voor dit merk.');
    renderPagination(0);
    return;
  }
  
  // Show max 4 products as preview
  const previewProducts = filteredProducts.slice(0, PREVIEW_PRODUCTS_LIMIT);
  const hasMoreProducts = filteredProducts.length > PREVIEW_PRODUCTS_LIMIT;
  
  // Render products using horizontal cards
  container.className = 'products-list brand-products-list';
  container.innerHTML = previewProducts.map(product => 
    createProductCardHorizontal(product, isLoggedIn)
  ).join('');
  
  // Add "View all products" link if there are more than 4 products
  if (hasMoreProducts) {
    const basePath = getBasePath();
    const viewAllLink = document.createElement('div');
    viewAllLink.className = 'view-all-products-wrapper';
    viewAllLink.innerHTML = `
      <a href="${basePath}producten/?brand_slug=${currentBrand}" class="btn-split view-all-products-btn">
        <span class="btn-split-text">Bekijk alle ${filteredProducts.length} ${currentBrandTitle || currentBrand} producten</span>
        <span class="btn-split-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
      </a>
    `;
    container.appendChild(viewAllLink);
  }
  
  // Hide pagination for preview mode
  renderPagination(0);
}

/**
 * Get base path for correct URL generation
 */
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/kraanbakken/')) {
    const parts = path.split('/').filter(p => p && !p.includes('.html'));
    const kraanbakkenIndex = parts.indexOf('kraanbakken');
    if (kraanbakkenIndex !== -1 && parts[kraanbakkenIndex + 1]) {
      const levelsUp = parts.length - kraanbakkenIndex;
      return '../'.repeat(levelsUp);
    }
  }
  return '';
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
  
  // Previous button
  html += `
    <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
  `;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || 
      i === totalPages || 
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      html += `
        <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += '<span class="pagination-ellipsis">...</span>';
    }
  }
  
  // Next button
  html += `
    <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  `;
  
  paginationContainer.innerHTML = html;
  
  // Add click listeners
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
export function clearTonnageFilters() {
  activeTonnageFilters = [];
  activeBucketTypeFilters = [];
  
  // Remove active class from all tonnage buttons
  document.querySelectorAll('.model-btn[data-tonnage]').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Uncheck all bucket type checkboxes
  document.querySelectorAll('.bucket-type-filter input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  
  // Update URL and re-render
  updateUrlWithFilters();
  filterAndRenderProducts();
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Only init if we're on a brand page
  if (document.querySelector('[data-brand]') || window.location.pathname.includes('/kraanbakken/')) {
    initBrandPage();
  }
});

// Export for external use
window.clearTonnageFilters = clearTonnageFilters;
