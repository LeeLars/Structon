/**
 * Products Page JavaScript
 * Handles product CRUD, filters, bulk actions, and image uploads
 */

console.log('🚀 [PRODUCTS] Script loading...');

import auth from './auth-simple.js';

console.log('✅ [PRODUCTS] Auth module imported successfully');

// Tonnage options
const TONNAGE_OPTIONS = [
  { value: '1.5-3', label: '1.5 - 3 ton' },
  { value: '3-8', label: '3 - 8 ton' },
  { value: '8-15', label: '8 - 15 ton' },
  { value: '15-25', label: '15 - 25 ton' },
  { value: '25-40', label: '25 - 40 ton' },
  { value: '40+', label: '40+ ton' }
];

// State
let products = [];
let filteredProducts = [];
let categories = [];
let subcategories = [];
let brands = [];
let currentPage = 1;
let itemsPerPage = 20;
let selectedProducts = new Set();
let editingProductId = null;
let isPopulatingForm = false;

/**
 * Autosave status toggles in modal
 */
async function handleStatusToggleChange(field) {
  // Prevent autosave while form is being populated
  if (isPopulatingForm) return;

  // Only autosave when editing an existing product
  if (!editingProductId) return;

  const activeEl = document.getElementById('product-active');
  const featuredEl = document.getElementById('product-featured');
  if (!activeEl || !featuredEl) return;

  const patch = {
    is_active: !!activeEl.checked,
    is_featured: !!featuredEl.checked
  };

  try {
    console.log(`⚡ [PRODUCTS] Autosaving status for ${editingProductId}:`, patch);
    await auth.patch(`/admin/products/${editingProductId}`, patch);
    showToast('Status opgeslagen', 'success');

    // Update local cache & UI without forcing user to click save
    const idx = products.findIndex(p => p.id === editingProductId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...patch };
    }
    applyFilters();
    updateStats();
  } catch (error) {
    console.error('❌ [PRODUCTS] Failed to autosave status:', error);
    showToast('Fout bij status opslaan', 'error');
  }
}

// Initialize
console.log('📌 [PRODUCTS] Setting up DOMContentLoaded listener...');

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 [PRODUCTS] DOM loaded, starting initialization...');
  
  try {
    initializeData();
    console.log('✅ [PRODUCTS] initializeData() completed');
  } catch (error) {
    console.error('❌ [PRODUCTS] Error in initializeData():', error);
  }
  
  try {
    setupEventListeners();
    console.log('✅ [PRODUCTS] setupEventListeners() completed');
  } catch (error) {
    console.error('❌ [PRODUCTS] Error in setupEventListeners():', error);
  }
});

/**
 * Initialize data from CMS API
 */
async function initializeData() {
  console.log('📦 [PRODUCTS] initializeData starting...');
  console.log('   TONNAGE_OPTIONS available:', TONNAGE_OPTIONS.length);
  
  // Show loading state
  const tbody = document.getElementById('products-tbody');
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="10" class="loading-cell">Producten laden...</td></tr>';
  }
  
  // Load products, categories, subcategories and brands from API
  try {
    const [productsData, categoriesData, subcategoriesData, brandsData] = await Promise.all([
      auth.get('/admin/products'),
      auth.get('/categories'),
      auth.get('/subcategories'),
      auth.get('/brands')
    ]);
    
    products = productsData.products || [];
    filteredProducts = [...products];
    categories = categoriesData.categories || [];
    subcategories = subcategoriesData.subcategories || [];
    brands = brandsData.brands || [];
    
    console.log(`✅ Loaded ${products.length} products, ${categories.length} categories, ${subcategories.length} subcategories, ${brands.length} brands`);
    
    // Populate dropdowns
    populateCategoryDropdown();
    populateBrandCheckboxes();
  } catch (error) {
    console.error('❌ Error loading data from CMS:', error);
    products = [];
    filteredProducts = [];
    categories = [];
    subcategories = [];
    brands = [];
  }
  
  renderProducts();
  populateFilters();
  updateStats();
  console.log('   Initial render complete');
}

/**
 * Update statistics cards
 */
function updateStats() {
  const total = products.length;
  const active = products.filter(p => p.is_active).length;
  const lowStock = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length;
  const outOfStock = products.filter(p => p.stock_quantity === 0 || !p.stock_quantity).length;
  
  animateValue('stat-total', total);
  animateValue('stat-active', active);
  animateValue('stat-low-stock', lowStock);
  animateValue('stat-out-stock', outOfStock);
}

/**
 * Animate number value
 */
function animateValue(id, target) {
  const element = document.getElementById(id);
  if (!element) return;
  
  const duration = 800;
  const start = parseInt(element.textContent) || 0;
  const increment = (target - start) / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.round(current);
    }
  }, 16);
}

/**
 * Populate category dropdown
 */
function populateCategoryDropdown() {
  const categorySelect = document.getElementById('product-category');
  if (!categorySelect) return;
  
  categorySelect.innerHTML = '<option value="">Selecteer categorie</option>' +
    categories.map(cat => `<option value="${cat.id}">${escapeHtml(cat.title)}</option>`).join('');
}

