/**
 * Dynamic Sitemap Generator
 * Fetches categories and subcategories to build a footer sitemap
 * Hides Slotenbakken and Adapterstukken, shows their subcategories instead
 */

import { API_BASE_URL } from './api/client.js';

export async function initSitemap() {
  const sitemapContainer = document.getElementById('footer-sitemap');
  if (!sitemapContainer) return;

  try {
    // Show loading state
    sitemapContainer.innerHTML = '<li class="sitemap-loading">Laden...</li>';

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
        <h5 class="sitemap-heading">Algemeen</h5>
        <ul class="sitemap-links">
          <li><a href="../../">Home</a></li>
          <li><a href="../../over-ons/">Over Ons</a></li>
          <li><a href="../../contact/">Contact</a></li>
          <li><a href="#" class="login-trigger">Klant Login</a></li>
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
            <h5 class="sitemap-heading">Producten</h5>
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
        <h5 class="sitemap-heading">Navigatie</h5>
        <ul class="sitemap-links">
          <li><a href="../../">Home</a></li>
          <li><a href="../../over-ons/">Over Ons</a></li>
          <li><a href="../../contact/">Contact</a></li>
          <li><a href="../../kraanbakken/">Kraanbakken</a></li>
          <li><a href="../../slotenbakken/">Slotenbakken</a></li>
        </ul>
      </li>
    `;
  }
}
