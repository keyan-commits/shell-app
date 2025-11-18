module.exports = {
  environment: 'sit',
  shellUrl: 'https://sit.microshop.com',
  mfeUrls: {
    products: 'https://products-sit.microshop.com',
    cart: 'https://cart-sit.microshop.com',
    user: 'https://user-sit.microshop.com',
  },

  security: {
    csp: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "https://products-sit.microshop.com", "https://cart-sit.microshop.com", "https://user-sit.microshop.com", "https://accounts.google.com"],
      'style-src': ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      'img-src': ["'self'", "data:", "https:"],
      'connect-src': ["'self'", "https://*.microshop.com", "https://accounts.google.com"],
    },
    corsOrigins: ['https://sit.microshop.com'],
  },
  features: {
    debugMode: true,
    hotReload: false,
  }
};