/**
 * Populate subcategory dropdown based on selected category
 */
function populateSubcategoryDropdown(categoryId) {
  const subcategorySelect = document.getElementById('product-subcategory');
  if (!subcategorySelect) return;
  
  const filteredSubcats = categoryId 
    ? subcategories.filter(sc => sc.category_id === categoryId)
    : [];
  
  subcategorySelect.innerHTML = '<option value="">Selecteer subcategorie</option>' +
    filteredSubcats.map(sc => `<option value="${sc.id}">${escapeHtml(sc.title)}</option>`).join('');
}

/**
 * Populate brand checkboxes (multi-select with "alle merken" option)
 */
function populateBrandCheckboxes() {
  const container = document.getElementById('brand-checkboxes');
  if (!container) return;
  
  // Keep the "Alle merken" checkbox, add individual brand checkboxes
  const allCheckbox = container.querySelector('#brand-all');
  
  container.innerHTML = `
    <label class="checkbox-label checkbox-all">
      <input type="checkbox" id="brand-all" name="brand_all" value="all">
      <strong>Alle merken</strong>
    </label>
  ` + brands.map(brand => `
    <label class="checkbox-label">
      <input type="checkbox" name="brand_ids" value="${brand.id}">
      ${escapeHtml(brand.title)}
    </label>
  `).join('');
  
  // Setup "Alle merken" toggle behavior
  setupBrandAllToggle();
}

/**
 * Setup "Alle merken" checkbox toggle behavior
 */
function setupBrandAllToggle() {
  const allCheckbox = document.getElementById('brand-all');
  const brandCheckboxes = document.querySelectorAll('input[name="brand_ids"]');
  
  if (!allCheckbox) return;
  
  // When "Alle merken" is checked, uncheck all individual brands
  allCheckbox.addEventListener('change', () => {
    if (allCheckbox.checked) {
      brandCheckboxes.forEach(cb => cb.checked = false);
    }
  });
  
  // When any individual brand is checked, uncheck "Alle merken"
  brandCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        allCheckbox.checked = false;
      }
    });
  });
}

/**
 * Get selected brand IDs from checkboxes
 */
function getSelectedBrandIds() {
  const allCheckbox = document.getElementById('brand-all');
  if (allCheckbox && allCheckbox.checked) {
    return 'all'; // Return 'all' to indicate all brands
  }
  
  const brandCheckboxes = document.querySelectorAll('input[name="brand_ids"]:checked');
  return Array.from(brandCheckboxes).map(cb => cb.value);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  console.log('🔧 [PRODUCTS] Setting up event listeners...');
  
  // New product button
  const newProductBtn = document.getElementById('btn-new-product');
  console.log('   btn-new-product found:', !!newProductBtn);
  
  if (newProductBtn) {
    newProductBtn.addEventListener('click', () => {
      console.log('🆕 [PRODUCTS] New product button clicked!');
      openProductModal();
    });
  }
  
  // Search
  document.getElementById('search-products')?.addEventListener('input', handleSearch);
  
  // Filters
  document.getElementById('filter-status')?.addEventListener('change', applyFilters);
  
  // View toggles
  document.getElementById('view-grid')?.addEventListener('click', () => switchView('grid'));
  document.getElementById('view-list')?.addEventListener('click', () => switchView('list'));
  
  // Select all checkbox
  document.getElementById('select-all')?.addEventListener('change', handleSelectAll);
  
  // Bulk actions
  document.getElementById('bulk-activate')?.addEventListener('click', () => handleBulkAction('activate'));
  document.getElementById('bulk-deactivate')?.addEventListener('click', () => handleBulkAction('deactivate'));
  document.getElementById('bulk-delete')?.addEventListener('click', () => handleBulkAction('delete'));
  
  // Modal
  document.getElementById('close-modal')?.addEventListener('click', closeProductModal);
  document.getElementById('cancel-product')?.addEventListener('click', closeProductModal);
  document.getElementById('product-form')?.addEventListener('submit', handleProductSubmit);
  
  // Auto-generate slug
  document.getElementById('product-title')?.addEventListener('input', (e) => {
    const slug = generateSlug(e.target.value);
    document.getElementById('product-slug').value = slug;
  });
  
  // Category change - load subcategories
  document.getElementById('product-category')?.addEventListener('change', (e) => {
    populateSubcategoryDropdown(e.target.value);
  });

  // Status autosave (1 click = direct save)
  document.getElementById('product-active')?.addEventListener('change', () => {
    handleStatusToggleChange('is_active');
  });
  document.getElementById('product-featured')?.addEventListener('change', () => {
    handleStatusToggleChange('is_featured');
  });
  
  // Image upload
  const imageUploadArea = document.getElementById('image-upload-area');
  const imageInput = document.getElementById('image-input');
  
  imageUploadArea?.addEventListener('click', () => imageInput.click());
  imageInput?.addEventListener('change', handleImageSelect);
  
  // Pagination
  document.getElementById('prev-page')?.addEventListener('click', () => changePage(-1));
  document.getElementById('next-page')?.addEventListener('click', () => changePage(1));
  
  // Import functionality
  document.getElementById('btn-import-products')?.addEventListener('click', openImportModal);
  document.getElementById('close-import-modal')?.addEventListener('click', closeImportModal);
  document.getElementById('cancel-import')?.addEventListener('click', closeImportModal);
  document.getElementById('confirm-import')?.addEventListener('click', handleImport);
  
  const importUploadArea = document.getElementById('import-upload-area');
  const importFileInput = document.getElementById('import-file-input');
  importUploadArea?.addEventListener('click', () => importFileInput?.click());
  importFileInput?.addEventListener('change', handleImportFileSelect);
  
  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
}

