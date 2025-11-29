/**
 * Products Page JavaScript
 * Handles product CRUD, filters, bulk actions, and image uploads
 * With full demo data support
 */

console.log('🚀 [PRODUCTS] Script loading...');

import api from './api-client.js?v=3';

console.log('✅ [PRODUCTS] API client imported successfully');

// Demo data - always available
const DEMO_PRODUCTS = [
  {
    id: 'prod-001',
    title: 'Slotenbak 600mm CW30',
    slug: 'slotenbak-600mm-cw30',
    description: 'Professionele slotenbak voor graafmachines van 8-15 ton.',
    category_id: 'cat-1',
    category_title: 'Slotenbakken',
    brand_id: 'brand-1',
    brand_title: 'Structon',
    width: 600,
    volume: 120,
    weight: 85,
    attachment_type: 'CW30',
    stock_quantity: 5,
    price_excl_vat: 2450.00,
    is_active: true,
    is_featured: true,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray.jpg' }]
  },
  {
    id: 'prod-002',
    title: 'Graafbak 1200mm CW40',
    slug: 'graafbak-1200mm-cw40',
    description: 'Zware graafbak voor grote graafmachines.',
    category_id: 'cat-2',
    category_title: 'Graafbakken',
    brand_id: 'brand-1',
    brand_title: 'Structon',
    width: 1200,
    volume: 450,
    weight: 280,
    attachment_type: 'CW40',
    stock_quantity: 3,
    price_excl_vat: 2945.00,
    is_active: true,
    is_featured: false,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag.jpg' }]
  },
  {
    id: 'prod-003',
    title: 'Sorteergrijper 800mm',
    slug: 'sorteergrijper-800mm',
    description: 'Veelzijdige sorteergrijper voor sloop en recycling.',
    category_id: 'cat-3',
    category_title: 'Sloop- en sorteergrijpers',
    brand_id: 'brand-2',
    brand_title: 'Caterpillar',
    width: 800,
    volume: null,
    weight: 450,
    attachment_type: 'S50',
    stock_quantity: 2,
    price_excl_vat: 3200.00,
    is_active: true,
    is_featured: true,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/car-interior-design.jpg' }]
  },
  {
    id: 'prod-004',
    title: 'Plantenbak 400mm CW10',
    slug: 'plantenbak-400mm-cw10',
    description: 'Compacte plantenbak voor kleine graafmachines.',
    category_id: 'cat-4',
    category_title: 'Overige',
    brand_id: 'brand-1',
    brand_title: 'Structon',
    width: 400,
    volume: 45,
    weight: 35,
    attachment_type: 'CW10',
    stock_quantity: 8,
    price_excl_vat: 1875.00,
    is_active: true,
    is_featured: false,
    cloudinary_images: []
  },
  {
    id: 'prod-005',
    title: 'Rioolbak 300mm CW20',
    slug: 'rioolbak-300mm-cw20',
    description: 'Smalle rioolbak voor precisiewerk.',
    category_id: 'cat-1',
    category_title: 'Slotenbakken',
    brand_id: 'brand-3',
    brand_title: 'Volvo',
    width: 300,
    volume: 60,
    weight: 55,
    attachment_type: 'CW20',
    stock_quantity: 0,
    price_excl_vat: 1250.00,
    is_active: false,
    is_featured: false,
    cloudinary_images: []
  }
];

const DEMO_CATEGORIES = [
  { id: 'cat-1', title: 'Slotenbakken', slug: 'slotenbakken' },
  { id: 'cat-2', title: 'Graafbakken', slug: 'graafbakken' },
  { id: 'cat-3', title: 'Sloop- en sorteergrijpers', slug: 'sloop-sorteergrijpers' },
  { id: 'cat-4', title: 'Overige', slug: 'overige' }
];

const DEMO_BRANDS = [
  { id: 'brand-1', title: 'Structon', slug: 'structon' },
  { id: 'brand-2', title: 'Caterpillar', slug: 'caterpillar' },
  { id: 'brand-3', title: 'Volvo', slug: 'volvo' }
];

// State
let products = [];
let categories = [];
let brands = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 20;
let selectedProducts = new Set();
let editingProductId = null;

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
 * Initialize with demo data immediately, then try API
 */
