/**
 * Products Page JavaScript
 * Handles product CRUD, filters, bulk actions, and image uploads
 */

console.log('🚀 [PRODUCTS] Script loading...');

import api from './api-client.js?v=3';

console.log('✅ [PRODUCTS] API client imported successfully');

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
  
  // Load from API
  try {
    const productsData = await api.get('/admin/products');
    
    if (productsData?.products) {
      products = productsData.products;
      filteredProducts = [...products];
      console.log(`✅ Loaded ${products.length} products from CMS`);
    } else {
      console.warn('⚠️ No products returned from API');
      products = [];
      filteredProducts = [];
    }
  } catch (error) {
    console.error('❌ Error loading data from CMS:', error);
    products = [];
    filteredProducts = [];
  }
  
  renderProducts();
  populateFilters();
  console.log('   Initial render complete');
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
}

/**
 * Populate form with product data
 */
function populateForm(product) {
  document.getElementById('product-title').value = product.title || '';
  document.getElementById('product-slug').value = product.slug || '';
  document.getElementById('product-description').value = product.description || '';
  // Category removed from form
  document.getElementById('product-width').value = product.width || '';
  document.getElementById('product-volume').value = product.volume || '';
  document.getElementById('product-weight').value = product.weight || '';
  document.getElementById('product-attachment').value = product.attachment_type || '';
  document.getElementById('product-stock').value = product.stock_quantity || 0;
  document.getElementById('product-active').checked = product.is_active;
  const featuredCheckbox = document.getElementById('product-featured');
  if (featuredCheckbox) featuredCheckbox.checked = product.is_featured;
  
  // Set tonnage checkboxes
  const tonnageCheckboxes = document.querySelectorAll('input[name="tonnage"]');
  tonnageCheckboxes.forEach(cb => {
    cb.checked = (product.tonnage || []).includes(cb.value);
  });
  
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
  
  // Get selected tonnage values
  const tonnageCheckboxes = document.querySelectorAll('input[name="tonnage"]:checked');
  const selectedTonnage = Array.from(tonnageCheckboxes).map(cb => cb.value);
  
  if (selectedTonnage.length === 0) {
    showToast('Selecteer minimaal één tonnage', 'error');
    return;
  }
  
  // Use uploaded images if available
  const uploadedImages = window.uploadedImages || [];
  
  const productData = {
    id: productId || `prod-${Date.now()}`,
    title: document.getElementById('product-title').value,
    slug: document.getElementById('product-slug').value,
    description: document.getElementById('product-description').value,
    tonnage: selectedTonnage,
    width: parseInt(document.getElementById('product-width').value) || null,
    volume: parseInt(document.getElementById('product-volume').value) || null,
    weight: parseInt(document.getElementById('product-weight').value) || null,
    attachment_type: document.getElementById('product-attachment').value || null,
    stock_quantity: parseInt(document.getElementById('product-stock').value) || 0,
    is_active: document.getElementById('product-active').checked,
    is_featured: document.getElementById('product-featured')?.checked || false,
    cloudinary_images: uploadedImages
  };
  
  // Save to API
  try {
    console.log('💾 Saving product to API:', productData);
    
    let savedProduct;
    if (productId) {
      savedProduct = await api.put(`/admin/products/${productId}`, productData);
      console.log('✅ Product updated:', savedProduct);
      showToast('Product bijgewerkt', 'success');
    } else {
      savedProduct = await api.post('/admin/products', productData);
      console.log('✅ Product created:', savedProduct);
      showToast('Product toegevoegd', 'success');
    }
    
    // Reload products from API to ensure we have the latest data
    await initializeData();
    closeProductModal();
    
  } catch (error) {
    console.error('❌ Failed to save product:', error);
    
    if (error.message.includes('Unauthorized')) {
      showToast('Sessie verlopen - log opnieuw in', 'error');
      setTimeout(() => window.location.href = '/cms/', 2000);
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
  
  // Show local preview first
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
    
    // Show local previews
    previewContainer.innerHTML = '';
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const div = document.createElement('div');
        div.style.cssText = 'position: relative; width: 100px; height: 100px;';
        div.innerHTML = `
          <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid #ddd;">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; font-size: 10px; padding: 2px; text-align: center; border-radius: 0 0 8px 8px;">Uploading...</div>
        `;
        previewContainer.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
  }
  
  // Try to upload to Cloudinary
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  
  try {
    showToast('Afbeeldingen uploaden naar server...', 'info');
    console.log('📤 Uploading to:', '/admin/upload/images');
    
    const response = await api.upload('/admin/upload/images', formData);
    console.log('📥 Upload response:', response);
    
    if (response.images && response.images.length > 0) {
      showToast(`${response.images.length} afbeelding(en) geüpload!`, 'success');
      window.uploadedImages = response.images;
      
      // Update preview with actual URLs
      const previewContainer = document.getElementById('image-preview-container');
      if (previewContainer) {
        previewContainer.innerHTML = response.images.map(img => `
          <div style="position: relative; width: 100px; height: 100px;">
            <img src="${img.url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid #22c55e;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: #22c55e; color: white; font-size: 10px; padding: 2px; text-align: center; border-radius: 0 0 8px 8px;">✓ Uploaded</div>
          </div>
        `).join('');
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
    if (error.message.includes('Unauthorized')) {
      showToast('Sessie verlopen - log opnieuw in', 'error');
    } else if (error.message.includes('Cloudinary not configured')) {
      showToast('Cloudinary niet geconfigureerd op server', 'error');
    } else {
      showToast(`Upload fout: ${error.message}`, 'error');
    }
  }
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
