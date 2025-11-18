module.exports = {
  environment: 'uat',
  shellUrl: 'https://uat.microshop.com',
  mfeUrls: {
    products: 'https://products-uat.microshop.com',
    cart: 'https://cart-uat.microshop.com',
    user: 'https://user-uat.microshop.com',
  },

  security: {
    csp: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'", 
        "https://products-uat.microshop.com", 
        "https://cart-uat.microshop.com", 
        "https://user-uat.microshop.com", 
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
        "https://uat.microshop.com", 
        "https://accounts.google.com",
        "https://www.facebook.com",
        "https://graph.facebook.com"
      ],
    },
    corsOrigins: ['https://uat.microshop.com'],
  },

  features: {
    debugMode: false,
    hotReload: false,
  },
};