/**
 * Populate filter dropdowns
 */
function populateFilters() {
  // No category filters needed anymore
  console.log('Filters initialized');
}

/**
 * Handle search
 */
function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  applyFilters(query);
}

/**
 * Apply filters
 */
function applyFilters(searchQuery = null) {
  const search = searchQuery || document.getElementById('search-products')?.value.toLowerCase() || '';
  const status = document.getElementById('filter-status')?.value || '';
  
  filteredProducts = products.filter(product => {
    const matchesSearch = !search || 
      product.title.toLowerCase().includes(search) ||
      product.slug.toLowerCase().includes(search);
    
    let matchesStatus = true;
    if (status === 'active') matchesStatus = product.is_active;
    if (status === 'inactive') matchesStatus = !product.is_active;
    if (status === 'featured') matchesStatus = product.is_featured;
    
    return matchesSearch && matchesStatus;
  });
  
  currentPage = 1;
  renderProducts();
}

/**
 * Render products table
 */
function renderProducts() {
  console.log('📊 [PRODUCTS] renderProducts called');
  console.log('   products array length:', products.length);
  console.log('   filteredProducts length:', filteredProducts.length);
  
  const tbody = document.getElementById('products-tbody');
  console.log('   products-tbody found:', !!tbody);
  
  if (!tbody) {
    console.error('❌ [PRODUCTS] products-tbody element not found!');
    return;
  }
  
  if (filteredProducts.length === 0) {
    console.log('   No products to display');
    tbody.innerHTML = '<tr><td colspan="10" class="loading-cell">Geen producten gevonden</td></tr>';
    return;
  }
  
  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageProducts = filteredProducts.slice(startIndex, endIndex);
  
  tbody.innerHTML = pageProducts.map(product => `
    <tr class="product-row" data-product-id="${product.id}" style="cursor: pointer;">
      <td onclick="event.stopPropagation();">
        <input type="checkbox" class="checkbox product-checkbox" data-id="${product.id}" 
          ${selectedProducts.has(product.id) ? 'checked' : ''}>
      </td>
      <td>
        ${product.cloudinary_images?.[0]?.url 
          ? `<img src="${product.cloudinary_images[0].url}" alt="${escapeHtml(product.title)}" class="product-image">`
          : `<div class="product-image-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>`
        }
      </td>
      <td>
        <div class="product-info">
          <div class="product-name">${escapeHtml(product.title)}</div>
          <div class="product-slug">${product.slug}</div>
        </div>
      </td>
      <td>
        <div class="tonnage-badges">
          ${(product.tonnage || []).map(t => `<span class="tonnage-badge">${t} ton</span>`).join('')}
        </div>
      </td>
      <td>
        <span class="stock-badge ${product.stock_quantity === 0 ? 'stock-out' : product.stock_quantity < 5 ? 'stock-low' : ''}">
          ${product.stock_quantity || 0}
        </span>
      </td>
      <td>${product.price_excl_vat ? formatPrice(product.price_excl_vat) : '-'}</td>
      <td>
        <span class="status-badge ${product.is_active ? 'status-badge-active' : 'status-badge-inactive'}">
          <span class="status-dot"></span>
          ${product.is_active ? 'Actief' : 'Inactief'}
        </span>
        ${product.is_featured ? '<span class="status-badge status-badge-featured"><span class="status-dot"></span>Featured</span>' : ''}
      </td>
      <td onclick="event.stopPropagation();">
        <div class="action-buttons">
          <button class="btn-action btn-edit" onclick="editProduct('${product.id}')" title="Bewerken">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="btn-action btn-delete" onclick="deleteProduct('${product.id}')" title="Verwijderen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  // Add checkbox listeners
  document.querySelectorAll('.product-checkbox').forEach(cb => {
    cb.addEventListener('change', handleProductSelect);
  });
  
  // Add row click listeners to edit product
  document.querySelectorAll('.product-row').forEach(row => {
    row.addEventListener('click', () => {
      const productId = row.dataset.productId;
      if (productId) {
        editProduct(productId);
      }
    });
  });
  
  updatePagination();
  updateBulkActions();
}

/**
 * Handle product select
 */
