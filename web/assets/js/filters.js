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
  
  // Inject improved range slider styles
  injectRangeSliderStyles();
  
  // Inject range slider HTML structure
  injectRangeSliderHTML();
  
  // Inject active filters display
  injectActiveFiltersDisplay();
  
  // Setup event listeners
  setupFilterListeners();
  
  // Initialize slider visual state
  updateRangeDisplay('volume');
  
  // Apply initial filters
  applyFilters();
}

/**
 * Inject HTML structure for range slider track
 */
function injectRangeSliderHTML() {
  const container = document.querySelector('.range-slider');
  if (!container) return;
  
  // Check if track already exists
  if (container.querySelector('.range-slider-track')) return;
  
  // Create track elements
  const track = document.createElement('div');
  track.className = 'range-slider-track';
  
  const fill = document.createElement('div');
  fill.className = 'range-track-fill';
  
  track.appendChild(fill);
  
  // Insert track before the input elements (visually behind them via z-index/positioning)
  // The inputs are absolute, track is relative. 
  // We want track to be in the flow to give height, but inputs are absolute.
  // Actually, let's put track first so it's behind inputs in DOM order if z-index fails, 
  // but we control z-index in CSS.
  // Ideally track determines height.
  container.insertBefore(track, container.firstChild);
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
  
  // Tonnage filter (from navigation menu) - convert to excavator_weight_ranges
  if (params.has('tonnage')) {
    const tonnage = params.get('tonnage');
    const weight = parseTonnageToWeight(tonnage);
    if (weight) {
      activeFilters.excavator_weight_ranges = [weight];
    }
  }
  
  // Brand filter (from brand pages link)
  if (params.has('brand')) {
    const brandParam = params.get('brand');
    if (brandParam) {
      activeFilters.brand = [brandParam];
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
      let val = parseInt(e.target.value);
      const maxVal = parseInt(volumeMax.value);
      
      // Prevent crossing
      if (val > maxVal) {
        val = maxVal;
        e.target.value = val;
      }
      
      activeFilters.volume_min = val;
      updateRangeDisplay('volume');
    });
    
    volumeMax.addEventListener('input', (e) => {
      let val = parseInt(e.target.value);
      const minVal = parseInt(volumeMin.value);
      
      // Prevent crossing
      if (val < minVal) {
        val = minVal;
        e.target.value = val;
      }
      
      activeFilters.volume_max = val;
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
  const filtersOverlay = document.getElementById('filters-overlay');
  
  if (toggleBtn && filtersSidebar) {
    toggleBtn.addEventListener('click', () => {
      const isOpening = !filtersSidebar.classList.contains('is-open');
      filtersSidebar.classList.toggle('is-open');
      if (filtersOverlay) {
        filtersOverlay.classList.toggle('is-open');
      }
      // Block body scroll when filters open on mobile only
      if (window.innerWidth <= 1024) {
        document.body.style.overflow = isOpening ? 'hidden' : '';
      }
    });
  }
  
  // Overlay click to close
  if (filtersOverlay) {
    filtersOverlay.addEventListener('click', closeMobileFilters);
  }
  
  // Close button for mobile filters
  const mobileCloseBtn = document.getElementById('mobile-filters-close');
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileFilters);
  }
  
  // Swipe down to close on mobile
  if (filtersSidebar && window.innerWidth <= 1024) {
    setupSwipeToClose(filtersSidebar, closeMobileFilters);
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
    const minSlider = document.getElementById('volume-min');
    const maxSlider = document.getElementById('volume-max');
    
    if (minDisplay) minDisplay.textContent = `${activeFilters.volume_min || 0}L`;
    if (maxDisplay) maxDisplay.textContent = `${activeFilters.volume_max || 5000}L`;
    
    // Update slider visual feedback
    if (minSlider && maxSlider) {
      const min = parseInt(minSlider.value);
      const max = parseInt(maxSlider.value);
      const minPercent = (min / 5000) * 100;
      const maxPercent = (max / 5000) * 100;
      
      // Update track fill
      const track = minSlider.parentElement.querySelector('.range-track-fill');
      if (track) {
        track.style.left = `${minPercent}%`;
        track.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }
}

/**
 * Inject improved range slider styles
 */
function injectRangeSliderStyles() {
  if (document.getElementById('range-slider-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'range-slider-styles';
  style.textContent = `
    .range-slider {
      position: relative;
      padding: 30px 0 10px;
      height: 40px;
    }
    .range-slider-track {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 10px;
      right: 10px;
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
    }
    .range-track-fill {
      position: absolute;
      height: 100%;
      background: #236773;
      border-radius: 3px;
      pointer-events: none;
      z-index: 1;
    }
    .range-slider input[type="range"] {
      position: absolute;
      width: calc(100% - 20px);
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      pointer-events: none;
      z-index: 2;
      margin: 0;
      height: 0; /* Minimize height to avoid layout issues */
    }
    /* Webkit Thumb */
    .range-slider input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      background: #fff;
      border: 2px solid #236773;
      border-radius: 50%;
      cursor: pointer;
      pointer-events: auto;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      transition: transform 0.1s ease, box-shadow 0.1s ease;
      margin-top: -12px; /* Center thumb: -width/2 */
    }
    .range-slider input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(35, 103, 115, 0.2);
    }
    /* Firefox Thumb */
    .range-slider input[type="range"]::-moz-range-thumb {
      width: 24px;
      height: 24px;
      background: #fff;
      border: 2px solid #236773;
      border-radius: 50%;
      cursor: pointer;
      pointer-events: auto;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      transition: transform 0.1s ease, box-shadow 0.1s ease;
      border: none; /* Reset default border */
    }
    .range-slider input[type="range"]::-moz-range-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(35, 103, 115, 0.2);
    }
    
    .range-values {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      font-size: 14px;
      font-weight: 600;
      color: #236773;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Apply filters and trigger callback
 */
function applyFilters() {
  if (onFilterChange) {
    onFilterChange(getActiveFilters());
  }
  
  // Update active filters display
  updateActiveFiltersDisplay();
  
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
  if (activeFilters.brand && activeFilters.brand.length > 0) {
    params.set('brand', activeFilters.brand[0]);
  }
  if (activeFilters.sort && activeFilters.sort !== 'newest') {
    params.set('sort', activeFilters.sort);
  }
  
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
}

// Fallback brands when API is unavailable
const FALLBACK_BRANDS = [
  { name: 'Caterpillar', slug: 'caterpillar' },
  { name: 'Case', slug: 'case' },
  { name: 'Develon', slug: 'develon' },
  { name: 'Hitachi', slug: 'hitachi' },
  { name: 'Hyundai', slug: 'hyundai' },
  { name: 'JCB', slug: 'jcb' },
  { name: 'Kobelco', slug: 'kobelco' },
  { name: 'Komatsu', slug: 'komatsu' },
  { name: 'Kubota', slug: 'kubota' },
  { name: 'Liebherr', slug: 'liebherr' },
  { name: 'Sany', slug: 'sany' },
  { name: 'Takeuchi', slug: 'takeuchi' },
  { name: 'Volvo', slug: 'volvo' },
  { name: 'Wacker Neuson', slug: 'wacker-neuson' },
  { name: 'Yanmar', slug: 'yanmar' }
];

/**
 * Load brand filters from API with fallback
 */
async function loadBrandFilters() {
  const loadingEl = document.getElementById('brand-filters-loading');
  const containerEl = document.getElementById('brand-filters-container');
  
  if (!loadingEl || !containerEl) return;
  
  let brandsToShow = [];
  
  try {
    // Import brands API with short timeout
    const { brands } = await import('./api/client.js');
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 3000)
    );
    
    const data = await Promise.race([
      brands.getAll(true),
      timeoutPromise
    ]);
    
    if (data && data.length > 0) {
      brandsToShow = data;
      console.log('✅ Brand filters loaded from API:', brandsToShow.length);
    }
  } catch (error) {
    console.warn('⚠️ API unavailable, using fallback brands:', error.message);
  }
  
  // Use fallback brands if API returned nothing
  if (brandsToShow.length === 0) {
    brandsToShow = FALLBACK_BRANDS;
    console.log('📦 Using fallback brands');
  }
  
  // Sort brands alphabetically
  const sortedBrands = brandsToShow.sort((a, b) => a.name.localeCompare(b.name));
  
  // Generate scrollable select with search
  containerEl.innerHTML = `
    <div class="brand-select-wrapper">
      <input 
        type="text" 
        id="brand-search" 
        class="brand-search-input" 
        placeholder="Zoek merk..."
        autocomplete="off"
      />
      <div class="brand-select-dropdown" id="brand-select-dropdown">
        ${sortedBrands.map(brand => `
          <label class="brand-option">
            <input type="checkbox" name="brand" value="${brand.slug}" class="brand-checkbox">
            <span class="brand-name">${brand.name}</span>
            ${brand.product_count ? `<span class="brand-count">(${brand.product_count})</span>` : ''}
          </label>
        `).join('')}
      </div>
    </div>
  `;
  
  // Inject CSS for brand select
  injectBrandSelectStyles();
  
  // Hide loading, show container
  loadingEl.style.display = 'none';
  containerEl.style.display = 'block';
  
  // Setup search functionality
  setupBrandSearch();
  
  // Pre-select brand checkboxes from URL params
  if (activeFilters.brand && activeFilters.brand.length > 0) {
    activeFilters.brand.forEach(brandSlug => {
      const checkbox = containerEl.querySelector(`input[value="${brandSlug}"]`);
      if (checkbox) {
        checkbox.checked = true;
        console.log(`✅ Brand pre-selected from URL: ${brandSlug}`);
      }
    });
  }
  
  console.log('✅ Brand filters ready:', sortedBrands.length);
}

/**
 * Inject CSS styles for brand select dropdown
 */
function injectBrandSelectStyles() {
  if (document.getElementById('brand-select-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'brand-select-styles';
  style.textContent = `
    .brand-select-wrapper {
      position: relative;
    }
    .brand-search-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s ease;
      background: #fff;
    }
    .brand-search-input:focus {
      outline: none;
      border-color: #236773;
      box-shadow: 0 0 0 3px rgba(35, 103, 115, 0.1);
    }
    .brand-select-dropdown {
      margin-top: 8px;
      max-height: 280px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fff;
      padding: 4px;
    }
    .brand-select-dropdown::-webkit-scrollbar {
      width: 8px;
    }
    .brand-select-dropdown::-webkit-scrollbar-track {
      background: #f9fafb;
      border-radius: 4px;
    }
    .brand-select-dropdown::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
    }
    .brand-select-dropdown::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
    .brand-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s ease;
      font-size: 14px;
    }
    .brand-option:hover {
      background: #f9fafb;
    }
    .brand-option.hidden {
      display: none;
    }
    .brand-checkbox {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .brand-name {
      flex: 1;
      color: #374151;
      font-weight: 500;
    }
    .brand-count {
      color: #9ca3af;
      font-size: 13px;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Setup brand search functionality
 */
function setupBrandSearch() {
  const searchInput = document.getElementById('brand-search');
  const dropdown = document.getElementById('brand-select-dropdown');
  
  if (!searchInput || !dropdown) return;
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const options = dropdown.querySelectorAll('.brand-option');
    
    options.forEach(option => {
      const brandName = option.querySelector('.brand-name').textContent.toLowerCase();
      if (brandName.includes(searchTerm)) {
        option.classList.remove('hidden');
      } else {
        option.classList.add('hidden');
      }
    });
  });
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
 * Inject active filters display HTML
 */
function injectActiveFiltersDisplay() {
  const brandFilterGroup = document.querySelector('.filter-group');
  if (!brandFilterGroup) return;
  
  // Check if already exists
  if (document.getElementById('active-filters-display')) return;
  
  const activeFiltersHTML = `
    <div id="active-filters-display" class="active-filters-display">
      <div class="active-filters-header">
        <span class="active-filters-title">Actieve filters</span>
        <button class="active-filters-clear-all" id="active-filters-clear-all" style="display: none;">Alles wissen</button>
      </div>
      <div id="active-filters-tags" class="active-filters-tags"></div>
    </div>
  `;
  
  brandFilterGroup.insertAdjacentHTML('beforebegin', activeFiltersHTML);
  
  // Inject styles
  injectActiveFiltersStyles();
  
  // Setup clear all handler
  const clearAllBtn = document.getElementById('active-filters-clear-all');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearFilters);
  }
}

/**
 * Inject active filters styles
 */
function injectActiveFiltersStyles() {
  if (document.getElementById('active-filters-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'active-filters-styles';
  style.textContent = `
    .active-filters-display {
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .active-filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .active-filters-title {
      font-size: 13px;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .active-filters-clear-all {
      background: none;
      border: none;
      color: #236773;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.15s ease;
    }
    .active-filters-clear-all:hover {
      background: #e5e7eb;
    }
    .active-filters-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .active-filter-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 13px;
      color: #374151;
      transition: all 0.15s ease;
    }
    .active-filter-tag:hover {
      border-color: #236773;
      background: #f0f9fa;
    }
    .active-filter-tag-label {
      font-weight: 500;
    }
    .active-filter-tag-remove {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      background: #e5e7eb;
      border-radius: 50%;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .active-filter-tag-remove:hover {
      background: #236773;
    }
    .active-filter-tag-remove svg {
      width: 10px;
      height: 10px;
      stroke: #6b7280;
      transition: stroke 0.15s ease;
    }
    .active-filter-tag-remove:hover svg {
      stroke: #fff;
    }
    .active-filters-empty {
      font-size: 13px;
      color: #9ca3af;
      font-style: italic;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Update active filters display
 */
function updateActiveFiltersDisplay() {
  const tagsContainer = document.getElementById('active-filters-tags');
  const clearAllBtn = document.getElementById('active-filters-clear-all');
  if (!tagsContainer) return;
  
  const tags = [];
  
  // Volume filters
  if (activeFilters.volume_min && activeFilters.volume_min > 0) {
    tags.push({
      type: 'volume_min',
      label: `Min: ${activeFilters.volume_min}L`,
      value: activeFilters.volume_min
    });
  }
  if (activeFilters.volume_max && activeFilters.volume_max < 5000) {
    tags.push({
      type: 'volume_max',
      label: `Max: ${activeFilters.volume_max}L`,
      value: activeFilters.volume_max
    });
  }
  
  // Excavator weight filters
  activeFilters.excavator_weight.forEach(weight => {
    let label = '';
    if (weight === 1500) label = '1-3 ton';
    else if (weight === 4000) label = '3-8 ton';
    else if (weight === 12000) label = '8-15 ton';
    else if (weight === 20000) label = '15-25 ton';
    else if (weight === 30000) label = '25-50 ton';
    
    if (label) {
      tags.push({
        type: 'excavator_weight',
        label: label,
        value: weight
      });
    }
  });
  
  // Width filters
  activeFilters.width.forEach(width => {
    tags.push({
      type: 'width',
      label: `Breedte: ${width}mm`,
      value: width
    });
  });
  
  // Attachment type filters
  activeFilters.attachment_type.forEach(type => {
    tags.push({
      type: 'attachment_type',
      label: type,
      value: type
    });
  });
  
  // Brand filters
  activeFilters.brand.forEach(brand => {
    // Capitalize first letter
    const brandLabel = brand.charAt(0).toUpperCase() + brand.slice(1);
    tags.push({
      type: 'brand',
      label: brandLabel,
      value: brand
    });
  });
  
  // Render tags
  if (tags.length === 0) {
    tagsContainer.innerHTML = '<span class="active-filters-empty">Geen actieve filters</span>';
    if (clearAllBtn) clearAllBtn.style.display = 'none';
  } else {
    tagsContainer.innerHTML = tags.map(tag => `
      <div class="active-filter-tag" data-filter-type="${tag.type}" data-filter-value="${tag.value}">
        <span class="active-filter-tag-label">${tag.label}</span>
        <div class="active-filter-tag-remove">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      </div>
    `).join('');
    
    if (clearAllBtn) clearAllBtn.style.display = 'block';
    
    // Add click handlers to remove buttons
    tagsContainer.querySelectorAll('.active-filter-tag-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tag = e.target.closest('.active-filter-tag');
        const filterType = tag.dataset.filterType;
        const filterValue = tag.dataset.filterValue;
        removeFilter(filterType, filterValue);
      });
    });
  }
}

/**
 * Remove a specific filter
 */
function removeFilter(type, value) {
  if (type === 'volume_min') {
    activeFilters.volume_min = null;
    const slider = document.getElementById('volume-min');
    if (slider) slider.value = 0;
    updateRangeDisplay('volume');
  } else if (type === 'volume_max') {
    activeFilters.volume_max = null;
    const slider = document.getElementById('volume-max');
    if (slider) slider.value = 5000;
    updateRangeDisplay('volume');
  } else if (type === 'excavator_weight') {
    const numValue = parseInt(value);
    activeFilters.excavator_weight = activeFilters.excavator_weight.filter(v => v !== numValue);
    // Uncheck the checkbox
    const checkbox = document.querySelector(`input[name="excavator"][value="${value}"]`);
    if (checkbox) checkbox.checked = false;
  } else if (type === 'width') {
    const numValue = parseInt(value);
    activeFilters.width = activeFilters.width.filter(v => v !== numValue);
    const checkbox = document.querySelector(`input[name="width"][value="${value}"]`);
    if (checkbox) checkbox.checked = false;
  } else if (type === 'attachment_type') {
    activeFilters.attachment_type = activeFilters.attachment_type.filter(v => v !== value);
    const checkbox = document.querySelector(`input[name="attachment"][value="${value}"]`);
    if (checkbox) checkbox.checked = false;
  } else if (type === 'brand') {
    activeFilters.brand = activeFilters.brand.filter(v => v !== value);
    const checkbox = document.querySelector(`input[name="brand"][value="${value}"]`);
    if (checkbox) checkbox.checked = false;
  }
  
  applyFilters();
}

/**
 * Close mobile filters
 */
function closeMobileFilters() {
  const filtersSidebar = document.getElementById('filters-sidebar');
  const filtersOverlay = document.getElementById('filters-overlay');
  
  if (filtersSidebar) {
    filtersSidebar.classList.remove('is-open');
  }
  if (filtersOverlay) {
    filtersOverlay.classList.remove('is-open');
  }
  // Restore body scroll on mobile only
  if (window.innerWidth <= 1024) {
    document.body.style.overflow = '';
  }
}

/**
 * Setup swipe down to close functionality
 */
function setupSwipeToClose(element, closeCallback) {
  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  let startTime = 0;
  
  const handleStart = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    const rect = element.getBoundingClientRect();
    
    // Only start drag if touching near the top (handle area)
    if (touch.clientY - rect.top > 60) return;
    
    startY = touch.clientY;
    currentY = startY;
    isDragging = true;
    startTime = Date.now();
    element.classList.add('dragging');
    element.style.transition = 'none';
  };
  
  const handleMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches ? e.touches[0] : e;
    currentY = touch.clientY;
    const deltaY = currentY - startY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      element.style.transform = `translateY(${deltaY}px)`;
    }
  };
  
  const handleEnd = () => {
    if (!isDragging) return;
    
    const deltaY = currentY - startY;
    const deltaTime = Date.now() - startTime;
    const velocity = deltaY / deltaTime;
    
    element.classList.remove('dragging');
    element.style.transition = '';
    element.style.transform = '';
    
    // Close if dragged down more than 100px or fast swipe
    if (deltaY > 100 || velocity > 0.5) {
      closeCallback();
    }
    
    isDragging = false;
  };
  
  // Touch events
  element.addEventListener('touchstart', handleStart, { passive: true });
  element.addEventListener('touchmove', handleMove, { passive: true });
  element.addEventListener('touchend', handleEnd);
  
  // Mouse events for desktop testing
  element.addEventListener('mousedown', handleStart);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);
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
