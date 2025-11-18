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
      'script-src': [
        "'self'", 
        "https://products-sit.microshop.com", 
        "https://cart-sit.microshop.com", 
        "https://user-sit.microshop.com", 
        "https://accounts.google.com",
        "'unsafe-inline'",
        "https://connect.facebook.net"
      ],
      'style-src': [
        "'self'", 
        "'unsafe-inline'", 
        "https://accounts.google.com"
      ],
      'img-src': [
        "'self'", 
        "data:", 
        "https:",
        "https://platform-lookaside.fbsbx.com"
      ],
      'connect-src': [
        "'self'", 
        "https://sit.microshop.com", 
        "https://accounts.google.com",
        "https://www.facebook.com",
        "https://graph.facebook.com"
      ],
      'frame-src': [
        "'self'",
        "https://www.facebook.com",
        "https://staticxx.facebook.com"
      ],
    },
    corsOrigins: ['https://sit.microshop.com'],
  },

  features: {
    debugMode: false,
    hotReload: false,
  },
};