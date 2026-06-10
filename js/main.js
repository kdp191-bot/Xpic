/**
 * EcoVault — Main JavaScript
 * Common functionality across all pages
 */

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile menu on link click
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
});

/**
 * Utility: Format price as currency
 */
function formatPrice(price) {
  return '$' + price.toFixed(2);
}

/**
 * Utility: Render star rating HTML
 */
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '★';
    } else if (i - 0.5 <= rating) {
      stars += '★'; // half star approximation
    } else {
      stars += '☆';
    }
  }
  return stars;
}

/**
 * Utility: Get category display name
 */
function getCategoryDisplay(category) {
  const names = {
    kitchen: 'Kitchen',
    bamboo: 'Bamboo',
    compostable: 'Compostable',
    cleaning: 'Cleaning',
    lifestyle: 'Lifestyle'
  };
  return names[category] || category;
}

/**
 * Utility: Generate placeholder image color based on product ID
 */
function getProductImageColor(id) {
  const colors = ['#95D5B2', '#F5EBE0', '#D4A373', '#B7E4C7', '#E9C46A', '#A8DADC', '#CDB4DB', '#BDE0FE'];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Utility: Get product image URL (uses image_url from products data)
 */
function getProductImageSrc(product) {
  return product.image_url || '';
}

/**
 * Render a product card
 */
function renderProductCard(product) {
  const badgeClass = product.badge ? product.badge.toLowerCase().replace(' ', '-') : '';
  
  return `
    <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
      <div class="product-card-image" style="background: ${getProductImageColor(product.id)}">
        <img src="${getProductImageSrc(product)}" 
             alt="${product.name}"
             onerror="this.style.display='none'; this.parentNode.innerHTML='<span style=\\'font-size:4rem;\\'>${getCategoryEmoji(product.category)}</span>'"
             loading="lazy">
        ${product.badge ? `<span class="product-badge ${badgeClass}">${product.badge}</span>` : ''}
      </div>
      <div class="product-card-body">
        <div class="product-card-category">${product.categoryDisplay || getCategoryDisplay(product.category)}</div>
        <h3 class="product-card-name">${product.name}</h3>
        <div class="product-card-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="review-count">(${product.reviewCount})</span>
        </div>
      </div>
      <div class="product-card-footer">
        <div class="product-card-price">
          ${formatPrice(product.price)}
          ${product.comparePrice ? `<span class="compare">${formatPrice(product.comparePrice)}</span>` : ''}
        </div>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); Cart.addItem('${product.id}', 1)" title="Add to cart">
          +
        </button>
      </div>
    </div>
  `;
}

/**
 * Get emoji for product category
 */
function getCategoryEmoji(category) {
  const emojis = {
    kitchen: '🍽️',
    bamboo: '🎋',
    compostable: '♻️',
    cleaning: '🧹',
    lifestyle: '🌿'
  };
  return emojis[category] || '🌱';
}

/**
 * Render a cart item row
 */
function renderCartItem(item) {
  if (!item.product) return '';
  const p = item.product;
  return `
    <div class="cart-item" data-product-id="${p.id}">
      <div class="cart-item-image" style="background: ${getProductImageColor(p.id)}">
        ${getCategoryEmoji(p.category)}
      </div>
      <div class="cart-item-info">
        <h3>${p.name}</h3>
        <p>${getCategoryDisplay(p.category)}</p>
        <div class="cart-item-price">${formatPrice(p.price)}</div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-selector">
          <button onclick="Cart.updateQuantity('${p.id}', ${item.quantity - 1}); renderCartPage();">−</button>
          <input type="text" value="${item.quantity}" readonly>
          <button onclick="Cart.updateQuantity('${p.id}', ${item.quantity + 1}); renderCartPage();">+</button>
        </div>
        <button class="cart-item-remove" onclick="Cart.removeItem('${p.id}'); renderCartPage();" title="Remove">✕</button>
      </div>
    </div>
  `;
}

/**
 * Render the full cart page
 */
function renderCartPage() {
  const container = document.getElementById('cart-container');
  if (!container) return;
  
  const items = Cart.getDetailedCart();
  
  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet. Browse our eco-friendly collection!</p>
        <a href="products.html" class="btn btn-primary">Shop Now</a>
      </div>
    `;
    return;
  }
  
  const subtotal = Cart.getSubtotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;
  
  container.innerHTML = `
    <div class="cart-layout">
      <div>
        <div class="cart-items">
          ${items.map(renderCartItem).join('')}
        </div>
      </div>
      <div>
        <div class="cart-summary">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? '<span class="free">FREE</span>' : formatPrice(shipping)}</span>
          </div>
          ${subtotal < 50 ? `<div class="summary-row" style="font-size:0.8rem;color:var(--color-dark-gray);">
            <span>Add ${formatPrice(50 - subtotal)} more for free shipping</span>
          </div>` : ''}
          <div class="summary-row total">
            <span>Total</span>
            <span>${formatPrice(total)}</span>
          </div>
          <a href="checkout.html" class="btn btn-primary btn-lg" style="width:100%;margin-top:var(--spacing-md);">
            Proceed to Checkout
          </a>
        </div>
      </div>
    </div>
  `;
}