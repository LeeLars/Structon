/**
 * Product Image Sync
 * Fetches fresh product data from API and updates images on static product pages.
 * This ensures images are always up-to-date after CMS changes.
 */
(function() {
  const API_BASE = 'https://structon-production.up.railway.app/api';

  // Extract product slug from URL path (last segment before trailing slash)
  const path = window.location.pathname.replace(/\/$/, '');
  const slug = path.split('/').pop();

  if (!slug) return;

  fetch(`${API_BASE}/products/${slug}?_t=${Date.now()}`, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    })
    .then(data => {
      const product = data.product || data;
      if (!product) return;

      // Parse cloudinary_images
      let images = product.cloudinary_images || [];
      if (typeof images === 'string') {
        try { images = JSON.parse(images); } catch(e) { images = []; }
      }
      if (!Array.isArray(images) || images.length === 0) return;

      const newUrl = images[0].url;
      if (!newUrl) return;

      // Update main product image
      const mainImg = document.getElementById('main-product-image');
      if (mainImg && mainImg.src !== newUrl) {
        mainImg.src = newUrl;
      }

      // Update thumbnails - remove extras if fewer images than thumbnails
      const thumbnailsContainer = document.querySelector('.product-thumbnails');
      const thumbnails = document.querySelectorAll('.product-thumbnail');
      
      if (images.length <= 1 && thumbnailsContainer) {
        // Hide thumbnails entirely if only 1 image
        thumbnailsContainer.style.display = 'none';
      } else if (thumbnailsContainer) {
        thumbnails.forEach((thumb, i) => {
          if (i < images.length) {
            thumb.setAttribute('data-image', images[i].url);
            const img = thumb.querySelector('img');
            if (img) img.src = images[i].url;
          } else {
            // Remove thumbnail if no corresponding image
            thumb.remove();
          }
        });
      }

      // Update data-product attributes on buttons (for quote cart image)
      document.querySelectorAll('[data-product]').forEach(btn => {
        try {
          const productData = JSON.parse(btn.getAttribute('data-product'));
          productData.image = newUrl;
          btn.setAttribute('data-product', JSON.stringify(productData));
        } catch(e) {}
      });
    })
    .catch(() => {
      // Silently fail - static images remain as fallback
    });
})();
