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
  
  // Tonnage filter (from navigation menu) - convert to excavator_weight_ranges
  if (params.has('tonnage')) {
    const tonnage = params.get('tonnage');
    const weight = parseTonnageToWeight(tonnage);
    if (weight) {
      activeFilters.excavator_weight_ranges = [weight];
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
      padding: 20px 0;
    }
    .range-slider-track {
      position: relative;
      height: 8px;
      background: #d1d5db;
      border: 2px solid #9ca3af;
      border-radius: 4px;
      margin: 0 8px;
    }
    .range-track-fill {
      position: absolute;
      height: 100%;
      background: #236773;
      border-radius: 2px;
      pointer-events: none;
      transition: all 0.15s ease;
    }
    .range-slider input[type="range"] {
      position: absolute;
      width: calc(100% - 16px);
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      pointer-events: none;
      z-index: 2;
    }
    .range-slider input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      background: #fff;
      border: 3px solid #236773;
      border-radius: 50%;
      cursor: pointer;
      pointer-events: all;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
    }
    .range-slider input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.15);
      box-shadow: 0 4px 12px rgba(35, 103, 115, 0.4);
      border-width: 4px;
    }
    .range-slider input[type="range"]::-webkit-slider-thumb:active {
      transform: scale(1.1);
      border-width: 4px;
      background: #f0f9ff;
    }
    .range-slider input[type="range"]::-moz-range-thumb {
      width: 22px;
      height: 22px;
      background: #fff;
      border: 3px solid #236773;
      border-radius: 50%;
      cursor: pointer;
      pointer-events: all;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
    }
    .range-slider input[type="range"]::-moz-range-thumb:hover {
      transform: scale(1.15);
      box-shadow: 0 4px 12px rgba(35, 103, 115, 0.4);
      border-width: 4px;
    }
    .range-slider input[type="range"]::-moz-range-thumb:active {
      transform: scale(1.1);
      border-width: 4px;
      background: #f0f9ff;
    }
    .range-values {
      display: flex;
      justify-content: space-between;
      margin-top: 12px;
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
