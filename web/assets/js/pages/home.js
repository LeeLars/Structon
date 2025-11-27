/**
 * Structon - Home Page JavaScript
 */

import { products, categories } from '../api/client.js';
import { createProductCard, showLoading, showError } from '../main.js';

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
  loadCategories();
});

/**
 * Load featured products
 */
async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;

  showLoading(container);

  try {
    const data = await products.getFeatured(8);
    
    if (data.products && data.products.length > 0) {
      container.innerHTML = data.products.map(createProductCard).join('');
    } else {
      container.innerHTML = `
        <div class="no-results" style="grid-column: 1/-1;">
          <p>Binnenkort beschikbaar</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading featured products:', error);
    // Show placeholder products for demo
    container.innerHTML = getDemoProducts().map(createProductCard).join('');
  }
}

/**
 * Load categories for hero section
 */
async function loadCategories() {
  const container = document.getElementById('hero-categories');
  if (!container) return;

  try {
    const data = await categories.getAll(true);
    
    if (data.categories && data.categories.length > 0) {
      // Only show first 3 categories
      const topCategories = data.categories.slice(0, 3);
      container.innerHTML = topCategories.map(cat => `
        <a href="pages/category.html?cat=${cat.slug}" class="hero-category">
          <img src="${cat.image_url || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=450&fit=crop'}" 
               alt="${cat.title}">
          <div class="hero-category-overlay">
            <h3 class="hero-category-title">${cat.title}</h3>
          </div>
        </a>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    // Keep default HTML
  }
}

/**
 * Demo products for when API is not available
 */
function getDemoProducts() {
  return [
    {
      id: '1',
      title: 'Slotenbak 300mm',
      slug: 'slotenbak-300mm',
      category_title: 'Slotenbakken',
      volume: 150,
      width: 300,
      attachment_type: 'CW10',
      cloudinary_images: [{ url: 'https://via.placeholder.com/400x400?text=Slotenbak+300mm' }]
    },
    {
      id: '2',
      title: 'Dieplepelbak 600mm',
      slug: 'dieplepelbak-600mm',
      category_title: 'Dieplepelbakken',
      volume: 350,
      width: 600,
      attachment_type: 'CW20',
      cloudinary_images: [{ url: 'https://via.placeholder.com/400x400?text=Dieplepelbak+600mm' }]
    },
    {
      id: '3',
      title: 'Slotenbak 400mm',
      slug: 'slotenbak-400mm',
      category_title: 'Slotenbakken',
      volume: 200,
      width: 400,
      attachment_type: 'CW10',
      cloudinary_images: [{ url: 'https://via.placeholder.com/400x400?text=Slotenbak+400mm' }]
    },
    {
      id: '4',
      title: 'Puinbak 1000mm',
      slug: 'puinbak-1000mm',
      category_title: 'Puinbakken',
      volume: 800,
      width: 1000,
      attachment_type: 'CW30',
      cloudinary_images: [{ url: 'https://via.placeholder.com/400x400?text=Puinbak+1000mm' }]
    }
  ];
}
