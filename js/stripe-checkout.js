/**
 * EcoVault — Stripe Payment Integration
 * 
 * Uses Stripe PaymentIntent API with a serverless backend.
 * Falls back to direct token creation for testing without the backend.
 * 
 * To switch to live mode:
 * 1. Get your live publishable key from https://dashboard.stripe.com/
 * 2. Update config/stripe.json with the live key
 * 3. Deploy api/create-payment-intent.js to Vercel/Netlify
 * 4. Set STRIPE_SECRET_KEY env var on your hosting platform
 */

const StripeCheckout = {
  // Test mode publishable key (safe to expose in client-side code)
  publishableKey: 'pk_test_51TguJdFNpxltvF0Ta2IkbCXcnGaWB8YNTXraKWrpcFrYMjkcIVDYZwYCoybwgWcXr2uA56Fk3NNUlrEzvtnU86gY005vAuC9uI',
  
  // URL for the PaymentIntent API endpoint (update when deployed)
  paymentIntentEndpoint: '/api/create-payment-intent',
  
  stripe: null,
  card: null,
  elements: null,

  /**
   * Initialize Stripe Elements
   */
  async init() {
    // Try loading key from config
    try {
      const resp = await fetch('config/stripe.json');
      if (resp.ok) {
        const cfg = await resp.json();
        this.publishableKey = cfg.publishableKey || this.publishableKey;
      }
    } catch (e) { /* no config file */ }

    if (!this.publishableKey || !document.getElementById('card-element')) {
      return false;
    }

    // Load Stripe.js
    this.stripe = Stripe(this.publishableKey);
    this.elements = this.stripe.elements();

    // Create card element with brand styling
    const style = {
      base: {
        color: '#2B2D42',
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        '::placeholder': { color: '#9CA3AF' },
        iconColor: '#1B4332'
      },
      invalid: {
        color: '#DC2626',
        iconColor: '#DC2626'
      }
    };

    this.card = this.elements.create('card', {
      style: style,
      hidePostalCode: false
    });
    this.card.mount('#card-element');

    // Handle validation errors
    this.card.addEventListener('change', (event) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
        displayError.style.display = 'block';
      } else {
        displayError.textContent = '';
        displayError.style.display = 'none';
      }
    });

    return true;
  },

  /**
   * Process payment via PaymentIntent API
   * 1. Call serverless function to create PaymentIntent
   * 2. Confirm the card payment client-side
   */
  async processPayment(formData) {
    if (!this.stripe || !this.card) {
      return { success: false, error: 'Stripe not initialized' };
    }

    try {
      // Step 1: Create PaymentIntent via serverless function
      const intentResponse = await fetch(this.paymentIntentEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: formData.total,
          currency: 'usd',
          items: formData.items,
          orderId: formData.id
        })
      });

      if (!intentResponse.ok) {
        // Serverless function not available — fall back to direct token
        return await this.fallbackTokenPayment(formData);
      }

      const intent = await intentResponse.json();

      // Step 2: Confirm the card payment
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        intent.client_secret,
        {
          payment_method: {
            card: this.card,
            billing_details: {
              name: formData.name,
              email: formData.email
            }
          }
        }
      );

      if (error) {
        return { success: false, error: error.message };
      }

      if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture') {
        return {
          success: true,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
          cardLast4: paymentIntent.charges?.data[0]?.payment_method_details?.card?.last4 || '****',
          cardBrand: paymentIntent.charges?.data[0]?.payment_method_details?.card?.brand || 'Card'
        };
      }

      return { success: false, error: `Payment ${paymentIntent.status}` };

    } catch (err) {
      console.error('Stripe payment error:', err);
      return { success: false, error: 'Payment processing failed. Please try again.' };
    }
  },

  /**
   * Fallback: create a PaymentMethod directly (no serverless function needed)
   * Works for testing without deploying the backend
   */
  async fallbackTokenPayment(formData) {
    try {
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card,
        billing_details: {
          name: formData.name || '',
          email: formData.email || '',
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        paymentMethodId: paymentMethod.id,
        cardLast4: paymentMethod.card.last4,
        cardBrand: paymentMethod.card.brand,
        testMode: true,
        message: 'Test mode — no real charge processed. Deploy the serverless function for live payments.'
      };
    } catch (err) {
      return { success: false, error: 'Payment processing failed. Please try again.' };
    }
  }
};