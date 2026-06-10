# EcoVault Storefront

A complete static e-commerce storefront for EcoVault — a curated dropshipping marketplace for eco-friendly home and lifestyle products. Built with HTML, CSS, and vanilla JavaScript. No build step required.

---

## Quick Start

### Run Locally
```bash
cd ecovault-store
python3 -m http.server 8000
# Open http://localhost:8000
```

Or use any static file server:
```bash
npx serve .        # Node.js
php -S 0.0.0.0:8000  # PHP
```

### Verify It Works
Open http://localhost:8000 in a browser. You should see:
- Homepage with hero image and featured products
- Product catalog with 20 products across 6 categories
- Working cart (localStorage), checkout flow, about/contact pages

---

## Project Structure

```
ecovault-store/
├── index.html              # Homepage
├── products.html           # Product catalog with search & filters
├── product.html            # Product detail page (?id=eco-XXX)
├── cart.html               # Shopping cart
├── checkout.html           # Order checkout with submission
├── about.html              # Brand story & sustainability
├── contact.html            # Contact form & info
├── favicon.png             # Site favicon
├── config/
│   └── forms.json          # Form/email notification config
├── css/
│   └── style.css           # All styles (brand-aligned)
├── js/
│   ├── products.js         # Product data (edit to add/update products)
│   ├── cart.js             # localStorage cart module
│   ├── orders.js           # Order processing (Web3Forms/Netlify/local)
│   └── main.js             # Common UI rendering functions
├── assets/
│   └── images/
│       ├── logo.png        # Brand logo
│       ├── hero-kitchen.png # Homepage hero image
│       ├── hero-lifestyle.png # Alternative hero image
│       └── ...product images...
└── README.md
```

---

## 📦 Products: How to Update

All product data lives in **`js/products.js`**. The file is organized so the content/marketing team can easily add or edit products.

### Product Structure
```js
{
  id: "eco-001",             // Unique product ID
  name: "Product Name",
  category: "kitchen",       // kitchen | bamboo | compostable | cleaning | lifestyle | home
  categoryDisplay: "Reusable Kitchenware",  // Display name
  price: 49.99,              // Retail price (USD)
  wholesale_price: 14.50,    // Wholesale cost
  supplier: "AliExpress - Store Name",  // Supplier info
  shipping_days: "5-10",     // Estimated shipping time
  rating: 4.7,               // 1-5
  reviewCount: 203,
  image_url: "https://...",  // Product image URL (external)
  badge: "Bestseller",       // "Bestseller" | "New" | "Sale" | "Eco-Approved" | null
  description: "Short description for catalog.",
  fullDescription: "Rich description for product detail page.",
  sustainability: "Sustainability info.",
  features: ["Feature 1", "Feature 2"],
  specs: { "Material": "Bamboo", "Weight": "100g" },
  inStock: true,
  weight: 200,
  material: "Bamboo"
}
```

### Adding a New Product
Add a new object to the `rawProducts` array in `js/products.js`, then add a matching key to `descriptionContent` for the full description.

---

## 🚀 Deployment Guide

### Option 1: Netlify (Recommended) ⭐
**Best for**: Easy setup, built-in form handling, free SSL, continuous deployment.

