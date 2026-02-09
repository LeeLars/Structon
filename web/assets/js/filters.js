/**
 * Structon Filters Module
 * Client-side filtering for product listings
 */

/**
 * Filter state
 */
let activeFilters = {
  category: null,
  subcategory: null,
  volume_min: null,
  volume_max: null,
  excavator_weight: [], // Array for multiple tonnage selections
  width: [],
  attachment_type: [],
  brand: [], // Array for multiple brand selections
  search: null,
  sort: 'newest'
};

let onFilterChange = null;

/**
 * Initialize filters
 */
export async function initFilters(callback) {
  onFilterChange = callback;
  
  // Parse URL params (now async to detect subcategories)
  await parseUrlParams();
  
  // Load brand filters
  await loadBrandFilters();
  
  // Setup event listeners
  setupFilterListeners();
  
  // Apply initial filters
  applyFilters();
}

/**
 * Parse URL parameters into filter state
 */
async function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  
  // Category filter - need to check if it's a main category or subcategory
  if (params.has('cat')) {
    const catParam = params.get('cat');
    
    // Check if this is a subcategory by fetching all categories and subcategories
    try {
      const { categories, subcategories } = await import('./api/client.js');
      
      // Fetch categories to check if catParam is a main category
      const categoriesData = await categories.getAll(true);
      const isMainCategory = categoriesData?.categories?.some(cat => cat.slug === catParam);
      
      if (isMainCategory) {
        // It's a main category
        activeFilters.category = catParam;
        activeFilters.subcategory = null;
      } else {
        // Check if it's a subcategory
        const subcategoriesData = await subcategories.getAll();
        const isSubcategory = subcategoriesData?.subcategories?.some(sub => sub.slug === catParam);
        
        if (isSubcategory) {
          // It's a subcategory - set subcategory filter instead
          activeFilters.subcategory = catParam;
          activeFilters.category = null;
        } else {
          // Fallback: treat as category
          activeFilters.category = catParam;
        }
      }
    } catch (error) {
      console.error('Error parsing category parameter:', error);
      // Fallback: treat as category
      activeFilters.category = catParam;
    }
  }
  
  // Subcategory filter (from navigation menu)
  if (params.has('subcat')) {
    activeFilters.subcategory = params.get('subcat');
  }
  
  // Tonnage filter (from navigation menu) - convert to excavator_weight
  if (params.has('tonnage')) {
    const tonnage = params.get('tonnage');
    const weight = parseTonnageToWeight(tonnage);
    if (weight) {
      activeFilters.excavator_weight = [weight];
    }
  }
  
  // Search filter
  if (params.has('search')) {
    activeFilters.search = params.get('search');
  }
  
  // Sort filter
  if (params.has('sort')) {
    activeFilters.sort = params.get('sort');
  }
}

/**
 * Convert tonnage ID to excavator weight value (in KG, matching checkbox values)
 * Maps mega menu tonnage ranges to checkbox values
 * Examples: '1-3t' -> 1500 (matches "1 - 3 ton" checkbox)
 */
function parseTonnageToWeight(tonnageId) {
  // Map tonnage ranges from mega menu to checkbox values (in kg)
  const tonnageMap = {
    '1-3t': 1500,    // 1 - 3 ton checkbox
    '3-8t': 4000,    // 3 - 8 ton checkbox
    '8-15t': 12000,  // 8 - 15 ton checkbox
    '15-25t': 20000, // 15 - 25 ton checkbox
    '25-50t': 30000, // 25 - 50 ton checkbox
    '25t-plus': 30000,  // 25t+ -> 25 - 50 ton checkbox
    // Sloop-sorteergrijpers ranges
    '1t-5t': 4000,      // 1t - 5t -> 3 - 8 ton checkbox
    '10t-20t': 12000,   // 10t - 20t -> 8 - 15 ton checkbox
    '20t-30t': 20000,   // 20t - 30t -> 15 - 25 ton checkbox
    '30t-40t': 30000,   // 30t - 40t -> 25 - 50 ton checkbox
    '40t-plus': 30000   // 40t+ -> 25 - 50 ton checkbox
  };
  
  return tonnageMap[tonnageId] || null;
}

/**
 * Setup filter event listeners
 */
