/**
 * Structon - Related Products Loader
 * Dynamically loads relevant products from CMS based on current product
 */

(function() {
  'use strict';

  // API Configuration
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:4000/api'
    : 'https://structon-production.up.railway.app/api';

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
   * Fetch products from CMS API
   */
  async function fetchProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.category_slug) params.set('category_slug', filters.category_slug);
      if (filters.subcategory_slug) params.set('subcategory_slug', filters.subcategory_slug);
      if (filters.limit) params.set('limit', filters.limit);
      
      const url = `${API_BASE}/products?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.warn('Failed to fetch products from CMS');
        return [];
      }
      
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
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
    const currentMin = currentProduct.excavator_min || 0;
    const currentMax = currentProduct.excavator_max || 0;
    const candidateMin = candidateProduct.excavator_weight_min || 0;
    const candidateMax = candidateProduct.excavator_weight_max || 0;
    
    if (currentMin && currentMax && candidateMin && candidateMax) {
      const currentMid = (currentMin + currentMax) / 2;
      const candidateMid = (candidateMin + candidateMax) / 2;
      const diff = Math.abs(currentMid - candidateMid);
      
      if (diff < 0.5) score += 30;
      else if (diff < 1.0) score += 20;
      else if (diff < 2.0) score += 10;
    }

    // Same attachment type
    if (currentProduct.specs?.attachment && 
        candidateProduct.attachment_type === currentProduct.specs.attachment) {
      score += 15;
    }

    return score;
  }

  /**
   * Get related products from CMS sorted by relevance
   */
  async function getRelatedProducts(currentProduct, limit = 3) {
    if (!currentProduct) return [];

    // Try to fetch products from same subcategory first
    let products = [];
    
    if (currentProduct.subcategory_slug) {
      products = await fetchProducts({
        subcategory_slug: currentProduct.subcategory_slug,
        limit: 10
      });
    }
    
    // If not enough, fetch from same category
    if (products.length < limit && currentProduct.category_slug) {
      const categoryProducts = await fetchProducts({
        category_slug: currentProduct.category_slug,
        limit: 10
      });
      products = [...products, ...categoryProducts];
    }

    // Filter out current product and calculate relevance
    const candidates = products
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
    
    // Get first image from cloudinary_images array
    const imageUrl = product.cloudinary_images?.[0]?.url || 
                     'https://via.placeholder.com/400x400?text=No+Image';
    
    // Build specs string
    const specs = [];
    if (product.width) specs.push(`${product.width}mm`);
    if (product.weight) specs.push(`${product.weight} kg`);
    if (product.excavator_weight_min && product.excavator_weight_max) {
      specs.push(`${product.excavator_weight_min}-${product.excavator_weight_max}t`);
    }
    
    return `
      <article class="product-card clean-card">
        <a href="${productUrl}" class="product-card-image">
          <img src="${imageUrl}" alt="${product.title}" loading="lazy">
        </a>
        <div class="product-card-divider"></div>
        <div class="product-card-content">
          <div class="product-header">
            <h3 class="product-card-title">
              <a href="${productUrl}">${product.title}</a>
            </h3>
          </div>
          ${specs.length > 0 ? `
            <p class="product-card-specs">${specs.join(' | ')}</p>
          ` : ''}
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
   * Load and render related products from CMS
   */
  async function loadRelatedProducts() {
    const section = document.getElementById('related-products-section');
    const grid = document.getElementById('related-products-grid');
    
    if (!section || !grid) return;

    const currentProduct = getCurrentProduct();
    if (!currentProduct) {
      console.log('No current product found');
      return;
    }

    // Show loading state
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #94a3b8;">Gerelateerde producten laden...</div>';
    section.style.display = 'block';

    try {
      const relatedProducts = await getRelatedProducts(currentProduct, 3);
      
      if (relatedProducts.length === 0) {
        console.log('No related products found');
        section.style.display = 'none';
        return;
      }

      // Render products
      grid.innerHTML = relatedProducts.map(createProductCard).join('');
      
      console.log(`✅ Loaded ${relatedProducts.length} related products from CMS`);
    } catch (error) {
      console.error('Error loading related products:', error);
      section.style.display = 'none';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadRelatedProducts);
  } else {
    loadRelatedProducts();
  }

})();
