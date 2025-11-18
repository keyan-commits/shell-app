## 🚀 Setup Instructions

### Quick Start (using defaults)
```bash
npm install
npm start  # Uses .env.dev with demo credentials
```

### Custom Setup (with your own Google OAuth)
```bash
npm install
cp .env.dev .env
# Edit .env with your actual Google Client ID
npm start  # Uses your .env file
```

### Getting Google OAuth Client ID
1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 Client ID
3. Add `http://localhost:3000` to authorized origins
4. Copy Client ID to `.env` file

### Environment Files
- `.env.dev` - Default development config (committed)
- `.env.sit` - SIT environment config (committed)
- `.env.uat` - UAT environment config (committed)
- `.env.prod` - Production config (committed)
- `.env` - Your local override (gitignored, create from .env.dev)

# Shell App - Micro-Frontend Container

The orchestrator application that loads and coordinates all micro-frontends (MFEs) in the MicroShop application.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Environment Management](#environment-management)
- [Adding New MFEs](#adding-new-mfes)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Shell App is a **Vanilla JavaScript** application (no framework) that serves as the container for all micro-frontends. It handles:

- ✅ **Authentication** - Google OAuth + Demo login
- ✅ **MFE Orchestration** - Loading and mounting all MFEs
- ✅ **Routing & Layout** - Application structure and navigation
- ✅ **Environment Management** - DEV/SIT/UAT/PROD configurations
- ✅ **Security** - CSP policies, origin validation, input validation
- ✅ **Fault Isolation** - Graceful degradation when MFEs fail

### Why Vanilla JavaScript?

- **Framework-agnostic** - Can load any framework (React, Vue, Angular)
- **Smaller bundle size** - No framework overhead
- **No conflicts** - Won't clash with MFE frameworks
- **Maximum flexibility** - Easy to modify and extend

---

## 🏗️ Architecture

### Design Patterns

The Shell App follows **SOLID principles** and implements several design patterns:

1. **Strategy Pattern** - Different loading strategies for different MFE types
2. **Registry Pattern** - Centralized MFE configuration
3. **Observer Pattern** - Authentication state management
4. **Facade Pattern** - Simple interface to complex loading logic

### Core Components

```
┌─────────────────────────────────────────┐
│           Shell App                     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Authentication             │   │
│  │  (authService, Login)           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      MFE Orchestration          │   │
│  │  (MFELoader, Strategies)        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      UI Management              │   │
│  │  (MFEUIManager, App)            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Configuration              │   │
│  │  (mfe-registry, env configs)    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
shell-app/
├── config/                      # Environment configurations
│   ├── dev.js                   # Development config
│   ├── sit.js                   # SIT environment
│   ├── uat.js                   # UAT environment
│   └── prod.js                  # Production config
│
├── public/                      # Static assets
│   ├── index.html               # Main HTML (with CSP)
│   └── security/                # Security configs (optional)
│
├── src/
│   ├── core/                    # Core orchestration logic
│   │   └── MFELoader.js         # MFE loading orchestrator
│   │
│   ├── loaders/                 # Loading strategies
│   │   └── AngularLoader.js     # Angular-specific loader
│   │
│   ├── ui/                      # UI management
│   │   └── MFEUIManager.js      # UI feedback handler
│   │
│   ├── config/                  # Configuration
│   │   └── mfe-registry.js      # 🎯 MFE registry (main config)
│   │
│   ├── auth/                    # Authentication
│   │   ├── authService.js       # Auth logic (OAuth + Demo)
│   │   └── Login.js             # Login UI component
│   │
│   ├── App.js                   # Main application class
│   └── index.js                 # Entry point
│
├── .env.dev                     # Development environment vars
├── .env.sit                     # SIT environment vars
├── .env.uat                     # UAT environment vars
├── .env.prod                    # Production environment vars
│
├── webpack.config.js            # Webpack + Module Federation
├── package.json                 # Dependencies and scripts
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

```bash
node --version  # v18 or higher
npm --version   # v9 or higher
```

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode (default)
npm start

# Open browser automatically at http://localhost:3000
```

### Building for Production

```bash
# Build for specific environment
npm run build:dev   # Development build
npm run build:sit   # SIT build
npm run build:uat   # UAT build
npm run build:prod  # Production build
```

---

## ⚙️ Configuration

### MFE Registry

The **single source of truth** for all MFE configurations.

**File: `src/config/mfe-registry.js`**

```javascript
export const MFE_REGISTRY = [
    {
        name: 'Products',
        tech: 'React',
        containerId: 'products-container',
        mountId: 'products-mfe',
        port: 3001,
        
        loader: {
            load: () => import('productsMFE/ProductsApp'),
            mount: (module) => module.mount('products-mfe')
        },
        
        onSuccess: () => MFEUIManager.showSuccess('products-container'),
        onError: () => MFEUIManager.showError('products-container', 'Products', 'React', 3001)
    },
    // ... more MFEs
];
```

### Webpack Configuration

**File: `webpack.config.js`**

Key sections:

```javascript
// Module Federation - Remote MFEs
remotes: {
  productsMFE: 'productsMFE@http://localhost:3001/remoteEntry.js',
  cartMFE: 'cartMFE@http://localhost:3002/remoteEntry.js',
}

// Environment injection
new webpack.DefinePlugin({
  'process.env.BUILD_ENV': JSON.stringify(BUILD_ENV),
  'process.env.SHELL_URL': JSON.stringify(config.shellUrl),
  // ... more env vars
})

// HTML template with CSP injection
new HtmlWebpackPlugin({
  template: './public/index.html',
  templateParameters: {
    CSP: generateCSPString(config.security.csp),
  },
})
```

---

## 🌍 Environment Management

### Available Environments

| Environment | Command | Port | Badge Color | CSP |
|-------------|---------|------|-------------|-----|
| **Development** | `npm start` | 3000 | 🟢 Green | Relaxed |
| **SIT** | `npm run start:sit` | 3000 | 🔵 Blue | Moderate |
| **UAT** | `npm run start:uat` | 3000 | 🟠 Orange | Moderate |
| **Production** | `npm run build:prod` | - | None | Strict |

### Environment Configuration

Each environment has its own config file:

**Example: `config/prod.js`**

```javascript
module.exports = {
  environment: 'production',
  shellUrl: 'https://app.microshop.com',
  mfeUrls: {
    products: 'https://products.microshop.com',
    cart: 'https://cart.microshop.com',
    user: 'https://user.microshop.com',
  },
  googleClientId: 'YOUR_PROD_CLIENT_ID',
  security: {
    csp: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "https://products.microshop.com"],
      // ... strict production CSP
    },
    corsOrigins: ['https://app.microshop.com'],
    enableSRI: true,
    enableHSTS: true,
  },
  features: {
    debugMode: false,
    hotReload: false,
  }
};
```

### Environment Badge

The shell automatically shows an environment indicator badge:

- **Visible in**: DEV, SIT, UAT
- **Hidden in**: Production
- **Location**: Top-right corner
- **Implementation**: JavaScript-based (no CSS template syntax)

**Code location**: `src/App.js` → `addEnvironmentBadge()` method

---

## 🆕 Adding New MFEs

### Quick Guide (4 Steps)

**1. Add MFE to Registry**

Edit `src/config/mfe-registry.js`:

```javascript
{
    name: 'Reviews',
    tech: 'React',
    containerId: 'reviews-container',
    mountId: 'reviews-mfe',
    port: 3004,
    
    loader: {
        load: () => import('reviewsMFE/ReviewsApp'),
        mount: (module) => module.mount('reviews-mfe')
    },
    
    onSuccess: () => MFEUIManager.showSuccess('reviews-container'),
    onError: () => MFEUIManager.showError('reviews-container', 'Reviews', 'React', 3004)
}
```

**2. Add Remote to Webpack**

Edit `webpack.config.js`:

```javascript
remotes: {
  productsMFE: 'productsMFE@http://localhost:3001/remoteEntry.js',
  cartMFE: 'cartMFE@http://localhost:3002/remoteEntry.js',
  reviewsMFE: 'reviewsMFE@http://localhost:3004/remoteEntry.js', // NEW
}
```

**3. Add Container to Layout**

Edit `src/App.js` → `render()` method:

```javascript
<div id="reviews-container" style="...">
    <div style="...">📦 reviews-mfe-react @ localhost:3004</div>
    <div style="padding: 20px;">
        <div id="reviews-mfe"></div>
    </div>
</div>
```

**4. Start the New MFE**

```bash
cd reviews-mfe-react
npm start
```

That's it! The shell will automatically load your new MFE! 🎉

---

## 🔒 Security

### Content Security Policy (CSP)

The shell implements environment-specific CSP policies:

**Development CSP (Relaxed):**
```
default-src 'self' http://localhost:* ws://localhost:*;
script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:*;
style-src 'self' 'unsafe-inline';
```

**Production CSP (Strict):**
```
default-src 'self';
script-src 'self' https://products.microshop.com https://cart.microshop.com;
style-src 'self';
connect-src 'self' https://api.microshop.com;
```

### Origin Validation

Angular MFE loader validates script sources:

```javascript
// In AngularLoader.js
const ALLOWED_ORIGINS = [
  'http://localhost:3003',           // Development
  'https://user-sit.microshop.com',  // SIT
  'https://user.microshop.com'       // Production
];

if (!ALLOWED_ORIGINS.includes(origin)) {
  throw new Error('Untrusted origin');
}
```

### Input Validation

All cross-MFE event data is validated:

```javascript
// Example in Cart MFE
const isValid = 
  product &&
  typeof product.id === 'number' &&
  typeof product.price === 'number' &&
  product.price > 0;

if (!isValid) {
  console.error('Invalid product data');
  return;
}
```

### Security Best Practices

1. ✅ **CSP Headers** - Environment-specific policies
2. ✅ **Origin Validation** - Check script sources before loading
3. ✅ **Input Validation** - Validate all event data
4. ✅ **CORS Configuration** - Restrict allowed origins
5. ✅ **SessionStorage Only** - No sensitive data in localStorage
6. ✅ **HTTPS Enforced** - Production uses HTTPS only
7. ✅ **SRI Hashes** - Subresource Integrity in production

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot find module 'productsMFE/ProductsApp'"

**Cause**: MFE not running or webpack config incorrect

**Solution**:
```bash
# Check if MFE is running
lsof -i :3001

# Verify webpack remotes match registry
# Start the MFE
cd products-mfe-react
npm start
```

---

#### 2. "Failed to load User Profile MFE"

**Cause**: Angular scripts not loading

**Solution**:
- Check if Angular MFE is running on port 3003
- Verify `ANGULAR_ALLOWED_ORIGINS` in `mfe-registry.js`
- Check browser console for specific errors

---

#### 3. CSP Blocking Resources

**Cause**: Content Security Policy too strict

**Solution**:
```javascript
// Update config/dev.js to allow source
security: {
  csp: {
    'script-src': ["'self'", "https://accounts.google.com"],
  }
}
```

---

#### 4. Environment Badge Not Showing

**Cause**: Running in production mode or badge not added

**Solution**:
- Badge only shows in DEV/SIT/UAT (not production)
- Check `addEnvironmentBadge()` method in `App.js`
- Verify `process.env.BUILD_ENV` is set

---

### Debug Mode

Enable verbose logging:

```javascript
// In App.js constructor
console.log('🔍 Shell App Debug Info:');
console.log('- Environment:', process.env.BUILD_ENV);
console.log('- MFE Count:', MFE_REGISTRY.length);
console.log('- MFEs:', MFE_REGISTRY.map(m => m.name));
```

---

## 📊 Console Output

### Successful Load

```
🌍 Running in DEV environment
============================================================
🚀 Starting MFE orchestration...
============================================================

🔄 Loading User Profile MFE (Angular)...
✅ Security check passed: http://localhost:3003
✅ User Profile MFE loaded successfully

🔄 Loading Products MFE (React)...
✅ Products MFE loaded successfully

🔄 Loading Cart MFE (Vue)...
✅ Cart MFE loaded successfully

============================================================
📊 MFE Load Summary
============================================================
Total:   3
Loaded:  3 ✅
Failed:  0 ❌
============================================================
```

### With Failures (Fault Isolation)

```
🚀 Starting MFE orchestration...

✅ User Profile MFE loaded successfully
❌ Failed to load Products MFE: Cannot find module
✅ Cart MFE loaded successfully

============================================================
📊 MFE Load Summary
============================================================
Total:   3
Loaded:  2 ✅
Failed:  1 ❌
============================================================

💡 Some MFEs failed, but the app continues working!
This demonstrates fault isolation in micro-frontend architecture.
```

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (port 3000) |
| `npm run start:sit` | Start with SIT configuration |
| `npm run start:uat` | Start with UAT configuration |
| `npm run build:dev` | Build for development |
| `npm run build:sit` | Build for SIT environment |
| `npm run build:uat` | Build for UAT environment |
| `npm run build:prod` | Build for production |

---

## 🔧 Tech Stack

- **Build Tool**: Webpack 5
- **Module Federation**: Webpack Module Federation Plugin
- **Authentication**: Google Identity Services
- **Language**: Vanilla JavaScript (ES6+)
- **Styling**: Inline styles (no CSS framework)
- **State Management**: Observer pattern (authService)

---

## 🎨 Key Features

### 1. Fault Isolation

If an MFE fails to load, the shell:
- ✅ Shows a friendly error message in that MFE's container
- ✅ Continues loading other MFEs
- ✅ Logs the error without crashing
- ✅ Provides instructions to fix the issue

### 2. Hot Module Replacement

In development mode:
- ✅ Changes reload automatically
- ✅ Preserves authentication state
- ✅ Fast refresh for quick development

### 3. Professional Logging

- ✅ Clear, formatted console output
- ✅ Progress indicators (🔄 Loading...)
- ✅ Success markers (✅)
- ✅ Error markers (❌)
- ✅ Summary statistics

### 4. Environment Awareness

- ✅ Visual indicator badge
- ✅ Environment-specific configs
- ✅ Different CSP policies per environment
- ✅ Debug mode in non-production

---

## 🤝 Contributing

### Code Standards

- Use ESLint for linting
- Follow the existing architecture patterns
- Keep components focused and single-responsibility
- Add JSDoc comments for public methods
- Test in all environments before committing

### Adding Features

1. Create a feature branch
2. Implement in the appropriate module
3. Test locally with all MFEs
4. Update documentation
5. Submit pull request

---

## 📚 Related Documentation

- [Main README](../README.md) - Complete project overview
- [Products MFE](../products-mfe-react/README.md) - React micro-frontend
- [Cart MFE](../cart-mfe-vue/README.md) - Vue micro-frontend
- [User MFE](../user-mfe-angular/README.md) - Angular micro-frontend

---

## 🎓 Learning Resources

- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Micro-Frontends](https://micro-frontends.org/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

## 📞 Support

For issues specific to the shell app:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review browser console logs
3. Verify all MFEs are running
4. Check webpack configuration

---

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ by the Platform Team**

*Last Updated: November 2025*