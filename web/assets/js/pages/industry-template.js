/**
 * Industry Page Template
 * Dynamische rendering van industrie pagina's op basis van industry-data.js
 * Vergelijkbaar met brand-template.js maar voor industrie pagina's
 */

import { INDUSTRY_DATA, getIndustryData, getRelatedIndustries } from '../data/industry-data.js?v=1';

/**
 * Get base path for correct URL generation (GitHub Pages compatible)
 */
function getBasePath() {
  const path = window.location.pathname;
  
  // Industry pages are at /industrieen/industry/ or /Structon/industrieen/industry/
  // We need to go back to root: ../../
  if (path.includes('/industrieen/')) {
    const parts = path.split('/').filter(p => p && !p.includes('.html'));
    if (parts.length >= 2) {
      return '../../';
    }
  }
  
  return '';
}

class IndustryTemplate {
  constructor() {
    this.industrySlug = null;
    this.industryData = null;
    this.init();
  }

  init() {
    // Haal industry slug uit URL of data attribuut
    this.industrySlug = this.getIndustrySlug();
    
    if (!this.industrySlug) {
      console.error('No industry slug found');
      return;
    }

    // Laad industry data
    this.industryData = getIndustryData(this.industrySlug);
    
    if (!this.industryData) {
      console.error(`No data found for industry: ${this.industrySlug}`);
      return;
    }

    // Render alle componenten
    this.renderAll();
  }

  getIndustrySlug() {
    // Probeer eerst uit data attribuut
    const main = document.querySelector('main[data-industry]');
    if (main) {
      return main.getAttribute('data-industry');
    }

    // Anders uit URL path
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const industrieenIndex = pathParts.indexOf('industrieen');
    if (industrieenIndex !== -1 && pathParts[industrieenIndex + 1]) {
      return pathParts[industrieenIndex + 1];
    }

    return null;
  }

  renderAll() {
    this.updateMetaTags();
    this.renderBreadcrumbs();
    this.renderHero();
    this.renderCTABanner();
    this.renderTonnageFilters();
    this.renderBucketTypeFilters();
    this.renderBenefits();
    this.renderSEOContent();
    this.renderRelatedIndustries();
    this.renderCTAFooter();
  }