function handleProductSelect(e) {
  const id = e.target.dataset.id;
  if (e.target.checked) {
    selectedProducts.add(id);
  } else {
    selectedProducts.delete(id);
  }
  updateBulkActions();
}

/**
 * Handle select all
 */
function handleSelectAll(e) {
  const checkboxes = document.querySelectorAll('.product-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = e.target.checked;
    const id = cb.dataset.id;
    if (e.target.checked) {
      selectedProducts.add(id);
    } else {
      selectedProducts.delete(id);
    }
  });
  updateBulkActions();
}

/**
 * Update bulk actions visibility
 */
function updateBulkActions() {
  const bulkActions = document.getElementById('bulk-actions');
  const selectedCount = document.getElementById('selected-count');
  
  if (bulkActions && selectedCount) {
    if (selectedProducts.size > 0) {
      bulkActions.style.display = 'flex';
      selectedCount.textContent = selectedProducts.size;
    } else {
      bulkActions.style.display = 'none';
    }
  }
}

/**
 * Handle bulk action
 */
async function handleBulkAction(action) {
  if (selectedProducts.size === 0) return;
  
  const productIds = Array.from(selectedProducts);
  
  if (action === 'delete') {
    if (!confirm(`Weet je zeker dat je ${productIds.length} producten wilt verwijderen?`)) {
      return;
    }
  }
  
  try {
    // Process each product
    for (const id of productIds) {
      if (action === 'activate') {
        await auth.put(`/admin/products/${id}`, { is_active: true });
      } else if (action === 'deactivate') {
        await auth.put(`/admin/products/${id}`, { is_active: false });
      } else if (action === 'delete') {
        await auth.delete(`/admin/products/${id}`);
      }
    }
    
    selectedProducts.clear();
    showToast(`${productIds.length} producten ${action === 'delete' ? 'verwijderd' : 'bijgewerkt'}`, 'success');
    await initializeData();
  } catch (error) {
    console.error('Bulk action error:', error);
    showToast('Fout bij uitvoeren actie', 'error');
  }
};

/**
 * Update pagination
 */
function updatePagination() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  document.getElementById('current-page').textContent = currentPage;
  document.getElementById('total-pages').textContent = totalPages;
  
  document.getElementById('prev-page').disabled = currentPage === 1;
  document.getElementById('next-page').disabled = currentPage === totalPages;
}

/**
 * Change page
 */
function changePage(delta) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const newPage = currentPage + delta;
  
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Open product modal
 */
function openProductModal(product = null) {
  console.log('📝 [PRODUCTS] openProductModal called, product:', product ? product.title : 'NEW');
  
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const title = document.getElementById('modal-title');
  
  console.log('   modal found:', !!modal);
  console.log('   form found:', !!form);
  console.log('   title found:', !!title);
  
  if (!modal) {
    console.error('❌ [PRODUCTS] Modal element not found!');
    return;
  }
  
  // Reset form first
  form.reset();
  delete form.dataset.productId;
  
  // Uncheck all tonnage checkboxes
  document.querySelectorAll('input[name="tonnage"]').forEach(cb => cb.checked = false);
  
  if (product) {
    title.textContent = 'Product Bewerken';
    populateForm(product);
    editingProductId = product.id;
  } else {
    title.textContent = 'Nieuw Product';
    editingProductId = null;
    // Initialize empty images array for new product
    window.uploadedImages = [];
    // Set default active state
    document.getElementById('product-active').checked = true;
  }
  
  modal.style.display = 'flex';
  console.log('✅ [PRODUCTS] Modal opened');
}

/**
 * Close product modal
 */
function closeProductModal() {
  document.getElementById('product-modal').style.display = 'none';
  document.getElementById('product-form').reset();
  editingProductId = null; // Reset editing ID
  window.uploadedImages = [];
  const previewContainer = document.getElementById('image-preview-container');
  if (previewContainer) {
    previewContainer.innerHTML = '';
  }
}

/**
 * Populate form with product data
 */
