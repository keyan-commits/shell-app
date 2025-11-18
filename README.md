# 🛍️ MicroShop - Enterprise Micro-Frontend Architecture

A production-ready demonstration of micro-frontend architecture using Module Federation, featuring multiple frameworks (React, Vue, Angular) working together seamlessly with enterprise-grade authentication.

## 🎯 Project Overview

**MicroShop** showcases modern micro-frontend patterns used by companies like Spotify, Amazon, and IKEA. Each micro-frontend (MFE) is independently developed, deployed, and maintained by separate teams, yet works together as a cohesive application.

### Key Features

✅ **True Micro-Frontends** - Independent deployment and development  
✅ **Multi-Framework** - React, Vue, and Angular in one application  
✅ **Module Federation** - Webpack 5 runtime sharing  
✅ **Enterprise Auth** - Google OAuth, Facebook Login, SSO-ready  
✅ **Modular Architecture** - Easy to extend and maintain  
✅ **Production-Ready** - CSP, CORS, security best practices  

---

## 📁 Repository Structure

```
shell-app/
├── config/                         # Environment configurations
│   ├── dev.js                      # Development config
│   ├── prod.js                     # Production config
│   ├── sit.js                      # SIT environment config
│   └── uat.js                      # UAT environment config
│
├── node_modules/                   # Dependencies (gitignored)
│
├── public/
│   └── index.html                  # Main HTML template
│
├── src/
│   ├── auth/                       # Authentication system
│   │   ├── config/
│   │   │   └── authConfig.js       # Auth providers configuration
│   │   ├── providers/
│   │   │   ├── AuthProvider.js     # Base provider class (abstract)
│   │   │   ├── DemoAuthProvider.js # Demo login implementation
│   │   │   ├── FacebookAuthProvider.js # Facebook OAuth
│   │   │   └── GoogleAuthProvider.js   # Google OAuth
│   │   ├── authService.js          # Main authentication service
│   │   └── Login.js                # Login UI component
│   │
│   ├── config/
│   │   └── mfe-registry.js         # MFE registry configuration
│   │
│   ├── core/
│   │   └── MFELoader.js            # Generic MFE loader
│   │
│   ├── loaders/
│   │   └── AngularLoader.js        # Angular-specific MFE loader
│   │
│   ├── ui/
│   │   └── MFEUIManager.js         # MFE UI lifecycle manager
│   │
│   ├── App.js                      # Main application component
│   └── index.js                    # Application entry point
│
├── .env                            # Active environment variables (gitignored)
├── .env.dev                        # Development environment variables
├── .env.prod                       # Production environment variables
├── .env.sit                        # SIT environment variables
├── .env.uat                        # UAT environment variables
├── .gitignore                      # Git ignore rules
├── package-lock.json               # Dependency lock file
├── package.json                    # NPM dependencies and scripts
├── README.md                       # This file
└── webpack.config.js               # Webpack Module Federation config
```

### Other MFE Repositories (Separate repos)

```
products-mfe-react/     # Product catalog (React 18) - Port 3001
cart-mfe-vue/           # Shopping cart (Vue 3) - Port 3002
user-mfe-angular/       # User profile (Angular 17) - Port 3003
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/micro-frontend-shop.git
cd shell-app

# Install dependencies
npm install
```

### Environment Setup

1. **Copy environment template:**
```bash
cp .env.dev .env
```

2. **Add your OAuth credentials to `.env`:**
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
FACEBOOK_APP_ID=your-facebook-app-id
```

### Running the Application

Start all micro-frontends (requires 4 terminal windows):

```bash
# Terminal 1 - Shell App (Main Container)
cd shell-app
npm start     # Runs on http://localhost:3000

# Terminal 2 - Products MFE (React)
cd products-mfe-react
npm start     # Runs on http://localhost:3001

# Terminal 3 - Cart MFE (Vue)
cd cart-mfe-vue
npm start     # Runs on http://localhost:3002

