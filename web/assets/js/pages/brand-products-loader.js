/**
 * Standalone Brand Products Loader
 * Loads products from CMS API directly - no module dependencies
 * Works independently of brand.js and brand-data.js
 */
(function() {
  const API_BASE = 'https://structon-production.up.railway.app/api';
  const PRODUCTS_TO_SHOW = 8;

  function getLocale() {
    const match = window.location.pathname.match(/\/(be-nl|nl-nl|be-fr|de-de)\//);
    return match ? match[1] : 'be-nl';
  }

  function getBasePath() {
    return window.location.pathname.includes('/Structon/') ? '/Structon' : '';
  }

  function buildProductUrl(product) {
    const basePath = getBasePath();
    const locale = getLocale();
    const slug = product.slug || product.id;
    const cat = product.category_slug || 'producten';
    const sub = product.subcategory_slug;
    return sub
      ? `${basePath}/${locale}/producten/${cat}/${sub}/${slug}/`
      : `${basePath}/${locale}/producten/${cat}/${slug}/`;
  }

  function buildCardHtml(product) {
    const imageUrl = (product.cloudinary_images && product.cloudinary_images[0] && product.cloudinary_images[0].url) || '';
    const url = buildProductUrl(product);

    var stockHtml = '';
    var stock = product.stock || 0;
    if (stock > 5) {
      stockHtml = '<span class="stock-status status-in-stock"><span class="status-dot"></span>Op voorraad</span>';
    } else if (stock > 0) {
      stockHtml = '<span class="stock-status status-low-stock"><span class="status-dot"></span>Nog slechts enkele stuks</span>';
    } else {
      stockHtml = '<span class="stock-status status-out-stock"><span class="status-dot"></span>Op bestelling</span>';
    }

    var specs = [];
    if (product.weight) specs.push(product.weight + ' kg');
    if (product.volume) specs.push(product.volume + ' liter');
    if (product.width) specs.push(product.width + 'mm');
    var specsHtml = specs.length > 0
      ? '<p class="product-card-specs">' + specs.join(' | ') + '</p>'
      : '';

    return '<article class="product-card clean-card" data-product-id="' + product.id + '">' +
      '<a href="' + url + '" class="product-card-image">' +
        (imageUrl ? '<img src="' + imageUrl + '" alt="' + (product.title || '') + '" loading="lazy">' : '') +
      '</a>' +
      '<div class="product-card-divider"></div>' +
      '<div class="product-card-content">' +
        '<div class="product-header">' +
          '<h3 class="product-card-title"><a href="' + url + '">' + (product.title || '') + '</a></h3>' +
          stockHtml +
        '</div>' +
        specsHtml +
        '<div class="product-card-footer">' +
          '<span class="product-price-label" style="display:block;margin-bottom:8px;">Prijs op aanvraag</span>' +
          '<div class="product-buttons">' +
            '<a href="' + url + '" class="btn-split btn-split-sm" style="text-decoration:none;">' +
              '<span class="btn-split-text">Meer info</span>' +
              '<span class="btn-split-icon">' +
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' +
              '</span>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function loadProducts() {
    var container = document.getElementById('products-grid');
    if (!container) return;

    fetch(API_BASE + '/products?limit=50&_t=' + Date.now(), { cache: 'no-store' })
      .then(function(res) {
        if (!res.ok) throw new Error('API error ' + res.status);
        return res.json();
      })
      .then(function(data) {
        var items = data.products || data.items || [];
        if (items.length === 0) {
          container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">Geen producten beschikbaar</div>';
          return;
        }
        var selected = shuffle(items).slice(0, PRODUCTS_TO_SHOW);
        container.innerHTML = selected.map(buildCardHtml).join('');
      })
      .catch(function(err) {
        console.warn('Brand products load error:', err);
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">Producten konden niet geladen worden</div>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
  } else {
    loadProducts();
  }
})();
