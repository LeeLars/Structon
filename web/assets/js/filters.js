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
  
  // Parse URL params
  parseUrlParams();
  
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
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  
  // Category filter
  if (params.has('cat')) {
    activeFilters.category = params.get('cat');
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
 * Convert tonnage ID to excavator weight value (in TONS, matching database)
 * Examples: '1t-2-5t' -> 1.75, '5t-10t' -> 7.5
 * Database stores values in tons (e.g., 3.00, 8.00)
 */
function parseTonnageToWeight(tonnageId) {
  // Extract numbers from tonnage ID
  // Format: '1t-2-5t' means 1 to 2.5 ton
  // Format: '5t-10t' means 5 to 10 ton
  // Format: '25t-plus' means 25+ ton
  
  if (tonnageId === '25t-plus') {
    return 25; // 25 ton and up (in tons)
  }
  
  // Extract first number (minimum weight)
  const match = tonnageId.match(/^(\d+)t/);
  if (match) {
    const minTon = parseInt(match[1]);
    
    // Check if there's a decimal part (e.g., '2-5' means 2.5)
    const decimalMatch = tonnageId.match(/(\d+)t-(\d+)-(\d+)t/);
    if (decimalMatch) {
      // e.g., '1t-2-5t' -> use middle value 1.75 ton
      const maxTon = parseFloat(`${decimalMatch[2]}.${decimalMatch[3]}`);
      return (minTon + maxTon) / 2; // Return in tons
    }
    
    // Check for range (e.g., '5t-10t')
    const rangeMatch = tonnageId.match(/(\d+)t-(\d+)t/);
    if (rangeMatch) {
      const maxTon = parseInt(rangeMatch[2]);
      return (minTon + maxTon) / 2; // Use middle value in tons
    }
    
    // Single value
    return minTon; // Return in tons
  }
  
  return null;
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

  // Excavator class checkboxes (values are in tons as floats)
  const excavatorFilters = document.querySelectorAll('input[name="excavator"]');
  excavatorFilters.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      updateCheckboxFilter('excavator_weight', parseFloat(e.target.value), e.target.checked);
    });
  });

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
    if (filters.excavator_weight_ranges && filters.excavator_weight_ranges.length > 0) {
      const matchesAnyRange = filters.excavator_weight_ranges.some(rangeValue => {
        // rangeValue is midpoint in kg (e.g., 4000 for 3-8 ton range)
        // Define ranges based on checkbox values
        let min, max;
        if (rangeValue === 1500) { min = 1500; max = 3000; }      // 1.5-3 ton
        else if (rangeValue === 4000) { min = 3000; max = 8000; } // 3-8 ton
        else if (rangeValue === 12000) { min = 8000; max = 15000; } // 8-15 ton
        else if (rangeValue === 20000) { min = 15000; max = 25000; } // 15-25 ton
        else if (rangeValue === 30000) { min = 25000; max = 50000; } // 25-50 ton
        
        // Check if product's weight range overlaps with filter range
        return product.excavator_weight_min <= max && product.excavator_weight_max >= min;
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
