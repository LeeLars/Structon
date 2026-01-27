/**
 * Structon - Contact & Quote Form JavaScript
 * Handles form submission to CMS with validation and confirmation emails
 * Now includes quote cart integration
 */

import { quotes, products } from '../api/client.js';

// Form state
let isSubmitting = false;

/**
 * Initialize contact page
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('📝 Contact page initialized');
  
  // Render cart items if available
  renderCartItems();
  
  // Parse URL parameters for pre-filling
  parseUrlParameters();
  
  // Setup form validation and submission
  setupFormHandling();
  
  // Setup request type toggle
  setupRequestTypeToggle();
});

/**
 * Render quote cart items above the form in a separate card
 */
function renderCartItems() {
  // Check if quoteCart service is available
  if (typeof window.quoteCart === 'undefined') {
    console.log('Quote cart service not loaded yet, retrying...');
    setTimeout(renderCartItems, 100);
    return;
  }
  
  const items = window.quoteCart.getItems();
  
  // Find or create cart items container
  let container = document.getElementById('quote-cart-items');
  
  // If no items, remove container if it exists and return
  if (items.length === 0) {
    if (container) container.remove();
    return;
  }
  
  if (!container) {
    // Create container BEFORE the form-card (not inside it)
    const formCard = document.querySelector('.form-card');
    if (!formCard) return;
    
    container = document.createElement('div');
    container.id = 'quote-cart-items';
    container.className = 'quote-cart-card';
    formCard.parentNode.insertBefore(container, formCard);
  }
  
  // Render items in a separate card style
  container.innerHTML = `
    <div class="quote-cart-card-header">
      <div class="quote-cart-card-title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <h2>UW OFFERTE MANDJE</h2>
      </div>
      <span class="quote-cart-card-count">${items.length} product${items.length > 1 ? 'en' : ''}</span>
    </div>
    <div class="quote-cart-card-items">
      ${items.map(item => `
        <div class="quote-cart-card-item">
          <div class="quote-cart-card-item-image">
            ${item.image ? `<img src="${item.image}" alt="${item.title}">` : `
              <div class="quote-cart-card-item-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
              </div>
            `}
          </div>
          <div class="quote-cart-card-item-info">
            <h4>${item.title}</h4>
            <p class="quote-cart-card-item-category">${item.category}${item.subcategory ? ' › ' + item.subcategory : ''}</p>
            ${item.specs && Object.keys(item.specs).length > 0 ? `
              <div class="quote-cart-card-item-specs">
                ${Object.entries(item.specs).filter(([k,v]) => v).map(([k,v]) => `<span>${v}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <div class="quote-cart-card-item-qty">
            <label>Aantal</label>
            <div class="qty-controls">
              <button type="button" class="qty-btn qty-minus" data-id="${item.id}">−</button>
              <span class="qty-value">${item.quantity || 1}</span>
              <button type="button" class="qty-btn qty-plus" data-id="${item.id}">+</button>
            </div>
          </div>
          <button type="button" class="quote-cart-card-item-remove" data-id="${item.id}" aria-label="Verwijderen">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `).join('')}
    </div>
    <div class="quote-cart-card-footer">
      <span>Totaal: <strong>${items.reduce((sum, item) => sum + (item.quantity || 1), 0)}</strong> product(en)</span>
      <button type="button" class="quote-cart-card-clear" id="clear-cart-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        Mandje legen
      </button>
    </div>
    <input type="hidden" name="cart_items_json" id="cart-items-json" value='${window.quoteCart.formatAsJSON()}'>
    <input type="hidden" name="cart_items_text" id="cart-items-text" value="${encodeCartText()}">
  `;
  
  // Bind quantity buttons
  container.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = window.quoteCart.getItems().find(i => i.id === id);
      if (item) {
        const isPlus = btn.classList.contains('qty-plus');
        const newQty = isPlus ? (item.quantity || 1) + 1 : (item.quantity || 1) - 1;
        if (newQty <= 0) {
          window.quoteCart.removeItem(id);
        } else {
          window.quoteCart.updateQuantity(id, newQty);
        }
        renderCartItems();
      }
    });
  });
  
  // Bind remove buttons
  container.querySelectorAll('.quote-cart-card-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      window.quoteCart.removeItem(id);
      renderCartItems();
    });
  });
  
  // Bind clear cart button
  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Weet u zeker dat u alle producten wilt verwijderen?')) {
        window.quoteCart.clear();
        renderCartItems();
      }
    });
  }
}

