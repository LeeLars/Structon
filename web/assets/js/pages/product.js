/**
 * Structon - Product Detail Page JavaScript
 */

import { products, quotes } from '../api/client.js';
import { createProductCard, showLoading, showError } from '../main.js';
import { loadProductPrice } from '../pricing.js';
import { isLoggedIn } from '../auth.js';
import { createExpertBox } from '../components/expert-box.js';

let currentProduct = null;

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build URL for quote request with all product details
 */
function buildQuoteUrl(product) {
  const params = new URLSearchParams();
  
  // Product identification
  if (product.id) params.set('product_id', product.id);
  if (product.slug) params.set('product', product.slug);
  if (product.title) params.set('product_name', product.title);
  
  // Product details for auto-fill
  if (product.category_title) params.set('product_category', product.category_title);
  if (product.brand_title) params.set('product_brand', product.brand_title);
  
  // Tonnage from excavator weight range (values are already in tons)
  if (product.excavator_weight_min && product.excavator_weight_max) {
    const minTon = Math.round(parseFloat(product.excavator_weight_min));
    const maxTon = Math.round(parseFloat(product.excavator_weight_max));
    params.set('product_tonnage', `${minTon}-${maxTon}`);
  }
  
  return `../offerte-aanvragen/?${params.toString()}`;
}

document.addEventListener('DOMContentLoaded', () => {
  initPage();
  setupQuoteForm();
});

/**
 * Initialize page
 */
async function initPage() {
  const container = document.getElementById('product-detail');
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  // If no container, this script shouldn't do anything (static page)
  if (!container) return;

  if (!productId) {
    showProductNotFound();
    return;
  }

  await loadProduct(productId);
}

/**
 * Load product details
 */
async function loadProduct(id) {
  const container = document.getElementById('product-detail');
  if (!container) return;

  showLoading(container);

  try {
    const data = await products.getById(id);
    currentProduct = data.product;

    if (!currentProduct) {
      showProductNotFound();
      return;
    }

    // Update page
    document.title = `${currentProduct.title} | Structon`;
    document.getElementById('breadcrumb-product').textContent = currentProduct.title;
    
    if (currentProduct.category_title) {
      const categoryLink = document.getElementById('breadcrumb-category-link');
      if (categoryLink) {
        categoryLink.textContent = currentProduct.category_title;
        categoryLink.href = `category.html?cat=${currentProduct.category_slug}`;
      }
    }

    // Render product
    renderProduct(currentProduct);

    // Show action section
    const actionSection = document.getElementById('product-action-section');
    if (actionSection) actionSection.style.display = 'block';

    // Setup quote form with product info
    updateQuoteForm(currentProduct);

    // Load related products
    loadRelatedProducts();

  } catch (error) {
    console.error('Error loading product:', error);
    showError(container, 'Kon product niet laden.');
  }
}

/**
 * Render product details
 */
