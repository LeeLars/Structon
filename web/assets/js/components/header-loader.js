/**
 * Header Loader Component
 * Dynamically loads the unified header with mega menus on all pages
 * Supports multilanguage with locale prefixes (be-nl, nl-nl, be-fr, de-de)
 * 
 * Usage: Add <div id="header-placeholder"></div> at start of <body>
 *        Then include this script
 */

(function() {
  'use strict';

  // Supported locales
  const SUPPORTED_LOCALES = ['be-nl', 'nl-nl', 'be-fr', 'de-de'];
  const DEFAULT_LOCALE = 'be-nl';

  // Detect current locale from URL path
  function getCurrentLocale() {
    const path = window.location.pathname;
    for (const locale of SUPPORTED_LOCALES) {
      // Match /locale/ or /Structon/locale/
      if (path.includes('/' + locale + '/')) {
        return locale;
      }
    }
    return null; // Not in a locale path
  }

  // Get the locale base path (e.g., '/be-nl/' or '/Structon/be-nl/')
  function getLocaleBasePath() {
    const path = window.location.pathname;
    const locale = getCurrentLocale();
    
    if (!locale) {
      // Not in a locale path, return empty (legacy behavior)
      return '';
    }
    
    // Check if on GitHub Pages with /Structon/ prefix
    if (path.includes('/Structon/')) {
      return '/Structon/' + locale + '/';
    }
    
    return '/' + locale + '/';
  }

  // Determine base path based on current page location (relative to locale root)
  function getBasePath() {
    const path = window.location.pathname;
    const locale = getCurrentLocale();
    
    // If we're in a locale path, calculate relative path back to locale root
    if (locale) {
      // Find the position after the locale in the path
      const localeIndex = path.indexOf('/' + locale + '/');
      if (localeIndex !== -1) {
        const pathAfterLocale = path.substring(localeIndex + locale.length + 2); // +2 for the slashes
        const depth = pathAfterLocale.split('/').filter(p => p && !p.includes('.html')).length;
        
        if (depth === 0) {
          // At locale root (e.g., /be-nl/index.html)
          return '';
        } else if (depth === 1) {
          // One level deep (e.g., /be-nl/contact/)
          return '../';
        } else {
          // Two or more levels deep (e.g., /be-nl/kraanbakken/caterpillar/)
          return '../'.repeat(depth);
        }
      }
    }
    
    // Legacy behavior for non-locale paths
    const rootFolders = ['contact', 'over-ons', 'blog', 'faq', 'dealer', 'configurator', 'producten', 'privacy', 'voorwaarden', 'login', 'sitemap-pagina', 'account', 'offerte-aanvragen'];
    
    for (const folder of rootFolders) {
      if (path.includes('/' + folder + '/') || path.endsWith('/' + folder)) {
        return '../';
      }
    }
    
    if (path.includes('/producten/')) {
      return '../';
    }
    
    if (path.includes('/kraanbakken/') || path.includes('/industrieen/') || path.includes('/kennisbank/') || path.includes('/sectoren/')) {
      const parts = path.split('/').filter(p => p && !p.includes('.html'));
      if (parts.length >= 2) {
        return '../../';
      }
      return '../';
    }
    
    if (path.includes('/slotenbakken/')) {
      return '../';
    }
    
    if (path === '/' || path.endsWith('/index.html') || path.match(/^\/[^\/]+\/?$/)) {
      return '';
    }
    
    return '';
  }
  
  // Get path to assets (always relative to web root, not locale root)
  function getAssetsPath() {
    const path = window.location.pathname;
    const locale = getCurrentLocale();
    
    if (locale) {
      // In a locale path - assets are one level up from locale root
      const basePath = getBasePath();
      // basePath gets us to locale root, then we need one more ../ to get to web root
      return basePath + '../assets/';
    }
    
    // Legacy: not in locale path
    return getBasePath() + 'assets/';
  }

  // Get current page path (relative to locale root)
  function getCurrentPagePath() {
    const path = window.location.pathname;
    const locale = getCurrentLocale();
    
    if (locale) {
      const localeIndex = path.indexOf('/' + locale + '/');
      if (localeIndex !== -1) {
        return path.substring(localeIndex + locale.length + 2);
      }
    }
    return '';
  }

  // Generate language switcher HTML
  function getLanguageSwitcher(options = {}) {
    const currentLocale = getCurrentLocale();
    const pagePath = getCurrentPagePath();
    const showFlag = options.showFlag !== false;
    const variantClass = options.variant ? ` language-switcher--${options.variant}` : '';
    
    // If not in a locale path, don't show switcher
    if (!currentLocale) {
      return '';
    }
    
    const localeNames = {
      'be-nl': { flag: '🇧🇪', name: 'NL', full: 'Nederlands (BE)' },
      'nl-nl': { flag: '🇳🇱', name: 'NL', full: 'Nederlands (NL)' },
      'be-fr': { flag: '🇧🇪', name: 'FR', full: 'Français (BE)' },
      'de-de': { flag: '🇩🇪', name: 'DE', full: 'Deutsch' }
    };
    
    const current = localeNames[currentLocale] || localeNames[DEFAULT_LOCALE];
    const basePath = window.location.pathname.includes('/Structon/') ? '/Structon/' : '/';
    
    let dropdownItems = '';
    for (const locale of SUPPORTED_LOCALES) {
      const info = localeNames[locale];
      const isActive = locale === currentLocale ? ' class="active"' : '';
      dropdownItems += `<a href="${basePath}${locale}/${pagePath}"${isActive}>${info.full}</a>`;
    }
    
    return `
      <div class="language-switcher${variantClass}">
        <button class="lang-toggle" id="lang-toggle" aria-label="Taal wijzigen">
          ${showFlag ? `<span class="lang-flag">${current.flag}</span>` : ''}
          <span class="lang-code">${current.name}</span>
          <span class="lang-arrow">▼</span>
        </button>
        <div class="lang-dropdown" id="lang-dropdown">
          ${dropdownItems}
        </div>
      </div>
    `;
  }

  // Get the header HTML with correct paths
  function getHeaderHTML(basePath) {
    // All category links should go to /producten/?cat= (not )
    const pagesPrefix = basePath === '../' && window.location.pathname.includes('/producten/') ? '' : basePath + 'producten/';
    
    return `
  <!-- Header Wrapper (Sticky) -->
  <div class="header-wrapper" id="header-wrapper">
    <!-- Top bar -->
    <div class="top-bar">
      <div class="container">
        ${getLanguageSwitcher({ showFlag: false, variant: 'topbar' })}
        <nav class="top-nav">
          <div class="account-menu-wrapper" id="account-menu-wrapper">
            <!-- Account menu will be dynamically populated based on login state -->
          </div>
          <a href="${basePath}over-ons/">Over</a>
          <a href="${basePath}dealer/">Dealer worden</a>
          <a href="${basePath}blog/">Blog</a>
          <a href="${basePath}faq/">FAQ</a>
          <a href="${basePath}configurator/">Configurator</a>
          <a href="${basePath}contact/">Contact</a>
        </nav>
      </div>
    </div>
  
    <!-- Main navigation -->
    <nav class="main-nav">
      <div class="container">
        <a href="${basePath}" class="logo">
          <img src="https://res.cloudinary.com/dchrgzyb4/image/upload/v1764264700/Logo-transparant_neticz.png" alt="Structon Logo" class="logo-image">
        </a>
        
        <div class="menu">
          <div class="menu-item">
            <a href="${pagesPrefix}?cat=graafbakken">
              Graafbakken <span class="dropdown-arrow">▼</span>
            </a>
            
            <!-- Mega Menu Dropdown - Graafbakken -->
            <div class="menu-dropdown">
              <div class="menu-dropdown-container">
                <div class="menu-dropdown-content" style="width: 100%;">
                  <div class="menu-dropdown-header">
                    <h3 class="menu-dropdown-title">Graafbakken</h3>
                    <a href="${pagesPrefix}?cat=graafbakken" class="menu-dropdown-view-all">
                      <span>Bekijk alles</span>
                    </a>
                  </div>
                  
                  <div class="menu-dropdown-grid">
                    <div class="menu-column">
                      <a href="${pagesPrefix}graafbakken/slotenbakken/" class="menu-column-title">Slotenbakken</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}graafbakken/slotenbakken/?tonnage=1-3t" class="menu-tonnage-link"><span>•</span> <span>Slotenbakken voor kranen van 1 - 3 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/slotenbakken/?tonnage=3-8t" class="menu-tonnage-link"><span>•</span> <span>Slotenbakken voor kranen van 3 - 8 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/slotenbakken/?tonnage=8-15t" class="menu-tonnage-link"><span>•</span> <span>Slotenbakken voor kranen van 8 - 15 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/slotenbakken/?tonnage=15-25t" class="menu-tonnage-link"><span>•</span> <span>Slotenbakken voor kranen van 15 - 25 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/slotenbakken/?tonnage=25-50t" class="menu-tonnage-link"><span>•</span> <span>Slotenbakken voor kranen van 25 - 50 ton</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}graafbakken/dieplepelbakken/" class="menu-column-title">Dieplepelbakken</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}graafbakken/dieplepelbakken/?tonnage=1-3t" class="menu-tonnage-link"><span>•</span> <span>Dieplepelbakken voor kranen van 1 - 3 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/dieplepelbakken/?tonnage=3-8t" class="menu-tonnage-link"><span>•</span> <span>Dieplepelbakken voor kranen van 3 - 8 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/dieplepelbakken/?tonnage=8-15t" class="menu-tonnage-link"><span>•</span> <span>Dieplepelbakken voor kranen van 8 - 15 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/dieplepelbakken/?tonnage=15-25t" class="menu-tonnage-link"><span>•</span> <span>Dieplepelbakken voor kranen van 15 - 25 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/dieplepelbakken/?tonnage=25-50t" class="menu-tonnage-link"><span>•</span> <span>Dieplepelbakken voor kranen van 25 - 50 ton</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}graafbakken/sleuvenbakken/" class="menu-column-title">Sleuvenbakken</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}graafbakken/sleuvenbakken/?tonnage=1-3t" class="menu-tonnage-link"><span>•</span> <span>Sleuvenbakken voor kranen van 1 - 3 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/sleuvenbakken/?tonnage=3-8t" class="menu-tonnage-link"><span>•</span> <span>Sleuvenbakken voor kranen van 3 - 8 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/sleuvenbakken/?tonnage=8-15t" class="menu-tonnage-link"><span>•</span> <span>Sleuvenbakken voor kranen van 8 - 15 ton</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}graafbakken/kantelbakken/" class="menu-column-title">Kantelbakken</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}graafbakken/kantelbakken/?tonnage=1-3t" class="menu-tonnage-link"><span>•</span> <span>Kantelbakken voor kranen van 1 - 3 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/kantelbakken/?tonnage=3-8t" class="menu-tonnage-link"><span>•</span> <span>Kantelbakken voor kranen van 3 - 8 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/kantelbakken/?tonnage=8-15t" class="menu-tonnage-link"><span>•</span> <span>Kantelbakken voor kranen van 8 - 15 ton</span></a>
                      </div>
                    </div>
                  </div>
                  
                  <div class="menu-cta-box">
                    <div class="menu-cta-content">
                      <h4 class="menu-cta-title">HULP NODIG?</h4>
                      <p class="menu-cta-text">Weet u niet zeker welke graafbakken geschikt zijn voor uw machine? Onze specialisten helpen u graag.</p>
                    </div>
                    <a href="${basePath}contact/" class="btn-split">
                      <span class="btn-split-text">Neem contact op</span>
                      <span class="btn-split-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="menu-item">
            <a href="${pagesPrefix}?cat=sloop-sorteergrijpers">
              Sloop- en sorteergrijpers <span class="dropdown-arrow">▼</span>
            </a>
            
            <!-- Mega Menu Dropdown - Sloop -->
            <div class="menu-dropdown">
              <div class="menu-dropdown-container">
                <div class="menu-dropdown-content" style="width: 100%;">
                  <div class="menu-dropdown-header">
                    <h3 class="menu-dropdown-title">Sloop- en Sorteergrijpers</h3>
                    <a href="${pagesPrefix}?cat=sloop-sorteergrijpers" class="menu-dropdown-view-all"><span>Bekijk alles</span></a>
                  </div>
                  
                  <div class="menu-dropdown-grid">
                    <div class="menu-column">
                      <a href="${pagesPrefix}sloop-sorteergrijpers/sorteergrijpers/" class="menu-column-title">Sorteergrijpers</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sorteergrijpers/?tonnage=1t-5t" class="menu-tonnage-link"><span>•</span> <span>Sorteergrijpers voor kranen van 1t - 5t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sorteergrijpers/?tonnage=5t-10t" class="menu-tonnage-link"><span>•</span> <span>Sorteergrijpers voor kranen van 5t - 10t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sorteergrijpers/?tonnage=10t-20t" class="menu-tonnage-link"><span>•</span> <span>Sorteergrijpers voor kranen van 10t - 20t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sorteergrijpers/?tonnage=20t-plus" class="menu-tonnage-link"><span>•</span> <span>Sorteergrijpers voor kranen van 20t+</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}sloop-sorteergrijpers/sloopgrijpers/" class="menu-column-title">Sloopgrijpers</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sloopgrijpers/?tonnage=5t-10t" class="menu-tonnage-link"><span>•</span> <span>Sloopgrijpers voor kranen van 5t - 10t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sloopgrijpers/?tonnage=10t-20t" class="menu-tonnage-link"><span>•</span> <span>Sloopgrijpers voor kranen van 10t - 20t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sloopgrijpers/?tonnage=20t-30t" class="menu-tonnage-link"><span>•</span> <span>Sloopgrijpers voor kranen van 20t - 30t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sloopgrijpers/?tonnage=30t-plus" class="menu-tonnage-link"><span>•</span> <span>Sloopgrijpers voor kranen van 30t+</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}sloop-sorteergrijpers/betonscharen/" class="menu-column-title">Betonscharen</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}sloop-sorteergrijpers/betonscharen/?tonnage=10t-20t" class="menu-tonnage-link"><span>•</span> <span>Betonscharen voor kranen van 10t - 20t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/betonscharen/?tonnage=20t-30t" class="menu-tonnage-link"><span>•</span> <span>Betonscharen voor kranen van 20t - 30t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/betonscharen/?tonnage=30t-plus" class="menu-tonnage-link"><span>•</span> <span>Betonscharen voor kranen van 30t+</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}sloop-sorteergrijpers/pulverisers/" class="menu-column-title">Pulverisers</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}sloop-sorteergrijpers/pulverisers/?tonnage=20t-30t" class="menu-tonnage-link"><span>•</span> <span>Pulverisers voor kranen van 20t - 30t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/pulverisers/?tonnage=30t-40t" class="menu-tonnage-link"><span>•</span> <span>Pulverisers voor kranen van 30t - 40t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/pulverisers/?tonnage=40t-plus" class="menu-tonnage-link"><span>•</span> <span>Pulverisers voor kranen van 40t+</span></a>
                      </div>
                    </div>
                  </div>
                  
                  <div class="menu-cta-box">
                    <div class="menu-cta-content">
                      <h4 class="menu-cta-title">HULP NODIG?</h4>
                      <p class="menu-cta-text">Weet u niet zeker welke sloop- of sorteergrijper geschikt is voor uw machine? Onze specialisten helpen u graag.</p>
                    </div>
                    <a href="${basePath}contact/" class="btn-split">
                      <span class="btn-split-text">Neem contact op</span>
                      <span class="btn-split-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="menu-item">
            <a href="${pagesPrefix}?cat=overige">
              Overige <span class="dropdown-arrow">▼</span>
            </a>
            
            <!-- Mega Menu Dropdown - Overige -->
            <div class="menu-dropdown">
              <div class="menu-dropdown-container">
                <div class="menu-dropdown-content" style="width: 100%;">
                  <div class="menu-dropdown-header">
                    <h3 class="menu-dropdown-title">Overige Producten</h3>
                    <a href="${pagesPrefix}?cat=overige" class="menu-dropdown-view-all"><span>Bekijk alles</span></a>
                  </div>
                  
                  <div class="menu-dropdown-grid">
                    <div class="menu-column">
                      <a href="${pagesPrefix}overige/tanden-slijtdelen/" class="menu-column-title">Tanden & Slijtdelen</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}overige/tanden-slijtdelen/?type=graaftanden" class="menu-tonnage-link"><span>•</span> <span>Graaftanden (diverse types)</span></a>
                        <a href="${pagesPrefix}overige/tanden-slijtdelen/?type=slijtplaten" class="menu-tonnage-link"><span>•</span> <span>Slijtplaten Hardox</span></a>
                        <a href="${pagesPrefix}overige/tanden-slijtdelen/?type=snijkanten" class="menu-tonnage-link"><span>•</span> <span>Snijkanten</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}overige/hydrauliek/" class="menu-column-title">Hydraulische Onderdelen</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}overige/hydrauliek/?type=cilinders" class="menu-tonnage-link"><span>•</span> <span>Hydraulische cilinders</span></a>
                        <a href="${pagesPrefix}overige/hydrauliek/?type=slangen" class="menu-tonnage-link"><span>•</span> <span>Hydraulische slangen</span></a>
                        <a href="${pagesPrefix}overige/hydrauliek/?type=koppelingen" class="menu-tonnage-link"><span>•</span> <span>Snelkoppelingen</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}overige/smeermiddelen/" class="menu-column-title">Smeermiddelen</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}overige/smeermiddelen/?type=vet" class="menu-tonnage-link"><span>•</span> <span>Smeervet</span></a>
                        <a href="${pagesPrefix}overige/smeermiddelen/?type=olie" class="menu-tonnage-link"><span>•</span> <span>Hydraulische olie</span></a>
                        <a href="${pagesPrefix}overige/smeermiddelen/?type=spray" class="menu-tonnage-link"><span>•</span> <span>Smeersprays</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}overige/accessoires/" class="menu-column-title">Accessoires</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}overige/accessoires/?type=hijsogen" class="menu-tonnage-link"><span>•</span> <span>Hijsogen</span></a>
                        <a href="${pagesPrefix}overige/accessoires/?type=beschermkappen" class="menu-tonnage-link"><span>•</span> <span>Beschermkappen</span></a>
                        <a href="${pagesPrefix}overige/accessoires/?type=gereedschap" class="menu-tonnage-link"><span>•</span> <span>Montage gereedschap</span></a>
                      </div>
                    </div>
                  </div>
                  
                  <div class="menu-cta-box">
                    <div class="menu-cta-content">
                      <h4 class="menu-cta-title">HULP NODIG?</h4>
                      <p class="menu-cta-text">Zoekt u een specifiek onderdeel of accessoire? Neem contact op met onze specialisten.</p>
                    </div>
                    <a href="${basePath}contact/" class="btn-split">
                      <span class="btn-split-text">Neem contact op</span>
                      <span class="btn-split-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="nav-actions">
          <a href="${basePath}producten/" class="cta-button">Bekijk alles</a>
        </div>
        
        <button class="menu-toggle" id="menu-toggle" aria-label="Menu openen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  </div><!-- End Header Wrapper -->

  <!-- Mobile Navigation -->
  <nav class="nav-mobile" id="nav-mobile" aria-label="Mobiele navigatie">
    <button class="nav-mobile-close" id="nav-mobile-close" aria-label="Menu sluiten">×</button>
    
    <!-- Quick Actions -->
    <div class="mobile-menu-section">
      <a href="${basePath}producten/" class="nav-link nav-link-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        Alle Producten
      </a>
      <a href="${basePath}offerte-aanvragen/" class="nav-link nav-link-cta">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        Offerte Aanvragen
      </a>
    </div>

    <!-- Product Categories -->
    <div class="mobile-menu-section">
      <div class="menu-section-title">PRODUCTCATEGORIEËN</div>
      <a href="${pagesPrefix}?cat=graafbakken" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        Graafbakken
      </a>
      <a href="${pagesPrefix}?cat=slotenbakken" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        Slotenbakken
      </a>
      <a href="${pagesPrefix}?cat=sloop-sorteergrijpers" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        Sloop- en Sorteergrijpers
      </a>
      <a href="${pagesPrefix}?cat=adapters" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        Adapters
      </a>
    </div>

    <!-- Browse by Brand -->
    <div class="mobile-menu-section">
      <div class="menu-section-title">MERKEN</div>
      <a href="${basePath}kraanbakken/caterpillar/" class="nav-link nav-link-compact">Caterpillar</a>
      <a href="${basePath}kraanbakken/komatsu/" class="nav-link nav-link-compact">Komatsu</a>
      <a href="${basePath}kraanbakken/volvo/" class="nav-link nav-link-compact">Volvo</a>
      <a href="${basePath}kraanbakken/hitachi/" class="nav-link nav-link-compact">Hitachi</a>
      <a href="${basePath}producten/" class="nav-link-more">Alle merken →</a>
    </div>

    <!-- Company Info -->
    <div class="mobile-menu-section">
      <div class="menu-section-title">BEDRIJF</div>
      <a href="${basePath}over-ons/" class="nav-link nav-link-compact">Over Ons</a>
      <a href="${basePath}contact/" class="nav-link nav-link-compact">Contact</a>
      <a href="${basePath}blog/" class="nav-link nav-link-compact">Blog</a>
      <a href="${basePath}faq/" class="nav-link nav-link-compact">FAQ</a>
    </div>

    <!-- Account -->
    <div class="mobile-menu-section">
      <a href="#" class="btn btn-primary btn-block login-trigger">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        Inloggen / Registreren
      </a>
    </div>
  </nav>
`;
  }

  // Initialize header
  function initHeader() {
    // Support both header-placeholder and header-wrapper IDs
    const placeholder = document.getElementById('header-placeholder') || document.getElementById('header-wrapper');
    if (placeholder) {
      const basePath = getBasePath();
      placeholder.outerHTML = getHeaderHTML(basePath);
      console.log('✅ Header loaded via header-loader.js (basePath: ' + basePath + ')');
      
      // Initialize mobile menu toggle after header is loaded
      initMobileMenu();
    }
  }

  // Initialize mobile menu functionality
  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMobile = document.getElementById('nav-mobile');
    const navMobileClose = document.getElementById('nav-mobile-close');

    if (menuToggle && navMobile) {
      menuToggle.addEventListener('click', function() {
        navMobile.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (navMobileClose && navMobile) {
      navMobileClose.addEventListener('click', function() {
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    // Initialize language switcher
    initLanguageSwitcher();
    
    // Initialize account dropdown
    initAccountDropdown();
  }
  
  // Render account menu based on login state
  function renderAccountMenu() {
    const wrapper = document.getElementById('account-menu-wrapper');
    if (!wrapper) return;
    
    // Get base path for links
    const basePath = getBasePath();
    
    // Check if user is logged in
    let user = null;
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        user = JSON.parse(userData);
      }
    } catch (e) {}
    
    const isLoggedIn = user && user.email;
    const isAdmin = user && (user.role === 'admin' || user.role === 'administrator');
    
    if (isLoggedIn) {
      // Show logged in state with dropdown - always show "Mijn Account" in button
      wrapper.innerHTML = `
        <a href="#" id="login-btn" class="login-trigger"><span>Mijn Account</span></a>
        <div id="account-dropdown" class="account-dropdown">
          <div class="account-dropdown-header">
            <div class="account-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="account-info">
              <div class="account-name">${user.email}</div>
              <div class="account-role">${isAdmin ? 'Administrator' : 'Klant'}</div>
            </div>
          </div>
          ${isAdmin ? `
          <a href="https://structon-production.up.railway.app/cms" class="account-dropdown-item" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>CMS Dashboard</span>
          </a>
          <a href="https://structon-production.up.railway.app/cms/products" class="account-dropdown-item" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            <span>Producten Beheren</span>
          </a>
          <a href="https://structon-production.up.railway.app/cms/quotes" class="account-dropdown-item" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>Offertes Beheren</span>
          </a>
          ` : `
          <div class="account-dropdown-divider"></div>
          <a href="${basePath}/account/#dashboard" class="account-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Dashboard</span>
          </a>
          <a href="${basePath}/account/#bestellingen" class="account-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Bestellingen</span>
          </a>
          <a href="${basePath}/account/#offertes" class="account-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <span>Offertes</span>
          </a>
          <div class="account-dropdown-divider"></div>
          <a href="${basePath}/account/#profiel" class="account-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Profiel</span>
          </a>
          <div class="account-dropdown-divider"></div>
          `}
          <button class="account-dropdown-item" id="logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Uitloggen</span>
          </button>
        </div>
      `;
    } else {
      // Show login button for guests
      wrapper.innerHTML = `
        <a href="#" id="login-btn" class="login-trigger"><span>Inloggen</span></a>
      `;
    }
    
    // Re-attach event listeners
    initAccountDropdownEvents();
  }
  
  // Initialize account dropdown events
  function initAccountDropdownEvents() {
    const loginBtn = document.getElementById('login-btn');
    const accountDropdown = document.getElementById('account-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Check if user is logged in
    let isLoggedIn = false;
    try {
      const userData = localStorage.getItem('user');
      isLoggedIn = userData && JSON.parse(userData).email;
    } catch (e) {}
    
    if (loginBtn) {
      loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (isLoggedIn && accountDropdown) {
          // Toggle dropdown for logged in users
          accountDropdown.classList.toggle('active');
        } else {
          // Open login modal for guests
          if (window.openLoginModal) {
            window.openLoginModal();
          }
        }
      });
    }
    
    if (accountDropdown) {
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (loginBtn && !loginBtn.contains(e.target) && !accountDropdown.contains(e.target)) {
          accountDropdown.classList.remove('active');
        }
      });
    }
    
    // Logout functionality
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Clear any stored auth tokens
        try {
          localStorage.removeItem('structon_auth_token');
          sessionStorage.removeItem('structon_auth_token');
          localStorage.removeItem('structon_user_email');
          localStorage.removeItem('structon_user_role');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        } catch (err) {}
        
        // Stay on current page by navigating to the same URL
        window.location.href = window.location.href;
      });
    }
  }
  
  // Initialize account dropdown (called after header is loaded)
  function initAccountDropdown() {
    renderAccountMenu();
  }
  
  // Initialize language switcher dropdown
  function initLanguageSwitcher() {
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');
    
    if (langToggle && langDropdown) {
      langToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
          langDropdown.classList.remove('active');
        }
      });
      
      // Save preference when clicking a language
      langDropdown.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          const href = this.getAttribute('href');
          const match = href.match(/\/(be-nl|nl-nl|be-fr|de-de)\//);
          if (match) {
            try {
              localStorage.setItem('structon_locale', match[1]);
            } catch (e) {}
          }
        });
      });
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();
