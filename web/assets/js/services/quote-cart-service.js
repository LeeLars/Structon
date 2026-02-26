/**
 * Structon Quote Cart Service
 * Manages the quote cart with localStorage persistence, versioning, and cross-tab sync
 */

const STORAGE_KEY = 'structon_quote_cart';
const STORAGE_VERSION = 1;

class QuoteCartService {
  constructor() {
    this.listeners = new Set();
    this.cart = this._load();
    
    // Cross-tab synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        this.cart = this._load();
        this._notify();
      }
    });
  }

  /**
   * Load cart from localStorage with version check
   */
  _load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return { version: STORAGE_VERSION, items: [] };
      
      const data = JSON.parse(stored);
      
      // Version migration if needed
      if (!data.version || data.version < STORAGE_VERSION) {
        return this._migrate(data);
      }
      
      return data;
    } catch (e) {
      console.warn('Quote cart: Failed to load, resetting', e);
      return { version: STORAGE_VERSION, items: [] };
    }
  }

  /**
   * Migrate old cart data to new version
   */
  _migrate(oldData) {
    // Handle legacy format (array only)
    if (Array.isArray(oldData)) {
      return { version: STORAGE_VERSION, items: oldData };
    }
    return { version: STORAGE_VERSION, items: oldData.items || [] };
  }

  /**
   * Save cart to localStorage with quota handling
   */
  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cart));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('Quote cart: localStorage full, using sessionStorage');
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.cart));
        } catch (e2) {
          console.error('Quote cart: Storage completely full');
        }
      }
    }
    this._notify();
  }

  /**
   * Notify all listeners of cart changes
   */
  _notify() {
    const event = new CustomEvent('cart:updated', { detail: this.getItems() });
    window.dispatchEvent(event);
    this.listeners.forEach(fn => fn(this.getItems()));
  }

  /**
   * Subscribe to cart changes
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Get all cart items
   */
  getItems() {
    return [...this.cart.items];
  }

  /**
   * Get cart item count
   */
  getCount() {
    return this.cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  /**
   * Check if product is in cart
   */
  hasItem(productId) {
    return this.cart.items.some(item => item.id === productId);
  }

  /**
   * Add product to cart
   */
  addItem(product) {
    if (!product || !product.id) {
      console.error('Quote cart: Invalid product data');
      return false;
    }

    const existingIndex = this.cart.items.findIndex(item => item.id === product.id);
    const addedQuantity = product.quantity || 1;
    
    if (existingIndex >= 0) {
      // Increase quantity by the amount being added
      this.cart.items[existingIndex].quantity = (this.cart.items[existingIndex].quantity || 1) + addedQuantity;
    } else {
      // Add new item with the specified quantity
      this.cart.items.push({
        ...product,
        quantity: addedQuantity,
        addedAt: new Date().toISOString()
      });
    }

    this._save();
    return true;
  }

  /**
   * Remove product from cart
   */
  removeItem(productId) {
    const index = this.cart.items.findIndex(item => item.id === productId);
    if (index >= 0) {
      const removed = this.cart.items.splice(index, 1)[0];
      this._save();
      return removed;
    }
    return null;
  }

  /**
   * Update item quantity
   */
  updateQuantity(productId, quantity) {
    const item = this.cart.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        return this.removeItem(productId);
      }
      item.quantity = quantity;
      this._save();
      return item;
    }
    return null;
  }

  /**
   * Clear entire cart
   */
  clear() {
    this.cart.items = [];
    this._save();
  }

  /**
   * Format cart for quote submission (text format for email)
   */
  formatAsText() {
    if (this.cart.items.length === 0) return '';
    
    let text = '=== GESELECTEERDE PRODUCTEN ===\n\n';
    
    this.cart.items.forEach((item, i) => {
      text += `${i + 1}. ${item.title}\n`;
      text += `   Categorie: ${item.category}${item.subcategory ? ' > ' + item.subcategory : ''}\n`;
      text += `   Aantal: ${item.quantity || 1}\n`;
      
      if (item.specs && Object.keys(item.specs).length > 0) {
        text += '   Specs: ';
        text += Object.entries(item.specs)
          .filter(([k, v]) => v)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        text += '\n';
      }
      text += '\n';
    });
    
    text += `Totaal: ${this.getCount()} product(en)\n`;
    return text;
  }

  /**
   * Format cart as JSON for API submission
   */
  formatAsJSON() {
    return JSON.stringify(this.cart.items.map(item => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      quantity: item.quantity || 1,
      specs: item.specs
    })));
  }
}

// Singleton instance - expose globally
window.quoteCart = new QuoteCartService();
console.log('🛒 Quote Cart Service initialized');