  updateMetaTags() {
    const data = this.industryData;
    
    // Update title
    document.title = data.metaTitle;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', data.metaDescription);
    }
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', data.metaKeywords);
    }
    
    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://structon.be/industrieen/${data.slug}/`);
    }
    
    // Update Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', data.title);
    }
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', data.metaDescription);
    }
    
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `https://structon.be/industrieen/${data.slug}/`);
    }
  }

  renderBreadcrumbs() {
    const breadcrumb = document.querySelector('.industry-breadcrumbs, .breadcrumb');
    if (!breadcrumb) return;

    const basePath = getBasePath();
    breadcrumb.innerHTML = `
      <a href="${basePath}">Home</a>
      <span>/</span>
      <a href="${basePath}industrieen/">Industrieën</a>
      <span>/</span>
      <span aria-current="page">${this.industryData.name}</span>
    `;
  }

  renderHero() {
    const data = this.industryData;
    
    // Update title
    const title = document.querySelector('.industry-title-large, .page-title');
    if (title) {
      title.textContent = data.title;
    }
    
    // Update description
    const description = document.querySelector('.industry-description, .page-subtitle');
    if (description) {
      description.textContent = data.hero.description;
    }
    
    // Update icon
    const iconWrapper = document.querySelector('.industry-hero-icon, .page-hero-icon');
    if (iconWrapper && data.hero.icon) {
      iconWrapper.innerHTML = data.hero.icon;
    }
  }

  renderCTABanner() {
    const data = this.industryData;
    
    // Update CTA title
    const ctaTitle = document.querySelector('.industry-cta-title');
    if (ctaTitle) {
      ctaTitle.textContent = data.ctaBanner.title;
    }
    
    // Update CTA subtitle
    const ctaSubtitle = document.querySelector('.industry-cta-subtitle');
    if (ctaSubtitle) {
      ctaSubtitle.textContent = data.ctaBanner.subtitle;
    }
    
    // Update CTA button link
    const ctaButton = document.querySelector('.industry-cta-button a');
    if (ctaButton) {
      const currentHref = ctaButton.getAttribute('href');
      if (currentHref) {
        ctaButton.setAttribute('href', currentHref.replace(/industry=[^&]*/, `industry=${data.slug}`));
      }
    }
  }

  renderTonnageFilters() {
    const data = this.industryData;
    const filterGrid = document.querySelector('.tonnage-filter-grid');
    
    if (!filterGrid || !data.tonnageRanges) return;

    const tonnageLabels = {
      '0-2': { label: '0 - 2 ton', description: 'Minigravers' },
      '2-5': { label: '2 - 5 ton', description: 'Compacte gravers' },
      '5-10': { label: '5 - 10 ton', description: 'Middenklasse' },
      '10-15': { label: '10 - 15 ton', description: 'Middenklasse' },
      '15-25': { label: '15 - 25 ton', description: 'Zware klasse' },
      '25-40': { label: '25 - 40 ton', description: 'Zware klasse' },
      '40+': { label: '40+ ton', description: 'Extra zware klasse' }
    };

    filterGrid.innerHTML = data.tonnageRanges.map(range => {
      const info = tonnageLabels[range];
      return `
        <div class="tonnage-filter">
          <input type="checkbox" id="tonnage-${range}" name="tonnage" value="${range}">
          <label for="tonnage-${range}">
            <span class="tonnage-checkbox"></span>
            <span class="tonnage-label">
              <span class="tonnage-range">${info.label}</span>
              <span class="tonnage-count">${info.description}</span>
            </span>
          </label>
        </div>
      `;
    }).join('');
  }

  renderBucketTypeFilters() {
    const data = this.industryData;
    const filterGrid = document.querySelector('.bucket-type-filter-grid');
    
    if (!filterGrid || !data.bucketTypes) return;

    const bucketLabels = {
      'graafbakken': 'Graafbakken',
      'slotenbakken': 'Slotenbakken',
      'rioolbakken': 'Rioolbakken',
      'egalisatiebakken': 'Egalisatiebakken',
      'sloopbakken': 'Sloopbakken',
      'baggerbakken': 'Baggerbakken',
      'sorteerbakken': 'Sorteerbakken'
    };

    filterGrid.innerHTML = data.bucketTypes.map(type => {
      return `
        <div class="bucket-type-filter">
          <input type="checkbox" id="type-${type}" name="bucket-type" value="${type}">
          <label for="type-${type}">${bucketLabels[type]}</label>
        </div>
      `;
    }).join('');
  }

  renderBenefits() {
    const data = this.industryData;
    const benefitsGrid = document.querySelector('.benefits-grid');
    
    if (!benefitsGrid || !data.benefits) return;

    benefitsGrid.innerHTML = data.benefits.map(benefit => {
      return `
        <div class="benefit-card">
          <svg class="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            ${benefit.icon}
          </svg>
          <h3 class="benefit-title">${benefit.title}</h3>
          <p class="benefit-text">${benefit.description}</p>
        </div>
      `;
    }).join('');
  }

  renderSEOContent() {
    const data = this.industryData;
    const seoMain = document.querySelector('.industry-seo-main');
    
    if (!seoMain || !data.seoContent) return;

    let html = `<h2>${data.seoContent.mainTitle}</h2>`;
    
    data.seoContent.sections.forEach(section => {
      if (section.title) {
        html += `<h3>${section.title}</h3>`;
      }
      html += `<p>${section.content}</p>`;
    });

    // Voeg placeholder toe voor populaire producten als die sectie bestaat
    const popularSection = data.seoContent.sections.find(s => s.title && s.title.includes('Populaire'));
    if (popularSection) {
      html += `
        <h3>Populaire Bakken voor ${data.name}</h3>
        <div id="content-popular-products" class="industry-products-grid">
          <div class="loading"><div class="spinner"></div></div>
        </div>
      `;
    }

    seoMain.innerHTML = html;
  }

  renderRelatedIndustries() {
    const relatedLinks = document.querySelector('.industry-related-links');
    
    if (!relatedLinks) return;

    const basePath = getBasePath();
    const related = getRelatedIndustries(this.industrySlug);
    
    relatedLinks.innerHTML = related.map(industry => {
      return `<a href="${basePath}industrieen/${industry.slug}/">${industry.name}</a>`;
    }).join('');
  }

  renderCTAFooter() {
    const data = this.industryData;
    
    // Update CTA title
    const ctaTitle = document.querySelector('.industry-cta-section .cta-title');
    if (ctaTitle) {
      ctaTitle.textContent = data.ctaFooter.title;
    }
    
    // Update CTA text
    const ctaText = document.querySelector('.industry-cta-section .cta-text');
    if (ctaText) {
      ctaText.textContent = data.ctaFooter.text;
    }
    
    // Update CTA button link
    const ctaButton = document.querySelector('.industry-cta-section a[href*="contact"]');
    if (ctaButton) {
      const currentHref = ctaButton.getAttribute('href');
      if (currentHref) {
        ctaButton.setAttribute('href', currentHref.replace(/industry=[^&]*/, `industry=${data.slug}`));
      }
    }
  }
}

// Initialize template when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new IndustryTemplate();
  });
} else {
  new IndustryTemplate();
}

export default IndustryTemplate;