# Terminal 4 - User MFE (Angular)
cd user-mfe-angular
npm start     # Runs on http://localhost:3003
```

Open **http://localhost:3000** in your browser.

---

## 🔐 Authentication System

### Architecture

The authentication system is located in `src/auth/` with a modular, extensible design:

```
src/auth/
├── config/
│   └── authConfig.js           # Central configuration for all providers
├── providers/
│   ├── AuthProvider.js         # Abstract base class (defines interface)
│   ├── GoogleAuthProvider.js   # Google OAuth implementation
│   ├── FacebookAuthProvider.js # Facebook OAuth implementation
│   └── DemoAuthProvider.js     # Demo login (no external service)
├── authService.js              # Main service (singleton pattern)
└── Login.js                    # Login UI component
```

### Design Philosophy

- **Open/Closed Principle** - Add new providers without modifying existing code
- **Single Responsibility** - Each provider manages only its own auth flow
- **Dependency Inversion** - Service depends on abstract AuthProvider interface
- **Strategy Pattern** - Swap authentication strategies at runtime

### Available Login Methods

| Provider | Status | Configuration Required |
|----------|--------|----------------------|
| 🔴 **Google OAuth** | ✅ Active | `GOOGLE_CLIENT_ID` |
| 🔵 **Facebook Login** | ✅ Active | `FACEBOOK_APP_ID` |
| 🎭 **Demo Login** | ✅ Active | None |
| 🔐 **Keycloak** | 📦 Ready to add | Config + new provider file |
| 🔐 **Okta** | 📦 Ready to add | Config + new provider file |

### Configuration

#### 1. Enable/Disable Providers

Edit `src/auth/config/authConfig.js`:

```javascript
const AUTH_CONFIG = {
    google: {
        enabled: true,  // Set to false to disable
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        sdkUrl: 'https://accounts.google.com/gsi/client',
        name: 'Google',
        scopes: ['profile', 'email']
    },
    facebook: {
        enabled: true,  // Set to false to disable
        appId: process.env.FACEBOOK_APP_ID || '',
        sdkUrl: 'https://connect.facebook.net/en_US/sdk.js',
        name: 'Facebook',
        version: 'v18.0',
        scopes: ['public_profile']
    },
    demo: {
        enabled: true,  // Always available for testing
        name: 'Demo'
    }
};
```

#### 2. Environment Variables

Create or edit `.env` file in root directory:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id

# Future providers
KEYCLOAK_URL=https://your-keycloak-server.com
KEYCLOAK_REALM=your-realm
KEYCLOAK_CLIENT_ID=your-keycloak-client-id
```

### Setting Up OAuth Providers

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Google Sign-In API"
4. Navigate to **Credentials** → Create **OAuth 2.0 Client ID**
5. Configure:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
6. Copy the **Client ID**
7. Add to `.env`: `GOOGLE_CLIENT_ID=your-client-id-here`

#### Facebook Login Setup

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Click **Create App** → Choose **Consumer** type
3. Add **Facebook Login** product
4. Go to **Settings** → **Basic**
5. Copy your **App ID**
6. Add to `.env`: `FACEBOOK_APP_ID=your-app-id-here`

**Important Notes:**
- Keep app in **Development Mode** for localhost testing
- `http://localhost` is automatically allowed in Development Mode
- No need to add redirect URIs manually for localhost
- For production, you'll need to submit for App Review

---

## 🔧 Adding New Authentication Providers

The modular architecture makes adding new providers simple. Just create one file!

### Step-by-Step Guide

#### Step 1: Create Provider Class

Create `src/auth/providers/KeycloakAuthProvider.js`:

```javascript
import AuthProvider from './AuthProvider';

class KeycloakAuthProvider extends AuthProvider {
    constructor(config) {
        super(config);
        this.keycloak = null;
    }

    async initialize() {
        if (!this.isConfigured()) {
            console.warn(`⚠️  ${this.name} not configured`);
            return;
        }
        // Load Keycloak SDK
        // Initialize Keycloak client
        console.log(`✅ ${this.name} initialized`);
    }

    async login() {
        // Implement Keycloak login flow
        const user = await this.keycloak.login();
        
        return this.normalizeUserData({
            id: user.sub,
            name: user.name,
            email: user.email,
            picture: user.picture
        });
    }

    async logout() {
        await this.keycloak.logout();
        console.log(`✅ Logged out from ${this.name}`);
    }

    isConfigured() {
        return this.config.url && 
               this.config.realm && 
               this.config.clientId;
    }
}

export default KeycloakAuthProvider;
```

#### Step 2: Add Configuration

Update `src/auth/config/authConfig.js`:

```javascript
const AUTH_CONFIG = {
    google: { /* existing */ },
    facebook: { /* existing */ },
    demo: { /* existing */ },
    
    // Add new provider
    keycloak: {
        enabled: true,
        url: process.env.KEYCLOAK_URL || '',
        realm: process.env.KEYCLOAK_REALM || '',
        clientId: process.env.KEYCLOAK_CLIENT_ID || '',
        name: 'Keycloak'
    }
};
```

