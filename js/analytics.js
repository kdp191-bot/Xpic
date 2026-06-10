/**
 * EcoVault — Google Analytics 4 Configuration
 * 
 * To activate: 
 * 1. Create a GA4 property in your Google Analytics account
 * 2. Copy your Measurement ID (starts with G-)
 * 3. Paste it below or create config/analytics.json
 * 
 * GA4 docs: https://developers.google.com/analytics/devguides/collection/gtagjs
 */

const Analytics = {
  // Replace with your GA4 Measurement ID (or set in config/analytics.json)
  measurementId: '',

  initialized: false,

  /**
   * Initialize GA4
   */
  async init() {
    // Try loading measurement ID from config file
    try {
      const resp = await fetch('config/analytics.json');
      if (resp.ok) {
        const cfg = await resp.json();
        this.measurementId = cfg.measurementId || this.measurementId;
      }
    } catch (e) { /* no config file */ }

    if (!this.measurementId) return; // GA not configured

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', this.measurementId, {
      send_page_view: true
    });

    this.initialized = true;
  },

  /**
   * Send a GA4 event
   */
  event(name, params = {}) {
    if (!this.initialized || !window.gtag) return;
    window.gtag('event', name, params);
  },

  /**
   * Track: view_item — called on product detail page
   */
  trackViewItem(product) {
    this.event('view_item', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.categoryDisplay || product.category,
        price: product.price
      }]
    });
  },

  /**
   * Track: add_to_cart — called when item is added to cart
   */
  trackAddToCart(product, quantity = 1) {
    this.event('add_to_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.categoryDisplay || product.category,
        price: product.price,
        quantity: quantity
      }]
    });
  },

  /**
   * Track: remove_from_cart
   */
  trackRemoveFromCart(product, quantity = 1) {
    this.event('remove_from_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: quantity
      }]
    });
  },

  /**
   * Track: begin_checkout
   */
  trackBeginCheckout(items, total) {
    this.event('begin_checkout', {
      currency: 'USD',
      value: total,
      items: items.map(item => ({
        item_id: item.product.id,
        item_name: item.product.name,
        item_category: item.product.categoryDisplay || item.product.category,
        price: item.product.price,
        quantity: item.quantity
      }))
    });
  },

  /**
   * Track: purchase
   */
  trackPurchase(orderData) {
    this.event('purchase', {
      currency: 'USD',
      transaction_id: orderData.id,
      value: orderData.total,
      shipping: orderData.total - orderData.subtotal,
      items: orderData.items.map(item => ({
        item_id: item.product.id,
        item_name: item.product.name,
        item_category: item.product.categoryDisplay || item.product.category,
        price: item.product.price,
        quantity: item.quantity
      }))
    });
  }
};

// Auto-init on page load
document.addEventListener('DOMContentLoaded', () => {
  Analytics.init();
});