function populateForm(product) {
  isPopulatingForm = true;
  document.getElementById('product-title').value = product.title || '';
  document.getElementById('product-slug').value = product.slug || '';
  document.getElementById('product-description').value = product.description || '';
  document.getElementById('product-width').value = product.width || '';
  document.getElementById('product-volume').value = product.volume || '';
  document.getElementById('product-weight').value = product.weight || '';
  document.getElementById('product-attachment').value = product.attachment_type || '';
  document.getElementById('product-stock').value = product.stock_quantity || 0;
  document.getElementById('product-active').checked = product.is_active;
  const featuredCheckbox = document.getElementById('product-featured');
  if (featuredCheckbox) featuredCheckbox.checked = product.is_featured;
  
  // Set category, subcategory and brand
  const categorySelect = document.getElementById('product-category');
  if (categorySelect && product.category_id) {
    categorySelect.value = product.category_id;
    // Populate subcategories for this category
    populateSubcategoryDropdown(product.category_id);
  }
  
  // Set subcategory after dropdown is populated
  setTimeout(() => {
    const subcategorySelect = document.getElementById('product-subcategory');
    if (subcategorySelect && product.subcategory_id) {
      subcategorySelect.value = product.subcategory_id;
    }
  }, 50);
  
  // Set brand checkboxes
  const brandCheckboxes = document.querySelectorAll('input[name="brand_ids"]');
  const brandAllCheckbox = document.getElementById('brand-all');
  
  // Reset all brand checkboxes
  brandCheckboxes.forEach(cb => cb.checked = false);
  if (brandAllCheckbox) brandAllCheckbox.checked = false;

  // Prefer multi-brand compatibility stored in specs
  const compatibleBrandIds = product.specs?.compatible_brand_ids;
  if (compatibleBrandIds === 'all') {
    if (brandAllCheckbox) brandAllCheckbox.checked = true;
  } else if (Array.isArray(compatibleBrandIds) && compatibleBrandIds.length > 0) {
    compatibleBrandIds.forEach((id) => {
      const brandCheckbox = document.querySelector(`input[name="brand_ids"][value="${id}"]`);
      if (brandCheckbox) brandCheckbox.checked = true;
    });
  } else if (product.brand_id) {
    // Fallback: legacy single brand
    const brandCheckbox = document.querySelector(`input[name="brand_ids"][value="${product.brand_id}"]`);
    if (brandCheckbox) brandCheckbox.checked = true;
  }
  
  // Set price if available (from current_price field returned by admin API)
  const priceInput = document.getElementById('product-price');
  if (priceInput && product.current_price) {
    priceInput.value = product.current_price;
  }
  
  // Set tonnage checkboxes based on excavator_weight_min/max
  const tonnageCheckboxes = document.querySelectorAll('input[name="tonnage"]');
  tonnageCheckboxes.forEach(cb => cb.checked = false);
  
  if (product.excavator_weight_min && product.excavator_weight_max) {
    // Parse to float to handle both string and number values from DB
    const min = parseFloat(product.excavator_weight_min);
    const max = parseFloat(product.excavator_weight_max);
    
    console.log('📊 Setting tonnage for:', { min, max });
    
    // Match to tonnage range
    if (min === 1.5 && max === 3) {
      document.querySelector('input[name="tonnage"][value="1.5-3"]').checked = true;
    } else if (min === 3 && max === 8) {
      document.querySelector('input[name="tonnage"][value="3-8"]').checked = true;
    } else if (min === 8 && max === 15) {
      document.querySelector('input[name="tonnage"][value="8-15"]').checked = true;
    } else if (min === 15 && max === 25) {
      document.querySelector('input[name="tonnage"][value="15-25"]').checked = true;
    } else if (min === 25 && max === 40) {
      document.querySelector('input[name="tonnage"][value="25-40"]').checked = true;
    } else if (min === 40) {
      document.querySelector('input[name="tonnage"][value="40+"]').checked = true;
    }
  }
  
  // Set existing images
  if (product.cloudinary_images && product.cloudinary_images.length > 0) {
    window.uploadedImages = product.cloudinary_images;
    renderImagePreviews();
  }

  // Ensure change events during populate don't trigger autosave
  setTimeout(() => {
    isPopulatingForm = false;
  }, 0);
}

/**
 * Handle product form submit
 */