function renderProduct(product) {
  const container = document.getElementById('product-detail');
  
  // Deduplicate images
  const uniqueImages = [];
  const seenUrls = new Set();
  const rawImages = product.cloudinary_images || [];
  
  rawImages.forEach(img => {
    if (!seenUrls.has(img.url)) {
      seenUrls.add(img.url);
      uniqueImages.push(img);
    }
  });
  
  if (uniqueImages.length === 0) {
    uniqueImages.push({ url: 'https://via.placeholder.com/600x600?text=Geen+Afbeelding' });
  }

  const images = uniqueImages;
  const mainImage = images[0]?.url;
  
  // Generate dynamic SEO description based on product data
  const seoDescription = generateSeoDescription(product);

  const cartProductData = JSON.stringify({
    id: product.id,
    title: product.title,
    image: mainImage,
    category: product.category_title || '',
    specs: { width: product.width || '', weight: product.weight || '' }
  });

  // Render static skeleton - no user data in innerHTML
  container.innerHTML = [
    '<button class="product-back-button" onclick="window.history.back()">',
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
    '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
    '<span>Terug</span></button>',
    '<div class="product-layout">',
    '<div class="product-gallery">',
    '<div class="product-thumbnails" id="product-thumbnails-wrap"></div>',
    '<div class="product-image-main"><img id="main-product-image" src="" alt=""></div>',
    '</div>',
    '<div class="product-info-wrapper">',
    '<div class="product-header">',
    '<span class="product-category-label" id="pd-category"></span>',
    '<h1 class="product-title" id="pd-title"></h1>',
    '<div class="product-sku" id="pd-sku"></div>',
    '<p class="product-subtitle" id="pd-subtitle"></p>',
    '</div>',
    '<div class="product-key-specs" id="pd-key-specs"></div>',
    '<div class="product-purchase-card">',
    '<div class="product-price-container" id="price-section">',
    '<div class="product-price-label">Prijs:</div>',
    '<div class="product-price">Login voor prijs</div>',
    '<p class="login-prompt"><a href="#" class="login-trigger">Log in</a> om prijzen te bekijken en te bestellen.</p>',
    '</div>',
    '<div class="product-cta-section">',
    '<div class="product-quantity-wrapper">',
    '<div class="quantity-selector">',
    '<button type="button" class="quantity-btn minus" onclick="var i=this.nextElementSibling;i.value=Math.max(1,parseInt(i.value||1)-1)">-</button>',
    '<input type="number" id="quantity" name="quantity" value="1" min="1" max="99">',
    '<button type="button" class="quantity-btn plus" onclick="var i=this.previousElementSibling;i.value=Math.min(99,parseInt(i.value||1)+1)">+</button>',
    '</div>',
    '<div class="product-actions">',
    '<button class="btn-split add-to-quote-btn" id="pd-add-btn">',
    '<span class="btn-split-text">Toevoegen aan offerte</span>',
    '<span class="btn-split-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>',
    '</button></div></div>',
    '<ul class="product-usps">',
    '<li>Op maat gemaakt in België - perfecte pasvorm</li>',
    '<li>Afgestemd op jouw graafmachine</li>',
    '<li>Snelle, gecontroleerde productie</li>',
    '</ul></div></div>',
    createExpertBox(),
    '</div></div>',
    '<section class="product-details-section"><div class="product-container"><div class="product-details-layout">',
    '<div class="product-detail-card"><div class="detail-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg></div>',
    '<h3>Geproduceerd uit Hardox 450 staal</h3><p>Slijtvast staal van topkwaliteit voor intensief professioneel gebruik.<br><strong>Langere levensduur, minder slijtage, lagere onderhoudskosten.</strong></p></div>',
    '<div class="product-detail-card"><div class="detail-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>',
    '<h3>Op maat gemaakt in België</h3><p>Geen stockproduct. Elk aanbouwdeel wordt specifiek voor jouw machine geproduceerd in onze werkplaats in Beernem.<br><strong>Perfecte pasvorm, geen compromissen.</strong></p></div>',
    '<div class="product-detail-card"><div class="detail-card-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>',
    '<h3>Afhalen of levering op locatie</h3><p>Afhaling in Beernem of levering waar nodig.<br><strong>Flexibel volgens jouw planning.</strong></p></div>',
    '</div></div></section>',
    '<section class="product-action-shot" id="pd-action-shot"><div class="action-shot-content">',
    '<h2>Kracht in elke beweging</h2>',
    '<p>Ontworpen voor maximale prestaties en efficiëntie op de werf. Onze <span id="pd-action-cat"></span> graven soepeler, vullen beter en gaan langer mee.</p>',
    '</div></section>',
    '<section class="specifications-section"><div class="product-container"><div class="specifications-content">',
    '<div class="specifications-description">',
    '<h2 class="specifications-title">PRODUCTBESCHRIJVING</h2>',
    '<p id="pd-desc"></p><p id="pd-apps"></p>',
    '</div>',
    '<div class="specifications-table-wrapper">',
    '<h3 class="specifications-subtitle">Technische Specificaties</h3>',
    '<table class="specifications-table"><tbody id="pd-specs-tbody"></tbody></table>',
    '</div></div></div></section>',
    '<div class="product-sticky-cta">',
    '<button class="btn-split btn-split-primary add-to-quote-btn" id="pd-sticky-btn">',
    '<span class="btn-split-text">Toevoegen aan offerte</span>',
    '<span class="btn-split-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>',
    '</button></div>'
  ].join('');

  // Now safely inject all user-controlled data via DOM API
  const seoDesc = generateSeoDescription(product);

  // Text content (auto-escaped by browser)
  container.querySelector('#pd-category').textContent = product.category_title || 'Product';
  container.querySelector('#pd-title').textContent = product.title;
  container.querySelector('#pd-sku').textContent = 'Artikelnummer: ' + (product.article_number || product.sku || 'N/A');
  container.querySelector('#pd-subtitle').textContent = product.short_description || `Hoogwaardige ${product.title.toLowerCase()} voor professioneel gebruik.`;
  container.querySelector('#pd-action-cat').textContent = product.category_title || 'producten';
  container.querySelector('#pd-desc').textContent = product.description || seoDesc.intro;
  container.querySelector('#pd-apps').textContent = seoDesc.applications;

  // Images (src/alt are safe attributes)
  const mainImg = container.querySelector('#main-product-image');
  mainImg.src = mainImage;
  mainImg.alt = product.title;

  // Thumbnails
  const thumbsWrap = container.querySelector('#product-thumbnails-wrap');
  if (images.length > 1) {
    images.forEach((img, i) => {
      const div = document.createElement('div');
      div.className = 'product-thumbnail' + (i === 0 ? ' active' : '');
      div.dataset.image = img.url;
      const thumbImg = document.createElement('img');
      thumbImg.src = img.url;
      thumbImg.alt = `${product.title} ${i + 1}`;
      div.appendChild(thumbImg);
      thumbsWrap.appendChild(div);
    });
  } else {
    thumbsWrap.style.display = 'none';
  }

  // Action shot background
  container.querySelector('#pd-action-shot').style.backgroundImage = `url('${mainImage.replace(/'/g, "\\'")}')`;

  // Price section product-id
  container.querySelector('#price-section').dataset.productId = product.id;

  // Cart data on buttons
  container.querySelector('#pd-add-btn').dataset.product = cartProductData;
  container.querySelector('#pd-sticky-btn').dataset.product = cartProductData;

  // Key specs
  const keySpecsEl = container.querySelector('#pd-key-specs');
  if (product.width || product.weight || product.attachment_type || (product.excavator_weight_min && product.excavator_weight_max)) {
    const specsData = [];
    if (product.width) specsData.push(['Breedte', `${product.width} mm`]);
    if (product.weight) specsData.push(['Gewicht', `${product.weight} kg`]);
    if (product.attachment_type) specsData.push(['Ophanging', product.attachment_type]);
    if (product.excavator_weight_min && product.excavator_weight_max) {
      specsData.push(['Graafmachine', `${formatWeight(product.excavator_weight_min)} - ${formatWeight(product.excavator_weight_max)}`]);
    }
    specsData.forEach(([label, value]) => {
      const div = document.createElement('div');
      div.className = 'key-spec';
      const labelSpan = document.createElement('span');
      labelSpan.className = 'key-spec-label';
      labelSpan.textContent = label;
      const valueSpan = document.createElement('span');
      valueSpan.className = 'key-spec-value';
      valueSpan.textContent = value;
      div.appendChild(labelSpan);
      div.appendChild(valueSpan);
      keySpecsEl.appendChild(div);
    });
  } else {
    keySpecsEl.style.display = 'none';
  }

  // Specs table
  const tbody = container.querySelector('#pd-specs-tbody');
  const specRows = [
    [product.article_number, 'Artikelnummer', product.article_number],
    [product.brand_title, 'Merk Machine', product.brand_title],
    [product.category_title, 'Categorie', product.category_title],
    [product.attachment_type, 'Aansluiting', product.attachment_type],
    [product.width, 'Breedte', product.width ? `${product.width} mm` : null],
    [product.volume, 'Inhoud (SAE)', product.volume ? `${product.volume} liter` : null],
    [product.weight, 'Eigen Gewicht', product.weight ? `${product.weight} kg` : null],
  ];
  specRows.forEach(([condition, label, value]) => {
    if (!condition) return;
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = label;
    const td = document.createElement('td');
    td.textContent = value;
    tr.appendChild(th);
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
  if (product.excavator_weight_min && product.excavator_weight_max) {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'Machine Klasse';
    const td = document.createElement('td');
    td.textContent = `${formatWeight(product.excavator_weight_min)} - ${formatWeight(product.excavator_weight_max)}`;
    tr.appendChild(th);
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
  const matTr = document.createElement('tr');
  const matTh = document.createElement('th');
  matTh.textContent = 'Materiaal';
  const matTd = document.createElement('td');
  matTd.textContent = product.material || 'Hardox 450 / S355';
  matTr.appendChild(matTh);
  matTr.appendChild(matTd);
  tbody.appendChild(matTr);
  const warTr = document.createElement('tr');
  const warTh = document.createElement('th');
  warTh.textContent = 'Garantie';
  const warTd = document.createElement('td');
  warTd.textContent = product.warranty || '2 Jaar Constructiegarantie';
  warTr.appendChild(warTh);
  warTr.appendChild(warTd);
  tbody.appendChild(warTr);
  tbody.insertAdjacentHTML('beforeend', renderExtraSpecs(product.specs));

  // Add related products section container after product detail
  const existingRelatedSection = document.getElementById('related-products-section');
  if (!existingRelatedSection) {
    const productsPageUrl = window.location.pathname.replace(/\/producten\/.*/, '/producten/');
    const relatedSectionHtml = `
      <section id="related-products-section" class="section-featured related-products-section" style="display: none;">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">UITGELICHTE PRODUCTEN</h2>
            <a href="${productsPageUrl}" class="btn-link-arrow">
              Bekijk alle producten
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
          <div id="related-products-grid" class="products-grid"></div>
        </div>
      </section>
    `;
    container.insertAdjacentHTML('afterend', relatedSectionHtml);
  }

  // Setup thumbnail clicks
  setupThumbnails();

  // Load price if logged in
  const priceSection = document.getElementById('price-section');
  if (priceSection) {
    loadProductPrice(product.id, priceSection);
  }
}

/**
 * Generate SEO description if missing
 */
function generateSeoDescription(product) {
  return {
    intro: `De <strong>${product.title}</strong> is een hoogwaardige aanbouwdeel voor professioneel gebruik. Speciaal ontwikkeld voor ${product.brand_title || 'diverse'} graafmachines tussen ${product.excavator_weight_min || '1'} en ${product.excavator_weight_max || '50'} ton. Dankzij het gebruik van slijtvaste materialen garanderen wij een lange levensduur, zelfs onder zware omstandigheden.`,
    applications: `Deze ${product.category_title || 'graafbak'} is ideaal voor diverse grondverzetwerkzaamheden, waaronder het graven van sleuven, egaliseren van terreinen en laden van vrachtwagens. De geoptimaliseerde vorm zorgt voor een betere vulgraad en brandstofbesparing.`
  };
}

/**
 * Setup thumbnail image switching
 */
function setupThumbnails() {
  const thumbnails = document.querySelectorAll('.product-thumbnail');
  const mainImage = document.getElementById('main-product-image');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update active state
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      // Update main image
      mainImage.src = thumb.dataset.image;
    });
  });
}

