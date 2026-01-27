/**
 * URL Redirects for Structon
 * Redirects old ?cat= URLs to new clean URLs for SEO
 * 
 * Old: /be-nl/producten/?cat=graafbakken
 * New: /be-nl/producten/graafbakken/
 */

(function() {
  'use strict';
  
  // Category to parent mapping for subcategories
  const SUBCATEGORY_PARENTS = {
    'slotenbakken': 'graafbakken',
    'dieplepelbakken': 'graafbakken',
    'sleuvenbakken': 'graafbakken',
    'kantelbakken': 'graafbakken',
    'rioolbakken': 'graafbakken',
    'trapezium-bakken': 'graafbakken',
    'sorteergrijpers': 'sloop-sorteergrijpers',
    'sloopgrijpers': 'sloop-sorteergrijpers',
    'puingrijpers': 'sloop-sorteergrijpers',
    'ripper-tanden': 'overige',
    'hydraulische-hamers': 'overige',
    'egaliseerbalken': 'overige',
    'verdichtingsplaten': 'overige'
  };
  
  // Main categories
  const MAIN_CATEGORIES = ['graafbakken', 'sloop-sorteergrijpers', 'overige'];
  
  // Check if we're on a producten page with ?cat= parameter
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  
  // Only redirect if we have a ?cat= parameter and we're on /producten/ page
  if (!catParam || !path.includes('/producten/')) {
    return;
  }
  
  // Don't redirect if we're already on a clean URL (path has more than just /producten/)
  const pathParts = path.split('/').filter(Boolean);
  const productenIndex = pathParts.indexOf('producten');
  if (productenIndex !== -1 && pathParts.length > productenIndex + 1) {
    // Already on clean URL, don't redirect
    return;
  }
  
  // Determine the locale from the path
  const localeMatch = path.match(/\/(be-nl|nl-nl|be-fr|de-de)\//);
  const locale = localeMatch ? localeMatch[1] : 'be-nl';
  
  // Build the new clean URL
  let newPath;
  
  if (MAIN_CATEGORIES.includes(catParam)) {
    // It's a main category
    newPath = `/${locale}/producten/${catParam}/`;
  } else if (SUBCATEGORY_PARENTS[catParam]) {
    // It's a subcategory
    const parentCategory = SUBCATEGORY_PARENTS[catParam];
    newPath = `/${locale}/producten/${parentCategory}/${catParam}/`;
  } else {
    // Unknown category, don't redirect
    return;
  }
  
  // Check if we're on GitHub Pages (has /Structon/ prefix)
  const basePath = path.includes('/Structon/') ? '/Structon' : '';
  newPath = basePath + newPath;
  
  // Preserve any other query parameters (except cat)
  params.delete('cat');
  const remainingParams = params.toString();
  const queryString = remainingParams ? '?' + remainingParams : '';
  
  // Redirect to the new clean URL
  const newUrl = newPath + queryString;
  
  // Use replaceState for SEO (doesn't add to history)
  // Then redirect
  console.log(`🔄 Redirecting from ${window.location.href} to ${newUrl}`);
  window.location.replace(newUrl);
})();
