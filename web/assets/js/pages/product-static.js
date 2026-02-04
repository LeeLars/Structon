/**
 * Structon - Static Product Page Interactions
 * Handles tabs and gallery interactions for statically generated product pages
 */

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupThumbnails();
  setupScrollAnimations();
});

/**
 * Setup Tabs
 */
function setupTabs() {
  const tabs = document.querySelectorAll('.product-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      document.querySelectorAll('.product-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.product-tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Find and activate corresponding content
      // Logic: Index based or specific naming convention
      // In generated HTML: onclick="switchTab('specs')" which we want to replace with event listeners
      // But we can also look at text content or attributes.
      
      // Since the inline script used 'specs' and 'description', let's try to map them if possible
      // Or relies on index.
      
      // Let's assume the order: 1st tab -> 1st content, 2nd tab -> 2nd content
      // Or use a data-target attribute if we update the HTML generator.
      
      // For now, let's look at the generated HTML structure:
      // Tab 1 (Specs) -> #tab-specs
      // Tab 2 (Desc) -> #tab-description
      
      const tabText = tab.textContent.trim().toLowerCase();
      let targetId = '';
      
      if (tabText.includes('specificaties')) {
        targetId = 'tab-specs';
      } else if (tabText.includes('omschrijving')) {
        targetId = 'tab-description';
      }
      
      if (targetId) {
        document.getElementById(targetId)?.classList.add('active');
      }
    });
  });
  
  // Expose global function for compatibility if needed, but prefer event listeners
  window.switchTab = function(tabName) {
    const targetTab = Array.from(tabs).find(t => {
      if (tabName === 'specs') return t.textContent.toLowerCase().includes('specificaties');
      if (tabName === 'description') return t.textContent.toLowerCase().includes('omschrijving');
      return false;
    });
    
    if (targetTab) targetTab.click();
  };
}

/**
 * Setup Thumbnails
 */
function setupThumbnails() {
  const thumbnails = document.querySelectorAll('.product-thumbnail');
  const mainImage = document.getElementById('main-product-image');
  
  if (!thumbnails.length || !mainImage) return;

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update active state
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      // Update main image
      const newSrc = thumb.getAttribute('data-image') || thumb.querySelector('img').src;
      mainImage.style.opacity = '0.5';
      
      setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = '1';
      }, 200);
    });
  });
}

/**
 * Setup Scroll Animations
 * Uses IntersectionObserver to reveal elements as they enter viewport
 */
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe product detail cards
  const detailCards = document.querySelectorAll('.product-detail-card');
  detailCards.forEach(card => {
    card.classList.add('scroll-reveal');
    observer.observe(card);
  });

  // Observe specifications section
  const specsSection = document.querySelector('.specifications-section');
  if (specsSection) {
    specsSection.classList.add('scroll-reveal');
    observer.observe(specsSection);
  }

  // Observe expert box
  const expertBox = document.querySelector('.expert-box');
  if (expertBox) {
    expertBox.classList.add('scroll-reveal');
    observer.observe(expertBox);
  }
}