/**
 * Encode cart text for hidden field (escape special chars)
 */
function encodeCartText() {
  if (typeof window.quoteCart === 'undefined') return '';
  return encodeURIComponent(window.quoteCart.formatAsText());
}

/**
 * Parse URL parameters to pre-fill form fields
 * Supports: product, industry, brand, category
 */
function parseUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  
  // Source page tracking
  const sourcePage = document.getElementById('source-page');
  if (sourcePage) {
    sourcePage.value = document.referrer || 'direct';
  }
  
  // Product pre-fill (from product page "Offerte aanvragen" button)
  const productId = params.get('product_id');
  const productSlug = params.get('product');
  const productName = params.get('product_name');
  const productCategory = params.get('product_category') || params.get('type');
  const productBrand = params.get('product_brand');
  const productTonnage = params.get('product_tonnage') || params.get('tonnage');
  
  if (productId || productSlug || productName) {
    document.getElementById('product-id').value = productId || '';
    document.getElementById('product-slug').value = productSlug || '';
    
    // Show prefilled product with all details
    const prefilledGroup = document.getElementById('product-prefilled');
    const prefilledName = document.getElementById('prefilled-product-name');
    const prefilledCategorySpan = document.getElementById('prefilled-product-category');
    const prefilledBrandSpan = document.getElementById('prefilled-product-brand');
    const prefilledTonnageSpan = document.getElementById('prefilled-product-tonnage');
    const selectionGroup = document.getElementById('product-selection-group');
    
    if (productName && prefilledGroup && prefilledName) {
      // Set display values
      prefilledName.textContent = decodeURIComponent(productName);
      
      // Set category
      if (prefilledCategorySpan && productCategory) {
        prefilledCategorySpan.textContent = decodeURIComponent(productCategory);
        document.getElementById('prefilled-product-category-input').value = productCategory;
      } else {
        const categoryRow = document.getElementById('prefilled-category-row');
        if (categoryRow) categoryRow.style.display = 'none';
      }
      
      // Set brand
      if (prefilledBrandSpan && productBrand) {
        prefilledBrandSpan.textContent = decodeURIComponent(productBrand);
        document.getElementById('prefilled-product-brand-input').value = productBrand;
        // Also pre-select machine brand
        const machineBrand = document.getElementById('machine_brand');
        if (machineBrand) {
          const brandOption = machineBrand.querySelector(`option[value="${productBrand.toLowerCase()}"]`);
          if (brandOption) machineBrand.value = productBrand.toLowerCase();
        }
      } else {
        const brandRow = document.getElementById('prefilled-brand-row');
        if (brandRow) brandRow.style.display = 'none';
      }
      
      // Set tonnage
      if (prefilledTonnageSpan && productTonnage) {
        prefilledTonnageSpan.textContent = decodeURIComponent(productTonnage);
        document.getElementById('prefilled-product-tonnage-input').value = productTonnage;
        // Also fill machine model field
        const machineModel = document.getElementById('machine_model');
        if (machineModel) machineModel.value = productTonnage + ' ton';
      } else {
        const tonnageRow = document.getElementById('prefilled-tonnage-row');
        if (tonnageRow) tonnageRow.style.display = 'none';
      }
      
      // Set hidden input for product name
      const prefilledNameInput = document.getElementById('prefilled-product-name-input');
      if (prefilledNameInput) prefilledNameInput.value = productName;
      
      prefilledGroup.style.display = 'block';
      if (selectionGroup) selectionGroup.style.display = 'none';

      // Try to fetch full product details for a richer preview
      fetchAndPopulateProductPreview(productId, productSlug);
    }
  }
  
  // Industry pre-fill (from industry page CTA)
  const industry = params.get('industry');
  if (industry) {
    document.getElementById('industry').value = industry;
    
    // Add industry context to message placeholder
    const messageField = document.getElementById('message');
    if (messageField) {
      const industryNames = {
        'grondwerkers': 'Grondwerkers',
        'afbraak-sloop': 'Afbraak & Sloop',
        'tuinaanleggers': 'Tuinaanleggers',
        'wegenbouw': 'Wegenbouw',
        'recycling': 'Recycling',
        'verhuur': 'Verhuurbedrijven',
        'loonwerk-landbouw': 'Loonwerk & Landbouw',
        'baggerwerken': 'Baggerwerken'
      };
      const industryName = industryNames[industry] || industry;
      messageField.placeholder = `Ik ben actief in de sector ${industryName}. Beschrijf uw vraag of gewenste specificaties...`;
    }
  }
  
  // Brand pre-fill (from brand page CTA)
  const brand = params.get('brand');
  if (brand) {
    document.getElementById('brand').value = brand;
    
    // Pre-select machine brand
    const machineBrand = document.getElementById('machine_brand');
    if (machineBrand) {
      const brandOption = machineBrand.querySelector(`option[value="${brand.toLowerCase()}"]`);
      if (brandOption) {
        machineBrand.value = brand.toLowerCase();
      }
    }
  }
  
  // Category pre-fill
  const category = params.get('category') || params.get('cat');
  if (category) {
    const categorySelect = document.getElementById('product_category');
    if (categorySelect) {
      categorySelect.value = category;
    }
  }

  // Machine info pre-fill (from product page configuration)
  const machineModel = params.get('machine_model');
  if (machineModel) {
    const modelField = document.getElementById('machine_model');
    if (modelField) {
      modelField.value = decodeURIComponent(machineModel);
    }
  }

  const attachmentType = params.get('attachment_type');
  if (attachmentType) {
    const attachmentSelect = document.getElementById('attachment_type');
    if (attachmentSelect) {
      attachmentSelect.value = decodeURIComponent(attachmentType);
    }
  }
}

