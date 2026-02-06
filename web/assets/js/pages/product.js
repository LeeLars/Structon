/**
 * Structon - Product Detail Page JavaScript
 */

import { products, quotes } from '../api/client.js';
import { createProductCard, showLoading, showError } from '../main.js';
import { loadProductPrice } from '../pricing.js';
import { isLoggedIn } from '../auth.js';

let currentProduct = null;

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
      categoryLink.textContent = currentProduct.category_title;
      categoryLink.href = `category.html?cat=${currentProduct.category_slug}`;
    }

    // Render product
    renderProduct(currentProduct);

    // Show action section
    document.getElementById('product-action-section').style.display = 'block';

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
  
  const images = product.cloudinary_images || [];
  const mainImage = images[0]?.url || 'https://via.placeholder.com/600x600?text=Geen+Afbeelding';
  
  // Generate dynamic SEO description based on product data
  const seoDescription = generateSeoDescription(product);

  container.innerHTML = `
    <div class="product-layout">
      <!-- LEFT COLUMN: Gallery -->
      <div class="product-gallery-wrapper">
        <div class="product-gallery">
          <div class="product-main-image">
            <img src="${mainImage}" alt="${product.title}" id="main-product-image">
          </div>
          ${images.length > 1 ? `
            <div class="product-thumbnails">
              ${images.map((img, i) => `
                <button class="product-thumbnail ${i === 0 ? 'active' : ''}" data-image="${img.url}">
                  <img src="${img.url}" alt="${product.title} ${i + 1}">
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Trust Signals (Mobile/Tablet only here, Desktop in right col) -->
        <div class="product-trust-signals hide-on-desktop">
          <div class="trust-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Op voorraad: Direct leverbaar</span>
          </div>
          <div class="trust-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>2 Jaar Garantie</span>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Info, Actions & Expert -->
      <div class="product-info-wrapper">
        <div class="product-info">
          <div class="product-header">
            <div class="product-badges">
              <span class="badge badge-quality">Premium Kwaliteit</span>
              ${product.stock_status === 'in_stock' ? '<span class="badge badge-stock in-stock">Op Voorraad</span>' : ''}
            </div>
            <span class="product-category-label">${product.category_title || 'Product'}</span>
            <h1 class="product-title">${product.title}</h1>
            <div class="product-sku">Artikelnummer: ${product.article_number || product.sku || 'N/A'}</div>
            <p class="product-subtitle">${product.short_description || `Hoogwaardige ${product.title.toLowerCase()} voor professioneel gebruik.`}</p>
          </div>

          <div class="product-purchase-card">
            <div class="product-price-container price-locked" id="price-section" data-product-id="${product.id}">
              <div class="product-price">Login voor prijs</div>
              <p class="login-prompt">
                <a href="login.html">Log in</a> om prijzen te bekijken en te bestellen.
              </p>
            </div>
            
            <div class="product-cta-section">
              <div class="product-quantity-wrapper" style="width: 100%; margin-bottom: 1rem;">
                <div class="quantity-selector">
                  <button type="button" class="quantity-btn minus" onclick="this.nextElementSibling.stepDown()">-</button>
                  <input type="number" id="quantity_${product.id}" name="quantity" value="1" min="1" max="99">
                  <button type="button" class="quantity-btn plus" onclick="this.previousElementSibling.stepUp()">+</button>
                </div>
              </div>

              <button class="btn-split usp-btn" 
                onclick="window.quoteCart.addItem({
                  id: '${product.id}',
                  title: '${product.title.replace(/'/g, "\\'")}',
                  image: '${mainImage}',
                  category: '${product.category_title || ''}',
                  specs: {
                    width: '${product.width || ''}',
                    weight: '${product.weight || ''}'
                  },
                  quantity: parseInt(document.getElementById('quantity_${product.id}').value) || 1
                });"
              >
                <span class="btn-split-text">
                  Toevoegen aan offerte
                </span>
                <span class="btn-split-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </button>
              
              <ul class="product-usps">
                <li class="product-usp-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Voor 15:00 besteld, morgen verzonden
                </li>
                <li class="product-usp-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Gratis verzending vanaf €500
                </li>
                <li class="product-usp-item">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Geproduceerd in België (Hardox staal)
                </li>
              </ul>
            </div>
          </div>

          <!-- Expert / Dealer Info Box -->
          <div class="expert-box-sidebar">
            <div class="expert-header">
              <div class="expert-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <span class="expert-title">Hulp nodig bij uw keuze?</span>
                <span class="expert-subtitle">Onze experts helpen u graag verder.</span>
              </div>
            </div>
            <p class="expert-text">Twijfelt u of de <strong>${product.title}</strong> past op uw machine? Wij controleren het direct voor u.</p>
            <div class="expert-actions">
              <a href="tel:+32469702138" class="expert-contact">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                +32 469 70 21 38
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details Section (Icons) -->
    <section class="section product-details-section">
      <div class="container">
        <div class="product-details-layout">
          <div class="product-detail-card">
            <div class="detail-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            </div>
            <h3>Technische Specificaties</h3>
            <p>Alle kraanbakken worden vervaardigd uit hoogwaardig Hardox staal voor maximale sterkte en duurzaamheid. Perfect afgestemd op uw graafmachine.</p>
          </div>
          <div class="product-detail-card">
            <div class="detail-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h3>Op Maat Gemaakt</h3>
            <p>Elke kraanbak wordt op maat geproduceerd in onze werkplaats in Beernem, België. Kwaliteit en precisie gegarandeerd.</p>
          </div>
          <div class="product-detail-card">
            <div class="detail-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3>Snelle Levering</h3>
            <p>Afhalen in Beernem of levering op locatie. Neem contact op voor levertijden en mogelijkheden.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Visual Storytelling: Action Shot -->
    <section class="section product-action-shot" style="background-image: url('${mainImage}');">
      <div class="action-shot-content fade-in">
        <h2>Kracht in elke beweging</h2>
        <p>Ontworpen voor maximale prestaties en efficiëntie op de werf. Onze dieplepelbakken graven soepeler, vullen beter en gaan langer mee.</p>
      </div>
    </section>

    <!-- Feature Hotspots -->
    <section class="section product-features-hotspots">
      <div class="container">
        <div class="section-title-small">Belangrijkste Kenmerken</div>
        <div class="features-hotspots-container">
          <div class="hotspots-image animate-on-scroll">
            <img src="${mainImage}" alt="${product.title} features">
            <!-- Hotspots positioned absolutely (Generic positions for now) -->
            <div class="hotspot-marker" style="top: 30%; left: 40%;" title="Versterkte ophanging">1</div>
            <div class="hotspot-marker" style="top: 60%; left: 70%;" title="Slijtvast Hardox staal">2</div>
            <div class="hotspot-marker" style="top: 80%; left: 30%;" title="Optimale snijhoek">3</div>
          </div>
          <div class="features-list animate-stagger">
            <div class="feature-item">
              <div class="feature-number">1</div>
              <div class="feature-content">
                <h3>Versterkte Ophanging</h3>
                <p>De ophanging is extra verstevigd om de krachten van de graafmachine optimaal over te brengen zonder scheurvorming.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-number">2</div>
              <div class="feature-content">
                <h3>Hardox 450 Staal</h3>
                <p>Volledig vervaardigd uit slijtvast Hardox staal voor een extreem lange levensduur, zelfs in abrasieve grondsoorten.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-number">3</div>
              <div class="feature-content">
                <h3>Geoptimaliseerde Vorm</h3>
                <p>De vormgeving zorgt voor minder weerstand tijdens het graven, wat resulteert in een lager brandstofverbruik en snellere cyclustijden.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Specs Matrix (New Design) -->
    <section class="section specs-matrix-section">
      <div class="container">
        <h2 class="specifications-title">Technische Specificaties</h2>
        <div class="specs-matrix-container">
          <table class="specs-matrix-table animate-on-scroll">
            <thead>
              <tr>
                <th colspan="2">Eigenschappen</th>
              </tr>
            </thead>
            <tbody>
              ${product.article_number ? `<tr><th>Artikelnummer</th><td>${product.article_number}</td></tr>` : ''}
              ${product.brand_title ? `<tr><th>Merk Machine</th><td>${product.brand_title}</td></tr>` : ''}
              ${product.category_title ? `<tr><th>Categorie</th><td>${product.category_title}</td></tr>` : ''}
              ${product.attachment_type ? `<tr><th>Aansluiting</th><td>${product.attachment_type}</td></tr>` : ''}
              ${product.width ? `<tr><th>Breedte</th><td>${product.width} mm</td></tr>` : ''}
              ${product.volume ? `<tr><th>Inhoud (SAE)</th><td>${product.volume} liter</td></tr>` : ''}
              ${product.weight ? `<tr><th>Eigen Gewicht</th><td>${product.weight} kg</td></tr>` : ''}
              ${product.excavator_weight_min && product.excavator_weight_max ? `
                <tr><th>Machine Klasse</th><td>${formatWeight(product.excavator_weight_min)} - ${formatWeight(product.excavator_weight_max)}</td></tr>
              ` : ''}
              ${product.material ? `<tr><th>Materiaal</th><td>${product.material}</td></tr>` : '<tr><th>Materiaal</th><td>Hardox 450 / S355</td></tr>'}
              ${product.warranty ? `<tr><th>Garantie</th><td>${product.warranty}</td></tr>` : '<tr><th>Garantie</th><td>2 Jaar Constructiegarantie</td></tr>'}
              ${renderExtraSpecs(product.specs)}
            </tbody>
          </table>
          
          <div class="specs-technical-drawing animate-on-scroll">
            <div style="text-align: center; padding: 2rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p style="color: #94a3b8; margin-top: 1rem;">Technische tekening</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Add related products section container after product detail
  const existingRelatedSection = document.getElementById('related-section');
  if (!existingRelatedSection) {
    const relatedSectionHtml = `
      <section id="related-section" class="related-products-section" style="display: none;">
        <div class="container">
          <h2 class="section-title">Gerelateerde Producten</h2>
          <div id="related-products-grid" class="related-products-grid"></div>
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
    .map(([key, value]) => `<tr><th>${formatSpecKey(key)}</th><td>${value}</td></tr>`)
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
    const data = await products.getAll({
      category_id: currentProduct.category_id,
      limit: 4
    });

    const related = (data.items || []).filter(p => p.id !== currentProduct.id);

    if (related.length > 0) {
      section.style.display = 'block';
      container.innerHTML = related.slice(0, 4).map(createProductCard).join('');
    } else {
      container.innerHTML = '';
    }
  } catch (error) {
    console.error('Error loading related products:', error);
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
