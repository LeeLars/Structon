/**
 * Structon - Category Page JavaScript
 */

import { products, categories } from '../api/client.js';
import { createProductCardHorizontal, showLoading, showError, showNoResults } from '../main.js';
import { initFilters, getActiveFilters } from '../filters.js';
import { initPagination, updatePagination, getOffset, getItemsPerPage } from '../pagination.js';
import { loadProductPrices } from '../pricing.js';

let allProducts = [];
let currentCategory = null;

// Check if user is logged in
const isLoggedIn = localStorage.getItem('authToken') !== null;

document.addEventListener('DOMContentLoaded', () => {
  initPage();
});

/**
 * Initialize page
 */
async function initPage() {
  // Get category from URL
  const params = new URLSearchParams(window.location.search);
  const categorySlug = params.get('cat');

  if (categorySlug) {
    await loadCategory(categorySlug);
  }

  // Initialize filters with callback
  initFilters(handleFilterChange);

  // Load initial products
  await loadProducts();
}

/**
 * Load category info
 */
async function loadCategory(slug) {
  try {
    const data = await categories.getBySlug(slug);
    currentCategory = data.category;

    // Update page title and breadcrumb
    document.getElementById('page-title').textContent = currentCategory.title;
    document.getElementById('page-subtitle').textContent = currentCategory.description || `Bekijk ons assortiment ${currentCategory.title.toLowerCase()}.`;
    document.getElementById('breadcrumb-category').textContent = currentCategory.title;
    document.title = `${currentCategory.title} | Structon`;
  } catch (error) {
    console.error('Error loading category:', error);
  }
}

/**
 * Load products
 */
async function loadProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  showLoading(container);

  try {
    const filters = getActiveFilters();
    
    // CRITICAL: Ensure category_slug is always set from URL
    const params = new URLSearchParams(window.location.search);
    const categorySlug = params.get('cat');
    if (categorySlug) {
      filters.category_slug = categorySlug;
    }
    
    filters.limit = getItemsPerPage();
    filters.offset = getOffset();

    console.log('🔍 Loading products with filters:', filters);

    const data = await products.getAll(filters);
    
    let filteredProducts = data.items || [];
    
    // Apply client-side excavator weight filter (API doesn't support this filter)
    if (filters.excavator_weight_ranges && filters.excavator_weight_ranges.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        return filters.excavator_weight_ranges.some(rangeValue => {
          let minTon, maxTon;
          if (rangeValue === 1500) { minTon = 1.5; maxTon = 3; }
          else if (rangeValue === 4000) { minTon = 3; maxTon = 8; }
          else if (rangeValue === 12000) { minTon = 8; maxTon = 15; }
          else if (rangeValue === 20000) { minTon = 15; maxTon = 25; }
          else if (rangeValue === 30000) { minTon = 25; maxTon = 50; }
          else return false;
          
          const productMin = parseFloat(product.excavator_weight_min) || 0;
          const productMax = parseFloat(product.excavator_weight_max) || 0;
          return productMin <= maxTon && productMax >= minTon;
        });
      });
    }
    
    allProducts = filteredProducts;
    const total = filters.excavator_weight_ranges?.length > 0 ? filteredProducts.length : (data.total || allProducts.length);

    console.log(`✅ Loaded ${allProducts.length} products for category: ${categorySlug}`);

    // Update count
    document.getElementById('products-count').textContent = total;

    // Initialize/update pagination
    initPagination(total, handlePageChange);

    // Render products
    renderProducts(allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    showError(container, 'Kon producten niet laden. Probeer het later opnieuw.');
  }
}

/**
 * Render products with horizontal cards
 */
function renderProducts(productList) {
  const container = document.getElementById('products-grid');
  if (!container) return;

  if (productList.length === 0) {
    showNoResults(container, 'Geen producten gevonden met de huidige filters.');
    return;
  }

  // Use horizontal card layout
  container.className = 'products-list';
  container.innerHTML = productList.map(product => 
    createProductCardHorizontal(product, isLoggedIn)
  ).join('');
  
  // Load prices for all product cards
  const productElements = container.querySelectorAll('[data-product-id]');
  if (productElements.length > 0) {
    loadProductPrices(productElements);
  }
}

/**
 * Handle filter change
 */
function handleFilterChange(filters) {
  loadProducts();
}

/**
 * Handle page change
 */
function handlePageChange(page, offset) {
  loadProducts();
}