#### Step 3: Register Provider

Update `src/auth/authService.js`:

```javascript
// Add import
import KeycloakAuthProvider from './providers/KeycloakAuthProvider';

// Register in providerClasses
const providerClasses = {
    google: GoogleAuthProvider,
    facebook: FacebookAuthProvider,
    demo: DemoAuthProvider,
    keycloak: KeycloakAuthProvider  // Add this line
};
```

#### Step 4: Update CSP

Update `config/dev.js` (and other environment configs):

```javascript
security: {
    csp: {
        'script-src': [
            // ... existing
            "https://your-keycloak-server.com"
        ],
        'connect-src': [
            // ... existing
            "https://your-keycloak-server.com"
        ]
    }
}
```

#### Step 5: Add Environment Variables

Add to `.env`:

```bash
KEYCLOAK_URL=https://your-keycloak-server.com
KEYCLOAK_REALM=your-realm
KEYCLOAK_CLIENT_ID=your-client-id
```

**That's it!** No modifications to existing providers needed. The system automatically:
- ✅ Loads your new provider
- ✅ Initializes it on startup
- ✅ Shows/hides login button based on `isConfigured()`
- ✅ Handles login/logout flows
- ✅ Normalizes user data format

---

## 🏗️ Micro-Frontend Architecture

### What is Micro-Frontend Architecture?

Micro-frontends apply the microservices concept to frontend development. The UI is composed of semi-independent fragments built by different teams using different technologies.

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Shell App (Port 3000)                     │
│              Webpack Module Federation Container              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Products    │  │     Cart     │  │      User        │  │
│  │  (React 18)  │  │   (Vue 3)    │  │  (Angular 17)    │  │
│  │  Port 3001   │  │  Port 3002   │  │   Port 3003      │  │
│  │              │  │              │  │                  │  │
│  │ • List       │  │ • Add Items  │  │ • Profile        │  │
│  │ • Details    │  │ • Checkout   │  │ • Settings       │  │
│  │ • Search     │  │ • Totals     │  │ • Preferences    │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                    Runtime Module Loading
                   Shared Dependencies (React, etc.)
