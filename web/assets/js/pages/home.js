/**
 * Structon - Home Page JavaScript
 * Optimized for fast loading with intersection observer
 */

import { products } from '../api/client.js';
import { createProductCard, showLoading } from '../main.js';

// Use requestIdleCallback for non-critical initialization
const scheduleTask = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

document.addEventListener('DOMContentLoaded', () => {
  // Initialize header scroll behavior
  initHeaderScroll();
  
  // Initialize FAQ accordion
  initFaqAccordion();
  
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
 * Initialize header scroll behavior
 * Shows top-bar when scrolling up, hides when scrolling down
 */
function initHeaderScroll() {
  const headerWrapper = document.getElementById('header-wrapper');
  if (!headerWrapper) return;
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function updateHeader() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY < 50) {
      // At top of page - show everything
      headerWrapper.classList.remove('scrolled-down', 'scrolled-up');
    } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down - hide top bar
      headerWrapper.classList.add('scrolled-down');
      headerWrapper.classList.remove('scrolled-up');
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up - show top bar
      headerWrapper.classList.add('scrolled-up');
      headerWrapper.classList.remove('scrolled-down');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeader();
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
        question.setAttribute('aria-expanded', !isActive);
      });
    }
  });
}

/**
 * Load featured products (Auto-selection from all products)
 * No longer requires CMS 'is_featured' flag - automatically selects diverse products
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
    // Fetch ALL products (not just featured) - auto-select diverse mix
    const data = await products.getAll({ limit: 50 });
    
    if (data.items && data.items.length > 0) {
      // Smart selection: pick diverse products from different categories
      selected = selectDiverseProducts(data.items, 8);
      console.log(`✅ Auto-selected ${selected.length} featured products from ${data.items.length} total`);
    }
  } catch (error) {
    console.error('Error loading featured products:', error);
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

/**
 * Select diverse products from different categories
 * Ensures a good mix of product types for the featured section
 */
function selectDiverseProducts(allProducts, count) {
  if (!allProducts || allProducts.length === 0) return [];
  
  // Group products by category
  const byCategory = {};
  allProducts.forEach(p => {
    const cat = p.category_slug || 'other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p);
  });
  
  // Shuffle products within each category
  Object.keys(byCategory).forEach(cat => {
    byCategory[cat].sort(() => 0.5 - Math.random());
  });
  
  // Pick products round-robin from each category for diversity
  const categories = Object.keys(byCategory);
  const selected = [];
  let catIndex = 0;
  
  while (selected.length < count && categories.length > 0) {
    const cat = categories[catIndex % categories.length];
    const catProducts = byCategory[cat];
    
    if (catProducts.length > 0) {
      selected.push(catProducts.shift());
    } else {
      // Remove empty category
      categories.splice(catIndex % categories.length, 1);
      if (categories.length === 0) break;
      continue;
    }
    catIndex++;
  }
  
  // Final shuffle to mix categories in display
  return selected.sort(() => 0.5 - Math.random());
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

