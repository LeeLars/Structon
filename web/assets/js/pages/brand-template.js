/**
 * Brand Template Renderer
 * Dynamically renders brand page content based on brand-data.js
 */

import { BRAND_DATA, OTHER_BRANDS } from '../data/brand-data.js?v=2';

/**
 * Get base path for correct URL generation (GitHub Pages compatible)
 */
function getBasePath() {
  const path = window.location.pathname;
  
  // Brand pages are at /kraanbakken/brand/ or /Structon/kraanbakken/brand/
  // Count how many levels deep we are from the brand page
  if (path.includes('/kraanbakken/')) {
    const parts = path.split('/').filter(p => p && !p.includes('.html'));
    // Find kraanbakken index
    const kraanbakkenIndex = parts.indexOf('kraanbakken');
    if (kraanbakkenIndex !== -1 && parts[kraanbakkenIndex + 1]) {
      // We're in a brand subfolder (e.g., /Structon/kraanbakken/volvo/)
      // Need to go up to root: count levels after kraanbakken + 1 for kraanbakken itself
      const levelsUp = parts.length - kraanbakkenIndex;
      return '../'.repeat(levelsUp);
    }
  }
  
  return '';
}

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
    if (brandData.heroImageWidth) heroImage.width = brandData.heroImageWidth;
    if (brandData.heroImageHeight) heroImage.height = brandData.heroImageHeight;
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
  const seoSidebar = document.querySelector('.brand-seo-sidebar');
  if (!seoSidebar) return;
  
  const basePath = getBasePath();
  const currentBrandSlug = getBrandSlug();
  
  // Get all brands except current one
  const otherBrandsList = OTHER_BRANDS.filter(b => b.slug !== currentBrandSlug);
  
  // Replace sidebar content with expert box and dynamic brand links
  seoSidebar.innerHTML = `
    <div class="expert-box">
      <div class="expert-header">
        <div class="expert-avatar">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#236773" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="expert-info">
          <strong>Arno Vermeersch</strong>
          <span>External Sales</span>
        </div>
      </div>
      <p class="expert-text">Twijfel je over de juiste ophanging of maat? Neem contact op met onze specialist.</p>
      <a href="tel:+32469702138" class="expert-phone">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        +32 469 70 21 38
      </a>
      <a href="mailto:arno.vermeersch@structon.be" class="expert-email">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        arno.vermeersch@structon.be
      </a>
    </div>
    
    <div class="brand-related-card">
      <h4>Andere Merken</h4>
      <div class="brand-related-links">
        ${otherBrandsList.map(brand => 
          `<a href="${basePath}kraanbakken/${brand.slug}/">${brand.name}</a>`
        ).join('')}
      </div>
    </div>
  `;
}

/**
 * Render other brands links (excluding current brand)
 */
function renderOtherBrands(currentBrandSlug) {
  const container = document.getElementById('other-brands-links');
  if (!container) return;
  
  const basePath = getBasePath();
  // Show all brands except current one (no slice limit)
  const otherBrandsList = OTHER_BRANDS.filter(b => b.slug !== currentBrandSlug);
  
  container.innerHTML = otherBrandsList.map(brand => 
    `<a href="${basePath}kraanbakken/${brand.slug}/">${brand.name}</a>`
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
  
  const basePath = getBasePath();
  const ctaLink = document.querySelector('.brand-cta .btn-white');
  if (ctaLink) {
    ctaLink.href = `${basePath}contact/?brand=${brandData.slug}`;
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