```

### Component Responsibilities

#### Shell App (`src/`)
- **App.js** - Main application orchestrator
- **index.js** - Application entry point
- **auth/** - Authentication system (shared by all MFEs)
- **core/MFELoader.js** - Generic MFE loader for React/Vue
- **loaders/AngularLoader.js** - Specialized loader for Angular (zone.js handling)
- **ui/MFEUIManager.js** - Manages MFE lifecycle and rendering
- **config/mfe-registry.js** - Registry of all available MFEs

#### MFE Loaders

**Why do we need loaders?**
- React/Vue can share standard loading logic
- Angular requires special handling (zone.js, bootstrapping)
- Loaders abstract away framework-specific details

### Benefits of This Architecture

| Benefit | Description |
|---------|-------------|
| **Team Autonomy** | Each MFE has its own team, repo, and deployment |
| **Technology Freedom** | Teams choose their preferred framework |
| **Independent Deployment** | Deploy one MFE without touching others |
| **Isolated Failures** | If Cart crashes, Products still works |
| **Faster Builds** | Only rebuild the changed MFE |
| **Easy Scaling** | Scale high-traffic MFEs independently |

### Module Federation

Configured in `webpack.config.js`:

```javascript
new ModuleFederationPlugin({
    name: 'shell',
    remotes: {
        productsMFE: 'productsMFE@http://localhost:3001/remoteEntry.js',
        cartMFE: 'cartMFE@http://localhost:3002/remoteEntry.js',
    },
    shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
    },
})
```

**How it works:**
1. Shell app loads at runtime
2. Discovers available MFEs from remotes
3. Dynamically loads MFE code when needed
4. Shares common dependencies (React, etc.)

---

## 🛡️ Security

### Content Security Policy (CSP)

All environments have strict CSP configured in `config/*.js` files.

**Example from `config/dev.js`:**

```javascript
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
        ]
    },
    corsOrigins: ['*']
}
```

### Why Each CSP Directive Matters

- **`script-src`** - Controls which scripts can execute (prevents XSS)
- **`connect-src`** - Controls AJAX/fetch requests (prevents data leaks)
- **`frame-src`** - Controls iframes (OAuth popups need this)
- **`img-src`** - Controls image loading (profile pictures from OAuth)

### Authentication Security

- ✅ OAuth 2.0 standard protocols
- ✅ Session storage (not localStorage for security)
- ✅ No credentials in client code
- ✅ Environment variables for sensitive data
- ✅ CSP protection for OAuth flows
- ✅ Automatic session cleanup on logout

---

## 🌍 Environment Configuration

The application supports four environments, each with its own config file:

| File | Environment | Purpose | Default URLs |
|------|-------------|---------|--------------|
| `config/dev.js` | Development | Local development | `http://localhost:*` |
| `config/sit.js` | SIT | System Integration Testing | `http://sit.localhost:*` |
| `config/uat.js` | UAT | User Acceptance Testing | `https://*-uat.microshop.com` |
| `config/prod.js` | Production | Live environment | `https://*.microshop.com` |

### Environment Variable Files

- `.env` - Active environment (gitignored, created from template)
- `.env.dev` - Development template
- `.env.sit` - SIT template
- `.env.uat` - UAT template  
- `.env.prod` - Production template

### Switching Environments

```bash
# Development (default)
npm start

# SIT
BUILD_ENV=sit npm start

# UAT
BUILD_ENV=uat npm run build

# Production
BUILD_ENV=prod npm run build
```

---

## 📊 Design Patterns

### 1. **Open/Closed Principle** (SOLID)
**Location:** `src/auth/`
- Open for extension: Create new `*AuthProvider.js` files
- Closed for modification: Don't change `AuthProvider.js` or `authService.js`
- Benefit: Add OAuth providers without breaking existing ones

### 2. **Abstract Factory Pattern**
**Location:** `src/auth/providers/AuthProvider.js`
- Base class defines interface
- Concrete providers implement details
- Enforces consistent implementation across all providers

### 3. **Strategy Pattern**
**Location:** `src/auth/authService.js`
- Different authentication strategies (Google, Facebook, Demo)
- User selects strategy at runtime
- Easy to add new strategies

### 4. **Singleton Pattern**
**Location:** `src/auth/authService.js`
```javascript
const authService = new AuthService(AUTH_CONFIG);
export default authService;
```
- Single instance across entire application
- Shared authentication state
- Consistent user session

### 5. **Observer Pattern**
**Location:** `src/auth/authService.js` - `subscribe()` method
```javascript
authService.subscribe(({ user, isAuthenticated }) => {
    console.log('Auth state changed:', user);
});
```
- Components subscribe to auth changes
- Service notifies all listeners on state update
- Reactive state management

### 6. **Loader Pattern**
**Location:** `src/core/` and `src/loaders/`
- `MFELoader.js` - Generic loader for React/Vue
- `AngularLoader.js` - Specialized for Angular
- Abstracts framework-specific loading logic

### 7. **Module Federation Pattern**
**Location:** `webpack.config.js`
- Runtime code sharing
- Dynamic remote loading
- Shared dependency management

---

## 🧪 Testing

```bash
# Run tests for shell app
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

---

## 📦 Deployment

### Building for Production

```bash
# Build shell app
BUILD_ENV=prod npm run build

# Output will be in dist/ folder
```

### Deployment Checklist

- [ ] Update `config/prod.js` with production URLs
- [ ] Configure OAuth providers with production redirect URIs
- [ ] Set production environment variables
- [ ] Update CSP for production domains
- [ ] Configure CORS for production
- [ ] Set up CI/CD pipeline
- [ ] Configure monitoring and logging
- [ ] Test all MFEs in production environment

### Hosting Options

- **AWS S3 + CloudFront** - Static site hosting
- **Azure Blob Storage** - Static site hosting
- **Netlify** - Easy deployment with CI/CD
- **Vercel** - Optimized for modern frameworks
- **Docker + Kubernetes** - Container orchestration

---

## 🐛 Troubleshooting

### Authentication Issues

#### Provider Not Showing Up
**Symptoms:** Login button missing  
**Solutions:**
1. Check `enabled: true` in `src/auth/config/authConfig.js`
2. Verify credentials exist in `.env`
3. Check browser console for `isConfigured()` warnings
4. Restart the application (`npm start`)

#### Google Login Fails
**Symptoms:** "Invalid Client ID" or button doesn't work  
**Solutions:**
1. Verify `GOOGLE_CLIENT_ID` format: `*.apps.googleusercontent.com`
2. Check authorized JavaScript origins include `http://localhost:3000`
3. Ensure Google+ API is enabled in Google Cloud Console
4. Clear browser cache and cookies

#### Facebook Login Fails
**Symptoms:** "App Not Found" or login popup closes immediately  
**Solutions:**
1. Verify `FACEBOOK_APP_ID` is correct
2. Ensure app is in **Development Mode**
3. Check you're logged into Facebook in the same browser
4. Add yourself as a test user if needed

#### Facebook "Failed to fetch" Errors
**Symptoms:** Console errors about failed fetch requests  
**Root Cause:** CSP blocking Facebook SDK communication  
**Solution:** Ensure `config/dev.js` includes:
```javascript
'connect-src': [
    "https://*.facebook.com",
    "https://*.fbsbx.com"
],
'frame-src': [
    "https://www.facebook.com",
    "https://staticxx.facebook.com"
]
```

### MFE Loading Issues

#### MFE Not Loading
**Symptoms:** Blank screen or "Loading..." never completes  
**Solutions:**
1. Verify all 4 applications are running (check all ports)
2. Check Module Federation config in `webpack.config.js`
3. Look for CORS errors in browser console
4. Verify `remoteEntry.js` is accessible at expected URL

#### Angular MFE Issues
**Symptoms:** Angular app doesn't load or zone.js errors  
**Solutions:**
1. Check `src/loaders/AngularLoader.js` is being used
2. Verify zone.js is properly initialized
3. Check for conflicting zone.js versions

### Build Issues

#### Webpack Errors
**Symptoms:** Build fails with module not found  
**Solutions:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Check all imports use correct paths
4. Verify all dependencies are in `package.json`

#### Environment Variables Not Working
**Symptoms:** `process.env.VARIABLE` is undefined  
**Solutions:**
1. Ensure `.env` file exists in root directory
2. Restart webpack dev server after changing `.env`
3. Check `webpack.config.js` defines the variable in `DefinePlugin`
4. Variables must be prefixed properly (if required by your setup)

---

## 📚 Additional Documentation

- **`AUTH_SYSTEM_README.md`** - Detailed authentication system documentation
- **`src/auth/`** - Inline comments explain each provider
- **`config/*.js`** - Comments explain each environment setting
- **`webpack.config.js`** - Module Federation configuration explained

---

## 🤝 Contributing

### Adding a New MFE

1. Create new repository/folder for the MFE
2. Set up Module Federation in the MFE's webpack config
3. Add remote entry to shell app's `webpack.config.js`
4. Update `src/config/mfe-registry.js`
5. Create loader if needed (see `src/loaders/`)
6. Test integration with shell app

### Code Standards

- Use ES6+ features
- Follow framework-specific conventions (React/Vue/Angular)
- Write clear, descriptive comments
- Update documentation when adding features
- Test changes across all environments

---

## 📄 License

MIT License - feel free to use this project as a learning resource or template for your own micro-frontend applications.

---

## 🎯 Roadmap

### Completed ✅
- [x] Google OAuth integration
- [x] Facebook Login integration
- [x] Demo authentication
- [x] Modular provider architecture
- [x] Multi-environment configuration (dev/sit/uat/prod)
- [x] CSP security implementation
- [x] React MFE integration
- [x] Vue MFE integration
- [x] Angular MFE integration with specialized loader

### In Progress 🚧
- [ ] MFE registry improvements
- [ ] Better error boundaries
- [ ] Loading states optimization

### Planned 📋
- [ ] Keycloak SSO integration
- [ ] Okta SSO integration
- [ ] GitHub OAuth
- [ ] Microsoft/Azure AD
- [ ] Two-factor authentication (2FA)
- [ ] Refresh token support
- [ ] Session timeout handling
- [ ] Remember me functionality
- [ ] Account recovery flows
- [ ] Internationalization (i18n)
- [ ] Dark mode support

---

## 💬 Support

For questions, issues, or contributions:
- Check inline code comments
- Review `AUTH_SYSTEM_README.md` for auth details
- Open an issue on GitHub
- Review existing documentation

---

## ⭐ Acknowledgments

This project demonstrates enterprise patterns used by:
- **Spotify** - Micro-frontend architecture
- **Amazon** - Independent team deployment
- **IKEA** - Module Federation patterns
- **Zalando** - Multi-framework integration

Built with modern web technologies:
- **Webpack 5** - Module Federation
- **React 18** - Products MFE
- **Vue 3** - Cart MFE
- **Angular 17** - User MFE

---

**Made with ❤️ for the micro-frontend community**