async function initializeData() {
  console.log('📦 [PRODUCTS] initializeData starting...');
  console.log('   DEMO_PRODUCTS available:', DEMO_PRODUCTS.length);
  console.log('   DEMO_CATEGORIES available:', DEMO_CATEGORIES.length);
  console.log('   DEMO_BRANDS available:', DEMO_BRANDS.length);
  
  // Load demo data immediately for fast display
  products = [...DEMO_PRODUCTS];
  categories = [...DEMO_CATEGORIES];
  brands = [...DEMO_BRANDS];
  filteredProducts = [...products];
  
  console.log('   Demo data loaded, rendering...');
  
  renderProducts();
  populateFilters();
  
  console.log('   Initial render complete');
  
  // Try to load from API in background
  try {
    const [productsData, categoriesData, brandsData] = await Promise.allSettled([
      api.get('/admin/products'),
      api.get('/categories'),
      api.get('/brands')
    ]);
    
    if (productsData.status === 'fulfilled' && productsData.value?.products?.length > 0) {
      products = productsData.value.products;
      filteredProducts = [...products];
      renderProducts();
    }
    
    if (categoriesData.status === 'fulfilled' && categoriesData.value?.length > 0) {
      categories = categoriesData.value;
      populateFilters();
    }
    
    if (brandsData.status === 'fulfilled' && brandsData.value?.length > 0) {
      brands = brandsData.value;
      populateFilters();
    }
  } catch (error) {
    console.log('Using demo data (API unavailable)');
  }
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
  document.getElementById('filter-category')?.addEventListener('change', applyFilters);
  document.getElementById('filter-brand')?.addEventListener('change', applyFilters);
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
  
  // Image upload
  const imageUploadArea = document.getElementById('image-upload-area');
  const imageInput = document.getElementById('image-input');
  
  imageUploadArea?.addEventListener('click', () => imageInput.click());
  imageInput?.addEventListener('change', handleImageSelect);
  
  // Pagination
  document.getElementById('prev-page')?.addEventListener('click', () => changePage(-1));
  document.getElementById('next-page')?.addEventListener('click', () => changePage(1));
  
  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
}

/**
 * Populate filter dropdowns
 */
function populateFilters() {
  // Clear existing options first (keep first "Alle" option)
  const categoryFilter = document.getElementById('filter-category');
  const brandFilter = document.getElementById('filter-brand');
  const productCategory = document.getElementById('product-category');
  const productBrand = document.getElementById('product-brand');
  
  // Clear and repopulate category filter
  if (categoryFilter) {
    categoryFilter.innerHTML = '<option value="">Alle categorieën</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.title;
      categoryFilter.appendChild(option);
    });
  }
  
  // Clear and repopulate brand filter
  if (brandFilter) {
    brandFilter.innerHTML = '<option value="">Alle merken</option>';
    brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand.id;
      option.textContent = brand.title;
      brandFilter.appendChild(option);
    });
  }
  
  // Populate modal category select
  if (productCategory) {
    productCategory.innerHTML = '<option value="">Selecteer categorie</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.title;
      productCategory.appendChild(option);
    });
  }
  
  // Populate modal brand select
  if (productBrand) {
    productBrand.innerHTML = '<option value="">Selecteer merk</option>';
    brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand.id;
      option.textContent = brand.title;
      productBrand.appendChild(option);
    });
  }
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
  const categoryId = document.getElementById('filter-category')?.value || '';
  const brandId = document.getElementById('filter-brand')?.value || '';
  const status = document.getElementById('filter-status')?.value || '';
  
  filteredProducts = products.filter(product => {
    const matchesSearch = !search || 
      product.title.toLowerCase().includes(search) ||
      product.slug.toLowerCase().includes(search);
    
    const matchesCategory = !categoryId || product.category_id === categoryId;
    const matchesBrand = !brandId || product.brand_id === brandId;
    
    let matchesStatus = true;
    if (status === 'active') matchesStatus = product.is_active;
    if (status === 'inactive') matchesStatus = !product.is_active;
    if (status === 'featured') matchesStatus = product.is_featured;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
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
    <tr>
      <td>
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
      <td>${escapeHtml(product.category_title || '-')}</td>
      <td>${escapeHtml(product.brand_title || '-')}</td>
      <td>
        <div class="product-specs">
          ${product.width ? `${product.width}mm` : ''}
          ${product.volume ? `• ${product.volume}L` : ''}
          ${product.attachment_type ? `• ${product.attachment_type}` : ''}
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
      <td>
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
        await api.put(`/admin/products/${id}`, { is_active: true });
      } else if (action === 'deactivate') {
        await api.put(`/admin/products/${id}`, { is_active: false });
      } else if (action === 'delete') {
        await api.delete(`/admin/products/${id}`);
      }
    }
    
    selectedProducts.clear();
    showToast(`${productIds.length} producten ${action === 'delete' ? 'verwijderd' : 'bijgewerkt'}`, 'success');
    await loadProducts();
  } catch (error) {
    console.error('Bulk action error:', error);
    showToast('Fout bij uitvoeren actie', 'error');
  }
}

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
  
  if (product) {
    title.textContent = 'Product Bewerken';
    populateForm(product);
    editingProductId = product.id;
  } else {
    title.textContent = 'Nieuw Product';
    form.reset();
    editingProductId = null;
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
}

