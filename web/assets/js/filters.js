/**
 * Structon Filters Module
 * Client-side filtering for product listings
 */

/**
 * Filter state
 */
let activeFilters = {
  category: null,
  volume_min: null,
  volume_max: null,
  excavator_weight: [],
  width: [],
  attachment_type: [],
  search: null,
  sort: 'newest'
};

let onFilterChange = null;

/**
 * Initialize filters
 */
export function initFilters(callback) {
  onFilterChange = callback;
  
  // Parse URL params
  parseUrlParams();
  
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
  
  if (params.has('cat')) {
    activeFilters.category = params.get('cat');
  }
  if (params.has('search')) {
    activeFilters.search = params.get('search');
  }
  if (params.has('sort')) {
    activeFilters.sort = params.get('sort');
  }
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

  // Excavator class checkboxes
  const excavatorFilters = document.querySelectorAll('input[name="excavator"]');
  excavatorFilters.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      updateCheckboxFilter('excavator_weight', e.target.value, e.target.checked);
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
  
  if (activeFilters.category) {
    filters.category = activeFilters.category;
  }
  if (activeFilters.volume_min) {
    filters.volume_min = activeFilters.volume_min;
  }
  if (activeFilters.volume_max && activeFilters.volume_max < 5000) {
    filters.volume_max = activeFilters.volume_max;
  }
  if (activeFilters.width.length > 0) {
    filters.width = activeFilters.width[0]; // API accepts single value
  }
  if (activeFilters.attachment_type.length > 0) {
    filters.attachment_type = activeFilters.attachment_type[0];
  }
  if (activeFilters.search) {
    filters.search = activeFilters.search;
  }
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
    volume_min: null,
    volume_max: null,
    excavator_weight: [],
    width: [],
    attachment_type: [],
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
    
    // Excavator weight filter
    if (filters.excavator_weight) {
      const [min, max] = filters.excavator_weight.split('-').map(Number);
      if (product.excavator_weight_max < min || product.excavator_weight_min > max) {
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
