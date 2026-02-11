/**
 * Product Image Sync
 * Fetches fresh product data from API and updates images on static product pages.
 * Thumbnails are hidden by default (CSS: display:none) and only shown
 * when the API confirms there are multiple images (.has-multiple class).
 */
(function() {
  const API_BASE = 'https://structon-production.up.railway.app/api';

  // Extract product slug from URL path (last segment before trailing slash)
  const path = window.location.pathname.replace(/\/$/, '');
  const slug = path.split('/').pop();

  if (!slug) return;

  const mainImg = document.getElementById('main-product-image');
  const thumbnailsContainer = document.querySelector('.product-thumbnails');

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

      const primaryUrl = images[0].url;
      if (!primaryUrl) return;

      // Update main product image
      if (mainImg) mainImg.src = primaryUrl;

      // Handle thumbnails based on actual image count
      if (images.length > 1 && thumbnailsContainer) {
        // Multiple images: rebuild thumbnails and show them
        thumbnailsContainer.innerHTML = '';
        images.forEach((img, i) => {
          const thumb = document.createElement('div');
          thumb.className = 'product-thumbnail' + (i === 0 ? ' active' : '');
          thumb.setAttribute('data-image', img.url);
          thumb.innerHTML = `<img src="${img.url}" alt="${product.title || ''} - View ${i + 1}">`;
          thumb.addEventListener('click', function() {
            if (mainImg) mainImg.src = img.url;
            thumbnailsContainer.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
          });
          thumbnailsContainer.appendChild(thumb);
        });
        // Show thumbnails (CSS default is display:none)
        thumbnailsContainer.classList.add('has-multiple');
      }
      // If only 1 image: thumbnails stay hidden (CSS default)

      // Update data-product attributes on buttons (for quote cart image)
      document.querySelectorAll('[data-product]').forEach(btn => {
        try {
          const productData = JSON.parse(btn.getAttribute('data-product'));
          productData.image = primaryUrl;
          btn.setAttribute('data-product', JSON.stringify(productData));
        } catch(e) {}
      });
    })
    .catch(() => {
      // Silently fail - static images remain as fallback
    });
})();
