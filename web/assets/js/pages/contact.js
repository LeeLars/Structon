/**
 * Structon - Contact & Quote Form JavaScript
 * Handles form submission to CMS with validation and confirmation emails
 */

import { quotes } from '../api/client.js';

// Form state
let isSubmitting = false;

/**
 * Initialize contact page
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('📝 Contact page initialized');
  
  // Parse URL parameters for pre-filling
  parseUrlParameters();
  
  // Setup form validation and submission
  setupFormHandling();
  
  // Setup request type toggle
  setupRequestTypeToggle();
});

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
  
  if (productId || productSlug || productName) {
    document.getElementById('product-id').value = productId || '';
    document.getElementById('product-slug').value = productSlug || '';
    
    // Show prefilled product
    const prefilledGroup = document.getElementById('product-prefilled');
    const prefilledName = document.getElementById('prefilled-product-name');
    const selectionGroup = document.getElementById('product-selection-group');
    
    if (productName && prefilledGroup && prefilledName) {
      prefilledName.textContent = decodeURIComponent(productName);
      prefilledGroup.style.display = 'block';
      if (selectionGroup) selectionGroup.style.display = 'none';
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
}

/**
 * Setup request type toggle (changes submit button text)
 */
function setupRequestTypeToggle() {
  const radioButtons = document.querySelectorAll('input[name="request_type"]');
  const submitBtn = document.querySelector('.btn-text');
  
  radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const labels = {
        'offerte': 'Offerte Aanvragen',
        'vraag': 'Vraag Versturen',
        'maatwerk': 'Maatwerk Aanvragen'
      };
      if (submitBtn) {
        submitBtn.textContent = labels[e.target.value] || 'Verzenden';
      }
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
  const quoteData = {
    // Required fields
    customer_name: formData.get('customer_name'),
    customer_email: formData.get('customer_email'),
    
    // Optional fields
    customer_phone: formData.get('customer_phone') || null,
    company_name: formData.get('company_name') || null,
    
    // Request details
    request_type: formData.get('request_type'),
    product_category: formData.get('product_category') || null,
    product_id: formData.get('product_id') || null,
    product_slug: formData.get('product_slug') || null,
    
    // Machine info
    machine_brand: formData.get('machine_brand') || null,
    machine_model: formData.get('machine_model') || null,
    attachment_type: formData.get('attachment_type') || null,
    
    // Message
    message: formData.get('message') || null,
    
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