1. Push the `ecovault-store/` folder to a GitHub/GitLab repo
2. Log in to [Netlify](https://app.netlify.com/)
3. Click **"Add new site" → "Import an existing project"**
4. Connect your Git repository
5. Deploy settings:
   - **Base directory**: (leave empty if repo root is the store)
   - **Build command**: (leave empty — no build needed)
   - **Publish directory**: `.` (the root, or `ecovault-store` if that's the repo root)
6. Click **"Deploy site"**

**Netlify Forms** (built-in):
- Netlify automatically detects `<form>` tags in your HTML
- Forms work out of the box with no backend
- To enable: deploy to Netlify, then go to Site Settings → Forms
- Update `js/orders.js` to use `service: 'netlify'` for built-in handling

### Option 2: Vercel
**Best for**: Fast global CDN, serverless functions if needed later.

1. Install Vercel CLI: `npm i -g vercel`
2. In the store directory: `vercel` and follow prompts
3. Or connect your Git repo via [vercel.com](https://vercel.com/)

### Option 3: GitHub Pages
**Best for**: Free, simple, tightly integrated with GitHub.

1. Push to a GitHub repo
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main`, folder: `/` (root) or `/docs`
5. Site will be live at `https://your-username.github.io/repo-name/`

**Note**: GitHub Pages doesn't support server-side form handling. Use Web3Forms (see below).

---

## 📬 Order Notifications Setup

The store has a built-in order processing module (`js/orders.js`) that supports three modes:

### Mode 1: Web3Forms (Free — 250 submissions/month) ⭐
1. Go to [Web3Forms.com](https://web3forms.com/) — no credit card required
2. Enter your email and get a **free access key**
3. Edit `config/forms.json`:
   ```json
   {
     "accessKey": "YOUR-ACCESS-KEY-HERE",
     "notificationEmail": "you@example.com",
     "service": "web3forms"
   }
   ```
4. Orders will be emailed to you in real time

### Mode 2: Netlify Forms (Free — 100 submissions/month)
1. Deploy to Netlify (see deployment guide above)
2. Netlify automatically detects forms — no config needed
3. View submissions in Netlify dashboard: **Forms → Submissions**
4. Update `config/forms.json`:
   ```json
   { "service": "netlify" }
   ```

### Mode 3: Local Storage (Default)
Orders are saved to the browser's `localStorage`. No email notifications are sent. Access saved orders from the browser's DevTools:
```js
JSON.parse(localStorage.getItem('ecovault_orders'))
```
This is the default mode until a form service is configured.

---

## 💳 Stripe Payment Processing

The store integrates Stripe for credit card payments using the **PaymentIntent** API.

### How It Works
1. Customer fills in shipping info + card details on checkout
2. Frontend calls the serverless `api/create-payment-intent.js` endpoint
3. Endpoint creates a Stripe PaymentIntent (with the total amount)
4. Frontend confirms the card payment using the returned `client_secret`
5. On success: order is saved, confirmation shown, cart cleared

### Setup

**1. Get Stripe Keys**
- Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
- Copy your **publishable key** (starts with `pk_test_`)
- Copy your **secret key** (starts with `sk_test_`)

**2. Configure Publishable Key**
Edit `config/stripe.json`:
```json
{
  "publishableKey": "pk_test_YOUR_PUBLISHABLE_KEY"
}
```

**3. Deploy the Serverless Function**
The file `api/create-payment-intent.js` works with both Vercel and Netlify:

**Vercel**:
- Place `api/` folder at project root (auto-detected)
- Set env var: `vercel env add STRIPE_SECRET_KEY`
- Or in Vercel Dashboard → Project Settings → Environment Variables

**Netlify**:
- Create `netlify/functions/` and symlink or copy `api/create-payment-intent.js`
- Or use `netlify.toml` to configure functions directory
- Set env var in Netlify Dashboard → Site Settings → Environment Variables

### Testing
Use Stripe test card numbers:
| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Declined |
| `4000 0025 0000 3155` | ⚠️ Requires 3D Secure |

Any future expiration date and any 3-digit CVC will work in test mode.

### Going Live
1. Get live keys from Stripe Dashboard (toggle "View test data" off)
2. Update `config/stripe.json` with `pk_live_...` key
3. Set `STRIPE_SECRET_KEY` env var to `sk_live_...` on your hosting platform
4. Remove "test mode" message from checkout page

---

## 📊 Google Analytics 4

The store includes a GA4 integration module (`js/analytics.js`) with ecommerce tracking.

### Setup
1. Create a GA4 property in [Google Analytics](https://analytics.google.com/)
2. Copy your Measurement ID (starts with `G-`)
3. Edit `config/analytics.json`:
```json
{
  "measurementId": "G-XXXXXXXXXX"
}
```
4. Done — events will fire automatically!

### Events Tracked
| Event | When | Data Sent |
|-------|------|-----------|
| `view_item` | Product detail page loaded | Product ID, name, category, price |
| `add_to_cart` | Item added to cart | Product ID, name, quantity |
| `remove_from_cart` | Item removed from cart | Product ID, quantity |
| `begin_checkout` | Checkout page loaded | All cart items + total |
| `purchase` | Order completed | Transaction ID, total, all items |

---

## 🖌️ Brand Assets

All brand assets are from the team designer:
| Asset | Location |
|-------|----------|
| Logo | `assets/images/logo.png` |
| Favicon | `favicon.png` |
| Hero Image | `assets/images/hero-kitchen.png` |
| Alternative Hero | `assets/images/hero-lifestyle.png` |
| Color Palette | `css/style.css` (CSS variables) |
| Brand Guidelines | `../brand-guidelines.md` (team shared) |

---

## 📊 Data Sources

This storefront integrates work from the full EcoVault team:

| Contributor | Deliverable | Location |
|------------|-------------|----------|
| **Researcher** | 20 products, suppliers, pricing | `js/products.js` (sourced from `products.json`) |
| **Content Writer** | Product descriptions, brand copy | `js/products.js` (sourced from `product-descriptions.json`) |
| **Designer** | Brand guidelines, logo, assets | `assets/images/`, `css/style.css` (sourced from `style.json`, `brand-guidelines.md`) |
| **Store Developer** | Storefront build, cart, checkout | All files in this directory |

---

## 🧪 Testing the Checkout

1. Browse to **Products** and add items to your cart
2. Click the cart icon → review items → **Proceed to Checkout**
3. Fill in the shipping form → **Place Order**
4. Order is saved locally (+ emailed if Web3Forms is configured)
5. Cart is cleared and confirmation is shown

---

## 🔧 Tech Notes

- **Zero build tools required** — pure HTML/CSS/JS, open any `.html` file in a browser
- **Cart persistence**: `localStorage` — survives page refreshes and browser restarts
- **Mobile-first responsive**: Works on all screen sizes (480px → 1200px+)
- **Category filters**: URL-param aware — `products.html?category=kitchen` links work directly
- **Product images**: Use remote URLs (`image_url`) with graceful fallback to colored emoji placeholders
- **No payment processing**: This is a demo storefront. Payment integration (Stripe, etc.) would be a future addition
- **Markup model**: Products are priced at 2–3× wholesale cost (typical dropshipping margin)