/**
 * Dynamic Sitemap Generator
 * Fetches categories and subcategories to build a footer sitemap
 */

import { API_BASE_URL } from './api/client.js';

export async function initSitemap() {
  const sitemapContainer = document.getElementById('footer-sitemap');
  if (!sitemapContainer) return;

  try {
    // Show loading state
    sitemapContainer.innerHTML = '<li class="sitemap-loading">Laden...</li>';

    // Fetch all categories with subcategories
    // We use the public categories endpoint. Assuming it returns active categories.
    // Ideally we would have an endpoint that returns the full tree for sitemap.
    // For now, we will use the navigation data logic.
    
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to load sitemap data');
    
    const data = await response.json();
    const categories = data.categories || data || [];
    
    // Build HTML
    let sitemapHtml = '';
    
    // 1. Main Pages
    sitemapHtml += `
      <li class="sitemap-section">
        <h5 class="sitemap-heading">Algemeen</h5>
        <ul class="sitemap-links">
          <li><a href="/">Home</a></li>
          <li><a href="/over-ons/">Over Ons</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/login/">Klant Login</a></li>
        </ul>
      </li>
    `;

    // 2. Products Categories
    if (categories && categories.length > 0) {
      sitemapHtml += `
        <li class="sitemap-section">
          <h5 class="sitemap-heading">Producten</h5>
          <ul class="sitemap-links">
            ${categories.map(cat => `
              <li>
                <a href="/${cat.slug}/" class="sitemap-cat-link">${cat.title}</a>
              </li>
            `).join('')}
          </ul>
        </li>
      `;
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
          <li><a href="/">Home</a></li>
          <li><a href="/over-ons/">Over Ons</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/kraanbakken/">Kraanbakken</a></li>
          <li><a href="/slotenbakken/">Slotenbakken</a></li>
        </ul>
      </li>
    `;
  }
}
