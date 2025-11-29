/**
 * All Products Page
 * Displays all available products in horizontal card layout
 */

import { products as productsAPI } from '../api/client.js';
import { createProductCardHorizontal, showLoading, showError } from '../main.js';

// Check if user is logged in
const isLoggedIn = localStorage.getItem('authToken') !== null;

/**
 * Load and display all products
 */
async function loadAllProducts() {
  const container = document.getElementById('all-products-grid');
  
  if (!container) return;
  
  // Show loading state
  container.innerHTML = `
    <div class="products-loading">
      <div class="spinner"></div>
      <p>Producten laden...</p>
    </div>
  `;
  
  try {
    // Fetch all products (no filters)
    const response = await productsAPI.getAll();
    
    // Handle both array and object response formats
    const allProducts = Array.isArray(response) ? response : (response?.products || []);
    
    console.log('📦 Products response:', response);
    console.log('📦 Products array:', allProducts.length, 'items');
    
    if (!allProducts || allProducts.length === 0) {
      container.innerHTML = `
        <div class="products-empty">
          <h3>Geen producten gevonden</h3>
          <p>Er zijn momenteel geen producten beschikbaar.</p>
        </div>
      `;
      return;
    }
    
    // Update product count if element exists
    const countEl = document.getElementById('products-count');
    if (countEl) {
      countEl.textContent = `${allProducts.length} producten`;
    }
    
    // Change container to products-list for horizontal layout
    container.className = 'products-list';
    
    // Render products with horizontal cards
    container.innerHTML = allProducts.map(product => 
      createProductCardHorizontal(product, isLoggedIn)
    ).join('');
    
    console.log(`✅ Loaded ${allProducts.length} products`);
    
  } catch (error) {
    console.error('Error loading products:', error);
    container.innerHTML = `
      <div class="products-empty">
        <h3>Oeps!</h3>
        <p>Kon producten niet laden. Probeer het later opnieuw.</p>
      </div>
    `;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadAllProducts();
});
