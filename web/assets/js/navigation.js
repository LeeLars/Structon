/**
 * Navigation with Dynamic Subcategories
 */

import { API_BASE_URL, navigation as navigationAPI } from './api/client.js';

// Fallback menu structure (used if CMS is unavailable)
// URL Structure: /pages/category.html?cat=subcategory&tonnage=weight-range
const FALLBACK_MENU_STRUCTURE = {
  'graafbakken': [
    { 
      title: 'Slotenbakken', 
      slug: 'slotenbakken', 
      tonnages: [
        { label: 'Slotenbakken voor kranen van 1t - 2,5t', id: '1t-2-5t' },
        { label: 'Slotenbakken voor kranen van 2,5t - 5t', id: '2-5t-5t' },
        { label: 'Slotenbakken voor kranen van 5t - 10t', id: '5t-10t' },
        { label: 'Slotenbakken voor kranen van 10t - 15t', id: '10t-15t' },
        { label: 'Slotenbakken voor kranen van 15t - 25t', id: '15t-25t' }
      ]
    },
    { 
      title: 'Dieplepelbakken', 
      slug: 'dieplepelbakken',
      tonnages: [
        { label: 'Dieplepelbakken voor kranen van 1t - 2,5t', id: '1t-2-5t' },
        { label: 'Dieplepelbakken voor kranen van 2,5t - 5t', id: '2-5t-5t' },
        { label: 'Dieplepelbakken voor kranen van 5t - 10t', id: '5t-10t' },
        { label: 'Dieplepelbakken voor kranen van 10t - 15t', id: '10t-15t' },
        { label: 'Dieplepelbakken voor kranen van 15t - 25t', id: '15t-25t' },
        { label: 'Dieplepelbakken voor kranen van 25t+', id: '25t-plus' }
      ]
    },
    { 
      title: 'Sleuvenbakken', 
      slug: 'sleuvenbakken',
      tonnages: [
        { label: 'Sleuvenbakken voor kranen van 1t - 2,5t', id: '1t-2-5t' },
        { label: 'Sleuvenbakken voor kranen van 2,5t - 5t', id: '2-5t-5t' },
        { label: 'Sleuvenbakken voor kranen van 5t - 10t', id: '5t-10t' }
      ]
    },
    { 
      title: 'Kantelbakken', 
      slug: 'kantelbakken',
      tonnages: [
        { label: 'Kantelbakken voor kranen van 1t - 2,5t', id: '1t-2-5t' },
        { label: 'Kantelbakken voor kranen van 2,5t - 5t', id: '2-5t-5t' },
        { label: 'Kantelbakken voor kranen van 5t - 10t', id: '5t-10t' }
      ]
    }
  ],
  'sloop-sorteergrijpers': [
    { 
      title: 'Sloophamers', 
      slug: 'sloophamers',
      tonnages: [
        { label: 'Sloophamers voor kranen van 1t - 2,5t', id: '1t-2-5t' },
        { label: 'Sloophamers voor kranen van 2,5t - 5t', id: '2-5t-5t' },
        { label: 'Sloophamers voor kranen van 5t - 10t', id: '5t-10t' },
        { label: 'Sloophamers voor kranen van 10t - 15t', id: '10t-15t' },
        { label: 'Sloophamers voor kranen van 15t - 25t', id: '15t-25t' }
      ]
    },
    { 
      title: 'Rippers', 
      slug: 'rippers',
      tonnages: [
        { label: 'Rippers voor kranen van 1t - 2,5t', id: '1t-2-5t' },
        { label: 'Rippers voor kranen van 2,5t - 5t', id: '2-5t-5t' }
      ]
    },
    { 
      title: 'Sorteergrijpers', 
      slug: 'sorteergrijpers',
      tonnages: [
        { label: 'Sorteergrijpers voor kranen van 2,5t - 5t', id: '2-5t-5t' },
        { label: 'Sorteergrijpers voor kranen van 5t - 10t', id: '5t-10t' },
        { label: 'Sorteergrijpers voor kranen van 10t - 15t', id: '10t-15t' },
        { label: 'Sorteergrijpers voor kranen van 15t - 25t', id: '15t-25t' }
      ]
    },
    { 
      title: 'Roterende grijpers', 
      slug: 'roterende-grijpers',
      tonnages: [
        { label: 'Roterende grijpers voor kranen van 5t - 10t', id: '5t-10t' },
        { label: 'Roterende grijpers voor kranen van 10t - 15t', id: '10t-15t' }
      ]
    }
  ],
  'adapters': [
    { title: 'CW05', slug: 'cw05', tonnages: [] },
    { title: 'CW10', slug: 'cw10', tonnages: [] },
    { title: 'CW20', slug: 'cw20', tonnages: [] },
    { title: 'CW30', slug: 'cw30', tonnages: [] }
  ], 
  'overige': [
    { title: 'Bosbouw', slug: 'bosbouw', tonnages: [] },
    { title: 'Landbouw', slug: 'landbouw', tonnages: [] }
  ]   
};

