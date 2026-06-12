/**
 * EcoVault — Stripe Payment Intent (Netlify Function)
 * 
 * Creates a Stripe PaymentIntent for checkout.
 * Deploys as a Netlify Function at /.netlify/functions/create-payment-intent
 * 
 * Env vars needed:
 * - STRIPE_SECRET_KEY: Your Stripe secret key (sk_test_... or sk_live_...)
 */

const stripe = require('stripe');

/**
 * Netlify Function handler
 */
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  try {
    const { amount, currency, items, orderId } = JSON.parse(event.body);

    // Validate
    if (!amount || amount <= 0) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ error: 'Invalid amount' }) 
      };
    }

    // Check for Stripe secret key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('[EcoVault Netlify] No STRIPE_SECRET_KEY set — returning mock response');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          id: `pi_test_${Date.now()}`,
          amount: Math.round(amount * 100),
          currency: currency || 'usd',
          status: 'requires_payment_method',
          client_secret: `pi_test_${Date.now()}_secret_${Math.random().toString(36).slice(2)}`,
          testMode: true,
          message: 'Test mode — set STRIPE_SECRET_KEY env var for live payments'
        })
      };
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency || 'usd',
      metadata: {
        orderId: orderId || 'unknown',
        items: JSON.stringify((items || []).map(i => `${i.product?.id || i.id}:${i.quantity || 1}`))
      },
      automatic_payment_methods: { enabled: true }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret,
        testMode: process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')
      })
    };

  } catch (error) {
    console.error('[EcoVault Netlify] Stripe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Payment processing error', message: error.message })
    };
  }
};