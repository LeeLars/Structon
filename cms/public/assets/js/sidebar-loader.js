/**
 * CMS Sidebar Loader
 * Loads consistent sidebar across all CMS pages
 * Handles notification badges for quotes, requests, and orders
 */

(function() {
  'use strict';

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:4000/api'
    : 'https://structon-production.up.railway.app/api';

  /**
   * Get auth token
   */
  function getToken() {
    return localStorage.getItem('structon_auth_token') || localStorage.getItem('auth_token');
  }

  /**
   * Get current page from URL
   */
  function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('quotes.html')) return 'quotes';
    if (path.includes('aanvragen.html')) return 'requests';
    if (path.includes('orders.html')) return 'orders';
    if (path.includes('products.html')) return 'products';
    if (path.includes('blogs.html')) return 'blogs';
    if (path.includes('users.html')) return 'users';
    if (path.endsWith('/cms/') || path.endsWith('/cms')) return 'dashboard';
    return 'dashboard';
  }

  /**
   * Generate sidebar HTML
   */
  function generateSidebarHTML(currentPage, badges = {}) {
    const isActive = (page) => currentPage === page ? 'active' : '';
    const badgeHTML = (id, count) => `<span class="nav-badge" id="${id}" style="display: ${count > 0 ? 'inline-flex' : 'none'};">${count || 0}</span>`;

    return `
      <div class="sidebar-header">
        <a href="/cms/" class="sidebar-brand">
          <img src="https://res.cloudinary.com/dchrgzyb4/image/upload/v1764264700/Logo-transparant_neticz.png" alt="Structon" class="sidebar-logo">
        </a>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">Overzicht</div>
        <a href="/cms/" class="nav-item ${isActive('dashboard')}">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Dashboard</span>
        </a>
        <div class="nav-section">Verkoop</div>
        <a href="/cms/quotes.html" class="nav-item ${isActive('quotes')}">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Offertes</span>
          ${badgeHTML('quotes-badge', badges.quotes)}
        </a>
        <a href="/cms/aanvragen.html" class="nav-item ${isActive('requests')}">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Aanvragen</span>
          ${badgeHTML('requests-badge', badges.requests)}
        </a>
        <a href="/cms/orders.html" class="nav-item ${isActive('orders')}">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>Bestellingen</span>
          ${badgeHTML('orders-badge', badges.orders)}
        </a>
        <div class="nav-section">Catalogus</div>
        <a href="/cms/products.html" class="nav-item ${isActive('products')}">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          <span>Producten</span>
        </a>
        <div class="nav-section">Content</div>
        <a href="/cms/blogs.html" class="nav-item ${isActive('blogs')}">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span>Blog</span>
        </a>
        <div class="nav-section">Instellingen</div>
        <a href="/cms/users.html" class="nav-item ${isActive('users')}">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
          <span>Gebruikers</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">A</div>
          <div class="user-info">
            <span class="user-name">Admin</span>
            <span class="user-role">Beheerder</span>
          </div>
        </div>
        <button class="btn-icon" id="logout-btn" title="Uitloggen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    `;
  }

  /**
   * Fetch notification counts
   */
  async function fetchNotificationCounts() {
    const token = getToken();
    if (!token) return { quotes: 0, requests: 0, orders: 0 };

    try {
      // Fetch quotes
      const quotesResponse = await fetch(`${API_BASE}/quotes?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      let newQuotesCount = 0;
      if (quotesResponse.ok) {
        const quotesData = await quotesResponse.json();
        // Only count quotes with status 'new'
        newQuotesCount = (quotesData.quotes || []).filter(q => q.status === 'new').length;
      }

      // Fetch orders
      const ordersResponse = await fetch(`${API_BASE}/orders?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      let newOrdersCount = 0;
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        // Only count orders with status 'new'
        newOrdersCount = (ordersData.orders || []).filter(o => o.status === 'new').length;
      }

      return {
        quotes: newQuotesCount,
        requests: 0, // TODO: Implement when requests API is ready
        orders: newOrdersCount
      };
    } catch (error) {
      console.error('Failed to fetch notification counts:', error);
      return { quotes: 0, requests: 0, orders: 0 };
    }
  }

  /**
   * Update badge counts
   */
  function updateBadges(badges) {
    const updateBadge = (id, count) => {
      const badge = document.getElementById(id);
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
      }
    };

    updateBadge('quotes-badge', badges.quotes);
    updateBadge('requests-badge', badges.requests);
    updateBadge('orders-badge', badges.orders);
  }

  /**
   * Initialize sidebar
   */
  async function initSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    if (!sidebar) return;

    const currentPage = getCurrentPage();
    
    // Fetch notification counts
    const badges = await fetchNotificationCounts();
    
    // Generate and insert sidebar HTML
    sidebar.innerHTML = generateSidebarHTML(currentPage, badges);

    // Bind logout event
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('structon_auth_token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('cms_token');
        window.location.href = '/cms/login.html';
      });
    }
  }

  /**
   * Refresh badges (can be called from other scripts)
   */
  async function refreshBadges() {
    const badges = await fetchNotificationCounts();
    updateBadges(badges);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebar);
  } else {
    initSidebar();
  }

  // Export for use in other scripts
  window.cmsSidebar = {
    refresh: refreshBadges,
    updateBadges
  };
})();
