/**
 * EcoVault — Stripe Payment Intent API Endpoint
 * 
 * Serverless function compatible with Vercel Serverless & Netlify Functions.
 * Creates a Stripe PaymentIntent for checkout.
 * 
 * Deploy:
 * - Vercel: Place in `api/` directory (auto-detected)
 * - Netlify: Place in `netlify/functions/` or configure in netlify.toml
 * 
 * Env vars needed:
 * - STRIPE_SECRET_KEY: Your Stripe secret key (sk_test_... or sk_live_...)
 */

// Stripe SDK — uncomment when deploying (npm install stripe)
// const Stripe = require('stripe');

// For local development, mock the Stripe instance
function getStripe() {
  if (typeof Stripe !== 'undefined') {
    return Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
  }
  return null;
}

/**
 * Vercel Serverless Function handler
 * URL: /api/create-payment-intent
 * Method: POST
 * Body: { amount: number (in cents), currency: string, items: array }
 */
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency, items, orderId } = req.body;

    // Validate
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // For demo/test mode without Stripe SDK installed, return a mock response
    // This allows testing without deploying the full backend
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      console.log('[EcoVault] Test mode: returning mock PaymentIntent');
      return res.status(200).json({
        id: `pi_test_${Date.now()}`,
        amount: amount,
        currency: currency || 'usd',
        status: 'requires_payment_method',
        client_secret: `pi_test_${Date.now()}_secret_${Math.random().toString(36).slice(2)}`,
        testMode: true,
        message: 'Test mode — set STRIPE_SECRET_KEY env var for live payments'
      });
    }

    // Real Stripe integration
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe SDK not initialized. Install stripe package.' });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency: currency || 'usd',
      metadata: {
        orderId: orderId || 'unknown',
        items: JSON.stringify((items || []).map(i => `${i.product?.id || i.id}:${i.quantity || 1}`))
      },
      // Capture immediately for this simple flow
      capture_method: 'automatic',
      // Auto-payment methods
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.status(200).json({
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      client_secret: paymentIntent.client_secret,
      testMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')
    });

  } catch (error) {
    console.error('[EcoVault] Stripe error:', error);
    return res.status(500).json({
      error: 'Payment processing error',
      message: error.message
    });
  }
};