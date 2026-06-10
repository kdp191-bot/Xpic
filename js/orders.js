/**
 * EcoVault — Order Processing Module
 * 
 * Captures orders and submits them to email/webhook services.
 * Supports: Web3Forms (default), Netlify Forms, or custom webhooks.
 * 
 * To activate, get a free access key at https://web3forms.com/
 * and set it in the config below, OR create an account.json file.
 */

const OrderProcessor = {
  // ==============================
  // CONFIGURATION
  // ==============================
  // Get your FREE access key at https://web3forms.com/ (250 submissions/month)
  // Then paste it here or create /home/team/shared/ecovault-store/config/forms.json
  config: {
    // Web3Forms access key — replace with your own from https://web3forms.com/
    accessKey: '', 
    
    // Where to send order notifications
    notificationEmail: 'orders@ecovault.com',
    
    // Service to use: 'web3forms' | 'netlify' | 'local'
    service: 'local',
    
    // Web3Forms endpoint
    web3formsEndpoint: 'https://api.web3forms.com/submit'
  },

  /**
   * Initialize — try to load saved config
   */
  async init() {
    // Try loading from account config
    try {
      const response = await fetch('config/forms.json');
      if (response.ok) {
        const savedConfig = await response.json();
        Object.assign(this.config, savedConfig);
      }
    } catch (e) {
      // No config file yet — using defaults
    }

    // Set service based on whether access key is configured
    if (this.config.accessKey) {
      this.config.service = 'web3forms';
    }
  },

  /**
   * Submit an order to the configured service
   */
  async submitOrder(orderData) {
    // Always save locally first
    this.saveLocally(orderData);

    // Submit to remote service if configured
    if (this.config.service === 'web3forms') {
      return await this.submitToWeb3Forms(orderData);
    } else {
      // Store in localStorage and provide instructions
      return { 
        success: true, 
        local: true, 
        message: 'Order saved locally. Configure a form service to receive email notifications.',
        instructions: 'Get a free access key at https://web3forms.com/ and set it in config/forms.json'
      };
    }
  },

  /**
   * Save order to localStorage
   */
  saveLocally(orderData) {
    const orders = JSON.parse(localStorage.getItem('ecovault_orders') || '[]');
    orders.push({
      ...orderData,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('ecovault_orders', JSON.stringify(orders));
  },

  /**
   * Submit to Web3Forms
   */
  async submitToWeb3Forms(orderData) {
    const formData = new FormData();
    formData.append('access_key', this.config.accessKey);
    formData.append('subject', `New EcoVault Order — ${orderData.id}`);
    formData.append('from_name', 'EcoVault Store');
    formData.append('email', this.config.notificationEmail);

    // Build a nice HTML email body
    const itemsHtml = orderData.items.map(item => 
      `• ${item.product.name} × ${item.quantity} — $${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `
New Order Received!
──────────────────
Order ID: ${orderData.id}
Date: ${new Date(orderData.orderDate).toLocaleString()}

Customer:
  Name: ${orderData.name}
  Email: ${orderData.email}
  Phone: ${orderData.phone || 'N/A'}

Shipping Address:
  ${orderData.address}
  ${orderData.city}, ${orderData.state} ${orderData.zip}
  ${orderData.country}

Items:
${itemsHtml}

Subtotal: $${orderData.subtotal.toFixed(2)}
Shipping: ${orderData.subtotal >= 50 ? 'FREE' : '$5.99'}
Total: $${orderData.total.toFixed(2)}

Notes: ${orderData.notes || 'None'}
    `.trim();

    formData.append('message', message);

    try {
      const response = await fetch(this.config.web3formsEndpoint, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      return { 
        success: result.success, 
        local: false, 
        message: result.success ? 'Order submitted and email sent!' : 'Order saved locally, but email notification failed.'
      };
    } catch (error) {
      console.error('Order submission error:', error);
      return { 
        success: true, 
        local: true, 
        message: 'Order saved locally. Email notification could not be sent (check your internet connection).'
      };
    }
  },

  /**
   * Get all saved orders (for admin use)
   */
  getSavedOrders() {
    try {
      return JSON.parse(localStorage.getItem('ecovault_orders') || '[]');
    } catch {
      return [];
    }
  }
};

// Auto-initialize when loaded
document.addEventListener('DOMContentLoaded', () => {
  OrderProcessor.init();
});