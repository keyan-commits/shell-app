module.exports = {
  environment: 'development',
  shellUrl: 'http://localhost:3000',
  mfeUrls: {
    products: 'http://localhost:3001',
    cart: 'http://localhost:3002',
    user: 'http://localhost:3003',
  },

  security: {
    csp: {
      'default-src': ["'self'", "http://localhost:*", "ws://localhost:*"],
      'script-src': [
        "'self'", 
        "'unsafe-inline'", 
        "'unsafe-eval'", 
        "http://localhost:*", 
        "https://accounts.google.com", 
        "https://apis.google.com",
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
        "http://localhost:*",
        "https://platform-lookaside.fbsbx.com"
      ],
      'connect-src': [
        "'self'", 
        "http://localhost:*", 
        "ws://localhost:*", 
        "https://accounts.google.com", 
        "https://apis.google.com",
        "https://www.facebook.com",
        "https://graph.facebook.com",
        "https://*.facebook.com",
        "https://*.fbsbx.com"
      ],
      'frame-src': [
        "'self'",
        "https://www.facebook.com",
        "https://staticxx.facebook.com"
      ],
    },
    corsOrigins: ['*'],
  },

  features: {
    debugMode: true,
    hotReload: true,
  },
};