module.exports = {
  environment: 'development',
  shellUrl: 'http://localhost:3000',
  mfeUrls: {
    products: 'http://localhost:3001',
    cart: 'http://localhost:3002',
    user: 'http://localhost:3003',
  },
  googleClientId: 'YOUR_DEV_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  security: {
    csp: {
      'default-src': ["'self'", "http://localhost:*", "ws://localhost:*"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "http://localhost:*", "https://accounts.google.com", "https://apis.google.com"],
      'style-src': ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      'img-src': ["'self'", "data:", "https:"],
      'connect-src': ["'self'", "http://localhost:*", "ws://localhost:*", "https://accounts.google.com", "https://apis.google.com"],
    },
    corsOrigins: ['*'],
  },
  features: {
    debugMode: true,
    hotReload: true,
  }
};