/**
 * Fetch full product info (image + specs) for a richer prefilled preview
 */
async function fetchAndPopulateProductPreview(productId, productSlug) {
  const lookup = productId || productSlug;
  if (!lookup) return;

  try {
    const res = await products.getById(lookup);
    const product = res?.product;
    if (!product) return;

    // Image
    const imageWrapper = document.getElementById('prefilled-product-image-wrapper');
    const imageEl = document.getElementById('prefilled-product-image');
    const imageUrl = product.cloudinary_images?.[0]?.url;
    if (imageWrapper && imageEl && imageUrl) {
      imageEl.src = imageUrl;
      imageEl.alt = product.title || 'Geselecteerd product';
      imageWrapper.style.display = 'block';
    }

    // Prefer authoritative values from API
    const prefilledName = document.getElementById('prefilled-product-name');
    if (prefilledName && product.title) prefilledName.textContent = product.title;
    const nameInput = document.getElementById('prefilled-product-name-input');
    if (nameInput && product.title) nameInput.value = product.title;

    const categorySpan = document.getElementById('prefilled-product-category');
    const categoryInput = document.getElementById('prefilled-product-category-input');
    const categoryRow = document.getElementById('prefilled-category-row');
    if (categorySpan && categoryInput && product.category_title) {
      categorySpan.textContent = product.category_title;
      categoryInput.value = product.category_title;
      if (categoryRow) categoryRow.style.display = 'block';
    }

    const brandSpan = document.getElementById('prefilled-product-brand');
    const brandInput = document.getElementById('prefilled-product-brand-input');
    const brandRow = document.getElementById('prefilled-brand-row');
    if (brandSpan && brandInput && product.brand_title) {
      brandSpan.textContent = product.brand_title;
      brandInput.value = product.brand_title;
      if (brandRow) brandRow.style.display = 'block';
    }

    // Tonnage range (tons)
    const tonnageSpan = document.getElementById('prefilled-product-tonnage');
    const tonnageInput = document.getElementById('prefilled-product-tonnage-input');
    const tonnageRow = document.getElementById('prefilled-tonnage-row');
    if (tonnageSpan && tonnageInput && product.excavator_weight_min && product.excavator_weight_max) {
      const minTon = Math.round(parseFloat(product.excavator_weight_min));
      const maxTon = Math.round(parseFloat(product.excavator_weight_max));
      const tonnage = `${minTon}-${maxTon}`;
      tonnageSpan.textContent = tonnage;
      tonnageInput.value = tonnage;
      if (tonnageRow) tonnageRow.style.display = 'block';
    }

    // Attachment type
    const attachmentRow = document.getElementById('prefilled-attachment-row');
    const attachmentSpan = document.getElementById('prefilled-product-attachment');
    if (attachmentRow && attachmentSpan && product.attachment_type) {
      attachmentSpan.textContent = product.attachment_type;
      attachmentRow.style.display = 'block';
    }

    // Width
    const widthRow = document.getElementById('prefilled-width-row');
    const widthSpan = document.getElementById('prefilled-product-width');
    if (widthRow && widthSpan && product.width) {
      widthSpan.textContent = `${product.width} mm`;
      widthRow.style.display = 'block';
    }

    // Volume
    const volumeRow = document.getElementById('prefilled-volume-row');
    const volumeSpan = document.getElementById('prefilled-product-volume');
    if (volumeRow && volumeSpan && product.volume) {
      volumeSpan.textContent = `${product.volume} L`;
      volumeRow.style.display = 'block';
    }
  } catch (e) {
    console.warn('⚠️ Could not fetch product preview data:', e);
  }
}

