module.exports = {
  environment: 'production',
  shellUrl: 'https://your-production-domain.com',
  mfeUrls: {
    products: 'https://products.your-domain.com',
    cart: 'https://cart.your-domain.com',
    user: 'https://user.your-domain.com',
  },

  security: {
    csp: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'", 
        "'unsafe-inline'", 
        "'unsafe-eval'", 
        "https://accounts.google.com", 
        "https://apis.google.com",
        "https://connect.facebook.net"  // ✨ Add this
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
        "https://platform-lookaside.fbsbx.com"  // ✨ Add this
      ],
      'connect-src': [
        "'self'", 
        "https://accounts.google.com", 
        "https://apis.google.com",
        "https://www.facebook.com",     // ✨ Add this
        "https://graph.facebook.com"    // ✨ Add this
      ],
      'frame-src': [
        "'self'",
        "https://www.facebook.com",
        "https://staticxx.facebook.com"
      ],
    },
    corsOrigins: ['https://your-production-domain.com'],
  },

  features: {
    debugMode: false,
    hotReload: false,
  },
};