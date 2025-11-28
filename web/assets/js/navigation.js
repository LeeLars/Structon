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
      slug: 'roterende-sorteergrijpers',
      tonnages: [
        { label: 'Roterende grijpers voor kranen van 5t - 10t', id: '5t-10t' },
        { label: 'Roterende grijpers voor kranen van 10t - 15t', id: '10t-15t' }
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
  contentCol.style.width = '100%';

  // Add header with category name
  const header = document.createElement('div');
  header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; padding-bottom:20px; border-bottom:2px solid #f0f0f0;';
  
  const mainTitle = document.createElement('h3');
  mainTitle.style.cssText = 'font-size:24px; font-weight:700; color:#2C5F6F; margin:0; text-transform:uppercase; letter-spacing:1px;';
  mainTitle.textContent = categoryName;
  
  const viewAllBtn = document.createElement('a');
  viewAllBtn.href = `/${categorySlug}/`;
  viewAllBtn.className = 'btn-split'; // Use global button class
  viewAllBtn.style.cssText = 'margin-left: auto;'; // Push to right if needed
  viewAllBtn.innerHTML = `
    <span class="btn-split-text">Bekijk alles</span>
    <span class="btn-split-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
    </span>
  `;
  
  header.appendChild(mainTitle);
  header.appendChild(viewAllBtn);
  contentCol.appendChild(header);

  // Wrapper for columns + help box
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:grid; grid-template-columns:1fr 350px; gap:60px;';

  // Grid of categories (Columns)
  const grid = document.createElement('div');
  grid.className = 'menu-dropdown-grid';
  grid.style.cssText = `display:grid; grid-template-columns:repeat(${items.length}, 1fr); gap:30px; align-items:start;`;

  items.forEach((item) => {
    const column = document.createElement('div');
    column.className = 'menu-column';
    
    // Category Title
    const titleLink = document.createElement('a');
    titleLink.href = `/${item.slug}/`;
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
        tLink.href = `/${item.slug}/${t.id}/`;
        tLink.className = 'menu-tonnage-link';
        // Updated style for multi-line text
        tLink.style.cssText = 'color:#666; text-decoration:none; font-size:14px; line-height:1.4; transition:all 0.2s; display:flex; align-items:start; gap:8px; padding:8px 12px; border-radius:6px;';
        
        // Use a small dot instead of arrow for cleaner list look with long text
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
  
  wrapper.appendChild(grid);

  // --- HELP BOX ---
  const helpBox = document.createElement('div');
  helpBox.style.cssText = 'background:#2C5F6F; color:white; padding:40px; border-radius:12px; height:fit-content; box-shadow:0 10px 30px rgba(44, 95, 111, 0.2);';
  helpBox.innerHTML = `
    <h4 style="font-size:22px; margin:0 0 20px 0; font-weight:700; color:white; text-transform:uppercase; letter-spacing:1px;">HULP NODIG?</h4>
    <p style="font-size:15px; line-height:1.7; opacity:0.9; margin:0 0 30px 0; color:white;">
      Weet u niet zeker welke ${categoryName.toLowerCase()} geschikt zijn voor uw machine? 
      Onze specialisten helpen u graag met persoonlijk advies.
    </p>
    <a href="/pages/contact.html" class="btn-split" style="background:white; color:#2C5F6F; width:100%; justify-content:center;">
      <span class="btn-split-text" style="color:#2C5F6F;">Neem contact op</span>
      <span class="btn-split-icon" style="background:#f0f0f0; color:#2C5F6F;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </span>
    </a>
  `;
  
  wrapper.appendChild(helpBox);
  contentCol.appendChild(wrapper);
  container.appendChild(contentCol); // THIS WAS MISSING!
  
  dropdown.appendChild(container);
  menuItem.appendChild(dropdown);
  
  // Prevent default click
  if (items.length > 0) {
    menuItem.addEventListener('click', (e) => {
      e.preventDefault();
    });
  }
}
