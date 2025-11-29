/**
 * Structon - Home Page JavaScript
 * Optimized for fast loading with intersection observer
 */

import { products } from '../api/client.js';
import { createProductCard, showLoading } from '../main.js';

// Use requestIdleCallback for non-critical initialization
const scheduleTask = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

document.addEventListener('DOMContentLoaded', () => {
  // Load featured products with intersection observer for lazy loading
  const container = document.getElementById('featured-products-wrapper');
  if (container) {
    // Check if section is in viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadFeaturedProducts();
            observer.disconnect();
          }
        });
      }, { rootMargin: '200px' }); // Start loading 200px before visible
      
      observer.observe(container);
    } else {
      // Fallback for older browsers
      loadFeaturedProducts();
    }
  }
});

/**
 * Load featured products (Random selection)
 */
async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products-wrapper');
  if (!container) return;

  showLoading(container);

  // Check login status for price visibility
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  let selected = [];

  try {
    // Fetch featured products
    const data = await products.getFeatured(12); // Get more to shuffle
    
    if (data.products && data.products.length > 0) {
      // Shuffle array
      const shuffled = data.products.sort(() => 0.5 - Math.random());
      // Take first 8 for slider
      selected = shuffled.slice(0, 8);
    }
  } catch (error) {
    console.error('Error loading featured products:', error);
    // Fallback to demo products if API fails or returns empty
    selected = getDemoProducts().sort(() => 0.5 - Math.random());
  }

  if (selected.length > 0) {
    container.innerHTML = selected.map(p => `
      <div class="swiper-slide">
        ${createProductCard(p, isLoggedIn)}
      </div>
    `).join('');
    
    // Initialize Swiper
    initSwiper();
  } else {
    container.innerHTML = `
      <div class="no-results" style="width: 100%; text-align: center;">
        <p>Binnenkort beschikbaar</p>
      </div>
    `;
  }
}

function initSwiper() {
  // Check if Swiper is loaded
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper library not loaded');
    return;
  }

  new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1200: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
  });
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