/**
 * Populate form with product data
 */
function populateForm(product) {
  document.getElementById('product-title').value = product.title || '';
  document.getElementById('product-slug').value = product.slug || '';
  document.getElementById('product-description').value = product.description || '';
  document.getElementById('product-category').value = product.category_id || '';
  document.getElementById('product-brand').value = product.brand_id || '';
  document.getElementById('product-width').value = product.width || '';
  document.getElementById('product-volume').value = product.volume || '';
  document.getElementById('product-weight').value = product.weight || '';
  document.getElementById('product-attachment').value = product.attachment_type || '';
  document.getElementById('product-min-weight').value = product.excavator_weight_min || '';
  document.getElementById('product-max-weight').value = product.excavator_weight_max || '';
  document.getElementById('product-stock').value = product.stock_quantity || 0;
  document.getElementById('product-active').checked = product.is_active;
  document.getElementById('product-featured').checked = product.is_featured;
  document.getElementById('product-price').value = product.price_excl_vat || '';
  
  // Store product ID for update
  document.getElementById('product-form').dataset.productId = product.id;
}

/**
 * Handle product form submit
 */
async function handleProductSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const productId = form.dataset.productId;
  
  const categoryId = document.getElementById('product-category').value;
  const brandId = document.getElementById('product-brand').value;
  const category = categories.find(c => c.id === categoryId);
  const brand = brands.find(b => b.id === brandId);
  
  const productData = {
    id: productId || `prod-${Date.now()}`,
    title: document.getElementById('product-title').value,
    slug: document.getElementById('product-slug').value,
    description: document.getElementById('product-description').value,
    category_id: categoryId || null,
    category_title: category?.title || '',
    brand_id: brandId || null,
    brand_title: brand?.title || '',
    width: parseInt(document.getElementById('product-width').value) || null,
    volume: parseInt(document.getElementById('product-volume').value) || null,
    weight: parseInt(document.getElementById('product-weight').value) || null,
    attachment_type: document.getElementById('product-attachment').value || null,
    excavator_weight_min: parseInt(document.getElementById('product-min-weight').value) || null,
    excavator_weight_max: parseInt(document.getElementById('product-max-weight').value) || null,
    stock_quantity: parseInt(document.getElementById('product-stock').value) || 0,
    is_active: document.getElementById('product-active').checked,
    is_featured: document.getElementById('product-featured').checked,
    price_excl_vat: parseFloat(document.getElementById('product-price').value) || null,
    cloudinary_images: []
  };
  
  // Try API first, fallback to local storage
  try {
    if (productId) {
      await api.put(`/admin/products/${productId}`, productData);
    } else {
      await api.post('/admin/products', productData);
    }
  } catch (error) {
    console.log('API unavailable, saving locally');
  }
  
  // Update local data regardless of API success
  if (productId) {
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
    }
    showToast('Product bijgewerkt', 'success');
  } else {
    products.unshift(productData);
    showToast('Product toegevoegd', 'success');
  }
  
  filteredProducts = [...products];
  closeProductModal();
  renderProducts();
}

/**
 * Handle image select
 */
function handleImageSelect(e) {
  const files = Array.from(e.target.files);
  // TODO: Implement image upload to Cloudinary
  console.log('Images selected:', files);
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
  
  // Try API first
  try {
    await api.delete(`/admin/products/${id}`);
  } catch (error) {
    console.log('API unavailable, deleting locally');
  }
  
  // Remove from local data
  products = products.filter(p => p.id !== id);
  filteredProducts = filteredProducts.filter(p => p.id !== id);
  showToast('Product verwijderd', 'success');
  renderProducts();
};

/**
 * Switch view
 */
function switchView(view) {
  // TODO: Implement grid view
  console.log('Switch to view:', view);
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
  try {
    await api.post('/auth/logout');
    window.location.href = '/cms/';
  } catch (error) {
    window.location.href = '/cms/';
  }
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
