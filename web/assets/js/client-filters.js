/**
 * Client-side Product Filters
 * Filters products that are already rendered in the DOM using data attributes
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', initClientFilters);

  function initClientFilters() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    // Get all product cards
    const productCards = productsGrid.querySelectorAll('.product-card-horizontal, .product-card');
    if (productCards.length === 0) return;

    console.log('🔧 Client filters initialized for', productCards.length, 'products');

    // Setup filter listeners
    setupVolumeFilters();
    setupCheckboxFilters();
    setupSortFilter();
    setupClearButton();
    setupMobileToggle();

    // Update initial count
    updateProductCount();
  }

  /**
   * Apply all filters and show/hide products
   */
  function applyFilters() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    const productCards = productsGrid.querySelectorAll('.product-card-horizontal, .product-card');
    
    // Get filter values
    const filters = getFilterValues();
    
    let visibleCount = 0;

    productCards.forEach(card => {
      const visible = matchesFilters(card, filters);
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });

    // Update count
    updateProductCount(visibleCount);

    // Apply sorting
    applySorting();

    console.log('🔍 Filters applied:', filters, '- Visible:', visibleCount);
  }

  /**
   * Get current filter values from UI
   */
  function getFilterValues() {
    const filters = {
      volumeMin: 0,
      volumeMax: 5000,
      widths: [],
      attachments: [],
      excavatorRanges: [],
      brands: []
    };

    // Volume range
    const volumeMin = document.getElementById('volume-min');
    const volumeMax = document.getElementById('volume-max');
    if (volumeMin) filters.volumeMin = parseInt(volumeMin.value) || 0;
    if (volumeMax) filters.volumeMax = parseInt(volumeMax.value) || 5000;

    // Width checkboxes
    document.querySelectorAll('input[name="width"]:checked').forEach(cb => {
      filters.widths.push(parseInt(cb.value));
    });

    // Attachment checkboxes
    document.querySelectorAll('input[name="attachment"]:checked').forEach(cb => {
      filters.attachments.push(cb.value);
    });

    // Excavator class checkboxes
    document.querySelectorAll('input[name="excavator"]:checked').forEach(cb => {
      filters.excavatorRanges.push(parseInt(cb.value));
    });

    // Brand checkboxes
    document.querySelectorAll('input[name="brand"]:checked').forEach(cb => {
      filters.brands.push(cb.value);
    });

    return filters;
  }

  /**
   * Check if a product card matches the current filters
   */
  function matchesFilters(card, filters) {
    // Volume filter
    const volume = parseFloat(card.dataset.volume) || 0;
    if (filters.volumeMin > 0 && volume < filters.volumeMin) return false;
    if (filters.volumeMax < 5000 && volume > filters.volumeMax) return false;

    // Width filter (match any selected)
    if (filters.widths.length > 0) {
      const width = parseInt(card.dataset.width) || 0;
      if (!filters.widths.includes(width)) return false;
    }

    // Attachment filter (match any selected)
    if (filters.attachments.length > 0) {
      const attachment = card.dataset.attachment || '';
      if (!filters.attachments.includes(attachment)) return false;
    }

    // Excavator class filter (match any selected range)
    if (filters.excavatorRanges.length > 0) {
      const excavatorMin = parseFloat(card.dataset.excavatorMin) || 0;
      const excavatorMax = parseFloat(card.dataset.excavatorMax) || 0;
      
      const matchesAnyRange = filters.excavatorRanges.some(rangeValue => {
        // Define ranges based on checkbox values (in kg)
        let min, max;
        if (rangeValue === 1500) { min = 1.5; max = 3; }      // 1.5-3 ton
        else if (rangeValue === 4000) { min = 3; max = 8; }   // 3-8 ton
        else if (rangeValue === 12000) { min = 8; max = 15; } // 8-15 ton
        else if (rangeValue === 20000) { min = 15; max = 25; } // 15-25 ton
        else if (rangeValue === 30000) { min = 25; max = 50; } // 25-50 ton
        else return false;
        
        // Check if product's weight range overlaps with filter range
        return excavatorMin <= max && excavatorMax >= min;
      });
      
      if (!matchesAnyRange) return false;
    }

    // Brand filter (match any selected)
    if (filters.brands.length > 0) {
      const brand = card.dataset.brand || '';
      if (!filters.brands.includes(brand)) return false;
    }

    return true;
  }

  /**
   * Setup volume range sliders
   */
  function setupVolumeFilters() {
    const volumeMin = document.getElementById('volume-min');
    const volumeMax = document.getElementById('volume-max');
    const minDisplay = document.getElementById('volume-min-value');
    const maxDisplay = document.getElementById('volume-max-value');

    if (volumeMin) {
      volumeMin.addEventListener('input', () => {
        if (minDisplay) minDisplay.textContent = volumeMin.value + 'L';
      });
      volumeMin.addEventListener('change', applyFilters);
    }

    if (volumeMax) {
      volumeMax.addEventListener('input', () => {
        if (maxDisplay) maxDisplay.textContent = volumeMax.value + 'L';
      });
      volumeMax.addEventListener('change', applyFilters);
    }
  }

  /**
   * Setup checkbox filters
   */
  function setupCheckboxFilters() {
    const checkboxes = document.querySelectorAll(
      'input[name="width"], input[name="attachment"], input[name="excavator"], input[name="brand"]'
    );

    checkboxes.forEach(cb => {
      cb.addEventListener('change', applyFilters);
    });

    // Also observe for dynamically added brand checkboxes
    const brandContainer = document.getElementById('brand-filters-container');
    if (brandContainer) {
      const observer = new MutationObserver(() => {
        document.querySelectorAll('input[name="brand"]').forEach(cb => {
          cb.removeEventListener('change', applyFilters);
          cb.addEventListener('change', applyFilters);
        });
      });
      observer.observe(brandContainer, { childList: true, subtree: true });
    }
  }

  /**
   * Setup sort filter
   */
  function setupSortFilter() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', applySorting);
    }
  }

  /**
   * Apply sorting to visible products
   */
  function applySorting() {
    const productsGrid = document.getElementById('products-grid');
    const sortSelect = document.getElementById('sort-select');
    if (!productsGrid || !sortSelect) return;

    const sortBy = sortSelect.value;
    const cards = Array.from(productsGrid.querySelectorAll('.product-card-horizontal, .product-card'));
    
    cards.sort((a, b) => {
      const titleA = a.querySelector('.product-title')?.textContent?.trim() || '';
      const titleB = b.querySelector('.product-title')?.textContent?.trim() || '';
      
      switch (sortBy) {
        case 'title_asc':
          return titleA.localeCompare(titleB);
        case 'title_desc':
          return titleB.localeCompare(titleA);
        case 'oldest':
        case 'newest':
        default:
          // Keep original order for date sorting (would need data-created attribute)
          return 0;
      }
    });

    // Re-append in sorted order
    cards.forEach(card => productsGrid.appendChild(card));
  }

  /**
   * Setup clear filters button
   */
  function setupClearButton() {
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        // Reset volume sliders
        const volumeMin = document.getElementById('volume-min');
        const volumeMax = document.getElementById('volume-max');
        if (volumeMin) volumeMin.value = 0;
        if (volumeMax) volumeMax.value = 5000;
        
        // Update displays
        const minDisplay = document.getElementById('volume-min-value');
        const maxDisplay = document.getElementById('volume-max-value');
        if (minDisplay) minDisplay.textContent = '0L';
        if (maxDisplay) maxDisplay.textContent = '5000L';

        // Uncheck all checkboxes
        document.querySelectorAll(
          'input[name="width"], input[name="attachment"], input[name="excavator"], input[name="brand"]'
        ).forEach(cb => cb.checked = false);

        // Reset sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = 'newest';

        // Apply filters (show all)
        applyFilters();
      });
    }
  }

  /**
   * Setup mobile filter toggle
   */
  function setupMobileToggle() {
    const toggleBtn = document.getElementById('toggle-filters');
    const sidebar = document.getElementById('filters-sidebar');
    
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
      });
    }

    // Apply filters button (mobile)
    const applyBtn = document.getElementById('apply-filters');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        applyFilters();
        if (sidebar) sidebar.classList.remove('is-open');
      });
    }
  }

  /**
   * Update product count display
   */
  function updateProductCount(count) {
    const countEl = document.getElementById('products-count');
    if (!countEl) return;

    if (count === undefined) {
      // Count visible products
      const productsGrid = document.getElementById('products-grid');
      if (productsGrid) {
        const visibleCards = productsGrid.querySelectorAll(
          '.product-card-horizontal:not([style*="display: none"]), .product-card:not([style*="display: none"])'
        );
        count = visibleCards.length;
      }
    }

    countEl.textContent = count;
  }

})();