async function handleProductSubmit(e) {
  e.preventDefault();
  
  console.log('💾 [PRODUCTS] Form submitted');
  console.log('💾 [PRODUCTS] editingProductId:', editingProductId);
  
  const form = e.target;
  const productId = editingProductId; // Use editingProductId instead of dataset
  
  console.log('💾 [PRODUCTS] Using productId:', productId);
  console.log('💾 [PRODUCTS] Is new product:', !productId);
  
  // Get selected tonnage values
  const tonnageCheckboxes = document.querySelectorAll('input[name="tonnage"]:checked');
  const selectedTonnage = Array.from(tonnageCheckboxes).map(cb => cb.value);
  
  if (selectedTonnage.length === 0) {
    showToast('Selecteer minimaal één tonnage', 'error');
    return;
  }
  
  // Convert tonnage to excavator_weight_min and excavator_weight_max
  // Parse all selected tonnage ranges and take min/max
  const tonnageMap = {
    '1.5-3': { min: 1.5, max: 3 },
    '3-8': { min: 3, max: 8 },
    '8-15': { min: 8, max: 15 },
    '15-25': { min: 15, max: 25 },
    '25-40': { min: 25, max: 40 },
    '40+': { min: 40, max: 100 }
  };
  
  const ranges = selectedTonnage.map(t => tonnageMap[t]).filter(Boolean);
  
  if (ranges.length === 0) {
    showToast('Ongeldige tonnage selectie', 'error');
    return;
  }
  
  // Take lowest min and highest max from all selected ranges
  const excavator_weight_min = Math.min(...ranges.map(r => r.min));
  const excavator_weight_max = Math.max(...ranges.map(r => r.max));
  
  console.log(`📊 Tonnage range: ${excavator_weight_min}-${excavator_weight_max} ton`);
  
  // Use uploaded images if available
  const uploadedImages = window.uploadedImages || [];
  
  // Get price value
  const priceValue = parseFloat(document.getElementById('product-price')?.value);
  
  // Sanitize input to prevent XSS
  const sanitizeInput = (str) => {
    if (!str) return '';
    return str.trim()
      .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
      .substring(0, 1000); // Limit length
  };
  
  // Get category, subcategory and brand(s)
  const categoryId = document.getElementById('product-category')?.value || null;
  const subcategoryId = document.getElementById('product-subcategory')?.value || null;
  
  // Get selected brands (can be 'all' or array of IDs)
  const selectedBrands = getSelectedBrandIds();
  // For now, store first selected brand in brand_id (database supports single brand)
  // Store all selected brands in brand_ids for future multi-brand support
  const brandId = selectedBrands === 'all' ? null : (selectedBrands[0] || null);
  const brandIds = selectedBrands === 'all' ? 'all' : selectedBrands;
  
  const productData = {
    title: sanitizeInput(document.getElementById('product-title').value),
    slug: document.getElementById('product-slug').value.trim().toLowerCase(),
    description: sanitizeInput(document.getElementById('product-description').value),
    category_id: categoryId || null,
    subcategory_id: subcategoryId || null,
    brand_id: brandId || null,
    specs: {
      compatible_brand_ids: brandIds
    },
    excavator_weight_min,
    excavator_weight_max,
    width: parseInt(document.getElementById('product-width').value) || null,
    volume: parseInt(document.getElementById('product-volume').value) || null,
    weight: parseInt(document.getElementById('product-weight').value) || null,
    attachment_type: document.getElementById('product-attachment').value || null,
    stock_quantity: parseInt(document.getElementById('product-stock').value) || 0,
    is_active: document.getElementById('product-active').checked,
    is_featured: document.getElementById('product-featured')?.checked || false,
    cloudinary_images: uploadedImages,
    price: !isNaN(priceValue) ? priceValue : null
  };
  
  // Save to API
  try {
    console.log('💾 Saving product to API:');
    console.log('  - Product ID:', productId);
    console.log('  - Data:', productData);
    
    let savedProduct;
    if (productId) {
      console.log(`📤 PATCH /admin/products/${productId}`);
      savedProduct = await auth.patch(`/admin/products/${productId}`, productData);
      console.log('✅ Product updated successfully');
      console.log('  - New stock:', savedProduct.product?.stock_quantity);
      console.log('  - Full response:', savedProduct);
      showToast('Product bijgewerkt', 'success');
    } else {
      console.log('📤 POST /admin/products');
      savedProduct = await auth.post('/admin/products', productData);
      console.log('✅ Product created:', savedProduct);
      showToast('Product toegevoegd', 'success');
    }
    
    // Close modal first (better UX)
    closeProductModal();
    
    // Reload products from API with error handling
    try {
      await initializeData();
      console.log('✅ Products reloaded successfully');
    } catch (reloadError) {
      console.error('⚠️ Failed to reload products:', reloadError);
      showToast('Product opgeslagen, maar lijst kon niet worden vernieuwd. Refresh de pagina handmatig.', 'warning');
    }
    
  } catch (error) {
    console.error('❌ Failed to save product:', error);
    console.error('  - Error details:', {
      message: error.message,
      stack: error.stack
    });
    
    if (error.message.includes('Session expired') || error.message.includes('Not authenticated')) {
      showToast('Sessie verlopen. Je wordt uitgelogd...', 'error');
      setTimeout(() => auth.logout(), 2000);
    } else if (error.message.includes('Product not found')) {
      showToast('Product niet gevonden. Refresh de pagina en probeer opnieuw.', 'error');
      setTimeout(() => window.location.reload(), 2000);
    } else if (error.message.includes('slug already exists')) {
      showToast('Een product met deze slug bestaat al. Kies een andere titel.', 'error');
    } else if (error.message.includes('Title is required')) {
      showToast('Titel is verplicht', 'error');
    } else {
      showToast(`Fout bij opslaan: ${error.message}`, 'error');
    }
  }
}

/**
 * Handle image select
 */
