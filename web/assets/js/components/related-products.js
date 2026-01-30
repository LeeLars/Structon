/**
 * Structon - Related Products Loader
 * Dynamically loads relevant products based on current product
 */

(function() {
  'use strict';

  // Mock product database - in production this would come from API
  const MOCK_PRODUCTS = [
    {
      id: '11c08c8c-265d-4900-b005-046e6e3102c4',
      slug: 'test-dieplepelbak-01',
      title: 'Test - Dieplepelbak - 01',
      category_slug: 'graafbakken',
      subcategory_slug: 'dieplepelbakken',
      category: 'Graafbakken',
      subcategory: 'Dieplepelbakken',
      image: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1769079586/structon/products/ap1labomijtkczoftjpz.png',
      excavator_min: 1.50,
      excavator_max: 3.00,
      width: 300,
      weight: 55,
      attachment: 'CW05'
    },
    {
      id: 'prod-dieplepel-02',
      slug: 'dieplepelbak-400mm',
      title: 'Dieplepelbak 400mm',
      category_slug: 'graafbakken',
      subcategory_slug: 'dieplepelbakken',
      category: 'Graafbakken',
      subcategory: 'Dieplepelbakken',
      image: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1737537600/structon/products/sample-dieplepel-2.jpg',
      excavator_min: 2.00,
      excavator_max: 4.00,
      width: 400,
      weight: 75,
      attachment: 'CW10'
    },
    {
      id: 'prod-dieplepel-03',
      slug: 'dieplepelbak-250mm',
      title: 'Dieplepelbak 250mm',
      category_slug: 'graafbakken',
      subcategory_slug: 'dieplepelbakken',
      category: 'Graafbakken',
      subcategory: 'Dieplepelbakken',
      image: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1737537600/structon/products/sample-dieplepel-3.jpg',
      excavator_min: 1.00,
      excavator_max: 2.50,
      width: 250,
      weight: 45,
      attachment: 'CW05'
    },
    {
      id: 'prod-graafbak-01',
      slug: 'standaard-graafbak-600mm',
      title: 'Standaard Graafbak 600mm',
      category_slug: 'graafbakken',
      subcategory_slug: 'standaard-graafbakken',
      category: 'Graafbakken',
      subcategory: 'Standaard Graafbakken',
      image: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1737537600/structon/products/sample-graafbak-1.jpg',
      excavator_min: 1.50,
      excavator_max: 3.00,
      width: 600,
      weight: 95,
      attachment: 'CW05'
    },
    {
      id: 'prod-taludbak-01',
      slug: 'taludbak-800mm',
      title: 'Taludbak 800mm',
      category_slug: 'graafbakken',
      subcategory_slug: 'taludbakken',
      category: 'Graafbakken',
      subcategory: 'Taludbakken',
      image: 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1737537600/structon/products/sample-taludbak-1.jpg',
      excavator_min: 2.00,
      excavator_max: 4.00,
      width: 800,
      weight: 110,
      attachment: 'CW10'
    }
  ];

  /**
   * Get current product data from page
   */
  function getCurrentProduct() {
    const addToQuoteBtn = document.getElementById('add-to-quote');
    if (!addToQuoteBtn) return null;

    try {
      const productData = addToQuoteBtn.dataset.product;
      if (!productData) return null;
      
      const product = JSON.parse(productData);
      
      // Extract excavator range from specs
      if (product.specs && product.specs.excavator) {
        const excavatorMatch = product.specs.excavator.match(/([\d.]+)\s*-\s*([\d.]+)/);
        if (excavatorMatch) {
          product.excavator_min = parseFloat(excavatorMatch[1]);
          product.excavator_max = parseFloat(excavatorMatch[2]);
        }
      }
      
      return product;
    } catch (e) {
      console.error('Failed to parse current product data:', e);
      return null;
    }
  }

  /**
   * Calculate relevance score for a product
   */
  function calculateRelevance(currentProduct, candidateProduct) {
    let score = 0;

    // Same subcategory = highest relevance
    if (candidateProduct.subcategory_slug === currentProduct.subcategory_slug) {
      score += 100;
    }

    // Same category but different subcategory
    if (candidateProduct.category_slug === currentProduct.category_slug && 
        candidateProduct.subcategory_slug !== currentProduct.subcategory_slug) {
      score += 50;
    }

    // Similar tonnage range
    if (currentProduct.excavator_min && currentProduct.excavator_max &&
        candidateProduct.excavator_min && candidateProduct.excavator_max) {
      const currentMid = (currentProduct.excavator_min + currentProduct.excavator_max) / 2;
      const candidateMid = (candidateProduct.excavator_min + candidateProduct.excavator_max) / 2;
      const diff = Math.abs(currentMid - candidateMid);
      
      if (diff < 0.5) score += 30;
      else if (diff < 1.0) score += 20;
      else if (diff < 2.0) score += 10;
    }

    // Same attachment type
    if (currentProduct.specs?.attachment && 
        candidateProduct.attachment === currentProduct.specs.attachment) {
      score += 15;
    }

    return score;
  }

  /**
   * Get related products sorted by relevance
   */
  function getRelatedProducts(currentProduct, limit = 4) {
    if (!currentProduct) return [];

    // Filter out current product and calculate relevance
    const candidates = MOCK_PRODUCTS
      .filter(p => p.id !== currentProduct.id)
      .map(p => ({
        ...p,
        relevanceScore: calculateRelevance(currentProduct, p)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    return candidates;
  }

  /**
   * Build product URL based on locale
   */
  function buildProductUrl(product) {
    const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
    const currentPath = window.location.pathname;
    const localeMatch = currentPath.match(/\/(be-nl|nl-nl|be-fr|de-de)\//);
    const locale = localeMatch ? localeMatch[1] : 'be-nl';
    
    const sub = product.subcategory_slug ? `/${product.subcategory_slug}` : '';
    return `${basePath}/${locale}/producten/${product.category_slug}${sub}/${product.slug}/`;
  }

  /**
   * Create product card HTML
   */
  function createProductCard(product) {
    const productUrl = buildProductUrl(product);
    
    return `
      <article class="product-card clean-card">
        <a href="${productUrl}" class="product-card-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </a>
        <div class="product-card-divider"></div>
        <div class="product-card-content">
          <div class="product-header">
            <h3 class="product-card-title">
              <a href="${productUrl}">${product.title}</a>
            </h3>
          </div>
          <p class="product-card-specs">
            ${product.width ? `${product.width}mm` : ''} 
            ${product.weight ? `| ${product.weight} kg` : ''}
            ${product.excavator_min && product.excavator_max ? `| ${product.excavator_min}-${product.excavator_max}t` : ''}
          </p>
          <div class="product-card-footer">
            <a href="${productUrl}" class="btn-split btn-split-sm" style="width: 100%;">
              <span class="btn-split-text">Meer info</span>
              <span class="btn-split-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </a>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Load and render related products
   */
  function loadRelatedProducts() {
    const section = document.getElementById('related-products-section');
    const grid = document.getElementById('related-products-grid');
    
    if (!section || !grid) return;

    const currentProduct = getCurrentProduct();
    if (!currentProduct) {
      console.log('No current product found');
      return;
    }

    const relatedProducts = getRelatedProducts(currentProduct, 4);
    
    if (relatedProducts.length === 0) {
      console.log('No related products found');
      return;
    }

    // Render products
    grid.innerHTML = relatedProducts.map(createProductCard).join('');
    
    // Show section
    section.style.display = 'block';
    
    console.log(`✅ Loaded ${relatedProducts.length} related products`);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadRelatedProducts);
  } else {
    loadRelatedProducts();
  }

})();
