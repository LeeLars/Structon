/**
 * Navigation with Dynamic Subcategories
 */

import { API_BASE_URL } from './api/client.js';

// Custom menu structure definition
const CUSTOM_MENU_STRUCTURE = {
  'graafbakken': [
    { title: 'Slotenbakken', slug: 'slotenbakken', description: 'Voor het uitgraven van sloten en taluds' },
    { title: 'Dieplepelbakken', slug: 'dieplepelbakken', description: 'De standaard bak voor graafwerk' },
    { title: 'Sleuvenbakken', slug: 'sleuvenbakken', description: 'Smal graven voor kabels en leidingen' },
    { title: 'Kantelbakken', slug: 'kantelbakken', description: 'Hydraulisch kantelbaar voor precisiewerk' }
  ],
  'sloop-sorteergrijpers': [
    { title: 'Breekhamers', slug: 'sloophamers', description: 'Krachtig sloopwerk voor beton en steen' },
    { title: 'Rippers', slug: 'rippers', description: 'Losmaken van harde ondergrond en wortels' },
    { title: 'Sorteergrijpers', slug: 'sorteergrijpers', description: 'Sorteren en verplaatsen van puin' },
    { title: 'Roterende sorteergrijpers', slug: 'roterende-sorteergrijpers', description: '360° rotatie voor maximale flexibiliteit' }
  ],
  'adapters': [], // Empty as requested
  'overige': []   // Empty as requested
};

/**
 * Initialize navigation with subcategories
 */
export async function initNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  for (const menuItem of menuItems) {
    const categorySlug = getCategorySlugFromMenuItem(menuItem);
    
    if (categorySlug && CUSTOM_MENU_STRUCTURE[categorySlug]) {
      const items = CUSTOM_MENU_STRUCTURE[categorySlug];
      
      if (items.length > 0) {
        createDropdownMenu(menuItem, categorySlug, items);
      }
    }
  }
}

/**
 * Extract category slug from menu item href
 */
function getCategorySlugFromMenuItem(menuItem) {
  const href = menuItem.getAttribute('href');
  if (!href) return null;
  
  // Extract slug from href like "/graafbakken/"
  const match = href.match(/\/([^\/]+)\/?$/);
  return match ? match[1] : null;
}

// Oude API functie niet meer nodig voor hoofdmenu, maar misschien wel voor data later
// ...

const CATEGORY_IMAGES = {
  // ...
};

/**
 * Create mega menu with subcategories
 */
function createDropdownMenu(menuItem, categorySlug, items) {
  const categoryName = menuItem.textContent.trim().replace('▼', '').trim();
  
  // Create mega menu container
  const dropdown = document.createElement('div');
  dropdown.className = 'menu-dropdown';
  
  // Create inner container
  const container = document.createElement('div');
  container.className = 'menu-dropdown-container';
  
  // --- LEFT SIDE: CONTENT ---
  const contentCol = document.createElement('div');
  contentCol.className = 'menu-dropdown-content';

  // Header
  const header = document.createElement('div');
  header.className = 'menu-dropdown-header';
  
  const title = document.createElement('h3');
  title.className = 'menu-dropdown-title';
  title.textContent = categoryName; // Just the name
  
  const viewAllLink = document.createElement('a');
  viewAllLink.href = `/${categorySlug}/`;
  viewAllLink.className = 'menu-dropdown-view-all';
  viewAllLink.innerHTML = `Bekijk alles <span>→</span>`;
  
  header.appendChild(title);
  header.appendChild(viewAllLink);
  contentCol.appendChild(header);
  
  // Grid of links
  const grid = document.createElement('div');
  grid.className = 'menu-dropdown-grid';

  items.forEach((item) => {
    const link = document.createElement('a');
    // Direct link to the category page (e.g. /slotenbakken/)
    link.href = `/${item.slug}/`; 
    link.className = 'menu-dropdown-item';
    link.innerHTML = `
      <span style="display:block; font-weight:bold; margin-bottom:4px; color:#2C5F6F;">${item.title}</span>
      <span style="font-size:0.85em; opacity:0.8; color:#555;">${item.description || ''}</span>
    `;
    grid.appendChild(link);
  });
  
  contentCol.appendChild(grid);
  container.appendChild(contentCol);

  // --- RIGHT SIDE: ADVICE BOX ---
  const adviceCol = document.createElement('div');
  adviceCol.className = 'menu-dropdown-advice';
  
  adviceCol.innerHTML = `
    <h4>Hulp nodig?</h4>
    <p>Weet u niet zeker welke ${categoryName.toLowerCase()} u nodig heeft? Onze experts helpen u graag.</p>
    <a href="/pages/contact.html" class="btn-advice">Advies vragen <span>→</span></a>
  `;
  
  container.appendChild(adviceCol);
  
  dropdown.appendChild(container);
  menuItem.appendChild(dropdown);
  
  // Prevent default click on menu item if it has a dropdown
  if (items.length > 0) {
    menuItem.addEventListener('click', (e) => {
      e.preventDefault();
    });
  }
}
