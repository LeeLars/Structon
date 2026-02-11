/**
 * Featured Products Loader
 * Fully standalone script for static product detail pages.
 * Loads and renders featured products in a 4-column grid.
 * No dependency on main.js - has its own card renderer.
 */
import { products } from '../api/client.js';

document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
});

async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products-grid');
  if (!container) {
    console.log('[FeaturedProducts] No #featured-products-grid found, skipping');
    return;
  }

  const section = document.getElementById('featured-products-section');
  const isLoggedIn = !!(localStorage.getItem('user') || localStorage.getItem('auth_token'));

  console.log('[FeaturedProducts] Loading featured products...');

  try {
    // Try featured first, fall back to all products
    let data = await products.getFeatured(8);
    let allProducts = data.items || [];

    if (allProducts.length === 0) {
      console.log('[FeaturedProducts] No featured products, falling back to all products');
      data = await products.getAll({ limit: 12 });
      allProducts = data.items || [];
    }

    console.log('[FeaturedProducts] Got', allProducts.length, 'products');

    // Get current product slug from URL to exclude it
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const currentSlug = pathParts[pathParts.length - 1] || '';

    // Filter out current product
    allProducts = allProducts.filter(p => p.slug !== currentSlug);

    if (allProducts.length === 0) {
      console.log('[FeaturedProducts] No products to show');
      if (section) section.style.display = 'none';
      return;
    }

    // Select up to 4 diverse products
    const selected = selectDiverseProducts(allProducts, 4);

    container.innerHTML = selected.map(p => buildProductCard(p, isLoggedIn)).join('');
    if (section) section.style.display = 'block';
    console.log('[FeaturedProducts] Rendered', selected.length, 'products');

  } catch (error) {
    console.error('[FeaturedProducts] Error loading:', error);
    if (section) section.style.display = 'none';
  }
}

/**
 * Build a product card HTML string (standalone, no main.js dependency)
 */
function buildProductCard(product, isLoggedIn) {
  const imageUrl = product.cloudinary_images?.[0]?.url || '';
  
  const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
  const currentPath = window.location.pathname;
  const localeMatch = currentPath.match(/\/(be-nl|nl-nl|be-fr|de-de)\//);
  const locale = localeMatch ? localeMatch[1] : 'be-nl';
  const productSlug = product.slug || product.id;
  const categorySlug = product.category_slug || 'producten';
  const subcategorySlug = product.subcategory_slug;
  const productUrl = subcategorySlug
    ? `${basePath}/${locale}/producten/${categorySlug}/${subcategorySlug}/${productSlug}/`
    : `${basePath}/${locale}/producten/${categorySlug}/${productSlug}/`;

  // Stock status
  const stock = product.stock || 0;
  let stockStatusHtml = '';
  if (stock > 5) {
    stockStatusHtml = '<span class="stock-status status-in-stock"><span class="status-dot"></span>Op voorraad</span>';
  } else if (stock > 0) {
    stockStatusHtml = '<span class="stock-status status-low-stock"><span class="status-dot"></span>Nog slechts enkele stuks</span>';
  } else {
    stockStatusHtml = '<span class="stock-status status-out-stock"><span class="status-dot"></span>Op bestelling</span>';
  }

  // Specs
  const specs = [];
  if (product.weight) specs.push(`${product.weight} kg`);
  if (product.volume) specs.push(`${product.volume} liter`);
  if (product.width) specs.push(`${product.width}mm`);
  const specsHtml = specs.length > 0
    ? `<p class="product-card-specs">${specs.join(' | ')}</p>`
    : '';

  // Footer
  let footerHtml;
  const hasPrice = isLoggedIn && product.price_excl_vat && parseFloat(product.price_excl_vat) > 0;

  if (hasPrice) {
    footerHtml = `
      <div class="product-price-row">
        <span class="product-price">&euro;${product.price_excl_vat}</span>
        <span class="product-vat">,- excl. BTW</span>
      </div>
      <a href="${productUrl}" class="btn-split btn-split-sm" style="width: 100%;">
        <span class="btn-split-text" style="flex: 1; justify-content: center;">In winkelwagen</span>
        <span class="btn-split-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </span>
      </a>
    `;
  } else {
    footerHtml = `
      <span class="product-price-label" style="display: block; margin-bottom: 8px;">Prijs op aanvraag</span>
      <div class="product-buttons">
        <a href="${productUrl}" class="btn-split btn-split-sm" style="text-decoration: none;">
          <span class="btn-split-text">Meer info</span>
          <span class="btn-split-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </a>
      </div>
    `;
  }

  return `
    <article class="product-card clean-card" data-product-id="${product.id}">
      <a href="${productUrl}" class="product-card-image">
        ${product.is_new ? '<span class="badge-new">Nieuw</span>' : ''}
        <img src="${imageUrl}" alt="${product.title}" loading="lazy">
      </a>
      <div class="product-card-divider"></div>
      <div class="product-card-content">
        <div class="product-header">
          <h3 class="product-card-title">
            <a href="${productUrl}">${product.title}</a>
          </h3>
          ${stockStatusHtml}
        </div>
        ${specsHtml}
        <div class="product-card-footer">
          ${footerHtml}
        </div>
      </div>
    </article>
  `;
}

/**
 * Select diverse products from different categories
 */
function selectDiverseProducts(allProducts, count) {
  if (allProducts.length <= count) return allProducts;

  const byCategory = {};
  allProducts.forEach(p => {
    const cat = p.category_slug || 'other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p);
  });

  const categories = Object.keys(byCategory);
  const selected = [];
  let catIndex = 0;

  while (selected.length < count && selected.length < allProducts.length) {
    const cat = categories[catIndex % categories.length];
    const available = byCategory[cat].filter(p => !selected.includes(p));
    if (available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      selected.push(available[randomIndex]);
    }
    catIndex++;
    if (catIndex > categories.length * count) break;
  }

  return selected;
}
