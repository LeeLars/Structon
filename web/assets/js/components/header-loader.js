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
    const rootFolders = ['contact', 'over-ons', 'blog', 'faq', 'dealer', 'producten', 'privacy', 'voorwaarden', 'login', 'sitemap-pagina', 'account', 'offerte-aanvragen'];
    
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
      'be-fr': { flag: '🇧🇪', name: 'FR', full: 'Français (FR)' },
      'de-de': { flag: '🇩🇪', name: 'DE', full: 'Deutsch (DE)' }
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
    
    // Get current locale for translations
    const currentLocale = getCurrentLocale() || 'be-nl';
    
    // Translations object
    const t = {
      'be-nl': {
        about: 'Over',
        becomeDealer: 'Dealer worden',
        blog: 'Blog',
        faq: 'FAQ',
        contact: 'Contact',
        excavatorBuckets: 'Graafbakken',
        demolitionGrippers: 'Sloop- en sorteergrijpers',
        other: 'Overige',
        viewAll: 'Bekijk alles',
        helpNeeded: 'HULP NODIG?',
        contactUs: 'Neem contact op',
        trenchBuckets: 'Slotenbakken',
        deepBuckets: 'Dieplepelbakken',
        narrowBuckets: 'Sleuvenbakken',
        tiltBuckets: 'Kantelbakken',
        sortingGrippers: 'Sorteergrijpers',
        demolitionGrippers2: 'Sloopgrijpers',
        concreteShears: 'Betonscharen',
        pulverizers: 'Pulverisers',
        teethWear: 'Tanden & Slijtdelen',
        hydraulicParts: 'Hydraulische Onderdelen',
        lubricants: 'Smeermiddelen',
        accessories: 'Accessoires',
        otherProducts: 'Overige Producten',
        helpTextBuckets: 'Weet u niet zeker welke graafbakken geschikt zijn voor uw machine? Onze specialisten helpen u graag.',
        helpTextGrippers: 'Weet u niet zeker welke sloop- of sorteergrijper geschikt is voor uw machine? Onze specialisten helpen u graag.',
        helpTextOther: 'Zoekt u een specifiek onderdeel of accessoire? Neem contact op met onze specialisten.',
        bucketsFor: 'voor kranen van',
        grippersFor: 'voor kranen van',
        trenchBucketsFor: 'Slotenbakken voor kranen van',
        deepBucketsFor: 'Dieplepelbakken voor kranen van',
        narrowBucketsFor: 'Sleuvenbakken voor kranen van',
        tiltBucketsFor: 'Kantelbakken voor kranen van',
        sortingGrippersFor: 'Sorteergrijpers voor kranen van',
        demolitionGrippersFor: 'Sloopgrijpers voor kranen van',
        concreteShearsFor: 'Betonscharen voor kranen van',
        pulverizersFor: 'Pulverisers voor kranen van',
        digTeeth: 'Graaftanden (diverse types)',
        wearPlates: 'Slijtplaten Hardox',
        cuttingEdges: 'Snijkanten',
        hydraulicCylinders: 'Hydraulische cilinders',
        hydraulicHoses: 'Hydraulische slangen',
        quickCouplers: 'Snelkoppelingen',
        grease: 'Smeervet',
        hydraulicOil: 'Hydraulische olie',
        lubricantSprays: 'Smeersprays',
        liftingEyes: 'Hijsogen',
        protectiveCaps: 'Beschermkappen',
        assemblyTools: 'Montage gereedschap',
        allProducts: 'Alle Producten',
        requestQuote: 'Offerte Aanvragen',
        productCategories: 'PRODUCTCATEGORIE\u00CBN',
        adapters: 'Adapters',
        allBrands: 'Alle merken',
        brandsTitle: 'MERKEN',
        companyTitle: 'BEDRIJF',
        aboutUs: 'Over Ons',
        loginRegister: 'Inloggen / Registreren',
        openMenu: 'Menu openen',
        closeMenu: 'Menu sluiten',
        mobileNav: 'Mobiele navigatie',
        myAccount: 'Mijn Account',
        customer: 'Klant',
        manageProducts: 'Producten Beheren',
        manageQuotes: 'Offertes Beheren',
        orders: 'Bestellingen',
        quotes: 'Offertes',
        profile: 'Profiel',
        logout: 'Uitloggen',
        login: 'Inloggen'
      },
      'nl-nl': {
        about: 'Over',
        becomeDealer: 'Dealer worden',
        blog: 'Blog',
        faq: 'FAQ',
        contact: 'Contact',
        excavatorBuckets: 'Graafbakken',
        demolitionGrippers: 'Sloop- en sorteergrijpers',
        other: 'Overige',
        viewAll: 'Bekijk alles',
        helpNeeded: 'HULP NODIG?',
        contactUs: 'Neem contact op',
        trenchBuckets: 'Slotenbakken',
        deepBuckets: 'Dieplepelbakken',
        narrowBuckets: 'Sleuvenbakken',
        tiltBuckets: 'Kantelbakken',
        sortingGrippers: 'Sorteergrijpers',
        demolitionGrippers2: 'Sloopgrijpers',
        concreteShears: 'Betonscharen',
        pulverizers: 'Pulverisers',
        teethWear: 'Tanden & Slijtdelen',
        hydraulicParts: 'Hydraulische Onderdelen',
        lubricants: 'Smeermiddelen',
        accessories: 'Accessoires',
        otherProducts: 'Overige Producten',
        helpTextBuckets: 'Weet u niet zeker welke graafbakken geschikt zijn voor uw machine? Onze specialisten helpen u graag.',
        helpTextGrippers: 'Weet u niet zeker welke sloop- of sorteergrijper geschikt is voor uw machine? Onze specialisten helpen u graag.',
        helpTextOther: 'Zoekt u een specifiek onderdeel of accessoire? Neem contact op met onze specialisten.',
        bucketsFor: 'voor kranen van',
        grippersFor: 'voor kranen van',
        trenchBucketsFor: 'Slotenbakken voor kranen van',
        deepBucketsFor: 'Dieplepelbakken voor kranen van',
        narrowBucketsFor: 'Sleuvenbakken voor kranen van',
        tiltBucketsFor: 'Kantelbakken voor kranen van',
        sortingGrippersFor: 'Sorteergrijpers voor kranen van',
        demolitionGrippersFor: 'Sloopgrijpers voor kranen van',
        concreteShearsFor: 'Betonscharen voor kranen van',
        pulverizersFor: 'Pulverisers voor kranen van',
        digTeeth: 'Graaftanden (diverse types)',
        wearPlates: 'Slijtplaten Hardox',
        cuttingEdges: 'Snijkanten',
        hydraulicCylinders: 'Hydraulische cilinders',
        hydraulicHoses: 'Hydraulische slangen',
        quickCouplers: 'Snelkoppelingen',
        grease: 'Smeervet',
        hydraulicOil: 'Hydraulische olie',
        lubricantSprays: 'Smeersprays',
        liftingEyes: 'Hijsogen',
        protectiveCaps: 'Beschermkappen',
        assemblyTools: 'Montage gereedschap',
        allProducts: 'Alle Producten',
        requestQuote: 'Offerte Aanvragen',
        productCategories: 'PRODUCTCATEGORIE\u00CBN',
        adapters: 'Adapters',
        allBrands: 'Alle merken',
        brandsTitle: 'MERKEN',
        companyTitle: 'BEDRIJF',
        aboutUs: 'Over Ons',
        loginRegister: 'Inloggen / Registreren',
        openMenu: 'Menu openen',
        closeMenu: 'Menu sluiten',
        mobileNav: 'Mobiele navigatie',
        myAccount: 'Mijn Account',
        customer: 'Klant',
        manageProducts: 'Producten Beheren',
        manageQuotes: 'Offertes Beheren',
        orders: 'Bestellingen',
        quotes: 'Offertes',
        profile: 'Profiel',
        logout: 'Uitloggen',
        login: 'Inloggen'
      },
      'be-fr': {
        about: 'À propos',
        becomeDealer: 'Devenir revendeur',
        blog: 'Blog',
        faq: 'FAQ',
        contact: 'Contact',
        excavatorBuckets: 'Godets',
        demolitionGrippers: 'Pinces de tri et démolition',
        other: 'Autres',
        viewAll: 'Voir tout',
        helpNeeded: 'BESOIN D\'AIDE?',
        contactUs: 'Contactez-nous',
        trenchBuckets: 'Godets de tranchée',
        deepBuckets: 'Godets de terrassement',
        narrowBuckets: 'Godets étroits',
        tiltBuckets: 'Godets orientables',
        sortingGrippers: 'Pinces de tri',
        demolitionGrippers2: 'Pinces de démolition',
        concreteShears: 'Cisailles à béton',
        pulverizers: 'Pulvérisateurs',
        teethWear: 'Dents et pièces d\'usure',
        hydraulicParts: 'Pièces hydrauliques',
        lubricants: 'Lubrifiants',
        accessories: 'Accessoires',
        otherProducts: 'Autres produits',
        helpTextBuckets: 'Vous ne savez pas quels godets conviennent à votre machine? Nos spécialistes sont là pour vous aider.',
        helpTextGrippers: 'Vous ne savez pas quelle pince convient à votre machine? Nos spécialistes sont là pour vous aider.',
        helpTextOther: 'Vous cherchez une pièce ou un accessoire spécifique? Contactez nos spécialistes.',
        bucketsFor: 'pour pelles de',
        grippersFor: 'pour pelles de',
        trenchBucketsFor: 'Godets de tranch\u00e9e pour pelles de',
        deepBucketsFor: 'Godets de terrassement pour pelles de',
        narrowBucketsFor: 'Godets \u00e9troits pour pelles de',
        tiltBucketsFor: 'Godets orientables pour pelles de',
        sortingGrippersFor: 'Pinces de tri pour pelles de',
        demolitionGrippersFor: 'Pinces de d\u00e9molition pour pelles de',
        concreteShearsFor: 'Cisailles \u00e0 b\u00e9ton pour pelles de',
        pulverizersFor: 'Pulv\u00e9risateurs pour pelles de',
        digTeeth: 'Dents de godet (divers types)',
        wearPlates: 'Plaques d\'usure Hardox',
        cuttingEdges: 'Lames de coupe',
        hydraulicCylinders: 'V\u00e9rins hydrauliques',
        hydraulicHoses: 'Flexibles hydrauliques',
        quickCouplers: 'Attaches rapides',
        grease: 'Graisse',
        hydraulicOil: 'Huile hydraulique',
        lubricantSprays: 'Sprays lubrifiants',
        liftingEyes: 'Anneaux de levage',
        protectiveCaps: 'Capots de protection',
        assemblyTools: 'Outillage de montage',
        allProducts: 'Tous les produits',
        requestQuote: 'Demander un devis',
        productCategories: 'CAT\u00c9GORIES DE PRODUITS',
        adapters: 'Adaptateurs',
        allBrands: 'Toutes les marques',
        brandsTitle: 'MARQUES',
        companyTitle: 'ENTREPRISE',
        aboutUs: '\u00c0 propos',
        loginRegister: 'Connexion / Inscription',
        openMenu: 'Ouvrir le menu',
        closeMenu: 'Fermer le menu',
        mobileNav: 'Navigation mobile',
        myAccount: 'Mon compte',
        customer: 'Client',
        manageProducts: 'G\u00e9rer les produits',
        manageQuotes: 'G\u00e9rer les devis',
        orders: 'Commandes',
        quotes: 'Devis',
        profile: 'Profil',
        logout: 'D\u00e9connexion',
        login: 'Connexion'
      },
      'de-de': {
        about: 'Über uns',
        becomeDealer: 'Händler werden',
        blog: 'Blog',
        faq: 'FAQ',
        contact: 'Kontakt',
        excavatorBuckets: 'Baggerlöffel',
        demolitionGrippers: 'Sortier- und Abbruchgreifer',
        other: 'Sonstige',
        viewAll: 'Alles ansehen',
        helpNeeded: 'HILFE BENÖTIGT?',
        contactUs: 'Kontaktieren Sie uns',
        trenchBuckets: 'Grabenlöffel',
        deepBuckets: 'Tieflöffel',
        narrowBuckets: 'Schlitzlöffel',
        tiltBuckets: 'Schwenklöffel',
        sortingGrippers: 'Sortiergreifer',
        demolitionGrippers2: 'Abbruchgreifer',
        concreteShears: 'Betonscheren',
        pulverizers: 'Pulverisierer',
        teethWear: 'Zähne & Verschleißteile',
        hydraulicParts: 'Hydraulikteile',
        lubricants: 'Schmiermittel',
        accessories: 'Zubehör',
        otherProducts: 'Sonstige Produkte',
        helpTextBuckets: 'Sie sind sich nicht sicher, welche Baggerlöffel für Ihre Maschine geeignet sind? Unsere Spezialisten helfen Ihnen gerne.',
        helpTextGrippers: 'Sie sind sich nicht sicher, welcher Greifer für Ihre Maschine geeignet ist? Unsere Spezialisten helfen Ihnen gerne.',
        helpTextOther: 'Suchen Sie ein bestimmtes Teil oder Zubehör? Kontaktieren Sie unsere Spezialisten.',
        bucketsFor: 'f\u00fcr Bagger von',
        grippersFor: 'f\u00fcr Bagger von',
        trenchBucketsFor: 'Grabenl\u00f6ffel f\u00fcr Bagger von',
        deepBucketsFor: 'Tiefl\u00f6ffel f\u00fcr Bagger von',
        narrowBucketsFor: 'Schlitzl\u00f6ffel f\u00fcr Bagger von',
        tiltBucketsFor: 'Schwenkl\u00f6ffel f\u00fcr Bagger von',
        sortingGrippersFor: 'Sortiergreifer f\u00fcr Bagger von',
        demolitionGrippersFor: 'Abbruchgreifer f\u00fcr Bagger von',
        concreteShearsFor: 'Betonscheren f\u00fcr Bagger von',
        pulverizersFor: 'Pulverisierer f\u00fcr Bagger von',
        digTeeth: 'Grabz\u00e4hne (verschiedene Typen)',
        wearPlates: 'Verschlei\u00dfplatten Hardox',
        cuttingEdges: 'Schneidkanten',
        hydraulicCylinders: 'Hydraulikzylinder',
        hydraulicHoses: 'Hydraulikschl\u00e4uche',
        quickCouplers: 'Schnellkupplungen',
        grease: 'Schmierfett',
        hydraulicOil: 'Hydraulik\u00f6l',
        lubricantSprays: 'Schmiersprays',
        liftingEyes: 'Hebeaugen',
        protectiveCaps: 'Schutzkappen',
        assemblyTools: 'Montagewerkzeug',
        allProducts: 'Alle Produkte',
        requestQuote: 'Angebot anfordern',
        productCategories: 'PRODUKTKATEGORIEN',
        adapters: 'Adapter',
        allBrands: 'Alle Marken',
        brandsTitle: 'MARKEN',
        companyTitle: 'UNTERNEHMEN',
        aboutUs: '\u00dcber uns',
        loginRegister: 'Anmelden / Registrieren',
        openMenu: 'Men\u00fc \u00f6ffnen',
        closeMenu: 'Men\u00fc schlie\u00dfen',
        mobileNav: 'Mobile Navigation',
        myAccount: 'Mein Konto',
        customer: 'Kunde',
        manageProducts: 'Produkte verwalten',
        manageQuotes: 'Angebote verwalten',
        orders: 'Bestellungen',
        quotes: 'Angebote',
        profile: 'Profil',
        logout: 'Abmelden',
        login: 'Anmelden'
      }
    };
    
    const trans = t[currentLocale];
    
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
          <a href="${basePath}over-ons/">${trans.about}</a>
          <a href="${basePath}dealer/">${trans.becomeDealer}</a>
          <a href="${basePath}blog/">${trans.blog}</a>
          <a href="${basePath}faq/">${trans.faq}</a>
          <a href="${basePath}contact/">${trans.contact}</a>
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
              ${trans.excavatorBuckets} <span class="dropdown-arrow">▼</span>
            </a>
            
            <!-- Mega Menu Dropdown - Graafbakken -->
            <div class="menu-dropdown">
              <div class="menu-dropdown-container">
                <div class="menu-dropdown-content" style="width: 100%;">
                  <div class="menu-dropdown-header">
                    <h3 class="menu-dropdown-title">${trans.excavatorBuckets}</h3>
                    <a href="${pagesPrefix}?cat=graafbakken" class="menu-dropdown-view-all">
                      <span>${trans.viewAll}</span>
                    </a>
                  </div>
                  
                  <div class="menu-dropdown-grid">
                    <div class="menu-column">
                      <a href="${pagesPrefix}graafbakken/slotenbakken/" class="menu-column-title">${trans.trenchBuckets}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}graafbakken/slotenbakken/?tonnage=1-3t" class="menu-tonnage-link"><span>•</span> <span>${trans.trenchBucketsFor} 1 - 3 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/slotenbakken/?tonnage=3-8t" class="menu-tonnage-link"><span>•</span> <span>${trans.trenchBucketsFor} 3 - 8 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/slotenbakken/?tonnage=8-15t" class="menu-tonnage-link"><span>•</span> <span>${trans.trenchBucketsFor} 8 - 15 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/slotenbakken/?tonnage=15-25t" class="menu-tonnage-link"><span>•</span> <span>${trans.trenchBucketsFor} 15 - 25 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/slotenbakken/?tonnage=25-50t" class="menu-tonnage-link"><span>•</span> <span>${trans.trenchBucketsFor} 25 - 50 ton</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}graafbakken/dieplepelbakken/" class="menu-column-title">${trans.deepBuckets}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}graafbakken/dieplepelbakken/?tonnage=1-3t" class="menu-tonnage-link"><span>•</span> <span>${trans.deepBucketsFor} 1 - 3 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/dieplepelbakken/?tonnage=3-8t" class="menu-tonnage-link"><span>•</span> <span>${trans.deepBucketsFor} 3 - 8 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/dieplepelbakken/?tonnage=8-15t" class="menu-tonnage-link"><span>•</span> <span>${trans.deepBucketsFor} 8 - 15 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/dieplepelbakken/?tonnage=15-25t" class="menu-tonnage-link"><span>•</span> <span>${trans.deepBucketsFor} 15 - 25 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/dieplepelbakken/?tonnage=25-50t" class="menu-tonnage-link"><span>•</span> <span>${trans.deepBucketsFor} 25 - 50 ton</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}graafbakken/sleuvenbakken/" class="menu-column-title">${trans.narrowBuckets}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}graafbakken/sleuvenbakken/?tonnage=1-3t" class="menu-tonnage-link"><span>•</span> <span>${trans.narrowBucketsFor} 1 - 3 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/sleuvenbakken/?tonnage=3-8t" class="menu-tonnage-link"><span>•</span> <span>${trans.narrowBucketsFor} 3 - 8 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/sleuvenbakken/?tonnage=8-15t" class="menu-tonnage-link"><span>•</span> <span>${trans.narrowBucketsFor} 8 - 15 ton</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}graafbakken/kantelbakken/" class="menu-column-title">${trans.tiltBuckets}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}graafbakken/kantelbakken/?tonnage=1-3t" class="menu-tonnage-link"><span>•</span> <span>${trans.tiltBucketsFor} 1 - 3 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/kantelbakken/?tonnage=3-8t" class="menu-tonnage-link"><span>•</span> <span>${trans.tiltBucketsFor} 3 - 8 ton</span></a>
                        <a href="${pagesPrefix}graafbakken/kantelbakken/?tonnage=8-15t" class="menu-tonnage-link"><span>•</span> <span>${trans.tiltBucketsFor} 8 - 15 ton</span></a>
                      </div>
                    </div>
                  </div>
                  
                  <div class="menu-cta-box">
                    <div class="menu-cta-content">
                      <h4 class="menu-cta-title">${trans.helpNeeded}</h4>
                      <p class="menu-cta-text">${trans.helpTextBuckets}</p>
                    </div>
                    <a href="${basePath}contact/" class="btn-split">
                      <span class="btn-split-text">${trans.contactUs}</span>
                      <span class="btn-split-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="menu-item">
            <a href="${pagesPrefix}?cat=sloop-sorteergrijpers">
              ${trans.demolitionGrippers} <span class="dropdown-arrow">▼</span>
            </a>
            
            <!-- Mega Menu Dropdown - Sloop -->
            <div class="menu-dropdown">
              <div class="menu-dropdown-container">
                <div class="menu-dropdown-content" style="width: 100%;">
                  <div class="menu-dropdown-header">
                    <h3 class="menu-dropdown-title">${trans.demolitionGrippers}</h3>
                    <a href="${pagesPrefix}?cat=sloop-sorteergrijpers" class="menu-dropdown-view-all"><span>${trans.viewAll}</span></a>
                  </div>
                  
                  <div class="menu-dropdown-grid">
                    <div class="menu-column">
                      <a href="${pagesPrefix}sloop-sorteergrijpers/sorteergrijpers/" class="menu-column-title">${trans.sortingGrippers}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sorteergrijpers/?tonnage=1t-5t" class="menu-tonnage-link"><span>•</span> <span>${trans.sortingGrippersFor} 1t - 5t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sorteergrijpers/?tonnage=5t-10t" class="menu-tonnage-link"><span>•</span> <span>${trans.sortingGrippersFor} 5t - 10t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sorteergrijpers/?tonnage=10t-20t" class="menu-tonnage-link"><span>•</span> <span>${trans.sortingGrippersFor} 10t - 20t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sorteergrijpers/?tonnage=20t-plus" class="menu-tonnage-link"><span>•</span> <span>${trans.sortingGrippersFor} 20t+</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}sloop-sorteergrijpers/sloopgrijpers/" class="menu-column-title">${trans.demolitionGrippers2}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sloopgrijpers/?tonnage=5t-10t" class="menu-tonnage-link"><span>•</span> <span>${trans.demolitionGrippersFor} 5t - 10t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sloopgrijpers/?tonnage=10t-20t" class="menu-tonnage-link"><span>•</span> <span>${trans.demolitionGrippersFor} 10t - 20t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sloopgrijpers/?tonnage=20t-30t" class="menu-tonnage-link"><span>•</span> <span>${trans.demolitionGrippersFor} 20t - 30t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/sloopgrijpers/?tonnage=30t-plus" class="menu-tonnage-link"><span>•</span> <span>${trans.demolitionGrippersFor} 30t+</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}sloop-sorteergrijpers/betonscharen/" class="menu-column-title">${trans.concreteShears}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}sloop-sorteergrijpers/betonscharen/?tonnage=10t-20t" class="menu-tonnage-link"><span>•</span> <span>${trans.concreteShearsFor} 10t - 20t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/betonscharen/?tonnage=20t-30t" class="menu-tonnage-link"><span>•</span> <span>${trans.concreteShearsFor} 20t - 30t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/betonscharen/?tonnage=30t-plus" class="menu-tonnage-link"><span>•</span> <span>${trans.concreteShearsFor} 30t+</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}sloop-sorteergrijpers/pulverisers/" class="menu-column-title">${trans.pulverizers}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}sloop-sorteergrijpers/pulverisers/?tonnage=20t-30t" class="menu-tonnage-link"><span>•</span> <span>${trans.pulverizersFor} 20t - 30t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/pulverisers/?tonnage=30t-40t" class="menu-tonnage-link"><span>•</span> <span>${trans.pulverizersFor} 30t - 40t</span></a>
                        <a href="${pagesPrefix}sloop-sorteergrijpers/pulverisers/?tonnage=40t-plus" class="menu-tonnage-link"><span>•</span> <span>${trans.pulverizersFor} 40t+</span></a>
                      </div>
                    </div>
                  </div>
                  
                  <div class="menu-cta-box">
                    <div class="menu-cta-content">
                      <h4 class="menu-cta-title">${trans.helpNeeded}</h4>
                      <p class="menu-cta-text">${trans.helpTextGrippers}</p>
                    </div>
                    <a href="${basePath}contact/" class="btn-split">
                      <span class="btn-split-text">${trans.contactUs}</span>
                      <span class="btn-split-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="menu-item">
            <a href="${pagesPrefix}?cat=overige">
              ${trans.other} <span class="dropdown-arrow">▼</span>
            </a>
            
            <!-- Mega Menu Dropdown - Overige -->
            <div class="menu-dropdown">
              <div class="menu-dropdown-container">
                <div class="menu-dropdown-content" style="width: 100%;">
                  <div class="menu-dropdown-header">
                    <h3 class="menu-dropdown-title">${trans.otherProducts}</h3>
                    <a href="${pagesPrefix}?cat=overige" class="menu-dropdown-view-all"><span>${trans.viewAll}</span></a>
                  </div>
                  
                  <div class="menu-dropdown-grid">
                    <div class="menu-column">
                      <a href="${pagesPrefix}overige/tanden-slijtdelen/" class="menu-column-title">${trans.teethWear}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}overige/tanden-slijtdelen/?type=graaftanden" class="menu-tonnage-link"><span>•</span> <span>${trans.digTeeth}</span></a>
                        <a href="${pagesPrefix}overige/tanden-slijtdelen/?type=slijtplaten" class="menu-tonnage-link"><span>•</span> <span>${trans.wearPlates}</span></a>
                        <a href="${pagesPrefix}overige/tanden-slijtdelen/?type=snijkanten" class="menu-tonnage-link"><span>•</span> <span>${trans.cuttingEdges}</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}overige/hydrauliek/" class="menu-column-title">${trans.hydraulicParts}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}overige/hydrauliek/?type=cilinders" class="menu-tonnage-link"><span>•</span> <span>${trans.hydraulicCylinders}</span></a>
                        <a href="${pagesPrefix}overige/hydrauliek/?type=slangen" class="menu-tonnage-link"><span>•</span> <span>${trans.hydraulicHoses}</span></a>
                        <a href="${pagesPrefix}overige/hydrauliek/?type=koppelingen" class="menu-tonnage-link"><span>•</span> <span>${trans.quickCouplers}</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}overige/smeermiddelen/" class="menu-column-title">${trans.lubricants}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}overige/smeermiddelen/?type=vet" class="menu-tonnage-link"><span>•</span> <span>${trans.grease}</span></a>
                        <a href="${pagesPrefix}overige/smeermiddelen/?type=olie" class="menu-tonnage-link"><span>•</span> <span>${trans.hydraulicOil}</span></a>
                        <a href="${pagesPrefix}overige/smeermiddelen/?type=spray" class="menu-tonnage-link"><span>•</span> <span>${trans.lubricantSprays}</span></a>
                      </div>
                    </div>
                    
                    <div class="menu-column">
                      <a href="${pagesPrefix}overige/accessoires/" class="menu-column-title">${trans.accessories}</a>
                      <div class="menu-tonnage-list">
                        <a href="${pagesPrefix}overige/accessoires/?type=hijsogen" class="menu-tonnage-link"><span>•</span> <span>${trans.liftingEyes}</span></a>
                        <a href="${pagesPrefix}overige/accessoires/?type=beschermkappen" class="menu-tonnage-link"><span>•</span> <span>${trans.protectiveCaps}</span></a>
                        <a href="${pagesPrefix}overige/accessoires/?type=gereedschap" class="menu-tonnage-link"><span>•</span> <span>${trans.assemblyTools}</span></a>
                      </div>
                    </div>
                  </div>
                  
                  <div class="menu-cta-box">
                    <div class="menu-cta-content">
                      <h4 class="menu-cta-title">${trans.helpNeeded}</h4>
                      <p class="menu-cta-text">${trans.helpTextOther}</p>
                    </div>
                    <a href="${basePath}contact/" class="btn-split">
                      <span class="btn-split-text">${trans.contactUs}</span>
                      <span class="btn-split-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="nav-actions">
          <a href="${basePath}producten/" class="cta-button">${trans.viewAll}</a>
        </div>
        
        <button class="menu-toggle" id="menu-toggle" aria-label="${trans.openMenu}">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  </div><!-- End Header Wrapper -->

  <!-- Mobile Navigation -->
  <nav class="nav-mobile" id="nav-mobile" aria-label="${trans.mobileNav}">
    <button class="nav-mobile-close" id="nav-mobile-close" aria-label="${trans.closeMenu}">×</button>
    
    <!-- Quick Actions -->
    <div class="mobile-menu-section">
      <a href="${basePath}producten/" class="nav-link nav-link-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        ${trans.allProducts}
      </a>
      <a href="${basePath}offerte-aanvragen/" class="nav-link nav-link-cta">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        ${trans.requestQuote}
      </a>
    </div>

    <!-- Product Categories -->
    <div class="mobile-menu-section">
      <div class="menu-section-title">${trans.productCategories}</div>
      <a href="${pagesPrefix}?cat=graafbakken" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        ${trans.excavatorBuckets}
      </a>
      <a href="${pagesPrefix}?cat=slotenbakken" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        ${trans.trenchBuckets}
      </a>
      <a href="${pagesPrefix}?cat=sloop-sorteergrijpers" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        ${trans.demolitionGrippers}
      </a>
      <a href="${pagesPrefix}?cat=adapters" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        ${trans.adapters}
      </a>
      <a href="${basePath}producten/" class="nav-link-more">${trans.viewAll} →</a>
    </div>

    <!-- Browse by Brand -->
    <div class="mobile-menu-section">
      <div class="menu-section-title">${trans.brandsTitle}</div>
      <a href="${basePath}kraanbakken/caterpillar/" class="nav-link nav-link-compact">Caterpillar</a>
      <a href="${basePath}kraanbakken/komatsu/" class="nav-link nav-link-compact">Komatsu</a>
      <a href="${basePath}kraanbakken/volvo/" class="nav-link nav-link-compact">Volvo</a>
      <a href="${basePath}kraanbakken/hitachi/" class="nav-link nav-link-compact">Hitachi</a>
      <a href="${basePath}producten/" class="nav-link-more">${trans.allBrands} →</a>
    </div>

    <!-- Company Info -->
    <div class="mobile-menu-section">
      <div class="menu-section-title">${trans.companyTitle}</div>
      <a href="${basePath}over-ons/" class="nav-link nav-link-compact">${trans.aboutUs}</a>
      <a href="${basePath}contact/" class="nav-link nav-link-compact">Contact</a>
      <a href="${basePath}blog/" class="nav-link nav-link-compact">Blog</a>
      <a href="${basePath}faq/" class="nav-link nav-link-compact">FAQ</a>
    </div>

    <!-- Account -->
    <div class="mobile-menu-section">
      <a href="#" class="btn btn-primary btn-block login-trigger">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        ${trans.loginRegister}
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
      
      // Initialize header scroll behavior (top-bar hide/show)
      initHeaderScroll();
    }
  }

  /**
   * Initialize header scroll behavior
   * Hides top-bar when scrolling down, shows when scrolling up
   */
  function initHeaderScroll() {
    const headerWrapper = document.getElementById('header-wrapper');
    if (!headerWrapper) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        headerWrapper.classList.remove('scrolled-down', 'scrolled-up');
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        headerWrapper.classList.add('scrolled-down');
        headerWrapper.classList.remove('scrolled-up');
      } else if (currentScrollY < lastScrollY) {
        headerWrapper.classList.add('scrolled-up');
        headerWrapper.classList.remove('scrolled-down');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // Initialize mobile menu functionality
  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMobile = document.getElementById('nav-mobile');
    const navMobileClose = document.getElementById('nav-mobile-close');

    if (menuToggle && navMobile) {
      menuToggle.addEventListener('click', function() {
        // Toggle menu visibility
        const isExpanded = navMobile.classList.toggle('active');
        
        // Toggle button animation state
        menuToggle.classList.toggle('is-active');
        
        // Update aria-expanded
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Toggle body scroll
        if (isExpanded) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
    }

    if (navMobileClose && navMobile) {
      navMobileClose.addEventListener('click', function() {
        navMobile.classList.remove('active');
        if (menuToggle) {
          menuToggle.classList.remove('is-active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
      });
    }
    
    // Close menu when clicking a link inside it
    const navLinks = navMobile ? navMobile.querySelectorAll('a') : [];
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMobile.classList.remove('active');
        if (menuToggle) {
          menuToggle.classList.remove('is-active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
      });
    });
    
    // Initialize language switcher
    initLanguageSwitcher();
    
    // Initialize account dropdown
    initAccountDropdown();
  }
  
  // Render account menu based on login state
  function renderAccountMenu() {
    const wrapper = document.getElementById('account-menu-wrapper');
    if (!wrapper) return;
    
    // Get locale base path for account links (e.g., /Structon/be-nl/)
    const localeBasePath = getLocaleBasePath();
    
    // Get translations for account menu
    const locale = getCurrentLocale() || 'be-nl';
    const accountT = {
      'be-nl': { myAccount: 'Mijn Account', customer: 'Klant', manageProducts: 'Producten Beheren', manageQuotes: 'Offertes Beheren', orders: 'Bestellingen', quotes: 'Offertes', profile: 'Profiel', logout: 'Uitloggen', login: 'Inloggen' },
      'nl-nl': { myAccount: 'Mijn Account', customer: 'Klant', manageProducts: 'Producten Beheren', manageQuotes: 'Offertes Beheren', orders: 'Bestellingen', quotes: 'Offertes', profile: 'Profiel', logout: 'Uitloggen', login: 'Inloggen' },
      'be-fr': { myAccount: 'Mon compte', customer: 'Client', manageProducts: 'G\u00e9rer les produits', manageQuotes: 'G\u00e9rer les devis', orders: 'Commandes', quotes: 'Devis', profile: 'Profil', logout: 'D\u00e9connexion', login: 'Connexion' },
      'de-de': { myAccount: 'Mein Konto', customer: 'Kunde', manageProducts: 'Produkte verwalten', manageQuotes: 'Angebote verwalten', orders: 'Bestellungen', quotes: 'Angebote', profile: 'Profil', logout: 'Abmelden', login: 'Anmelden' }
    };
    const at = accountT[locale] || accountT['be-nl'];
    
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
      wrapper.innerHTML = `
        <a href="#" id="login-btn" class="login-trigger"><span>${at.myAccount}</span></a>
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
              <div class="account-role">${isAdmin ? 'Administrator' : at.customer}</div>
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
          <a href="https://structon-production.up.railway.app/cms/products.html" class="account-dropdown-item" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            <span>${at.manageProducts}</span>
          </a>
          <a href="https://structon-production.up.railway.app/cms/quotes.html" class="account-dropdown-item" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>${at.manageQuotes}</span>
          </a>
          ` : `
          <div class="account-dropdown-divider"></div>
          <a href="${localeBasePath}account/#dashboard" class="account-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Dashboard</span>
          </a>
          <a href="${localeBasePath}account/#bestellingen" class="account-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>${at.orders}</span>
          </a>
          <a href="${localeBasePath}account/#offertes" class="account-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <span>${at.quotes}</span>
          </a>
          <div class="account-dropdown-divider"></div>
          <a href="${localeBasePath}account/#profiel" class="account-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>${at.profile}</span>
          </a>
          <div class="account-dropdown-divider"></div>
          `}
          <button class="account-dropdown-item" id="logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>${at.logout}</span>
          </button>
        </div>
      `;
    } else {
      wrapper.innerHTML = `
        <a href="#" id="login-btn" class="login-trigger"><span>${at.login}</span></a>
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
