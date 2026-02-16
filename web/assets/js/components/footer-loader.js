/**
 * Footer Loader Component
 * Dynamically loads unified footer on all pages
 * Supports multilanguage with locale prefixes (be-nl, nl-nl, be-fr, de-de)
 */

(function() {
  'use strict';

  const SUPPORTED_LOCALES = ['be-nl', 'nl-nl', 'be-fr', 'de-de'];

  function getCurrentLocale() {
    const path = window.location.pathname;
    for (const locale of SUPPORTED_LOCALES) {
      if (path.includes('/' + locale + '/')) {
        return locale;
      }
    }
    return null;
  }

  function getBasePath() {
    const path = window.location.pathname;
    const locale = getCurrentLocale();
    
    // For locale-specific pages, calculate relative path back to locale root
    if (locale) {
      const localeIndex = path.indexOf('/' + locale + '/');
      if (localeIndex !== -1) {
        const pathAfterLocale = path.substring(localeIndex + locale.length + 2);
        const depth = pathAfterLocale.split('/').filter(p => p && !p.includes('.html')).length;
        
        // Return relative path to locale root
        if (depth === 0) return './';
        else if (depth === 1) return '../';
        else return '../'.repeat(depth);
      }
    }
    
    // For non-locale pages (legacy root pages)
    const rootFolders = ['contact', 'over-ons', 'blog', 'faq', 'dealer', 'configurator', 'producten', 'privacy', 'voorwaarden', 'login', 'sitemap-pagina', 'account', 'offerte-aanvragen'];
    
    for (const folder of rootFolders) {
      if (path.includes('/' + folder + '/') || path.endsWith('/' + folder)) {
        return '../';
      }
    }
    
    if (path.includes('/kraanbakken/') || path.includes('/industrieen/')) {
      const parts = path.split('/').filter(p => p && !p.includes('.html'));
      if (parts.length >= 2) return '../../';
      return '../';
    }
    
    return './';
  }

  function getFooterHTML(basePath) {
    const assetsPath = basePath + 'assets/';
    const logoUrl = 'https://res.cloudinary.com/dchrgzyb4/image/upload/v1764264700/Logo-transparant_neticz.png';
    
    const locale = getCurrentLocale() || 'be-nl';
    const ft = {
      'be-nl': {
        tagline: 'Specialist in kraanbakken en<br>graafmachine aanbouwdelen.',
        navLoading: 'Navigatie laden...',
        allRights: 'Alle rechten voorbehouden.',
        terms: 'Voorwaarden',
        madeBy: 'Gemaakt door'
      },
      'nl-nl': {
        tagline: 'Specialist in kraanbakken en<br>graafmachine aanbouwdelen.',
        navLoading: 'Navigatie laden...',
        allRights: 'Alle rechten voorbehouden.',
        terms: 'Voorwaarden',
        madeBy: 'Gemaakt door'
      },
      'be-fr': {
        tagline: 'Sp\u00e9cialiste en godets et<br>accessoires pour pelles.',
        navLoading: 'Chargement de la navigation...',
        allRights: 'Tous droits r\u00e9serv\u00e9s.',
        terms: 'Conditions',
        madeBy: 'R\u00e9alis\u00e9 par'
      },
      'de-de': {
        tagline: 'Spezialist f\u00fcr Baggerl\u00f6ffel und<br>Bagger-Anbauger\u00e4te.',
        navLoading: 'Navigation wird geladen...',
        allRights: 'Alle Rechte vorbehalten.',
        terms: 'AGB',
        madeBy: 'Erstellt von'
      }
    };
    const t = ft[locale] || ft['be-nl'];
    
    return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <!-- Column 1: Logo & Info -->
        <div class="footer-brand-col">
          <a href="${basePath}" class="footer-logo">
            <img src="${logoUrl}" alt="Structon" width="120">
          </a>
          <p class="footer-tagline">
            ${t.tagline}
          </p>
        </div>

        <!-- Column 2 & 3: Dynamic Sitemap -->
        <div class="footer-sitemap-col">
          <ul id="footer-sitemap" class="sitemap-grid">
            <!-- Dynamically loaded via sitemap.js -->
            <li class="sitemap-loading">${t.navLoading}</li>
          </ul>
        </div>

        <!-- Column 4: Contact -->
        <div class="footer-contact-col">
          <h4 class="footer-heading">Contact</h4>
          <address class="footer-address">
            <p><strong>Structon BV</strong></p>
            <p>BE 1029978959</p>
            <p>Sint jorisstraat 84B</p>
            <p>8730 Beernem</p>
            <p class="mt-2"><a href="mailto:info@structon.be">info@structon.be</a></p>
          </address>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-legal">
          <p>&copy; 2024 Structon. ${t.allRights}</p>
          <div class="legal-links">
            <a href="${basePath}sitemap-pagina/">Sitemap</a>
            <span class="separator">&bull;</span>
            <a href="${basePath}privacy/">Privacy</a>
            <span class="separator">&bull;</span>
            <a href="${basePath}voorwaarden/">${t.terms}</a>
          </div>
        </div>
        
        <div class="footer-creator">
          <span>${t.madeBy} <a href="https://grafixstudio.be/" target="_blank" rel="noopener">Grafix Studio</a></span>
          <span class="creator-separator">&bull;</span>
          <a href="https://structon-production.up.railway.app/cms/" class="cms-lock-link" target="_blank" rel="noopener" title="CMS Login">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
`;
  }

  function initFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
      const basePath = getBasePath();
      placeholder.outerHTML = getFooterHTML(basePath);
      console.log('✅ Footer loaded via footer-loader.js (basePath: ' + basePath + ')');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }
})();
