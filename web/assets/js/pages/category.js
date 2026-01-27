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
    
    allProducts = data.items || [];
    const total = data.total || allProducts.length;

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
