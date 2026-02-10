/**
 * Shared Sidebar Component
 * Ensures consistent navigation across all CMS pages
 */

/**
 * Generate the sidebar HTML
 * @param {string} activePage - The current active page identifier
 */
export function renderSidebar(activePage = '') {
  const navItems = [
    { section: 'Overzicht' },
    { id: 'dashboard', href: '/cms/', icon: 'dashboard', label: 'Dashboard' },
    { section: 'Verkoop' },
    { id: 'quotes', href: '/cms/quotes.html', icon: 'quotes', label: 'Offertes' },
    { id: 'orders', href: '/cms/orders.html', icon: 'orders', label: 'Bestellingen' },
    { section: 'Catalogus' },
    { id: 'products', href: '/cms/products.html', icon: 'products', label: 'Producten' },
    { id: 'categories', href: '/cms/categories.html', icon: 'categories', label: 'Categorieën' },
    { id: 'brands', href: '/cms/brands.html', icon: 'brands', label: 'Merken' },
    { section: 'Content' },
    { id: 'blogs', href: '/cms/blogs.html', icon: 'blogs', label: 'Blog' },
    { section: 'Instellingen' },
    { id: 'users', href: '/cms/users.html', icon: 'users', label: 'Gebruikers' },
  ];

  const icons = {
    dashboard: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',
    quotes: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>',
    orders: '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
    products: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>',
    categories: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>',
    brands: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>',
    blogs: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>',
  };

  const navHtml = navItems.map(item => {
    if (item.section) {
      return `<div class="nav-section">${item.section}</div>`;
    }
    const isActive = item.id === activePage ? ' active' : '';
    return `
      <a href="${item.href}" class="nav-item${isActive}">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[item.icon]}</svg>
        <span>${item.label}</span>
      </a>`;
  }).join('');

  return `
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <a href="/cms/" class="sidebar-brand">
          <img src="https://res.cloudinary.com/dchrgzyb4/image/upload/v1764264700/Logo-transparant_neticz.png" alt="Structon" class="sidebar-logo">
        </a>
      </div>
      
      <nav class="sidebar-nav">
        ${navHtml}
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">A</div>
          <div class="user-details">
            <span class="user-name" id="sidebar-user-name">Admin</span>
            <span class="user-role">Beheerder</span>
          </div>
        </div>
        <button class="btn-logout" id="logout-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Uitloggen</span>
        </button>
      </div>
    </aside>
  `;
}

/**
 * Initialize sidebar on a page
 * @param {string} activePage - The current active page identifier
 */
export function initSidebar(activePage) {
  const container = document.getElementById('sidebar-container');
  if (container) {
    container.innerHTML = renderSidebar(activePage);
    
    // Setup logout handler
    setupLogoutHandler();
  }
}

/**
 * Setup logout button handler
 */
function setupLogoutHandler() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
}

/**
 * Handle logout - clear all auth data and redirect to login
 */
function handleLogout() {
  console.log('🚪 Logging out...');
  
  // Clear all possible auth tokens
  localStorage.removeItem('structon_auth_token');
  localStorage.removeItem('structon_user');
  localStorage.removeItem('structon_user_email');
  localStorage.removeItem('structon_user_role');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('cms_token');
  
  // Clear session storage
  sessionStorage.clear();
  
  // Redirect to login page
  window.location.href = '/cms/login.html';
}

/**
 * Detect active page from URL
 */
export function detectActivePage() {
  const path = window.location.pathname;
  
  if (path === '/cms/' || path === '/cms/index.html') return 'dashboard';
  if (path.includes('quotes')) return 'quotes';
  if (path.includes('orders')) return 'orders';
  if (path.includes('products')) return 'products';
  if (path.includes('categories')) return 'categories';
  if (path.includes('brands')) return 'brands';
  if (path.includes('blogs')) return 'blogs';
  if (path.includes('users')) return 'users';
  
  return 'dashboard';
}
