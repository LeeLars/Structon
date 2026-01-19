/**
 * Brand Template Renderer
 * Dynamically renders brand page content based on brand-data.js
 */

import { BRAND_DATA, OTHER_BRANDS } from '../data/brand-data.js?v=2';

/**
 * Get brand slug from URL path
 */
function getBrandSlug() {
  const path = window.location.pathname;
  const match = path.match(/\/kraanbakken\/([^\/]+)\//);
  return match ? match[1] : null;
}

/**
 * Initialize brand page with dynamic content
 */
export function initBrandTemplate() {
  const brandSlug = getBrandSlug();
  
  console.log('🔍 Brand slug from URL:', brandSlug);
  console.log('📦 Available brands:', Object.keys(BRAND_DATA));
  
  if (!brandSlug || !BRAND_DATA[brandSlug]) {
    console.error('❌ Brand not found:', brandSlug);
    console.error('Available brands:', Object.keys(BRAND_DATA));
    return;
  }

  const brandData = BRAND_DATA[brandSlug];
  
  console.log('✅ Loading brand data for:', brandData.name);
  console.log('📊 Brand data:', {
    name: brandData.name,
    title: brandData.title,
    modelCount: brandData.modelCategories?.length || 0
  });
  
  // Update page metadata
  updateMetadata(brandData);
  
  // Render hero section
  renderHero(brandData);
  
  // Render model selector
  renderModelSelector(brandData);
  
  // Render SEO content
  renderSEOContent(brandData);
  
  // Render CTA
  renderCTA(brandData);
  
  // Render other brands links
  renderOtherBrands(brandSlug);
  
  console.log('✅ Brand template initialized for:', brandData.name);
}

/**
 * Update page metadata
 */
function updateMetadata(brandData) {
  document.title = brandData.metaTitle;
  
  // Update meta tags
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.content = brandData.metaDescription;
  
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) metaKeywords.content = brandData.metaKeywords;
  
  // Update Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = brandData.title + ' | Structon';
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.content = brandData.heroDescription;
  
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.content = `https://structon.be/kraanbakken/${brandData.slug}/`;
  
  // Update canonical
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = `https://structon.be/kraanbakken/${brandData.slug}/`;
  
  // Update breadcrumb structured data
  const breadcrumbScript = document.querySelector('script[type="application/ld+json"]');
  if (breadcrumbScript) {
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://structon.be/"},
        {"@type": "ListItem", "position": 2, "name": "Kraanbakken", "item": "https://structon.be/kraanbakken/"},
        {"@type": "ListItem", "position": 3, "name": brandData.name, "item": `https://structon.be/kraanbakken/${brandData.slug}/`}
      ]
    };
    breadcrumbScript.textContent = JSON.stringify(breadcrumb, null, 2);
  }
}

/**
 * Render hero section
 */
function renderHero(brandData) {
  const breadcrumbBrand = document.querySelector('.brand-breadcrumbs span[aria-current="page"]');
  if (breadcrumbBrand) breadcrumbBrand.textContent = brandData.name;
  
  const title = document.querySelector('.brand-title-large');
  if (title) title.textContent = brandData.title;
  
  const description = document.querySelector('.brand-description');
  if (description) description.textContent = brandData.heroDescription;
  
  const heroImage = document.querySelector('.brand-hero-image-wrapper img');
  if (heroImage) {
    heroImage.src = brandData.heroImage;
    heroImage.alt = `${brandData.name} graafmachine aan het werk`;
  }
}

/**
 * Render model selector section
 */
