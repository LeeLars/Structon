/**
 * Products Page JavaScript
 * Handles product CRUD, filters, bulk actions, and image uploads
 */

import api from './api-client.js';
import { renderSidebar } from './sidebar.js';

// State
let products = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 20;
let selectedProducts = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Initialize sidebar
  const sidebarContainer = document.getElementById('sidebar-container');
  if (sidebarContainer) {
    sidebarContainer.innerHTML = renderSidebar('products');
  }
  
  checkAuth();
  setupEventListeners();
  loadProducts();
});

/**
 * Check authentication
 */
async function checkAuth() {
  try {
    const data = await api.get('/auth/me');
    if (data.user.role !== 'admin') {
      window.location.href = '/cms/';
    }
  } catch (error) {
    window.location.href = '/cms/';
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // New product button
  document.getElementById('btn-new-product')?.addEventListener('click', () => openProductModal());
  
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
 * Load products
 */
async function loadProducts() {
  try {
    const data = await api.get('/admin/products');
    products = data.products || [];
    filteredProducts = [...products];
    renderProducts();
    await loadFilterOptions();
  } catch (error) {
    console.error('Error loading products:', error);
    showError('Fout bij laden van producten');
  }
}

/**
 * Load filter options
 */
async function loadFilterOptions() {
  try {
    const [categoriesData, brandsData] = await Promise.all([
      api.get('/categories'),
      api.get('/brands')
    ]);
    
    // Populate category filter
    const categoryFilter = document.getElementById('filter-category');
    if (categoryFilter && categoriesData.categories) {
      categoriesData.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.title;
        categoryFilter.appendChild(option);
      });
    }
    
    // Populate brand filter
    const brandFilter = document.getElementById('filter-brand');
    if (brandFilter && brandsData.brands) {
      brandsData.brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.id;
        option.textContent = brand.title;
        brandFilter.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading filters:', error);
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
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;
  
  if (filteredProducts.length === 0) {
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
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const title = document.getElementById('modal-title');
  
  if (product) {
    title.textContent = 'Product Bewerken';
    populateForm(product);
  } else {
    title.textContent = 'Nieuw Product';
    form.reset();
  }
  
  modal.style.display = 'flex';
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
  
  const productData = {
    title: document.getElementById('product-title').value,
    slug: document.getElementById('product-slug').value,
    description: document.getElementById('product-description').value,
    category_id: document.getElementById('product-category').value || null,
    brand_id: document.getElementById('product-brand').value || null,
    width: parseInt(document.getElementById('product-width').value) || null,
    volume: parseInt(document.getElementById('product-volume').value) || null,
    weight: parseInt(document.getElementById('product-weight').value) || null,
    attachment_type: document.getElementById('product-attachment').value || null,
    excavator_weight_min: parseInt(document.getElementById('product-min-weight').value) || null,
    excavator_weight_max: parseInt(document.getElementById('product-max-weight').value) || null,
    stock_quantity: parseInt(document.getElementById('product-stock').value) || 0,
    is_active: document.getElementById('product-active').checked,
    is_featured: document.getElementById('product-featured').checked,
    price: parseFloat(document.getElementById('product-price').value) || null,
  };
  
  try {
    if (productId) {
      await api.put(`/admin/products/${productId}`, productData);
      showToast('Product bijgewerkt', 'success');
    } else {
      await api.post('/admin/products', productData);
      showToast('Product toegevoegd', 'success');
    }
    
    closeProductModal();
    await loadProducts();
  } catch (error) {
    console.error('Error saving product:', error);
    showToast(error.message || 'Fout bij opslaan', 'error');
  }
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
window.editProduct = async function(id) {
  try {
    const data = await api.get(`/admin/products/${id}`);
    openProductModal(data.product);
  } catch (error) {
    console.error('Error loading product:', error);
    showToast('Fout bij laden product', 'error');
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
    await api.delete(`/admin/products/${id}`);
    showToast('Product verwijderd', 'success');
    await loadProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
    showToast('Fout bij verwijderen', 'error');
  }
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
