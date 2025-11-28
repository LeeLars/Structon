/**
 * Navigation with Dynamic Subcategories
 */

import { API_BASE_URL } from './api/client.js';

/**
 * Initialize navigation with subcategories
 */
export async function initNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  for (const menuItem of menuItems) {
    const categorySlug = getCategorySlugFromMenuItem(menuItem);
    
    if (categorySlug) {
      try {
        const subcategories = await fetchSubcategories(categorySlug);
        
        if (subcategories && subcategories.length > 0) {
          createDropdownMenu(menuItem, categorySlug, subcategories);
        }
      } catch (error) {
        console.error(`Failed to load subcategories for ${categorySlug}:`, error);
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
  subcategories.forEach(subcat => {
    const link = document.createElement('a');
    link.href = `/${categorySlug}/${subcat.slug}/`;
    link.className = 'menu-dropdown-item';
    link.textContent = subcat.title;
    container.appendChild(link);
  });
  
  dropdown.appendChild(container);
  
  // Append mega menu to menu item
  menuItem.appendChild(dropdown);
  
  // Prevent default click on menu item (keep hover behavior)
  menuItem.addEventListener('click', (e) => {
    e.preventDefault();
  });
}