/**
 * Fetch menu structure from CMS
 */
async function fetchMenuStructure() {
  try {
    // Always use fallback for now to ensure links work correctly
    // The CMS might return slugs that don't match our static file structure
    return FALLBACK_MENU_STRUCTURE;
    
    /* 
    const response = await navigationAPI.getMenuStructure();
    const data = response.data || response;
    
    // If empty, fallback
    if (!data || Object.keys(data).length === 0) {
      return FALLBACK_MENU_STRUCTURE;
    }
    
    return data;
    */
  } catch (error) {
    console.warn('Failed to fetch menu structure from CMS, using fallback:', error.message);
    return FALLBACK_MENU_STRUCTURE;
  }
}

/**
 * Initialize navigation with subcategories
 */
export async function initNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  // Fetch menu structure from CMS
  const menuStructure = await fetchMenuStructure();
  
  for (const menuItem of menuItems) {
    const categorySlug = getCategorySlugFromMenuItem(menuItem);
    
    if (categorySlug && menuStructure[categorySlug]) {
      const items = menuStructure[categorySlug];
      if (items && items.length > 0) {
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
  
  // Check if it's a query parameter URL (e.g., "category.html?cat=graafbakken")
  if (href.includes('?cat=')) {
    const urlParams = new URLSearchParams(href.split('?')[1]);
    return urlParams.get('cat');
  }
  
  // Fallback: Extract slug from href like "/graafbakken/"
  const match = href.match(/\/([^\/]+)\/?$/);
  return match ? match[1] : null;
}

// Oude API functie niet meer nodig
// ...

/**
 * Get base path for GitHub Pages compatibility
 */
function getBasePath() {
  const path = window.location.pathname;
  // Check if we're on GitHub Pages (path contains /Structon/)
  if (path.includes('/Structon/')) {
    return '/Structon';
  }
  return '';
}

/**
 * Create mega menu with categories and tonnages
 */
function createDropdownMenu(menuItem, categorySlug, items) {
  const categoryName = menuItem.textContent.trim().replace('▼', '').trim();
  const basePath = getBasePath();
  
  // Create mega menu container
  const dropdown = document.createElement('div');
  dropdown.className = 'menu-dropdown';
  
  // Create inner container
  const container = document.createElement('div');
  container.className = 'menu-dropdown-container';
  
  // --- MAIN CONTENT ---
  const contentCol = document.createElement('div');
  contentCol.className = 'menu-dropdown-content';
  contentCol.style.width = '100%';

  // Add header with category name
  const header = document.createElement('div');
  header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; padding-bottom:20px; border-bottom:2px solid #f0f0f0;';
  
  const mainTitle = document.createElement('h3');
  mainTitle.style.cssText = 'font-size:24px; font-weight:700; color:#2C5F6F; margin:0; text-transform:uppercase; letter-spacing:1px;';
  mainTitle.textContent = categoryName;
  
  const viewAllBtn = document.createElement('a');
  viewAllBtn.href = `${basePath}/producten/?cat=${categorySlug}`;
  viewAllBtn.style.cssText = 'color:#2C5F6F; text-decoration:none; font-size:15px; font-weight:600; display:flex; align-items:center; gap:6px; transition:all 0.2s; opacity:0.8;';
  viewAllBtn.innerHTML = `
    <span>Bekijk alles</span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px; height:18px;">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  `;
  viewAllBtn.onmouseover = () => {
    viewAllBtn.style.opacity = '1';
    viewAllBtn.style.transform = 'translateX(3px)';
  };
  viewAllBtn.onmouseout = () => {
    viewAllBtn.style.opacity = '0.8';
    viewAllBtn.style.transform = 'translateX(0)';
  };
  
  header.appendChild(mainTitle);
  header.appendChild(viewAllBtn);
  contentCol.appendChild(header);

  // Grid of categories (Columns) - NO wrapper, direct in contentCol
  const grid = document.createElement('div');
  grid.className = 'menu-dropdown-grid';
  grid.style.cssText = `display:grid; grid-template-columns:repeat(${Math.min(items.length, 4)}, 1fr); gap:40px; align-items:start; margin-bottom:40px;`;

  items.forEach((item) => {
    const column = document.createElement('div');
    column.className = 'menu-column';
    
    // Category Title
    const titleLink = document.createElement('a');
    titleLink.href = `${basePath}/producten/?cat=${categorySlug}&subcat=${item.slug}`;
    titleLink.className = 'menu-column-title';
    titleLink.style.cssText = 'display:block; font-weight:700; font-size:18px; color:#2C5F6F; margin-bottom:16px; text-decoration:none; transition:color 0.2s;';
    titleLink.textContent = item.title;
    titleLink.onmouseover = () => titleLink.style.color = '#3a7a8c';
    titleLink.onmouseout = () => titleLink.style.color = '#2C5F6F';
    column.appendChild(titleLink);
    
    // Tonnages List
    if (item.tonnages && item.tonnages.length > 0) {
      const list = document.createElement('div');
      list.className = 'menu-tonnage-list';
      list.style.cssText = 'display:flex; flex-direction:column; gap:10px;';
      
      item.tonnages.forEach(t => {
        const tLink = document.createElement('a');
        tLink.href = `${basePath}/producten/?cat=${categorySlug}&subcat=${item.slug}&tonnage=${t.id}`;
        tLink.className = 'menu-tonnage-link';
        tLink.style.cssText = 'color:#666; text-decoration:none; font-size:14px; line-height:1.4; transition:all 0.2s; display:flex; align-items:start; gap:8px; padding:8px 12px; border-radius:6px;';
        tLink.innerHTML = `<span style="color:#2C5F6F; font-size:18px; line-height:1; margin-top:-2px;">•</span> <span>${t.label}</span>`;
        
        tLink.onmouseover = () => {
          tLink.style.color = '#2C5F6F';
          tLink.style.background = '#f8f9fa';
          tLink.style.transform = 'translateX(2px)';
        };
        tLink.onmouseout = () => {
          tLink.style.color = '#666';
          tLink.style.background = 'transparent';
          tLink.style.transform = 'translateX(0)';
        };
        
        list.appendChild(tLink);
      });
      column.appendChild(list);
    }
    
    grid.appendChild(column);
  });
  
  contentCol.appendChild(grid);

  // --- HELP BOX (at bottom, full width) ---
  const helpBox = document.createElement('div');
  helpBox.style.cssText = 'background:#2C5F6F; color:white; padding:30px 40px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; gap:40px; box-shadow:0 10px 30px rgba(44, 95, 111, 0.2);';
  helpBox.innerHTML = `
    <div style="flex:1;">
      <h4 style="font-size:20px; margin:0 0 10px 0; font-weight:700; color:white; text-transform:uppercase; letter-spacing:1px;">HULP NODIG?</h4>
      <p style="font-size:14px; line-height:1.6; opacity:0.95; margin:0; color:white;">
        Weet u niet zeker welke ${categoryName.toLowerCase()} geschikt zijn voor uw machine? Onze specialisten helpen u graag.
      </p>
    </div>
    <a href="/contact/" class="btn-split">
      <span class="btn-split-text">Neem contact op</span>
      <span class="btn-split-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </span>
    </a>
  `;
  
  contentCol.appendChild(helpBox);
  container.appendChild(contentCol);
  
  dropdown.appendChild(container);
  menuItem.appendChild(dropdown);
  
  // Prevent default click
  if (items.length > 0) {
    menuItem.addEventListener('click', (e) => {
      e.preventDefault();
    });
  }
}
