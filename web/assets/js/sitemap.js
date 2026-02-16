/**
 * Dynamic Sitemap Generator
 * Fetches categories and subcategories to build a footer sitemap
 * Hides Slotenbakken and Adapterstukken, shows their subcategories instead
 */

import { API_BASE_URL } from './api/client.js';

function getSitemapLocale() {
  const path = window.location.pathname;
  const locales = ['be-nl', 'nl-nl', 'be-fr', 'de-de'];
  for (const loc of locales) {
    if (path.includes('/' + loc + '/')) return loc;
  }
  return 'be-nl';
}

const sitemapT = {
  'be-nl': { general: 'Algemeen', home: 'Home', aboutUs: 'Over Ons', customerLogin: 'Klant Login', products: 'Producten', navigation: 'Navigatie', excavatorBuckets: 'Kraanbakken', trenchBuckets: 'Slotenbakken', loading: 'Laden...' },
  'nl-nl': { general: 'Algemeen', home: 'Home', aboutUs: 'Over Ons', customerLogin: 'Klant Login', products: 'Producten', navigation: 'Navigatie', excavatorBuckets: 'Kraanbakken', trenchBuckets: 'Slotenbakken', loading: 'Laden...' },
  'be-fr': { general: 'G\u00e9n\u00e9ral', home: 'Accueil', aboutUs: '\u00c0 propos', customerLogin: 'Connexion client', products: 'Produits', navigation: 'Navigation', excavatorBuckets: 'Godets', trenchBuckets: 'Godets de tranch\u00e9e', loading: 'Chargement...' },
  'de-de': { general: 'Allgemein', home: 'Startseite', aboutUs: '\u00dcber uns', customerLogin: 'Kunden-Login', products: 'Produkte', navigation: 'Navigation', excavatorBuckets: 'Baggerl\u00f6ffel', trenchBuckets: 'Grabenl\u00f6ffel', loading: 'Laden...' }
};

export async function initSitemap() {
  const sitemapContainer = document.getElementById('footer-sitemap');
  if (!sitemapContainer) return;

  const locale = getSitemapLocale();
  const t = sitemapT[locale] || sitemapT['be-nl'];

  try {
    sitemapContainer.innerHTML = '<li class="sitemap-loading">' + t.loading + '</li>';

    // Fetch categories and subcategories
    const [categoriesResponse, subcategoriesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/categories`),
      fetch(`${API_BASE_URL}/subcategories`)
    ]);
    
    if (!categoriesResponse.ok || !subcategoriesResponse.ok) {
      throw new Error('Failed to load sitemap data');
    }
    
    const categoriesData = await categoriesResponse.json();
    const subcategoriesData = await subcategoriesResponse.json();
    
    const categories = categoriesData.categories || categoriesData || [];
    const subcategories = subcategoriesData.subcategories || subcategoriesData || [];
    
    // Categories to hide (show their subcategories instead)
    const hiddenCategories = ['slotenbakken', 'adapterstukken', 'adapters'];
    
    // Build HTML
    let sitemapHtml = '';
    
    // 1. Main Pages
    sitemapHtml += `
      <li class="sitemap-section">
        <h5 class="sitemap-heading">${t.general}</h5>
        <ul class="sitemap-links">
          <li><a href="../../">${t.home}</a></li>
          <li><a href="../../over-ons/">${t.aboutUs}</a></li>
          <li><a href="../../contact/">Contact</a></li>
          <li><a href="#" class="login-trigger">${t.customerLogin}</a></li>
        </ul>
      </li>
    `;

    // 2. Products Categories (with subcategories for hidden categories)
    if (categories && categories.length > 0) {
      const productLinks = [];
      
      categories.forEach(cat => {
        const catSlug = cat.slug.toLowerCase();
        
        // Skip hidden categories
        if (hiddenCategories.includes(catSlug)) {
          // Add their subcategories instead
          const catSubcategories = subcategories.filter(sub => 
            sub.category_id === cat.id || sub.category_slug === cat.slug
          );
          
          catSubcategories.forEach(sub => {
            productLinks.push(`
              <li>
                <a href="../../producten/?cat=${sub.slug}" class="sitemap-cat-link">${sub.title}</a>
              </li>
            `);
          });
        } else {
          // Show regular category
          productLinks.push(`
            <li>
              <a href="../../producten/?cat=${cat.slug}" class="sitemap-cat-link">${cat.title}</a>
            </li>
          `);
        }
      });
      
      if (productLinks.length > 0) {
        sitemapHtml += `
          <li class="sitemap-section">
            <h5 class="sitemap-heading">${t.products}</h5>
            <ul class="sitemap-links">
              ${productLinks.join('')}
            </ul>
          </li>
        `;
      }
    }

    // Render
    sitemapContainer.innerHTML = sitemapHtml;

  } catch (error) {
    console.error('Sitemap load error:', error);
    // Fallback static sitemap
    sitemapContainer.innerHTML = `
      <li class="sitemap-section">
        <h5 class="sitemap-heading">${t.navigation}</h5>
        <ul class="sitemap-links">
          <li><a href="../../">${t.home}</a></li>
          <li><a href="../../over-ons/">${t.aboutUs}</a></li>
          <li><a href="../../contact/">Contact</a></li>
          <li><a href="../../kraanbakken/">${t.excavatorBuckets}</a></li>
          <li><a href="../../slotenbakken/">${t.trenchBuckets}</a></li>
        </ul>
      </li>
    `;
  }
}