async function handleImageSelect(e) {
  const files = Array.from(e.target.files);
  
  if (files.length === 0) return;
  
  console.log('📷 Selected files:', files.map(f => f.name));
  
  // Show local preview first (await all previews)
  const uploadArea = document.getElementById('image-upload-area');
  if (uploadArea) {
    // Create preview container if it doesn't exist
    let previewContainer = document.getElementById('image-preview-container');
    if (!previewContainer) {
      previewContainer = document.createElement('div');
      previewContainer.id = 'image-preview-container';
      previewContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;';
      uploadArea.parentNode.insertBefore(previewContainer, uploadArea.nextSibling);
    }
    
    // Show local previews (wait for all to load) - append to existing previews
    const previewPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const div = document.createElement('div');
          div.style.cssText = 'position: relative; width: 100px; height: 100px;';
          div.innerHTML = `
            <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid #ddd;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; font-size: 10px; padding: 2px; text-align: center; border-radius: 0 0 8px 8px;">Uploading...</div>
          `;
          previewContainer.appendChild(div);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });
    
    // Wait for all previews to render
    await Promise.all(previewPromises);
  }
  
  // Try to upload to Cloudinary
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  
  try {
    showToast('Afbeeldingen uploaden naar server...', 'info');
    console.log('📤 Uploading to:', '/admin/upload/images');
    
    const response = await auth.upload('/admin/upload/images', formData);
    console.log('📥 Upload response:', response);
    
    if (response.images && response.images.length > 0) {
      showToast(`${response.images.length} afbeelding(en) geüpload!`, 'success');
      // Append new images to existing ones instead of replacing
      if (!window.uploadedImages) {
        window.uploadedImages = [];
      }
      window.uploadedImages = [...window.uploadedImages, ...response.images];
      
      // Re-render all images including the new ones
      renderImagePreviews();
      
      // Reset file input to allow selecting more images
      const imageInput = document.getElementById('image-input');
      if (imageInput) {
        imageInput.value = '';
      }
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    
    // Update preview to show error
    const previewContainer = document.getElementById('image-preview-container');
    if (previewContainer) {
      const previews = previewContainer.querySelectorAll('div > div');
      previews.forEach(div => {
        div.style.background = '#ef4444';
        div.textContent = 'Upload failed';
      });
    }
    
    // Show specific error message
    if (error.message.includes('Unauthorized') || error.message.includes('Session expired')) {
      showToast('Sessie verlopen - log opnieuw in', 'error');
      setTimeout(() => auth.logout(), 2000);
    } else if (error.message.includes('Cloudinary') || error.message.includes('niet geconfigureerd')) {
      showToast('⚠️ Afbeeldingen uploaden is tijdelijk niet beschikbaar. Je kunt het product wel opslaan zonder afbeeldingen.', 'warning');
    } else {
      showToast(`Upload fout: ${error.message}`, 'error');
    }
  }
};

/**
 * Render image previews for existing images
 */
function renderImagePreviews() {
  const uploadArea = document.getElementById('image-upload-area');
  if (!uploadArea) return;
  
  // Create or get preview container
  let previewContainer = document.getElementById('image-preview-container');
  if (!previewContainer) {
    previewContainer = document.createElement('div');
    previewContainer.id = 'image-preview-container';
    previewContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;';
    uploadArea.parentNode.insertBefore(previewContainer, uploadArea.nextSibling);
  }
  
  previewContainer.innerHTML = '';
  
  const images = window.uploadedImages || [];
  images.forEach((img, index) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position: relative; width: 100px; height: 100px;';
    
    const imgEl = document.createElement('img');
    imgEl.src = img.url;
    imgEl.alt = img.alt || 'Product afbeelding';
    imgEl.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 8px;';
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.innerHTML = '×';
    removeBtn.style.cssText = 'position: absolute; top: -8px; right: -8px; width: 24px; height: 24px; border-radius: 50%; background: #ef4444; color: white; border: none; cursor: pointer; font-size: 16px; line-height: 1;';
    removeBtn.onclick = () => {
      window.uploadedImages.splice(index, 1);
      renderImagePreviews();
    };
    
    wrapper.appendChild(imgEl);
    wrapper.appendChild(removeBtn);
    previewContainer.appendChild(wrapper);
  });
}

/**
 * Edit product
 */
window.editProduct = function(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    editingProductId = id;
    openProductModal(product);
  } else {
    showToast('Product niet gevonden', 'error');
  }
};

/**
 * Delete product
 */
window.deleteProduct = async function(id) {
  if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
    return;
  }
  
  try {
    await auth.delete(`/admin/products/${id}`);
    showToast('Product verwijderd', 'success');
    await initializeData();
  } catch (error) {
    console.error('Failed to delete product:', error);
    if (error.message.includes('Session expired')) {
      showToast('Sessie verlopen. Je wordt uitgelogd...', 'error');
      setTimeout(() => auth.logout(), 2000);
    } else {
      showToast('Fout bij verwijderen', 'error');
    }
  }
};

/**
 * Switch view
 */
function switchView(view) {
  const tableContainer = document.querySelector('.table-container');
  const viewGridBtn = document.getElementById('view-grid');
  const viewListBtn = document.getElementById('view-list');
  
  if (!tableContainer) return;
  
  if (view === 'grid') {
    tableContainer.classList.add('grid-view');
    tableContainer.classList.remove('list-view');
    viewGridBtn?.classList.add('active');
    viewListBtn?.classList.remove('active');
  } else {
    tableContainer.classList.remove('grid-view');
    tableContainer.classList.add('list-view');
    viewListBtn?.classList.add('active');
    viewGridBtn?.classList.remove('active');
  }
  
  renderProducts();
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Logout
 */
async function handleLogout() {
  console.log('🚪 Logging out...');
  
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.log('Logout API call failed, continuing anyway');
  }
  
  // Clear token from localStorage
  localStorage.removeItem('auth_token');
  
  // Redirect to login
  window.location.href = '/cms/';
}

