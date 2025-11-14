module.exports = {
  environment: 'production',
  shellUrl: 'https://app.microshop.com',
  mfeUrls: {
    products: 'https://products.microshop.com',
    cart: 'https://cart.microshop.com',
    user: 'https://user.microshop.com',
  },
  googleClientId: 'YOUR_PROD_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  security: {
    csp: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "https://products.microshop.com", "https://cart.microshop.com", "https://user.microshop.com", "https://accounts.google.com"],
      'style-src': ["'self'", "https://accounts.google.com"],
      'img-src': ["'self'", "data:", "https:"],
      'connect-src': ["'self'", "https://api.microshop.com", "https://accounts.google.com"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    },
    corsOrigins: ['https://app.microshop.com'],
    enableSRI: true, // Subresource Integrity
    enableHSTS: true, // HTTP Strict Transport Security
  },
  features: {
    debugMode: false,
    hotReload: false,
  }
};