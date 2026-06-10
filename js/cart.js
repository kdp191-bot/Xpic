/**
 * EcoVault — Shopping Cart Module
 * Pure client-side cart using localStorage
 */

const Cart = {
  STORAGE_KEY: 'ecovault_cart',

  /**
   * Get all cart items
   */
  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Save cart items
   */
  saveItems(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.updateCartBadge();
  },

  /**
   * Add product to cart
   */
  addItem(productId, quantity = 1) {
    const items = this.getItems();
    const existing = items.find(item => item.productId === productId);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }
    
    this.saveItems(items);
    
    // Track add_to_cart event
    if (typeof Analytics !== 'undefined' && typeof getProductById !== 'undefined') {
      const product = getProductById(productId);
      if (product) {
        Analytics.trackAddToCart(product, quantity);
      }
    }
    
    this.showNotification('Added to cart!');
    return items;
  },

  /**
   * Remove item from cart
   */
  removeItem(productId) {
    let items = this.getItems();
    const removed = items.find(item => item.productId === productId);
    items = items.filter(item => item.productId !== productId);
    this.saveItems(items);
    
    // Track remove_from_cart
    if (removed && typeof Analytics !== 'undefined' && typeof getProductById !== 'undefined') {
      const product = getProductById(productId);
      if (product) {
        Analytics.trackRemoveFromCart(product, removed.quantity);
      }
    }
    
    return items;
  },

  /**
   * Update item quantity
   */
  updateQuantity(productId, quantity) {
    const items = this.getItems();
    const item = items.find(i => i.productId === productId);
    if (item) {
      if (quantity <= 0) {
        return this.removeItem(productId);
      }
      item.quantity = quantity;
      this.saveItems(items);
    }
    return items;
  },

  /**
   * Get cart total count
   */
  getCount() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Get cart subtotal
   */
  getSubtotal() {
    const items = this.getItems();
    let total = 0;
    items.forEach(item => {
      const product = getProductById(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    });
    return total;
  },

  /**
   * Clear cart
   */
  clear() {
    this.saveItems([]);
  },

  /**
   * Get cart with full product data
   */
  getDetailedCart() {
    const items = this.getItems();
    return items.map(item => {
      const product = getProductById(item.productId);
      return {
        ...item,
        product
      };
    }).filter(item => item.product !== undefined);
  },

  /**
   * Update cart badge in header
   */
  updateCartBadge() {
    const count = this.getCount();
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  /**
   * Show a notification toast
   */
  showNotification(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
};

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCartBadge();
});