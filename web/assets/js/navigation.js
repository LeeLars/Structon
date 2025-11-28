/**
 * Navigation with Dynamic Subcategories
 */

import { API_BASE_URL } from './api/client.js';

// Fallback data voor als API niet beschikbaar is
const FALLBACK_SUBCATEGORIES = {
  'kraanbakken': [
    { title: 'Kraanbakken voor kranen van 1t - 2,5t', slug: '1t-2-5t' },
    { title: 'Kraanbakken voor kranen van 2,5t - 5t', slug: '2-5t-5t' },
    { title: 'Kraanbakken voor kranen van 5t - 10t', slug: '5t-10t' },
    { title: 'Kraanbakken voor kranen van 10t - 15t', slug: '10t-15t' },
    { title: 'Kraanbakken voor kranen van 15t - 25t', slug: '15t-25t' },
    { title: 'Kraanbakken voor kranen van 25t+', slug: '25t-plus' }
  ],
  'slotenbakken': [
    { title: 'Slotenbakken voor kranen van 1t - 2,5t', slug: '1t-2-5t' },
    { title: 'Slotenbakken voor kranen van 2,5t - 5t', slug: '2-5t-5t' },
    { title: 'Slotenbakken voor kranen van 5t - 10t', slug: '5t-10t' },
    { title: 'Slotenbakken voor kranen van 10t - 15t', slug: '10t-15t' },
    { title: 'Slotenbakken voor kranen van 15t - 25t', slug: '15t-25t' }
  ],
  'dieplepelbakken': [
    { title: 'Dieplepelbakken voor kranen van 1t - 2,5t', slug: '1t-2-5t' },
    { title: 'Dieplepelbakken voor kranen van 2,5t - 5t', slug: '2-5t-5t' },
    { title: 'Dieplepelbakken voor kranen van 5t - 10t', slug: '5t-10t' },
    { title: 'Dieplepelbakken voor kranen van 10t - 15t', slug: '10t-15t' },
    { title: 'Dieplepelbakken voor kranen van 15t - 25t', slug: '15t-25t' },
    { title: 'Dieplepelbakken voor kranen van 25t+', slug: '25t-plus' }
  ],
  'sorteergrijpers': [
    { title: 'Sorteergrijpers voor kranen van 2,5t - 5t', slug: '2-5t-5t' },
    { title: 'Sorteergrijpers voor kranen van 5t - 10t', slug: '5t-10t' },
    { title: 'Sorteergrijpers voor kranen van 10t - 15t', slug: '10t-15t' },
    { title: 'Sorteergrijpers voor kranen van 15t - 25t', slug: '15t-25t' }
  ],
  'sloophamers': [
    { title: 'Sloophamers voor kranen van 1t - 2,5t', slug: '1t-2-5t' },
    { title: 'Sloophamers voor kranen van 2,5t - 5t', slug: '2-5t-5t' },
    { title: 'Sloophamers voor kranen van 5t - 10t', slug: '5t-10t' },
    { title: 'Sloophamers voor kranen van 10t - 15t', slug: '10t-15t' },
    { title: 'Sloophamers voor kranen van 15t - 25t', slug: '15t-25t' }
  ]
};

/**
 * Initialize navigation with subcategories
 */
export async function initNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  for (const menuItem of menuItems) {
    const categorySlug = getCategorySlugFromMenuItem(menuItem);
    
    if (categorySlug) {
      try {
        let subcategories = await fetchSubcategories(categorySlug);
        
        // Fallback naar hardcoded data als API faalt
        if (!subcategories || subcategories.length === 0) {
          subcategories = FALLBACK_SUBCATEGORIES[categorySlug] || [];
        }
        
        if (subcategories && subcategories.length > 0) {
          createDropdownMenu(menuItem, categorySlug, subcategories);
        }
      } catch (error) {
        // Probeer fallback data bij error
        const fallbackData = FALLBACK_SUBCATEGORIES[categorySlug];
        if (fallbackData) {
          createDropdownMenu(menuItem, categorySlug, fallbackData);
        }
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
  
  // Extract slug from href like "/kraanbakken/" or "/sorteergrijpers/"
  const match = href.match(/\/([^\/]+)\/?$/);
  return match ? match[1] : null;
}

/**
 * Fetch subcategories for a category
 */
async function fetchSubcategories(categorySlug) {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategories?category_slug=${categorySlug}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.subcategories || [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

/**
 * Create mega menu with subcategories
 */
function createDropdownMenu(menuItem, categorySlug, subcategories) {
  const categoryName = menuItem.textContent.trim().replace('▼', '').trim();
  
  // Create mega menu container
  const dropdown = document.createElement('div');
  dropdown.className = 'menu-dropdown';
  
  // Create inner container
  const container = document.createElement('div');
  container.className = 'menu-dropdown-container';
  
  // Create header with title and "View All" button
  const header = document.createElement('div');
  header.className = 'menu-dropdown-header';
  
  const title = document.createElement('h3');
  title.className = 'menu-dropdown-title';
  title.textContent = `${categoryName} per tonnage`;
  
  const viewAllLink = document.createElement('a');
  viewAllLink.href = `/${categorySlug}/`;
  viewAllLink.className = 'menu-dropdown-view-all';
  viewAllLink.innerHTML = `Bekijk alle ${categoryName} <span>→</span>`;
  
  header.appendChild(title);
  header.appendChild(viewAllLink);
  container.appendChild(header);
  
  // Add subcategory links in grid
  subcategories.forEach((subcat) => {
    const link = document.createElement('a');
    link.href = `/${categorySlug}/${subcat.slug}/`;
    link.className = 'menu-dropdown-item';
    link.textContent = subcat.title;
    container.appendChild(link);
  });
  
  dropdown.appendChild(container);
  menuItem.appendChild(dropdown);
  
  // Prevent default click on menu item (keep hover behavior)
  menuItem.addEventListener('click', (e) => {
    e.preventDefault();
  });
}