function setupFilterListeners() {
  // Volume range sliders
  const volumeMin = document.getElementById('volume-min');
  const volumeMax = document.getElementById('volume-max');
  
  if (volumeMin && volumeMax) {
    volumeMin.addEventListener('input', (e) => {
      activeFilters.volume_min = parseInt(e.target.value);
      updateRangeDisplay('volume');
    });
    
    volumeMax.addEventListener('input', (e) => {
      activeFilters.volume_max = parseInt(e.target.value);
      updateRangeDisplay('volume');
    });
    
    volumeMin.addEventListener('change', applyFilters);
    volumeMax.addEventListener('change', applyFilters);
  }

  // Excavator class checkboxes (values are in kg as integers)
  const excavatorFilters = document.querySelectorAll('input[name="excavator"]');
  excavatorFilters.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      updateCheckboxFilter('excavator_weight', parseInt(e.target.value), e.target.checked);
    });
  });
  
  // Pre-check checkboxes based on URL parameters (after event listeners are set)
  applyUrlFiltersToUI();

  // Width checkboxes
  const widthFilters = document.querySelectorAll('input[name="width"]');
  widthFilters.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      updateCheckboxFilter('width', parseInt(e.target.value), e.target.checked);
    });
  });

  // Attachment type checkboxes
  const attachmentFilters = document.querySelectorAll('input[name="attachment"]');
  attachmentFilters.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      updateCheckboxFilter('attachment_type', e.target.value, e.target.checked);
    });
  });

  // Brand checkboxes (setup after dynamic load)
  setupBrandListeners();

  // Sort select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.value = activeFilters.sort;
    sortSelect.addEventListener('change', (e) => {
      activeFilters.sort = e.target.value;
      applyFilters();
    });
  }

  // Clear filters button
  const clearBtn = document.getElementById('clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearFilters);
  }

  // Apply filters button (mobile)
  const applyBtn = document.getElementById('apply-filters');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      applyFilters();
      closeMobileFilters();
    });
  }

  // Mobile filter toggle
  const toggleBtn = document.getElementById('toggle-filters');
  const filtersSidebar = document.getElementById('filters-sidebar');
  
  if (toggleBtn && filtersSidebar) {
    toggleBtn.addEventListener('click', () => {
      filtersSidebar.classList.toggle('is-open');
    });
  }
}

/**
 * Apply URL filters to UI (check appropriate checkboxes)
 */
function applyUrlFiltersToUI() {
  // Check excavator weight checkboxes based on active filters
  if (activeFilters.excavator_weight.length > 0) {
    const excavatorCheckboxes = document.querySelectorAll('input[name="excavator"]');
    excavatorCheckboxes.forEach(checkbox => {
      const checkboxValue = parseInt(checkbox.value);
      if (activeFilters.excavator_weight.includes(checkboxValue)) {
        checkbox.checked = true;
      }
    });
  }
}

/**
 * Update checkbox filter array
 */
function updateCheckboxFilter(filterName, value, isChecked) {
  if (isChecked) {
    if (!activeFilters[filterName].includes(value)) {
      activeFilters[filterName].push(value);
    }
  } else {
    activeFilters[filterName] = activeFilters[filterName].filter(v => v !== value);
  }
  
  applyFilters();
}

/**
 * Update range display
 */
function updateRangeDisplay(type) {
  if (type === 'volume') {
    const minDisplay = document.getElementById('volume-min-value');
    const maxDisplay = document.getElementById('volume-max-value');
    
    if (minDisplay) minDisplay.textContent = `${activeFilters.volume_min || 0}L`;
    if (maxDisplay) maxDisplay.textContent = `${activeFilters.volume_max || 5000}L`;
  }
}

/**
 * Apply filters and trigger callback
 */
function applyFilters() {
  if (onFilterChange) {
    onFilterChange(getActiveFilters());
  }
  
  // Update URL
  updateUrl();
}

/**
 * Get active filters for API call
 */
export function getActiveFilters() {
  const filters = {};
  
  // Category filter (main category slug)
  if (activeFilters.category) {
    filters.category_slug = activeFilters.category;
  }
  
  // Subcategory filter (e.g., 'slotenbakken')
  if (activeFilters.subcategory) {
    filters.subcategory_slug = activeFilters.subcategory;
  }
  
  // Excavator weight filter (tonnage in kg) - send all selected ranges
  if (activeFilters.excavator_weight && activeFilters.excavator_weight.length > 0) {
    filters.excavator_weight_ranges = activeFilters.excavator_weight;
  }
  
  // Volume range filters
  if (activeFilters.volume_min) {
    filters.volume_min = activeFilters.volume_min;
  }
  if (activeFilters.volume_max && activeFilters.volume_max < 5000) {
    filters.volume_max = activeFilters.volume_max;
  }
  
  // Width filter
  if (activeFilters.width.length > 0) {
    filters.width = activeFilters.width[0]; // API accepts single value
  }
  
  // Attachment type filter
  if (activeFilters.attachment_type.length > 0) {
    filters.attachment_type = activeFilters.attachment_type[0];
  }
  
  // Brand filter
  if (activeFilters.brand.length > 0) {
    filters.brand_slug = activeFilters.brand; // Send as array
  }
  
  // Search filter
  if (activeFilters.search) {
    filters.search = activeFilters.search;
  }
  
  // Sort filter
  if (activeFilters.sort) {
    filters.sort = activeFilters.sort;
  }
  
  return filters;
}

/**
 * Clear all filters
 */
