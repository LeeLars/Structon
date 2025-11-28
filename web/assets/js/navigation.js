/**
 * Navigation with Dynamic Subcategories
 */

import { API_BASE_URL } from './api/client.js';

// Custom menu structure definition with tonnages
const CUSTOM_MENU_STRUCTURE = {
  'graafbakken': [
    { 
      title: 'Slotenbakken', 
      slug: 'slotenbakken', 
      tonnages: [
        { label: '1t - 2.5t', id: '1t-2-5t' },
        { label: '2.5t - 5t', id: '2-5t-5t' },
        { label: '5t - 10t', id: '5t-10t' },
        { label: '10t - 15t', id: '10t-15t' },
        { label: '15t - 25t', id: '15t-25t' }
      ]
    },
    { 
      title: 'Dieplepelbakken', 
      slug: 'dieplepelbakken',
      tonnages: [
        { label: '1t - 2.5t', id: '1t-2-5t' },
        { label: '2.5t - 5t', id: '2-5t-5t' },
        { label: '5t - 10t', id: '5t-10t' },
        { label: '10t - 15t', id: '10t-15t' },
        { label: '15t - 25t', id: '15t-25t' },
        { label: '25t+', id: '25t-plus' }
      ]
    },
    { 
      title: 'Sleuvenbakken', 
      slug: 'sleuvenbakken',
      tonnages: [
         { label: '1t - 2.5t', id: '1t-2-5t' },
         { label: '2.5t - 5t', id: '2-5t-5t' },
         { label: '5t - 10t', id: '5t-10t' }
      ]
    },
    { 
      title: 'Kantelbakken', 
      slug: 'kantelbakken',
      tonnages: [
        { label: '1t - 2.5t', id: '1t-2-5t' },
        { label: '2.5t - 5t', id: '2-5t-5t' },
        { label: '5t - 10t', id: '5t-10t' }
      ]
    }
  ],
  'sloop-sorteergrijpers': [
    { 
      title: 'Sloophamers', 
      slug: 'sloophamers',
      tonnages: [
        { label: '1t - 2.5t', id: '1t-2-5t' },
        { label: '2.5t - 5t', id: '2-5t-5t' },
        { label: '5t - 10t', id: '5t-10t' },
        { label: '10t - 15t', id: '10t-15t' },
        { label: '15t - 25t', id: '15t-25t' }
      ]
    },
    { 
      title: 'Rippers', 
      slug: 'rippers',
      tonnages: [
        { label: '1t - 2.5t', id: '1t-2-5t' },
        { label: '2.5t - 5t', id: '2-5t-5t' }
      ]
    },
    { 
      title: 'Sorteergrijpers', 
      slug: 'sorteergrijpers',
      tonnages: [
        { label: '2.5t - 5t', id: '2-5t-5t' },
        { label: '5t - 10t', id: '5t-10t' },
        { label: '10t - 15t', id: '10t-15t' },
        { label: '15t - 25t', id: '15t-25t' }
      ]
    },
    { 
      title: 'Roterende grijpers', 
      slug: 'roterende-sorteergrijpers',
      tonnages: [
        { label: '5t - 10t', id: '5t-10t' },
        { label: '10t - 15t', id: '10t-15t' }
      ]
    }
  ],
  'adapters': [], 
  'overige': []   
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

// Oude API functie niet meer nodig
// ...

/**
 * Create mega menu with categories and tonnages
 */
function createDropdownMenu(menuItem, categorySlug, items) {
  const categoryName = menuItem.textContent.trim().replace('▼', '').trim();
  
  // Create mega menu container
  const dropdown = document.createElement('div');
  dropdown.className = 'menu-dropdown';
  
  // Create inner container
  const container = document.createElement('div');
  container.className = 'menu-dropdown-container';
  
  // --- MAIN CONTENT ---
  const contentCol = document.createElement('div');
  contentCol.className = 'menu-dropdown-content';
  contentCol.style.width = '100%'; // Take full width

  // Grid of categories (Columns)
  const grid = document.createElement('div');
  grid.className = 'menu-dropdown-grid';
  // Override default grid to support columns per category
  grid.style.gridTemplateColumns = `repeat(${items.length}, 1fr)`;
  grid.style.alignItems = 'start';

  items.forEach((item) => {
    const column = document.createElement('div');
    column.className = 'menu-column';
    
    // Category Title
    const titleLink = document.createElement('a');
    titleLink.href = `/${item.slug}/`;
    titleLink.className = 'menu-column-title';
    titleLink.style.cssText = 'display:block; font-weight:700; font-size:18px; color:#2C5F6F; margin-bottom:12px; text-decoration:none;';
    titleLink.textContent = item.title;
    column.appendChild(titleLink);
    
    // Tonnages List
    if (item.tonnages && item.tonnages.length > 0) {
      const list = document.createElement('div');
      list.className = 'menu-tonnage-list';
      list.style.display = 'flex';
      list.style.flexDirection = 'column';
      list.style.gap = '8px';
      
      item.tonnages.forEach(t => {
        const tLink = document.createElement('a');
        tLink.href = `/${item.slug}/${t.id}/`;
        tLink.className = 'menu-tonnage-link';
        tLink.style.cssText = 'color:#555; text-decoration:none; font-size:14px; transition:color 0.2s; display:flex; align-items:center; gap:6px;';
        tLink.innerHTML = `<span style="color:#2C5F6F; font-size:10px;">›</span> ${t.label}`;
        
        tLink.onmouseover = () => tLink.style.color = '#2C5F6F';
        tLink.onmouseout = () => tLink.style.color = '#555';
        
        list.appendChild(tLink);
      });
      column.appendChild(list);
    }
    
    grid.appendChild(column);
  });
  
  contentCol.appendChild(grid);
  container.appendChild(contentCol);
  
  // Advice box removed to give full space to the grid
  
  dropdown.appendChild(container);
  menuItem.appendChild(dropdown);
  
  // Prevent default click
  if (items.length > 0) {
    menuItem.addEventListener('click', (e) => {
      e.preventDefault();
    });
  }
}
