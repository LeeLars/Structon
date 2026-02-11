/**
 * Featured Products Loader
 * Standalone script for static product detail pages.
 * Loads and renders featured products in a 4-column grid.
 */
import { products } from '../api/client.js';
import { createProductCard } from '../main.js';

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
});

async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products-grid');
  if (!container) return;

  const section = document.getElementById('featured-products-section');
  const isLoggedIn = !!(localStorage.getItem('token') || localStorage.getItem('auth_token'));

  try {
    const data = await products.getAll({ limit: 50 });
    let allProducts = data.items || [];

    // Get current product slug from URL to exclude it
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const currentSlug = pathParts[pathParts.length - 1] || '';

    // Filter out current product
    allProducts = allProducts.filter(p => p.slug !== currentSlug);

    if (allProducts.length === 0) {
      if (section) section.style.display = 'none';
      return;
    }

    // Select up to 4 diverse products
    const selected = selectDiverseProducts(allProducts, 4);

    container.innerHTML = selected.map(p => createProductCard(p, isLoggedIn)).join('');
    if (section) section.style.display = 'block';

  } catch (error) {
    console.error('Error loading featured products:', error);
    if (section) section.style.display = 'none';
  }
}

/**
 * Select diverse products from different categories
 */
function selectDiverseProducts(products, count) {
  if (products.length <= count) return products;

  const byCategory = {};
  products.forEach(p => {
    const cat = p.category_slug || 'other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p);
  });

  const categories = Object.keys(byCategory);
  const selected = [];
  let catIndex = 0;

  while (selected.length < count && selected.length < products.length) {
    const cat = categories[catIndex % categories.length];
    const available = byCategory[cat].filter(p => !selected.includes(p));
    if (available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      selected.push(available[randomIndex]);
    }
    catIndex++;
    if (catIndex > categories.length * count) break;
  }

  return selected;
}
