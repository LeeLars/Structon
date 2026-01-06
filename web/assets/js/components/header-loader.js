/**
 * Header Loader Component
 * Dynamically loads the unified header with mega menus on all pages
 * 
 * Usage: Add <div id="header-placeholder"></div> at start of <body>
 *        Then include this script
 */

(function() {
  'use strict';

  // Determine base path based on current page location
  function getBasePath() {
    const path = window.location.pathname;
    
    // Root-level folders that need '../' to get back to site root
    const rootFolders = ['contact', 'over-ons', 'blog', 'faq', 'dealer', 'configurator', 'producten', 'privacy', 'voorwaarden', 'login', 'sitemap-pagina', 'account'];
    
    // Check for root-level folders FIRST (works for both local and GitHub Pages)
    // This handles /producten/, /over-ons/, /Structon/producten/, etc.
    for (const folder of rootFolders) {
      if (path.includes('/' + folder + '/') || path.endsWith('/' + folder)) {
        return '../';
      }
    }
    
    // Pages folder (/pages/*.html)
    if (path.includes('/pages/')) {
      return '../';
    }
    
    // Brand pages (/kraanbakken/brand/) or Industry pages (/industrieen/industry/)
    if (path.includes('/kraanbakken/') || path.includes('/industrieen/') || path.includes('/kennisbank/') || path.includes('/sectoren/')) {
      // Check depth - if we're in a subfolder
      const parts = path.split('/').filter(p => p && !p.includes('.html'));
      if (parts.length >= 2) {
        return '../../';
      }
      return '../';
    }
    
    // Slotenbakken landing page
    if (path.includes('/slotenbakken/')) {
      return '../';
    }
    
    // Root level (index.html or /) - no prefix needed
    if (path === '/' || path.endsWith('/index.html') || path.match(/^\/[^\/]+\/?$/)) {
      return '';
    }
    
    // Default fallback
    return '';
  }

  // Get the header HTML with correct paths
  function getHeaderHTML(basePath) {
    // For pages in /pages/ folder, category links don't need prefix
    // For other pages, they need the appropriate prefix
    const pagesPrefix = basePath === '../' && window.location.pathname.includes('/pages/') ? '' : basePath + 'pages/';
    
    return `
  <!-- Header Wrapper (Sticky) -->
  <div class="header-wrapper" id="header-wrapper">
    <!-- Top bar -->
    <div class="top-bar">
      <div class="container">
        <nav class="top-nav">
          <a href="#" id="login-btn" class="login-trigger">Inloggen</a>
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
            <a href="${pagesPrefix}category.html?cat=graafbakken">
              Graafbakken <span class="dropdown-arrow">▼</span>
            </a>
            
            <!-- Mega Menu Dropdown - Graafbakken -->
            <div class="menu-dropdown">
              <div class="menu-dropdown-container">
                <div class="menu-dropdown-content" style="width: 100%;">
                  <div class="menu-dropdown-header">
                    <h3 class="menu-dropdown-title">Graafbakken</h3>
                    <a href="${pagesPrefix}category.html?cat=graafbakken" class="menu-dropdown-view-all">
                      <span>Bekijk alles</span>
                    </a>
                  </div>
                  
                  <div class="menu-dropdown-grid">
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=slotenbakken" class="menu-column-title">Slotenbakken</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=slotenbakken&tonnage=1t-2-5t" class="menu-tonnage-link"><span>•</span> <span>Slotenbakken voor kranen van 1t - 2,5t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=slotenbakken&tonnage=2-5t-5t" class="menu-tonnage-link"><span>•</span> <span>Slotenbakken voor kranen van 2,5t - 5t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=slotenbakken&tonnage=5t-10t" class="menu-tonnage-link"><span>•</span> <span>Slotenbakken voor kranen van 5t - 10t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=slotenbakken&tonnage=10t-15t" class="menu-tonnage-link"><span>•</span> <span>Slotenbakken voor kranen van 10t - 15t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=slotenbakken&tonnage=15t-25t" class="menu-tonnage-link"><span>•</span> <span>Slotenbakken voor kranen van 15t - 25t</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=dieplepelbakken" class="menu-column-title">Dieplepelbakken</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=dieplepelbakken&tonnage=1t-2-5t" class="menu-tonnage-link"><span>•</span> <span>Dieplepelbakken voor kranen van 1t - 2,5t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=dieplepelbakken&tonnage=2-5t-5t" class="menu-tonnage-link"><span>•</span> <span>Dieplepelbakken voor kranen van 2,5t - 5t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=dieplepelbakken&tonnage=5t-10t" class="menu-tonnage-link"><span>•</span> <span>Dieplepelbakken voor kranen van 5t - 10t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=dieplepelbakken&tonnage=10t-15t" class="menu-tonnage-link"><span>•</span> <span>Dieplepelbakken voor kranen van 10t - 15t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=dieplepelbakken&tonnage=15t-25t" class="menu-tonnage-link"><span>•</span> <span>Dieplepelbakken voor kranen van 15t - 25t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=dieplepelbakken&tonnage=25t-plus" class="menu-tonnage-link"><span>•</span> <span>Dieplepelbakken voor kranen van 25t+</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=sleuvenbakken" class="menu-column-title">Sleuvenbakken</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=sleuvenbakken&tonnage=1t-2-5t" class="menu-tonnage-link"><span>•</span> <span>Sleuvenbakken voor kranen van 1t - 2,5t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=sleuvenbakken&tonnage=2-5t-5t" class="menu-tonnage-link"><span>•</span> <span>Sleuvenbakken voor kranen van 2,5t - 5t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=sleuvenbakken&tonnage=5t-10t" class="menu-tonnage-link"><span>•</span> <span>Sleuvenbakken voor kranen van 5t - 10t</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=kantelbakken" class="menu-column-title">Kantelbakken</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=kantelbakken&tonnage=1t-2-5t" class="menu-tonnage-link"><span>•</span> <span>Kantelbakken voor kranen van 1t - 2,5t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=kantelbakken&tonnage=2-5t-5t" class="menu-tonnage-link"><span>•</span> <span>Kantelbakken voor kranen van 2,5t - 5t</span></a>
                        <a href="${pagesPrefix}category.html?cat=graafbakken&subcat=kantelbakken&tonnage=5t-10t" class="menu-tonnage-link"><span>•</span> <span>Kantelbakken voor kranen van 5t - 10t</span></a>
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
            <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers">
              Sloop- en sorteergrijpers <span class="dropdown-arrow">▼</span>
            </a>
            
            <!-- Mega Menu Dropdown - Sloop -->
            <div class="menu-dropdown">
              <div class="menu-dropdown-container">
                <div class="menu-dropdown-content" style="width: 100%;">
                  <div class="menu-dropdown-header">
                    <h3 class="menu-dropdown-title">Sloop- en Sorteergrijpers</h3>
                    <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers" class="menu-dropdown-view-all"><span>Bekijk alles</span></a>
                  </div>
                  
                  <div class="menu-dropdown-grid">
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=sorteergrijpers" class="menu-column-title">Sorteergrijpers</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=sorteergrijpers&tonnage=1t-5t" class="menu-tonnage-link"><span>•</span> <span>Sorteergrijpers voor kranen van 1t - 5t</span></a>
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=sorteergrijpers&tonnage=5t-10t" class="menu-tonnage-link"><span>•</span> <span>Sorteergrijpers voor kranen van 5t - 10t</span></a>
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=sorteergrijpers&tonnage=10t-20t" class="menu-tonnage-link"><span>•</span> <span>Sorteergrijpers voor kranen van 10t - 20t</span></a>
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=sorteergrijpers&tonnage=20t-plus" class="menu-tonnage-link"><span>•</span> <span>Sorteergrijpers voor kranen van 20t+</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=sloopgrijpers" class="menu-column-title">Sloopgrijpers</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=sloopgrijpers&tonnage=5t-10t" class="menu-tonnage-link"><span>•</span> <span>Sloopgrijpers voor kranen van 5t - 10t</span></a>
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=sloopgrijpers&tonnage=10t-20t" class="menu-tonnage-link"><span>•</span> <span>Sloopgrijpers voor kranen van 10t - 20t</span></a>
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=sloopgrijpers&tonnage=20t-30t" class="menu-tonnage-link"><span>•</span> <span>Sloopgrijpers voor kranen van 20t - 30t</span></a>
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=sloopgrijpers&tonnage=30t-plus" class="menu-tonnage-link"><span>•</span> <span>Sloopgrijpers voor kranen van 30t+</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=betonscharen" class="menu-column-title">Betonscharen</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=betonscharen&tonnage=10t-20t" class="menu-tonnage-link"><span>•</span> <span>Betonscharen voor kranen van 10t - 20t</span></a>
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=betonscharen&tonnage=20t-30t" class="menu-tonnage-link"><span>•</span> <span>Betonscharen voor kranen van 20t - 30t</span></a>
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=betonscharen&tonnage=30t-plus" class="menu-tonnage-link"><span>•</span> <span>Betonscharen voor kranen van 30t+</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=pulverisers" class="menu-column-title">Pulverisers</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=pulverisers&tonnage=20t-30t" class="menu-tonnage-link"><span>•</span> <span>Pulverisers voor kranen van 20t - 30t</span></a>
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=pulverisers&tonnage=30t-40t" class="menu-tonnage-link"><span>•</span> <span>Pulverisers voor kranen van 30t - 40t</span></a>
                        <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers&subcat=pulverisers&tonnage=40t-plus" class="menu-tonnage-link"><span>•</span> <span>Pulverisers voor kranen van 40t+</span></a>
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
            <a href="${pagesPrefix}category.html?cat=adapters">
              Adapterstukken <span class="dropdown-arrow">▼</span>
            </a>
            
            <!-- Mega Menu Dropdown - Adapters -->
            <div class="menu-dropdown">
              <div class="menu-dropdown-container">
                <div class="menu-dropdown-content" style="width: 100%;">
                  <div class="menu-dropdown-header">
                    <h3 class="menu-dropdown-title">Adapterstukken</h3>
                    <a href="${pagesPrefix}category.html?cat=adapters" class="menu-dropdown-view-all"><span>Bekijk alles</span></a>
                  </div>
                  
                  <div class="menu-dropdown-grid">
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=adapters&subcat=cw-snelwissels" class="menu-column-title">CW Snelwissels</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=cw-snelwissels&type=cw05" class="menu-tonnage-link"><span>•</span> <span>CW05 Snelwissels (1-2 ton)</span></a>
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=cw-snelwissels&type=cw10" class="menu-tonnage-link"><span>•</span> <span>CW10 Snelwissels (2-5 ton)</span></a>
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=cw-snelwissels&type=cw20" class="menu-tonnage-link"><span>•</span> <span>CW20 Snelwissels (5-10 ton)</span></a>
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=cw-snelwissels&type=cw30" class="menu-tonnage-link"><span>•</span> <span>CW30 Snelwissels (10-15 ton)</span></a>
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=cw-snelwissels&type=cw40" class="menu-tonnage-link"><span>•</span> <span>CW40 Snelwissels (15-25 ton)</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=adapters&subcat=s-systemen" class="menu-column-title">S-Systemen</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=s-systemen&type=s45" class="menu-tonnage-link"><span>•</span> <span>S45 Snelwissels (5-10 ton)</span></a>
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=s-systemen&type=s60" class="menu-tonnage-link"><span>•</span> <span>S60 Snelwissels (10-15 ton)</span></a>
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=s-systemen&type=s70" class="menu-tonnage-link"><span>•</span> <span>S70 Snelwissels (15-25 ton)</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=adapters&subcat=pennen-bussen" class="menu-column-title">Pennen & Bussen</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=pennen-bussen&type=pennen" class="menu-tonnage-link"><span>•</span> <span>Pennen (diverse maten)</span></a>
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=pennen-bussen&type=bussen" class="menu-tonnage-link"><span>•</span> <span>Bussen (diverse maten)</span></a>
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=pennen-bussen&type=borgpennen" class="menu-tonnage-link"><span>•</span> <span>Borgpennen</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=adapters&subcat=adapterplaten" class="menu-column-title">Adapterplaten</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=adapterplaten&type=cw-naar-s" class="menu-tonnage-link"><span>•</span> <span>CW naar S-systeem</span></a>
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=adapterplaten&type=s-naar-cw" class="menu-tonnage-link"><span>•</span> <span>S naar CW-systeem</span></a>
                        <a href="${pagesPrefix}category.html?cat=adapters&subcat=adapterplaten&type=vast" class="menu-tonnage-link"><span>•</span> <span>Vaste adapterplaten</span></a>
                      </div>
                    </div>
                  </div>
                  
                  <div class="menu-cta-box">
                    <div class="menu-cta-content">
                      <h4 class="menu-cta-title">HULP NODIG?</h4>
                      <p class="menu-cta-text">Weet u niet zeker welke aansluiting u nodig heeft? Onze specialisten helpen u graag met het juiste adapterstuk.</p>
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
            <a href="${pagesPrefix}category.html?cat=overige">
              Overige <span class="dropdown-arrow">▼</span>
            </a>
            
            <!-- Mega Menu Dropdown - Overige -->
            <div class="menu-dropdown">
              <div class="menu-dropdown-container">
                <div class="menu-dropdown-content" style="width: 100%;">
                  <div class="menu-dropdown-header">
                    <h3 class="menu-dropdown-title">Overige Producten</h3>
                    <a href="${pagesPrefix}category.html?cat=overige" class="menu-dropdown-view-all"><span>Bekijk alles</span></a>
                  </div>
                  
                  <div class="menu-dropdown-grid">
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=overige&subcat=tanden-slijtdelen" class="menu-column-title">Tanden & Slijtdelen</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=tanden-slijtdelen&type=graaftanden" class="menu-tonnage-link"><span>•</span> <span>Graaftanden (diverse types)</span></a>
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=tanden-slijtdelen&type=slijtplaten" class="menu-tonnage-link"><span>•</span> <span>Slijtplaten Hardox</span></a>
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=tanden-slijtdelen&type=snijkanten" class="menu-tonnage-link"><span>•</span> <span>Snijkanten</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=overige&subcat=hydrauliek" class="menu-column-title">Hydraulische Onderdelen</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=hydrauliek&type=cilinders" class="menu-tonnage-link"><span>•</span> <span>Hydraulische cilinders</span></a>
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=hydrauliek&type=slangen" class="menu-tonnage-link"><span>•</span> <span>Hydraulische slangen</span></a>
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=hydrauliek&type=koppelingen" class="menu-tonnage-link"><span>•</span> <span>Snelkoppelingen</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=overige&subcat=smeermiddelen" class="menu-column-title">Smeermiddelen</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=smeermiddelen&type=vet" class="menu-tonnage-link"><span>•</span> <span>Smeervet</span></a>
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=smeermiddelen&type=olie" class="menu-tonnage-link"><span>•</span> <span>Hydraulische olie</span></a>
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=smeermiddelen&type=spray" class="menu-tonnage-link"><span>•</span> <span>Smeersprays</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}category.html?cat=overige&subcat=accessoires" class="menu-column-title">Accessoires</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=accessoires&type=hijsogen" class="menu-tonnage-link"><span>•</span> <span>Hijsogen</span></a>
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=accessoires&type=beschermkappen" class="menu-tonnage-link"><span>•</span> <span>Beschermkappen</span></a>
                        <a href="${pagesPrefix}category.html?cat=overige&subcat=accessoires&type=gereedschap" class="menu-tonnage-link"><span>•</span> <span>Montage gereedschap</span></a>
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
    <a href="${basePath}producten/" class="nav-link">Alle Producten</a>
    <a href="${pagesPrefix}category.html?cat=graafbakken" class="nav-link">Graafbakken</a>
    <a href="${pagesPrefix}category.html?cat=slotenbakken" class="nav-link">Slotenbakken</a>
    <a href="${pagesPrefix}category.html?cat=sloop-sorteergrijpers" class="nav-link">Sloop- en sorteergrijpers</a>
    <a href="${pagesPrefix}category.html?cat=adapters" class="nav-link">Adapterstukken</a>
    <a href="${basePath}blog/" class="nav-link">Blog</a>
    <hr>
    <a href="${basePath}over-ons/" class="nav-link">Over ons</a>
    <a href="${basePath}contact/" class="nav-link">Contact</a>
    <a href="${basePath}login/" class="btn btn-primary">Inloggen</a>
  </nav>
`;
  }

  // Initialize header
  function initHeader() {
    const placeholder = document.getElementById('header-placeholder');
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
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();