function renderModelSelector(brandData) {
  const sectionTitle = document.querySelector('.model-selector-section .section-title');
  if (sectionTitle) sectionTitle.textContent = brandData.modelSelectorTitle;
  
  const sectionSubtitle = document.querySelector('.model-selector-section .section-subtitle');
  if (sectionSubtitle) sectionSubtitle.textContent = brandData.modelSelectorSubtitle;
  
  const modelGrid = document.querySelector('.model-cards-grid');
  if (!modelGrid || !brandData.modelCategories || brandData.modelCategories.length === 0) {
    // Hide section if no models
    const section = document.querySelector('.model-selector-section');
    if (section) section.style.display = 'none';
    return;
  }
  
  modelGrid.innerHTML = brandData.modelCategories.map(category => `
    <div class="model-card">
      <h3 class="model-card-title">${category.title}</h3>
      <p class="model-card-subtitle">${category.subtitle}</p>
      <div class="model-buttons">
        ${category.models.map(model => `
          <a href="?model=${encodeURIComponent(model.name)}" 
             class="model-btn" 
             data-tonnage="${model.tonnage}" 
             data-cw="${model.cw}"
             ${model.type ? `data-type="${model.type}"` : ''}>
            ${model.name}
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/**
 * Render SEO content section
 */
function renderSEOContent(brandData) {
  const infoGrid = document.querySelector('.info-grid');
  if (!infoGrid) return;
  
  const { cwTable, whyStructon } = brandData.seoContent;
  
  // CW Table Card
  const cwTableHTML = cwTable.rows.length > 0 ? `
    <div class="info-card">
      <h3 class="info-title">${cwTable.title}</h3>
      <div class="info-content">
        <p>${cwTable.description}</p>
        <table class="info-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Gewicht</th>
              <th>CW</th>
              ${cwTable.rows[0].type ? '<th>Type</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${cwTable.rows.map(row => `
              <tr>
                <td>${row.model}</td>
                <td>${row.weight}</td>
                <td>${row.cw}</td>
                ${row.type ? `<td>${row.type}</td>` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  ` : '';
  
  // Why Structon Card
  const whyStructonHTML = whyStructon.items.length > 0 ? `
    <div class="info-card">
      <h3 class="info-title">${whyStructon.title}</h3>
      <div class="info-content">
        <ul class="info-list">
          ${whyStructon.items.map(item => `
            <li><strong>${item.title}:</strong> ${item.description}</li>
          `).join('')}
        </ul>
      </div>
    </div>
  ` : '';
  
  // Other Brands Card (always show)
  const otherBrandsHTML = `
    <div class="info-card">
      <h3 class="info-title">Andere Merken</h3>
      <div class="info-content">
        <p>Naast ${brandData.name} leveren wij ook voor:</p>
        <div class="brand-links-small" id="other-brands-links"></div>
      </div>
    </div>
  `;
  
  infoGrid.innerHTML = cwTableHTML + whyStructonHTML + otherBrandsHTML;
}

/**
 * Render other brands links (excluding current brand)
 */
function renderOtherBrands(currentBrandSlug) {
  const container = document.getElementById('other-brands-links');
  if (!container) return;
  
  const otherBrandsList = OTHER_BRANDS.filter(b => b.slug !== currentBrandSlug).slice(0, 10);
  
  container.innerHTML = otherBrandsList.map(brand => 
    `<a href="/kraanbakken/${brand.slug}/">${brand.name}</a>`
  ).join('');
}

/**
 * Render CTA section
 */
function renderCTA(brandData) {
  const ctaTitle = document.querySelector('.brand-cta-title');
  if (ctaTitle) ctaTitle.textContent = brandData.ctaTitle;
  
  const ctaText = document.querySelector('.brand-cta-text');
  if (ctaText) ctaText.textContent = brandData.ctaText;
  
  const ctaLink = document.querySelector('.brand-cta .btn-white');
  if (ctaLink) {
    ctaLink.href = `/contact/?brand=${brandData.slug}`;
  }
}

/**
 * Update category intro text dynamically
 */
export function updateCategoryIntro(categorySlug, brandName) {
  const introBox = document.getElementById('category-intro');
  if (!introBox) return;
  
  const categoryNames = {
    'graafbakken': 'Graafbakken',
    'slotenbakken': 'Slotenbakken',
    'rioolbakken': 'Rioolbakken',
    'sorteergrijpers': 'Sorteergrijpers'
  };
  
  const categoryName = categoryNames[categorySlug] || 'Producten';
  
  const title = introBox.querySelector('.category-description-title');
  const text = introBox.querySelector('.category-description-text');
  
  if (title) title.textContent = `${categoryName} voor ${brandName}`;
  
  if (text) {
    const descriptions = {
      'graafbakken': `Professionele graafbakken voor alle grondwerkzaamheden met uw ${brandName} graafmachine. Van lichte tuinwerkzaamheden tot zware grondverzet projecten. Alle bakken zijn vervaardigd met Hardox 450 slijtplaten voor maximale levensduur.`,
      'slotenbakken': `Slotenbakken speciaal ontworpen voor ${brandName} graafmachines. Ideaal voor grondverzet en graven van sleuven.`,
      'rioolbakken': `Rioolbakken passend voor ${brandName} machines. Perfect voor het graven van smalle sleuven voor riolering en kabels.`,
      'sorteergrijpers': `Sorteergrijpers en sloopgrijpers voor ${brandName} graafmachines. Geschikt voor recycling en sloopwerkzaamheden.`
    };
    
    text.textContent = descriptions[categorySlug] || `Professionele producten voor ${brandName} graafmachines.`;
  }
}
