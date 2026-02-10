/**
 * Structon - Home Page JavaScript
 * Optimized for fast loading with intersection observer
 */

import { products } from '../api/client.js';
import { createProductCard, showLoading } from '../main.js';

// Use requestIdleCallback for non-critical initialization
const scheduleTask = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

// Fallback products when API is unavailable
const FALLBACK_PRODUCTS = [
  {
    id: 'fb-1',
    title: 'Dieplepelbak 600mm',
    slug: 'dieplepelbak-600mm',
    description: 'Robuuste dieplepelbak voor grondverzet. Vervaardigd uit Hardox 450 staal.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'dieplepelbakken',
    weight: 85,
    volume: 120,
    width: 600,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831686/CM20190621-473fb-e9a23_umfdbh.jpg' }]
  },
  {
    id: 'fb-2',
    title: 'Slotenbak 400mm',
    slug: 'slotenbak-400mm',
    description: 'Smalle slotenbak voor precisiewerk. Ideaal voor kabels en leidingen.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'sleuvenbakken',
    weight: 65,
    volume: 80,
    width: 400,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831820/volvo_n1v8j7.jpg' }]
  },
  {
    id: 'fb-3',
    title: 'Rioolbak 300mm',
    slug: 'rioolbak-300mm',
    description: 'Gespecialiseerde rioolbak voor drainage en rioleringswerkzaamheden.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'rioolbakken',
    weight: 55,
    volume: 60,
    width: 300,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831686/CM20190621-473fb-e9a23_umfdbh.jpg' }]
  },
  {
    id: 'fb-4',
    title: 'Dieplepelbak 800mm',
    slug: 'dieplepelbak-800mm',
    description: 'Brede dieplepelbak voor grote grondverzet projecten.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'dieplepelbakken',
    weight: 120,
    volume: 180,
    width: 800,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831820/volvo_n1v8j7.jpg' }]
  },
  {
    id: 'fb-5',
    title: 'Sorteergrijper 600mm',
    slug: 'sorteergrijper-600mm',
    description: 'Krachtige sorteergrijper voor efficiënt sorteren en verplaatsen.',
    category_title: 'Sorteergrijpers',
    category_slug: 'sorteergrijpers',
    subcategory_slug: null,
    weight: 450,
    volume: null,
    width: 600,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831686/CM20190621-473fb-e9a23_umfdbh.jpg' }]
  },
  {
    id: 'fb-6',
    title: 'Slotenbak 500mm',
    slug: 'slotenbak-500mm',
    description: 'Veelzijdige slotenbak voor diverse grondwerkzaamheden.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'sleuvenbakken',
    weight: 75,
    volume: 95,
    width: 500,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831820/volvo_n1v8j7.jpg' }]
  },
  {
    id: 'fb-7',
    title: 'Dieplepelbak 1000mm',
    slug: 'dieplepelbak-1000mm',
    description: 'Extra brede dieplepelbak voor grootschalige projecten.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'dieplepelbakken',
    weight: 150,
    volume: 250,
    width: 1000,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831686/CM20190621-473fb-e9a23_umfdbh.jpg' }]
  },
  {
    id: 'fb-8',
    title: 'Rioolbak 450mm',
    slug: 'rioolbak-450mm',
    description: 'Professionele rioolbak voor drainage systemen.',
    category_title: 'Graafbakken',
    category_slug: 'graafbakken',
    subcategory_slug: 'rioolbakken',
    weight: 70,
    volume: 85,
    width: 450,
    cloudinary_images: [{ url: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1768831820/volvo_n1v8j7.jpg' }]
  }
];

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

  // Skip if products are already hardcoded in HTML
  const existingSlides = container.querySelectorAll('.swiper-slide');
  if (existingSlides.length > 0) {
    waitForSwiper();
    return;
  }

  // Check login status for price visibility
  const isLoggedIn = !!(localStorage.getItem('token') || localStorage.getItem('auth_token'));

  let selected = FALLBACK_PRODUCTS.slice(0, 8);

  // Render products immediately
  container.innerHTML = selected.map(p => `
    <div class="swiper-slide">
      ${createProductCard(p, isLoggedIn)}
    </div>
  `).join('');
  
  // Initialize Swiper - retry until library is loaded
  waitForSwiper();
}

/**
 * Wait for Swiper library to be available, then initialize
 */
function waitForSwiper(attempts = 0) {
  if (typeof Swiper !== 'undefined') {
    initSwiper();
    return;
  }
  if (attempts < 20) {
    setTimeout(() => waitForSwiper(attempts + 1), 200);
  } else {
    console.warn('Swiper library failed to load after 4s');
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