/**
 * Setup request type toggle (changes submit button text and field visibility)
 */
function setupRequestTypeToggle() {
  const radioButtons = document.querySelectorAll('input[name="request_type"]');
  const submitBtn = document.querySelector('.btn-text');
  const technicalFields = document.getElementById('technical-fields');
  
  // Setup custom brand field toggle
  const machineBrandSelect = document.getElementById('machine_brand');
  const customBrandGroup = document.getElementById('custom-brand-group');
  const customBrandInput = document.getElementById('custom_brand');
  
  if (machineBrandSelect && customBrandGroup) {
    machineBrandSelect.addEventListener('change', function() {
      if (this.value === 'anders') {
        customBrandGroup.style.display = 'block';
        customBrandInput.required = true;
      } else {
        customBrandGroup.style.display = 'none';
        customBrandInput.required = false;
        customBrandInput.value = '';
      }
    });
  }
  
  const updateState = (type) => {
    // Update button text
    const labels = {
      'offerte': 'Offerte Aanvragen',
      'vraag': 'Vraag Versturen',
      'maatwerk': 'Maatwerk Aanvragen'
    };
    if (submitBtn) {
      submitBtn.textContent = labels[type] || 'Verzenden';
    }
    
    // Update fields visibility
    if (technicalFields) {
      if (type === 'vraag') {
        technicalFields.style.display = 'none';
        // Clear required attributes if any (though currently none are required in this section)
      } else {
        technicalFields.style.display = 'block';
        // Restore/scroll animation could go here
      }
    }
  };

  // Initial state check
  const currentChecked = document.querySelector('input[name="request_type"]:checked');
  if (currentChecked) {
    updateState(currentChecked.value);
  }
  
  radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
      updateState(e.target.value);
    });
  });
}

/**
 * Setup form validation and submission
 */
function setupFormHandling() {
  const form = document.getElementById('quote-form');
  if (!form) return;
  
  // Real-time validation
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-group').classList.contains('has-error')) {
        validateField(field);
      }
    });
  });
  
  // Form submission
  form.addEventListener('submit', handleFormSubmit);
}

/**
 * Validate a single field
 */
