/**
 * Sitemap Page - Dynamic sitemap generation with all products
 */

import { API_BASE_URL } from '../api/client.js';

async function initSitemapPage() {
  const container = document.getElementById('sitemap-content');
  if (!container) return;

  try {
    console.log('🗺️ Loading sitemap data...');
    
    // Fetch all data in parallel
    const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/categories`),
      fetch(`${API_BASE_URL}/subcategories`),
      fetch(`${API_BASE_URL}/products?limit=1000`)
    ]);

    if (!categoriesRes.ok || !subcategoriesRes.ok || !productsRes.ok) {
      throw new Error('Failed to load sitemap data');
    }

    const categoriesData = await categoriesRes.json();
    const subcategoriesData = await subcategoriesRes.json();
    const productsData = await productsRes.json();

    const categories = categoriesData.categories || [];
    const subcategories = subcategoriesData.subcategories || [];
    const products = productsData.products || productsData.items || [];

    console.log(`✅ Loaded ${categories.length} categories, ${subcategories.length} subcategories, ${products.length} products`);

    // Build sitemap HTML
    let html = '';

    // 1. Main Pages
    html += `
      <div class="sitemap-column">
        <h2>Hoofdpagina's</h2>
        <ul>
          <li><a href="../">Home</a></li>
          <li><a href="../producten/">Alle Producten</a></li>
          <li><a href="../over-ons/">Over Ons</a></li>
          <li><a href="../contact/">Contact</a></li>
          <li><a href="../offerte-aanvragen/">Offerte Aanvragen</a></li>
        </ul>
      </div>
    `;

    // 2. Industries
    html += `
      <div class="sitemap-column">
        <h2>Industrieën</h2>
        <ul>
          <li><a href="../industrieen/grondwerkers/">Grondwerkers</a></li>
          <li><a href="../industrieen/afbraak-sloop/">Afbraak & Sloop</a></li>
          <li><a href="../industrieen/tuinaanleggers/">Tuinaanleggers</a></li>
          <li><a href="../industrieen/wegenbouw/">Wegenbouw</a></li>
          <li><a href="../industrieen/recycling/">Recycling</a></li>
          <li><a href="../industrieen/verhuur/">Verhuurbedrijven</a></li>
          <li><a href="../industrieen/loonwerk-landbouw/">Loonwerk & Landbouw</a></li>
          <li><a href="../industrieen/baggerwerken/">Baggerwerken</a></li>
        </ul>
      </div>
    `;

    // 3. Brands
    const brands = [
      'Caterpillar', 'Komatsu', 'Volvo', 'Hitachi', 'Liebherr', 'JCB', 
      'Kubota', 'Hyundai', 'Case', 'Takeuchi', 'Yanmar', 'Develon', 
      'Kobelco', 'Sany', 'Wacker Neuson'
    ];
    
    html += `
      <div class="sitemap-column">
        <h2>Merken</h2>
        <ul>
          ${brands.map(brand => {
            const slug = brand.toLowerCase().replace(/\s+/g, '-');
            return `<li><a href="../kraanbakken/${slug}/">${brand}</a></li>`;
          }).join('')}
        </ul>
      </div>
    `;

    // 4. Categories with subcategories and products
    const hiddenCategories = ['slotenbakken', 'adapterstukken', 'adapters'];
    
    categories.forEach(category => {
      const catSlug = category.slug.toLowerCase();
      
      // Skip hidden categories
      if (hiddenCategories.includes(catSlug)) return;
      
      // Get subcategories for this category
      const catSubcategories = subcategories.filter(sub => 
        sub.category_id === category.id || sub.category_slug === category.slug
      );
      
      // Get products for this category
      const catProducts = products.filter(p => 
        p.category_id === category.id || p.category_slug === category.slug
      );
      
      html += `
        <div class="sitemap-column">
          <h2>${category.title}</h2>
          <ul>
            <li><a href="../producten/?cat=${category.slug}">Alle ${category.title}</a></li>
      `;
      
      // Add subcategories
      if (catSubcategories.length > 0) {
        catSubcategories.forEach(sub => {
          const subProducts = products.filter(p => 
            p.subcategory_id === sub.id || p.subcategory_slug === sub.slug
          );
          
          html += `
            <li>
              <a href="../producten/?cat=${sub.slug}">${sub.title}</a>
          `;
          
          // Add products under subcategory
          if (subProducts.length > 0) {
            html += '<ul>';
            subProducts.forEach(product => {
              html += `<li><a href="../producten/?id=${product.id}">${product.title}</a></li>`;
            });
            html += '</ul>';
          }
          
          html += '</li>';
        });
      }
      
      // Add products without subcategory directly under category
      const productsWithoutSubcat = catProducts.filter(p => !p.subcategory_id);
      if (productsWithoutSubcat.length > 0) {
        productsWithoutSubcat.forEach(product => {
          html += `<li><a href="../producten/?id=${product.id}">${product.title}</a></li>`;
        });
      }
      
      html += `
          </ul>
        </div>
      `;
    });

    // 5. Kennisbank
    html += `
      <div class="sitemap-column">
        <h2>Kennisbank</h2>
        <ul>
          <li><a href="../kennisbank/">Kennisbank Overzicht</a></li>
          <li><a href="../kennisbank/wat-is-een-cw-aansluiting/">Wat is een CW-aansluiting?</a></li>
          <li><a href="../kennisbank/slotenbak-vs-dieplepelbak/">Slotenbak vs Dieplepelbak</a></li>
          <li><a href="../kennisbank/welke-kraanbak-heb-ik-nodig/">Welke kraanbak heb ik nodig?</a></li>
        </ul>
      </div>
    `;

    // 6. Sectoren
    html += `
      <div class="sitemap-column">
        <h2>Sectoren</h2>
        <ul>
          <li><a href="../sectoren/">Sectoren Overzicht</a></li>
          <li><a href="../sectoren/grondwerkers/">Grondwerkers</a></li>
          <li><a href="../sectoren/wegenbouw/">Wegenbouw</a></li>
          <li><a href="../sectoren/recycling/">Recycling</a></li>
          <li><a href="../sectoren/sloop-afbraak/">Sloop & Afbraak</a></li>
          <li><a href="../sectoren/verhuurbedrijven/">Verhuurbedrijven</a></li>
        </ul>
      </div>
    `;

    // 7. Product Categorieën (Statische Pagina's)
    html += `
      <div class="sitemap-column">
        <h2>Product Categorieën</h2>
        <ul>
          <li><a href="../kraanbakken/">Kraanbakken Overzicht</a></li>
          <li><a href="../slotenbakken/">Slotenbakken</a></li>
          <li><a href="../sorteergrijpers/">Sorteergrijpers</a></li>
          <li><a href="../sloophamers/">Sloophamers</a></li>
        </ul>
      </div>
    `;

    // 8. Other
    html += `
      <div class="sitemap-column">
        <h2>Overig</h2>
        <ul>
          <li><a href="../privacy/">Privacybeleid</a></li>
          <li><a href="../voorwaarden/">Algemene Voorwaarden</a></li>
          <li><a href="../sitemap-pagina/">Sitemap</a></li>
        </ul>
      </div>
    `;

    container.innerHTML = html;
    console.log('✅ Sitemap generated successfully');

  } catch (error) {
    console.error('❌ Error loading sitemap:', error);
    container.innerHTML = `
      <div class="sitemap-column">
        <p style="color: #ef4444;">Kon sitemap niet laden. Probeer de pagina te verversen.</p>
      </div>
    `;
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSitemapPage);
} else {
  initSitemapPage();
}