export function clearFilters() {
  activeFilters = {
    category: activeFilters.category, // Keep category
    subcategory: activeFilters.subcategory, // Keep subcategory
    volume_min: null,
    volume_max: null,
    excavator_weight: [], // Reset to empty array
    width: [],
    attachment_type: [],
    brand: [], // Reset brand filter
    search: null,
    sort: 'newest'
  };
  
  // Reset UI
  document.querySelectorAll('.filters input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  
  const volumeMin = document.getElementById('volume-min');
  const volumeMax = document.getElementById('volume-max');
  if (volumeMin) volumeMin.value = 0;
  if (volumeMax) volumeMax.value = 5000;
  updateRangeDisplay('volume');
  
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'newest';
  
  applyFilters();
}

/**
 * Update URL with current filters
 */
function updateUrl() {
  const params = new URLSearchParams();
  
  if (activeFilters.category) {
    params.set('cat', activeFilters.category);
  }
  if (activeFilters.search) {
    params.set('search', activeFilters.search);
  }
  if (activeFilters.sort && activeFilters.sort !== 'newest') {
    params.set('sort', activeFilters.sort);
  }
  
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
}

/**
 * Load brand filters from API
 */
async function loadBrandFilters() {
  const loadingEl = document.getElementById('brand-filters-loading');
  const containerEl = document.getElementById('brand-filters-container');
  
  if (!loadingEl || !containerEl) return;
  
  try {
    // Import brands API
    const { brands } = await import('./api/client.js');
    const data = await brands.getAll(true); // with count
    
    if (!data || !data.length) {
      loadingEl.style.display = 'none';
      containerEl.innerHTML = '<p class="filter-empty">Geen merken beschikbaar</p>';
      containerEl.style.display = 'block';
      return;
    }
    
    // Sort brands alphabetically
    const sortedBrands = data.sort((a, b) => a.name.localeCompare(b.name));
    
    // Generate checkboxes
    containerEl.innerHTML = sortedBrands.map(brand => `
      <label class="checkbox-label">
        <input type="checkbox" name="brand" value="${brand.slug}">
        <span>${brand.name}${brand.product_count ? ` (${brand.product_count})` : ''}</span>
      </label>
    `).join('');
    
    // Hide loading, show container
    loadingEl.style.display = 'none';
    containerEl.style.display = 'block';
    
    console.log('✅ Brand filters loaded:', sortedBrands.length);
  } catch (error) {
    console.error('Error loading brand filters:', error);
    loadingEl.style.display = 'none';
    containerEl.innerHTML = '<p class="filter-error">Kon merken niet laden</p>';
    containerEl.style.display = 'block';
  }
}

/**
 * Setup brand filter event listeners
 */
function setupBrandListeners() {
  const brandFilters = document.querySelectorAll('input[name="brand"]');
  brandFilters.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      updateCheckboxFilter('brand', e.target.value, e.target.checked);
    });
  });
}

/**
 * Close mobile filters
 */
function closeMobileFilters() {
  const filtersSidebar = document.getElementById('filters-sidebar');
  if (filtersSidebar) {
    filtersSidebar.classList.remove('is-open');
  }
}

/**
 * Filter products client-side (for already loaded data)
 */
export function filterProducts(products, filters) {
  return products.filter(product => {
    // Volume filter
    if (filters.volume_min && product.volume < filters.volume_min) {
      return false;
    }
    if (filters.volume_max && product.volume > filters.volume_max) {
      return false;
    }
    
    // Width filter
    if (filters.width && product.width !== filters.width) {
      return false;
    }
    
    // Attachment type filter
    if (filters.attachment_type && product.attachment_type !== filters.attachment_type) {
      return false;
    }
    
    // Excavator weight filter - check if product falls within ANY selected range
    // NOTE: Product data stores excavator_weight_min/max in TONS (e.g., 1.5, 3.0, 8.0)
    // Checkbox values are in kg (1500, 4000, 12000, etc.) - we define ranges in TONS
    if (filters.excavator_weight_ranges && filters.excavator_weight_ranges.length > 0) {
      const matchesAnyRange = filters.excavator_weight_ranges.some(rangeValue => {
        // rangeValue is checkbox value in kg - define filter ranges in TONS to match product data
        let minTon, maxTon;
        if (rangeValue === 1500) { minTon = 1.5; maxTon = 3; }      // 1.5-3 ton
        else if (rangeValue === 4000) { minTon = 3; maxTon = 8; }   // 3-8 ton
        else if (rangeValue === 12000) { minTon = 8; maxTon = 15; } // 8-15 ton
        else if (rangeValue === 20000) { minTon = 15; maxTon = 25; } // 15-25 ton
        else if (rangeValue === 30000) { minTon = 25; maxTon = 50; } // 25-50 ton
        else return false;
        
        // Product values are in tons - check if product's weight range overlaps with filter range
        const productMin = parseFloat(product.excavator_weight_min) || 0;
        const productMax = parseFloat(product.excavator_weight_max) || 0;
        
        // Check overlap: product range [productMin, productMax] overlaps with filter range [minTon, maxTon]
        return productMin <= maxTon && productMax >= minTon;
      });
      
      if (!matchesAnyRange) {
        return false;
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = product.title.toLowerCase().includes(searchLower);
      const descMatch = product.description?.toLowerCase().includes(searchLower);
      if (!titleMatch && !descMatch) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Sort products
 */
export function sortProducts(products, sortBy) {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'title_asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'title_desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case 'newest':
    default:
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
  }
  
  return sorted;
}