/**
 * Render extra specs from JSON
 */
function renderExtraSpecs(specs) {
  if (!specs || typeof specs !== 'object') return '';

  return Object.entries(specs)
    .map(([key, value]) => `<tr><th>${escapeHtml(formatSpecKey(key))}</th><td>${escapeHtml(value)}</td></tr>`)
    .join('');
}

/**
 * Format spec key for display
 */
function formatSpecKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format weight in kg or ton
 */
function formatWeight(kg) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} ton`;
  }
  return `${kg} kg`;
}

/**
 * Load related products
 */
async function loadRelatedProducts() {
  const section = document.getElementById('related-products-section');
  const container = document.getElementById('related-products-grid');
  
  if (!section || !container || !currentProduct) return;

  container.innerHTML = `
    <div class="structon-loader loader-small">
      <div class="loader-spinner"></div>
    </div>
  `;

  try {
    // Try to get products from same subcategory first
    let data = await products.getAll({
      subcategory_id: currentProduct.subcategory_id,
      limit: 8
    });

    let related = (data.items || []).filter(p => p.id !== currentProduct.id);

    // If not enough from subcategory, get from same category
    if (related.length < 4 && currentProduct.category_id) {
      const categoryData = await products.getAll({
        category_id: currentProduct.category_id,
        limit: 8
      });
      
      const categoryProducts = (categoryData.items || []).filter(p => 
        p.id !== currentProduct.id && !related.find(r => r.id === p.id)
      );
      
      related = [...related, ...categoryProducts];
    }

    if (related.length > 0) {
      section.style.display = 'block';
      const loggedIn = isLoggedIn();
      container.innerHTML = related.slice(0, 4).map(p => createProductCard(p, loggedIn)).join('');
    } else {
      section.style.display = 'none';
      container.innerHTML = '';
    }
  } catch (error) {
    console.error('Error loading related products:', error);
    section.style.display = 'none';
    container.innerHTML = '';
  }
}

/**
 * Show product not found
 */
function showProductNotFound() {
  const container = document.getElementById('product-detail');
  container.innerHTML = `
    <div class="product-not-found" style="grid-column: 1/-1;">
      <h2>Product niet gevonden</h2>
      <p>Het opgevraagde product bestaat niet of is niet meer beschikbaar.</p>
      <a href="category.html" class="btn btn-primary">Bekijk alle producten</a>
    </div>
  `;
}

/**
 * Setup quote form
 */
function setupQuoteForm() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('quote-submit');
    const successDiv = document.getElementById('quote-success');
    const errorDiv = document.getElementById('quote-error');
    
    // Reset states
    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verzenden...';

    try {
      const formData = {
        product_id: document.getElementById('quote-product-id').value || null,
        product_name: document.getElementById('quote-product-name').value || null,
        customer_name: document.getElementById('quote-name').value,
        customer_email: document.getElementById('quote-email').value,
        customer_phone: document.getElementById('quote-phone').value || null,
        message: document.getElementById('quote-message').value || null
      };

      console.log('📧 Submitting quote request:', formData);
      
      const result = await quotes.submit(formData);
      
      console.log('✅ Quote submitted successfully:', result);
      
      // Show success
      form.style.display = 'none';
      successDiv.style.display = 'block';
      
    } catch (error) {
      console.error('❌ Quote submission failed:', error);
      errorDiv.style.display = 'block';
      errorDiv.querySelector('p').textContent = error.message || 'Er is iets misgegaan. Probeer het later opnieuw.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Offerte Aanvragen';
    }
  });
}

/**
 * Update quote form with product info
 */
function updateQuoteForm(product) {
  const quoteSection = document.getElementById('quote-section');
  const productIdInput = document.getElementById('quote-product-id');
  const productNameInput = document.getElementById('quote-product-name');
  
  if (quoteSection && product) {
    quoteSection.style.display = 'block';
    
    if (productIdInput) productIdInput.value = product.id;
    if (productNameInput) productNameInput.value = product.title;
  }
}

/**
 * Open product image in lightbox
 */
window.openProductLightbox = function(imageUrl, productTitle) {
  // Create lightbox overlay
  const lightbox = document.createElement('div');
  lightbox.className = 'product-lightbox-overlay';
  const lightboxContent = document.createElement('div');
  lightboxContent.className = 'product-lightbox-content';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'product-lightbox-close';
  closeBtn.setAttribute('onclick', 'closeProductLightbox()');
  closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = productTitle;

  lightboxContent.appendChild(closeBtn);
  lightboxContent.appendChild(img);
  lightbox.appendChild(lightboxContent);
  
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';
  
  // Close on overlay click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeProductLightbox();
    }
  });
  
  // Close on ESC key
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeProductLightbox();
      document.removeEventListener('keydown', escHandler);
    }
  });
};

/**
 * Close product lightbox
 */
window.closeProductLightbox = function() {
  const lightbox = document.querySelector('.product-lightbox-overlay');
  if (lightbox) {
    lightbox.remove();
    document.body.style.overflow = '';
  }
};
