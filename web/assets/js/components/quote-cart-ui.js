/**
 * Structon Quote Cart UI
 * Floating Action Button + Sidebar + Toast notifications
 */

class QuoteCartUI {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createFAB();
    this.createSidebar();
    this.createToastContainer();
    this.bindEvents();
    this.updateBadge();
    
    // Listen for cart updates
    window.addEventListener('cart:updated', () => {
      this.updateBadge();
      if (this.isOpen) this.renderCartItems();
    });
  }

  /**
   * Create Floating Action Button
   */
  createFAB() {
    const fab = document.createElement('button');
    fab.id = 'quote-cart-fab';
    fab.className = 'quote-cart-fab';
    fab.setAttribute('aria-label', 'Open offerte mandje');
    fab.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <span class="quote-cart-badge" id="quote-cart-badge">0</span>
    `;
    document.body.appendChild(fab);
    this.fab = fab;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return document.body.classList.contains('is-logged-in');
  }

  /**
   * Get auth-aware text
   */
  getAuthText(guestText, authText) {
    return this.isLoggedIn() ? authText : guestText;
  }

  /**
   * Create Sidebar
   */
  createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'quote-cart-sidebar';
    sidebar.className = 'quote-cart-sidebar';
    sidebar.innerHTML = `
      <div class="quote-cart-overlay" id="quote-cart-overlay"></div>
      <div class="quote-cart-panel">
        <div class="quote-cart-header">
          <h2 class="quote-cart-title">
            <span class="guest-only-inline">UW OFFERTE</span>
            <span class="auth-only-inline">UW BESTELLING</span>
          </h2>
          <button class="quote-cart-close" id="quote-cart-close" aria-label="Sluiten">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="quote-cart-content" id="quote-cart-content">
          <!-- Items rendered here -->
        </div>
        <div class="quote-cart-footer" id="quote-cart-footer">
          <div class="quote-cart-total">
            <span>Totaal producten:</span>
            <strong id="quote-cart-total-count">0</strong>
          </div>
          <a href="/Structon/be-nl/offerte-aanvragen/" class="btn-split btn-split-primary quote-cart-cta" id="quote-cart-submit">
            <span class="btn-split-text">
              <span class="guest-only-inline">Offerte aanvragen</span>
              <span class="auth-only-inline">Bestelling plaatsen</span>
            </span>
            <span class="btn-split-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </a>
          <button class="quote-cart-clear" id="quote-cart-clear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Mandje legen
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(sidebar);
    this.sidebar = sidebar;
    
    // Update CTA link based on locale
    this.updateCTALink();
  }

  /**
   * Update CTA link based on current locale
   */
  updateCTALink() {
    const path = window.location.pathname;
    let locale = 'be-nl';
    
    if (path.includes('/nl-nl/')) locale = 'nl-nl';
    else if (path.includes('/be-fr/')) locale = 'be-fr';
    else if (path.includes('/de-de/')) locale = 'de-de';
    
    const cta = document.getElementById('quote-cart-submit');
    if (cta) {
      cta.href = `/Structon/${locale}/offerte-aanvragen/`;
    }
  }

  /**
   * Create Toast Container
   */
  createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    this.toastContainer = container;
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // FAB click
    this.fab.addEventListener('click', () => this.toggle());
    
    // Close button
    document.getElementById('quote-cart-close').addEventListener('click', () => this.close());
    
    // Overlay click
    document.getElementById('quote-cart-overlay').addEventListener('click', () => this.close());
    
    // Clear cart
    document.getElementById('quote-cart-clear').addEventListener('click', () => {
      if (confirm('Weet u zeker dat u alle producten wilt verwijderen?')) {
        window.quoteCart.clear();
        this.showToast(this.isLoggedIn() ? 'Bestelling geleegd' : 'Offerte mandje geleegd', 'info');
      }
    });
    
    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
    
    // Swipe down to close on mobile
    const panel = document.querySelector('.quote-cart-panel');
    if (panel && window.innerWidth <= 768) {
      this.setupSwipeToClose(panel);
    }
    
    // Add to quote buttons (delegated)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#add-to-quote, #add-to-quote-sticky');
      if (btn) {
        e.preventDefault();
        this.handleAddToQuote(btn);
      }
    });
  }

  /**
   * Setup swipe down to close functionality for mobile
   */
  setupSwipeToClose(element) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let startTime = 0;
    
    const handleStart = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      const rect = element.getBoundingClientRect();
      
      // Only start drag if touching near the top (handle area)
      if (touch.clientY - rect.top > 60) return;
      
      startY = touch.clientY;
      currentY = startY;
      isDragging = true;
      startTime = Date.now();
      element.classList.add('dragging');
      element.style.transition = 'none';
    };
    
    const handleMove = (e) => {
      if (!isDragging) return;
      
      const touch = e.touches ? e.touches[0] : e;
      currentY = touch.clientY;
      const deltaY = currentY - startY;
      
      // Only allow dragging down on mobile
      if (deltaY > 0 && window.innerWidth <= 768) {
        element.style.transform = `translateY(${deltaY}px)`;
      }
    };
    
    const handleEnd = () => {
      if (!isDragging) return;
      
      const deltaY = currentY - startY;
      const deltaTime = Date.now() - startTime;
      const velocity = deltaY / deltaTime;
      
      element.classList.remove('dragging');
      element.style.transition = '';
      element.style.transform = '';
      
      // Close if dragged down more than 100px or fast swipe
      if (deltaY > 100 || velocity > 0.5) {
        this.close();
      }
      
      isDragging = false;
    };
    
    // Touch events
    element.addEventListener('touchstart', handleStart, { passive: true });
    element.addEventListener('touchmove', handleMove, { passive: true });
    element.addEventListener('touchend', handleEnd);
  }

  /**
   * Handle add to quote button click
   */
  handleAddToQuote(btn) {
    const productData = btn.dataset.product;
    if (!productData) {
      console.error('No product data on button');
      return;
    }
    
    try {
      const product = JSON.parse(productData);
      const wasInCart = window.quoteCart.hasItem(product.id);
      
      if (window.quoteCart.addItem(product)) {
        if (wasInCart) {
          this.showToast(`${product.title} - aantal verhoogd`, 'success');
        } else {
          this.showToast(`${product.title} toegevoegd aan ${this.isLoggedIn() ? 'bestelling' : 'offerte'}`, 'success');
        }
        
        // Pulse animation on FAB
        this.fab.classList.add('pulse');
        setTimeout(() => this.fab.classList.remove('pulse'), 600);
      }
    } catch (e) {
      console.error('Failed to parse product data:', e);
      this.showToast('Er ging iets mis', 'error');
    }
  }

  /**
   * Toggle sidebar
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open sidebar
   */
  open() {
    this.isOpen = true;
    this.sidebar.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.renderCartItems();
  }

  /**
   * Close sidebar
   */
  close() {
    this.isOpen = false;
    this.sidebar.classList.remove('open');
    document.body.style.overflow = '';
  }

  /**
   * Update badge count and FAB visibility
   */
  updateBadge() {
    const count = window.quoteCart.getCount();
    const badge = document.getElementById('quote-cart-badge');
    const totalCount = document.getElementById('quote-cart-total-count');
    const footer = document.getElementById('quote-cart-footer');
    const fab = document.getElementById('quote-cart-fab');
    
    // FAB is always visible on all pages
    if (fab) {
      fab.style.display = 'flex';
    }
    
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
    
    if (totalCount) {
      totalCount.textContent = count;
    }
    
    if (footer) {
      footer.style.display = count > 0 ? 'block' : 'none';
    }
  }

  /**
   * Render cart items in sidebar
   */
  renderCartItems() {
    const container = document.getElementById('quote-cart-content');
    const items = window.quoteCart.getItems();

    const getLocale = () => {
      const path = window.location.pathname;
      if (path.includes('/nl-nl/')) return 'nl-nl';
      if (path.includes('/be-fr/')) return 'be-fr';
      if (path.includes('/de-de/')) return 'de-de';
      return 'be-nl';
    };

    const buildProductUrl = (item) => {
      const locale = getLocale();
      if (!item || !item.slug || !item.category_slug) return null;
      const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
      const sub = item.subcategory_slug ? `/${item.subcategory_slug}` : '';
      return `${basePath}/${locale}/producten/${item.category_slug}${sub}/${item.slug}/`;
    };
    
    if (items.length === 0) {
      container.innerHTML = `
        <div class="quote-cart-empty">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h3>Uw offerte mandje is leeg</h3>
          <p>Voeg producten toe om een offerte aan te vragen</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = items.map(item => `
      <div class="quote-cart-item" data-id="${item.id}">
        <div class="quote-cart-item-image">
          ${item.image ? `
            ${buildProductUrl(item) ? `
              <a href="${buildProductUrl(item)}" style="display: flex; width: 100%; height: 100%;" aria-label="Bekijk ${item.title}">
                <img src="${item.image}" alt="${item.title}">
              </a>
            ` : `
              <img src="${item.image}" alt="${item.title}">
            `}
          ` : `
            <div class="quote-cart-item-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          `}
        </div>
        <div class="quote-cart-item-info">
          ${buildProductUrl(item) ? `
            <h4 class="quote-cart-item-title"><a href="${buildProductUrl(item)}" style="color: inherit; text-decoration: none;">${item.title}</a></h4>
          ` : `
            <h4 class="quote-cart-item-title">${item.title}</h4>
          `}
          <p class="quote-cart-item-category">${item.category}${item.subcategory ? ' › ' + item.subcategory : ''}</p>
          ${item.specs && Object.keys(item.specs).length > 0 ? `
            <div class="quote-cart-item-specs">
              ${Object.entries(item.specs).filter(([k,v]) => v).map(([k,v]) => `<span>${v}</span>`).join('')}
            </div>
          ` : ''}
          <div class="quote-cart-item-quantity">
            <button class="qty-btn qty-minus" data-id="${item.id}" data-action="decrease">−</button>
            <span class="qty-value">${item.quantity || 1}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}" data-action="increase">+</button>
          </div>
        </div>
        <button class="quote-cart-item-remove" data-id="${item.id}" aria-label="Verwijderen">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `).join('');
    
    // Bind item events
    this.bindItemEvents();
  }

  /**
   * Bind events for cart items
   */
  bindItemEvents() {
    // Quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const item = window.quoteCart.getItems().find(i => i.id === id);
        
        if (item) {
          const newQty = action === 'increase' ? (item.quantity || 1) + 1 : (item.quantity || 1) - 1;
          if (newQty <= 0) {
            window.quoteCart.removeItem(id);
            this.showToast('Product verwijderd', 'info');
          } else {
            window.quoteCart.updateQuantity(id, newQty);
          }
        }
      });
    });
    
    // Remove buttons
    document.querySelectorAll('.quote-cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = window.quoteCart.removeItem(id);
        if (item) {
          this.showToast(`${item.title} verwijderd`, 'info');
        }
      });
    });
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' 
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
      : type === 'error'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    
    toast.innerHTML = `${icon}<span>${message}</span>`;
    this.toastContainer.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => toast.classList.add('show'));
    
    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (window.quoteCartUI || document.getElementById('quote-cart-fab')) {
    return;
  }

  // Wait for quoteCart service to be available
  if (window.quoteCart) {
    window.quoteCartUI = new QuoteCartUI();
  } else {
    // Retry after a short delay
    setTimeout(() => {
      if (window.quoteCartUI || document.getElementById('quote-cart-fab')) {
        return;
      }
      window.quoteCartUI = new QuoteCartUI();
    }, 100);
  }
});
