/**
 * All Products Page
 * Displays all available products in a grid
 */

import { products as productsAPI } from '../api/client.js';
import { createProductCard, showLoading, showError } from '../main.js';

// Check if user is logged in
const isLoggedIn = localStorage.getItem('authToken') !== null;

/**
 * Load and display all products
 */
async function loadAllProducts() {
  const grid = document.getElementById('all-products-grid');
  
  if (!grid) return;
  
  showLoading(grid);
  
  try {
    // Fetch all products (no filters)
    const allProducts = await productsAPI.getAll();
    
    if (!allProducts || allProducts.length === 0) {
      grid.innerHTML = '<div class="no-results"><h3>Geen producten gevonden</h3><p>Er zijn momenteel geen producten beschikbaar.</p></div>';
      return;
    }
    
    // Render products
    grid.innerHTML = allProducts.map(product => createProductCard(product, isLoggedIn)).join('');
    
    console.log(`✅ Loaded ${allProducts.length} products`);
    
  } catch (error) {
    console.error('Error loading products:', error);
    showError(grid, 'Kon producten niet laden. Probeer het later opnieuw.');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadAllProducts();
});
