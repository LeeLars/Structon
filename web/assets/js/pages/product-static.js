/**
 * Structon - Static Product Page Interactions
 * Handles tabs and gallery interactions for statically generated product pages
 */

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupThumbnails();
  setupLightbox();
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
  
  // Expose global function for compatibility
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

      // Update main image with smooth transition
      const newSrc = thumb.getAttribute('data-image') || thumb.querySelector('img').src;
      mainImage.style.opacity = '0.5';
      mainImage.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = '1';
        mainImage.style.transform = 'scale(1)';
      }, 200);
    });
  });
}

/**
 * Setup Lightbox for Gallery
 */
function setupLightbox() {
  const mainImage = document.getElementById('main-product-image');
  const thumbnails = document.querySelectorAll('.product-thumbnail');
  
  if (!mainImage) return;
  
  // Collect all images
  const images = [];
  
  // Add main image first
  if (mainImage.src) images.push(mainImage.src);
  
  // Add thumbnail images
  thumbnails.forEach(thumb => {
    const imgSrc = thumb.getAttribute('data-image') || thumb.querySelector('img')?.src;
    if (imgSrc && !images.includes(imgSrc)) {
      images.push(imgSrc);
    }
  });
  
  // Main image click opens lightbox
  const mainImageWrapper = mainImage.closest('.product-main-image, .product-image-main');
  if (mainImageWrapper) {
    mainImageWrapper.addEventListener('click', () => {
      if (window.structonLightbox && images.length > 0) {
        const currentIndex = images.indexOf(mainImage.src);
        window.structonLightbox.open(images, currentIndex >= 0 ? currentIndex : 0);
      }
    });
  }
}