function validateField(field) {
  const group = field.closest('.form-group');
  let isValid = true;
  
  if (field.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(field.value);
  } else if (field.type === 'checkbox') {
    isValid = field.checked;
  } else if (field.id === 'vat_number') {
    // BTW-nummer validatie (BE, NL, of ander Europees formaat)
    const vatValue = field.value.trim().toUpperCase().replace(/\s/g, '');
    // Accepteer BE, NL, DE, FR, LU formaten of lege waarde als niet required
    const vatRegex = /^(BE[0-9]{9,10}|NL[0-9]{9}B[0-9]{2}|DE[0-9]{9}|FR[A-Z0-9]{2}[0-9]{9}|LU[0-9]{8})$/;
    isValid = vatRegex.test(vatValue) || (!field.required && vatValue === '');
    // Update field value to uppercase
    if (vatValue) field.value = vatValue;
  } else {
    isValid = field.value.trim() !== '';
  }
  
  if (isValid) {
    group.classList.remove('has-error');
    field.classList.remove('error');
  } else {
    group.classList.add('has-error');
    field.classList.add('error');
  }
  
  return isValid;
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (isSubmitting) return;
  
  const form = e.target;
  
  // Validate all required fields
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  if (!isValid) {
    // Scroll to first error
    const firstError = form.querySelector('.has-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Show loading state
  isSubmitting = true;
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  
  btnText.style.display = 'none';
  btnLoading.style.display = 'flex';
  submitBtn.disabled = true;
  
  // Collect form data
  const formData = new FormData(form);
  
  // Get cart items from quote cart service
  let cartItems = [];
  if (typeof window.quoteCart !== 'undefined') {
    cartItems = window.quoteCart.getItems();
  }
  
  const quoteData = {
    // Required fields
    customer_name: formData.get('customer_name'),
    customer_email: formData.get('customer_email'),
    
    // B2B required fields
    company_name: formData.get('company_name'),
    vat_number: formData.get('vat_number'),
    
    // Optional fields
    customer_phone: formData.get('customer_phone') || null,
    
    // Request details
    request_type: formData.get('request_type'),
    product_category: formData.get('product_category') || null,
    product_id: formData.get('product_id') || null,
    product_slug: formData.get('product_slug') || null,
    
    // Machine info - use custom brand if "anders" is selected
    machine_brand: formData.get('machine_brand') === 'anders' 
      ? formData.get('custom_brand') 
      : formData.get('machine_brand') || null,
    machine_model: formData.get('machine_model') || null,
    attachment_type: formData.get('attachment_type') || null,
    
    // Message
    message: formData.get('message') || null,
    
    // Cart items (products in quote basket)
    cart_items: cartItems.length > 0 ? cartItems : null,
    
    // Prefilled product details (auto-filled from product page)
    prefilled_product_name: formData.get('prefilled_product_name') || null,
    prefilled_product_category: formData.get('prefilled_product_category') || null,
    prefilled_product_brand: formData.get('prefilled_product_brand') || null,
    prefilled_product_tonnage: formData.get('prefilled_product_tonnage') || null,
    
    // Tracking
    source_page: formData.get('source_page') || window.location.href,
    industry: formData.get('industry') || null,
    brand: formData.get('brand') || null,
    
    // Generate slug for CMS
    // Format: quote-{date}-{name-slug}
    slug: generateQuoteSlug(formData.get('customer_name'))
  };
  
  console.log('📤 Submitting quote:', quoteData);
  
  try {
    // Submit to CMS API
    const response = await quotes.submit(quoteData);
    
    console.log('✅ Quote submitted successfully:', response);
    
    // Show success message
    showSuccessMessage(response.reference || response.id || generateReference());
    
  } catch (error) {
    console.error('❌ Quote submission failed:', error);
    
    // Show error message
    showErrorMessage(error.message || 'Er is een fout opgetreden. Probeer het later opnieuw.');
    
    // Reset button state
    btnText.style.display = 'block';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
    isSubmitting = false;
  }
}

/**
 * Generate a slug for the quote in CMS
 * Format: quote-YYYYMMDD-name-slug
 */
function generateQuoteSlug(customerName) {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const nameSlug = customerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);
  
  return `quote-${dateStr}-${nameSlug}`;
}

/**
 * Generate a reference number for display
 */
function generateReference() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `STR-${year}${month}-${random}`;
}

/**
 * Show success message
 */
function showSuccessMessage(reference) {
  const form = document.getElementById('quote-form');
  const successDiv = document.getElementById('form-success');
  const referenceSpan = document.getElementById('quote-reference');
  
  if (form && successDiv) {
    form.style.display = 'none';
    successDiv.style.display = 'block';
    
    if (referenceSpan) {
      referenceSpan.textContent = reference;
    }
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Show error message
 */
function showErrorMessage(message) {
  // Create error toast
  const toast = document.createElement('div');
  toast.className = 'form-error-toast';
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 400px;
    animation: slideIn 0.3s ease;
  `;
  toast.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/**
 * Clear prefilled product (called from HTML onclick)
 */
window.clearPrefilledProduct = function() {
  const prefilledGroup = document.getElementById('product-prefilled');
  const selectionGroup = document.getElementById('product-selection-group');
  
  document.getElementById('product-id').value = '';
  document.getElementById('product-slug').value = '';
  
  if (prefilledGroup) prefilledGroup.style.display = 'none';
  if (selectionGroup) selectionGroup.style.display = 'block';
};

// Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
