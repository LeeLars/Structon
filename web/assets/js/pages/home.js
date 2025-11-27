/**
 * Structon - Home Page JavaScript
 */

import { products } from '../api/client.js';
import { createProductCard, showLoading } from '../main.js';

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
});

/**
 * Load featured products (Random selection)
 */
async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products-grid');
  if (!container) return;

  showLoading(container);

  // Check login status for price visibility
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  try {
    // Fetch featured products
    const data = await products.getFeatured(12); // Get more to shuffle
    
    if (data.products && data.products.length > 0) {
      // Shuffle array
      const shuffled = data.products.sort(() => 0.5 - Math.random());
      // Take first 4
      const selected = shuffled.slice(0, 4);
      
      container.innerHTML = selected.map(p => createProductCard(p, isLoggedIn)).join('');
    } else {
      container.innerHTML = `
        <div class="no-results" style="grid-column: 1/-1;">
          <p>Binnenkort beschikbaar</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading featured products:', error);
    // Fallback to demo products if API fails
    const demo = getDemoProducts().sort(() => 0.5 - Math.random()).slice(0, 4);
    container.innerHTML = demo.map(p => createProductCard(p, isLoggedIn)).join('');
  }
}

/**
 * Demo products for when API is not available
 */
function getDemoProducts() {
  return [
    {
      id: '1',
      title: 'Slotenbak 300mm CW10',
      slug: 'slotenbak-300mm-cw10',
      category_title: 'Slotenbakken',
      volume: 80,
      width: 300,
      attachment_type: 'CW10',
      cloudinary_images: [{ url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=400&fit=crop' }]
    },
    {
      id: '2',
      title: 'Dieplepelbak 600mm CW10',
      slug: 'dieplepelbak-600mm-cw10',
      category_title: 'Dieplepelbakken',
      volume: 180,
      width: 600,
      attachment_type: 'CW10',
      cloudinary_images: [{ url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop' }]
    },
    {
      id: '3',
      title: 'Slotenbak 400mm CW10',
      slug: 'slotenbak-400mm-cw10',
      category_title: 'Slotenbakken',
      volume: 120,
      width: 400,
      attachment_type: 'CW10',
      cloudinary_images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop' }]
    },
    {
      id: '4',
      title: 'Puinbak 1200mm CW30',
      slug: 'puinbak-1200mm-cw30',
      category_title: 'Puinbakken',
      volume: 800,
      width: 1200,
      attachment_type: 'CW30',
      cloudinary_images: [{ url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop' }]
    }
  ];
}
