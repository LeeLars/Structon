/**
 * Structon - Category Page JavaScript
 */

import { products, categories } from '../api/client.js';
import { createProductCard, showLoading, showError, showNoResults } from '../main.js';
import { initFilters, getActiveFilters } from '../filters.js';
import { initPagination, updatePagination, getOffset, getItemsPerPage } from '../pagination.js';

let allProducts = [];
let currentCategory = null;

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
    filters.limit = getItemsPerPage();
    filters.offset = getOffset();

    const data = await products.getAll(filters);
    
    allProducts = data.products || [];
    const total = data.total || allProducts.length;

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
 * Render products to grid
 */
function renderProducts(productList) {
  const container = document.getElementById('products-grid');
  if (!container) return;

  if (productList.length === 0) {
    showNoResults(container, 'Geen producten gevonden met de huidige filters.');
    return;
  }

  container.innerHTML = productList.map(createProductCard).join('');
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