// Utility functions
function formatPrice(price) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  if (window.showToast) {
    window.showToast(message, type);
  }
}

function showError(message) {
  showToast(message, 'error');
}

// ==========================================
// IMPORT FUNCTIONALITY
// ==========================================

let importedProducts = [];

/**
 * Open import modal
 */
function openImportModal() {
  document.getElementById('import-modal').style.display = 'flex';
  document.getElementById('import-preview').style.display = 'none';
  document.getElementById('confirm-import').disabled = true;
  importedProducts = [];
}

/**
 * Close import modal
 */
function closeImportModal() {
  document.getElementById('import-modal').style.display = 'none';
  document.getElementById('import-file-input').value = '';
  importedProducts = [];
}

/**
 * Handle import file selection
 */
function handleImportFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.csv')) {
    parseCSV(file);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    parseExcel(file);
  } else {
    showError('Ongeldig bestandsformaat. Gebruik CSV of Excel.');
  }
}

/**
 * Parse CSV file
 */
function parseCSV(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      showError('Bestand bevat geen data');
      return;
    }
    
    // Parse header
    const headers = lines[0].split(/[,;]/).map(h => h.trim().toLowerCase());
    
    // Parse rows
    importedProducts = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/[,;]/).map(v => v.trim().replace(/^["']|["']$/g, ''));
      
      if (values.length < 2) continue;
      
      const product = mapRowToProduct(headers, values);
      if (product.title) {
        importedProducts.push(product);
      }
    }
    
    showImportPreview();
  };
  reader.readAsText(file);
}

/**
 * Parse Excel file (basic support)
 */
function parseExcel(file) {
  // For Excel, we'll use a simple approach - convert to text
  // In production, you'd use a library like SheetJS
  showError('Excel import wordt binnenkort ondersteund. Gebruik voorlopig CSV.');
}

/**
 * Map CSV row to product object
 */
function mapRowToProduct(headers, values) {
  const getValue = (keys) => {
    for (const key of keys) {
      const index = headers.indexOf(key);
      if (index !== -1 && values[index]) {
        return values[index];
      }
    }
    return '';
  };
  
  const title = getValue(['titel', 'title', 'naam', 'name', 'product']);
  
  return {
    id: `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: title,
    slug: generateSlug(title),
    category_title: getValue(['categorie', 'category', 'cat']),
    brand_title: getValue(['merk', 'brand']),
    specs: {
      breedte: getValue(['breedte', 'width', 'b']),
      inhoud: getValue(['inhoud', 'volume', 'capacity']),
      gewicht: getValue(['gewicht', 'weight', 'kg']),
      ophanging: getValue(['ophanging', 'mounting', 'aansluiting'])
    },
    stock: parseInt(getValue(['voorraad', 'stock', 'qty', 'aantal'])) || 0,
    price: parseFloat(getValue(['prijs', 'price']).replace(',', '.')) || 0,
    is_active: getValue(['actief', 'active', 'status']) !== 'false' && getValue(['actief', 'active', 'status']) !== '0',
    is_featured: false,
    images: []
  };
}

/**
 * Show import preview
 */
function showImportPreview() {
  const previewDiv = document.getElementById('import-preview');
  const countSpan = document.getElementById('import-count');
  const listDiv = document.getElementById('import-preview-list');
  const confirmBtn = document.getElementById('confirm-import');
  
  if (importedProducts.length === 0) {
    showError('Geen geldige producten gevonden in bestand');
    return;
  }
  
  countSpan.textContent = importedProducts.length;
  
  listDiv.innerHTML = importedProducts.slice(0, 10).map((p, i) => `
    <div style="padding: 0.5rem; border-bottom: 1px solid var(--col-border-light); font-size: 0.85rem;">
      <strong>${i + 1}. ${escapeHtml(p.title)}</strong>
      <span style="color: var(--col-text-muted); margin-left: 0.5rem;">
        ${p.category_title || 'Geen categorie'} | ${p.brand_title || 'Geen merk'} | €${p.price.toFixed(2)}
      </span>
    </div>
  `).join('') + (importedProducts.length > 10 ? `<div style="padding: 0.5rem; color: var(--col-text-muted);">... en ${importedProducts.length - 10} meer</div>` : '');
  
  previewDiv.style.display = 'block';
  confirmBtn.disabled = false;
}

/**
 * Handle import confirmation
 */
async function handleImport() {
  if (importedProducts.length === 0) return;
  
  const confirmBtn = document.getElementById('confirm-import');
  confirmBtn.disabled = true;
  confirmBtn.textContent = 'Importeren...';
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const product of importedProducts) {
    try {
      // Try to save via API
      await api.post('/admin/products', product);
      successCount++;
    } catch (error) {
      // Save locally if API fails
      allProducts.push(product);
      successCount++;
    }
  }
  
  // Refresh the product list
  renderProducts();
  closeImportModal();
  
  showToast(`${successCount} producten geïmporteerd${errorCount > 0 ? `, ${errorCount} mislukt` : ''}`);
}
