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

  fetch(`${API_BASE}/products/${slug}`)
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

      // Update thumbnails
      const thumbnails = document.querySelectorAll('.product-thumbnail');
      thumbnails.forEach((thumb, i) => {
        const imgUrl = images[i]?.url || newUrl;
        thumb.setAttribute('data-image', imgUrl);
        const img = thumb.querySelector('img');
        if (img) img.src = imgUrl;
      });

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
