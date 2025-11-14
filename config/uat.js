module.exports = {
  environment: 'uat',
  shellUrl: 'https://uat.microshop.com',
  mfeUrls: {
    products: 'https://products-uat.microshop.com',
    cart: 'https://cart-uat.microshop.com',
    user: 'https://user-uat.microshop.com',
  },
  googleClientId: 'YOUR_UAT_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  security: {
    csp: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "https://products-uat.microshop.com", "https://cart-uat.microshop.com", "https://user-uat.microshop.com", "https://accounts.google.com"],
      'style-src': ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      'img-src': ["'self'", "data:", "https:"],
      'connect-src': ["'self'", "https://*.microshop.com", "https://accounts.google.com"],
    },
    corsOrigins: ['https://uat.microshop.com'],
  },
  features: {
    debugMode: false,
    hotReload: false,
  }
};