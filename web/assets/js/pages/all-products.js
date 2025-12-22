/**
 * All Products Page
 * Displays all available products with filters
 */

import { products } from '../api/client.js';
import { createProductCardHorizontal, showLoading, showError, showNoResults } from '../main.js';
import { initFilters, getActiveFilters } from '../filters.js';
import { initPagination, updatePagination, getOffset, getItemsPerPage } from '../pagination.js';

let allProducts = [];

// Check if user is logged in
const isLoggedIn = localStorage.getItem('authToken') !== null;

document.addEventListener('DOMContentLoaded', () => {
  initPage();
});

/**
 * Initialize page
 */
async function initPage() {
  // Initialize filters with callback
  initFilters(handleFilterChange);
  
  // Load initial products
  await loadProducts();
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
    
    allProducts = data.items || [];
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
