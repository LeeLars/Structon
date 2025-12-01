/**
 * FAQ Page
 * Handles accordion functionality and search
 */

document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initSearch();
  initSmoothScroll();
});

/**
 * Initialize FAQ accordion
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Toggle active state
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Initialize search functionality
 */
function initSearch() {
  const searchInput = document.getElementById('faq-search-input');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query === '') {
      // Show all items
      showAllItems();
      return;
    }
    
    // Search through FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    const categories = document.querySelectorAll('.faq-category');
    
    categories.forEach(category => {
      let hasVisibleItems = false;
      const categoryItems = category.querySelectorAll('.faq-item');
      
      categoryItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(query) || answer.includes(query)) {
          item.classList.remove('hidden');
          item.classList.add('active'); // Open matching items
          hasVisibleItems = true;
        } else {
          item.classList.add('hidden');
          item.classList.remove('active');
        }
      });
      
      // Hide category if no visible items
      if (hasVisibleItems) {
        category.classList.remove('hidden');
      } else {
        category.classList.add('hidden');
      }
    });
  });
}

/**
 * Show all FAQ items
 */
function showAllItems() {
  const faqItems = document.querySelectorAll('.faq-item');
  const categories = document.querySelectorAll('.faq-category');
  
  faqItems.forEach(item => {
    item.classList.remove('hidden');
    item.classList.remove('active');
  });
  
  categories.forEach(category => {
    category.classList.remove('hidden');
  });
}

/**
 * Initialize smooth scroll for category navigation
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.faq-nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active state
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Scroll to category
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const offset = 100; // Account for fixed header
        const targetPosition = targetElement.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Update active nav link on scroll
  window.addEventListener('scroll', updateActiveNavLink);
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
  const categories = document.querySelectorAll('.faq-category');
  const navLinks = document.querySelectorAll('.faq-nav-link');
  
  let currentCategory = '';
  
  categories.forEach(category => {
    const rect = category.getBoundingClientRect();
    if (rect.top <= 150 && rect.bottom >= 150) {
      currentCategory = category.id;
    }
  });
  
  if (currentCategory) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      if (href === currentCategory) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
