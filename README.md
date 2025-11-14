# Micro-Frontend with React, Vue, Angular + OAuth Login

## 📁 Repository Structure

This system consists of **4 separate repositories**:

```
micro-frontend-ecosystem/
├── shell-app/                    # Webpack Module Federation Container + Auth
├── products-mfe-react/          # React + Webpack Module Federation
├── cart-mfe-vue/                # Vue 3 + Webpack Module Federation
└── user-mfe-angular/            # Angular + Module Federation
```

## 🏗️ Repository 1: Shell Application + Auth

**Repository Name:** `shell-app`  
**Tech:** Webpack 5 Module Federation + Google OAuth

### Directory Structure
```
shell-app/
├── config/
│   ├── dev.js
│   ├── sit.js
│   ├── uat.js
│   └── prod.js
├── public/
│   ├── index.html (template)
│   └── security/
│       ├── csp-dev.js
│       ├── csp-sit.js
│       ├── csp-uat.js
│       └── csp-prod.js
├── src/
│   ├── auth/
│   ├── App.js
│   └── index.js
├── .env.dev
├── .env.sit
├── .env.uat
├── .env.prod
├── webpack.config.js
└── package.json
# Shell Application

Container application with Google OAuth authentication.

## Setup
```bash
npm install
npm start           # Uses dev config
# or
npm run start:sit   # Test with SIT config locally
npm run start:uat   # Test with UAT config locally

Build for Deployment
npm run build:dev   # Development build
npm run build:sit   # SIT build
npm run build:uat   # UAT build
npm run build:prod  # Production build
```

## Google OAuth Setup (Optional)

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google Sign-In API
4. Create OAuth 2.0 Client ID
5. Add authorized origin: http://localhost:3000
6. Copy Client ID to src/auth/authService.js (line 18)

**Note:** App works with Demo login without OAuth!

Runs on http://localhost:3000
```
--------------
# MicroShop - Micro-Frontend Architecture Guide

## 📖 Table of Contents
- [What is This Application?](#what-is-this-application)
- [Architecture Overview](#architecture-overview)
- [Repository Structure](#repository-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [How It Works](#how-it-works)
- [Adding New Micro-Frontends](#adding-new-micro-frontends)
- [Cross-MFE Communication](#cross-mfe-communication)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🎯 What is This Application?

**MicroShop** is a demonstration e-commerce application built using **Micro-Frontend Architecture**. It showcases how different teams can work independently on separate parts of an application using different technologies while creating a unified user experience.

### Key Features:
- **Multi-Framework Integration**: React, Vue, and Angular working together
- **Google OAuth Authentication**: Real login with Google or demo mode
- **Fault Isolation**: If one micro-frontend fails, others continue working
- **Independent Deployment**: Each team can deploy their MFE independently
- **Cross-MFE Communication**: Components communicate via custom events
- **Module Federation**: Uses Webpack 5's Module Federation for runtime integration

### Business Use Case:
This architecture is ideal for:
- Large organizations with multiple teams
- Applications that need to scale development teams independently
- Systems requiring different technologies for different features
- Applications where parts need to be updated without full redeployment

---

## 🏗️ Architecture Overview

### The Four Repositories

```
micro-frontend-shop/
├── shell-app/              # Container/Host Application
├── products-mfe-react/     # Product Catalog (React)
├── cart-mfe-vue/           # Shopping Cart (Vue)
└── user-mfe-angular/       # User Profile (Angular)
```

### Technology Stack

| MFE | Framework | Port | Team | Purpose |
|-----|-----------|------|------|---------|
| **Shell App** | Vanilla JS + Webpack 5 | 3000 | Platform Team | Container, Authentication, Orchestration |
| **Products MFE** | React 18 | 3001 | Catalog Team | Product listing and management |
| **Cart MFE** | Vue 3 | 3002 | Commerce Team | Shopping cart functionality |
| **User MFE** | Angular 17 | 3003 | Identity Team | User profile and authentication state |

### Communication Flow

```
┌─────────────────────────────────────────┐
│          Shell App (Port 3000)          │
│  - Authentication (Google OAuth)        │
│  - Layout & Navigation                  │
│  - MFE Orchestration                    │
└─────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
    ┌────────┐    ┌─────────┐    ┌──────────┐
    │Products│    │  Cart   │    │   User   │
    │ React  │    │   Vue   │    │ Angular  │
    │ :3001  │    │  :3002  │    │  :3003   │
    └────────┘    └─────────┘    └──────────┘
         │              │              │
         └──────────────┴──────────────┘
                     │
              Custom Events
         (addToCart, cartUpdated)
```

---

## 📁 Repository Structure

### Shell App (`shell-app/`)

```
shell-app/
├── public/
│   └── index.html              # Main HTML entry point
├── src/
│   ├── auth/
│   │   ├── authService.js      # OAuth & Demo authentication
│   │   └── Login.js            # Login screen component
│   ├── App.js                  # Main application logic & MFE loading
│   └── index.js                # Entry point
├── webpack.config.js           # Webpack & Module Federation config
├── package.json
└── README.md

--new format--
shell-app/
├── config/
│   ├── dev.js
│   ├── sit.js
│   ├── uat.js
│   └── prod.js
├── public/
│   ├── index.html (template)
│   └── security/
│       ├── csp-dev.js
│       ├── csp-sit.js
│       ├── csp-uat.js
│       └── csp-prod.js
├── src/
│   ├── auth/
│   ├── App.js
│   └── index.js
├── .env.dev
├── .env.sit
├── .env.uat
├── .env.prod
├── webpack.config.js
└── package.json
```

**Key Files:**
- `App.js`: Loads and orchestrates all MFEs, handles authentication state
- `authService.js`: Manages Google OAuth and demo login
- `webpack.config.js`: Configures Module Federation remotes

---

### Products MFE (`products-mfe-react/`)

```
products-mfe-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── ProductCard.jsx     # Individual product display
│   ├── ProductsApp.jsx         # Main products component
│   ├── bootstrap.jsx           # Mount/unmount logic
│   └── index.js                # Entry point
├── webpack.config.js           # Module Federation config
├── package.json
└── README.md
```

**Key Responsibilities:**
- Display product catalog
- Handle "Add to Cart" button clicks
- Emit `addToCart` custom events
- Can run standalone on port 3001

---

### Cart MFE (`cart-mfe-vue/`)

```
cart-mfe-vue/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── CartItem.vue        # Individual cart item
│   ├── CartApp.vue             # Main cart component
│   ├── bootstrap.js            # Mount logic
│   └── main.js                 # Entry point
├── webpack.config.js           # Module Federation config
├── package.json
└── README.md
```

**Key Responsibilities:**
- Listen for `addToCart` events
- Manage cart state (add/remove items)
- Calculate totals
- Emit `cartUpdated` events
- Can run standalone on port 3002

---

### User Profile MFE (`user-mfe-angular/`)

```
user-mfe-angular/
├── src/
│   ├── app/
│   │   ├── user-profile/
│   │   │   ├── user-profile.component.ts
│   │   │   ├── user-profile.component.html
│   │   │   └── user-profile.component.css
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── main.ts                 # Entry point & mount function
│   └── index.html
├── angular.json                # Angular CLI config
├── tsconfig.json               # TypeScript config
├── package.json
└── README.md
```

**Key Responsibilities:**
- Display logged-in user information
- Listen for `cartUpdated` events
- Show cart item count
- Read user from sessionStorage
- Can run standalone on port 3003

---

## 🚀 Installation & Setup

### Prerequisites

```bash
# Required
node --version  # v18 or higher
npm --version   # v9 or higher

# Optional (for Google OAuth)
# Google Cloud Console account
```

### Initial Setup

**Step 1: Clone or create the repositories**

```bash
mkdir micro-frontend-shop
cd micro-frontend-shop

# Create all 4 directories
mkdir shell-app products-mfe-react cart-mfe-vue user-mfe-angular
```

**Step 2: Copy code into each repository**

Copy the respective files from the documentation into each directory.

**Step 3: Install dependencies**

```bash
# Install for Shell App
cd shell-app
npm install

# Install for Products MFE
cd ../products-mfe-react
npm install

# Install for Cart MFE
cd ../cart-mfe-vue
npm install

# Install for User MFE
cd ../user-mfe-angular
npm install
```

### Google OAuth Setup (Optional)

The app works with **Demo Login** out of the box. For production Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "MicroShop"
3. Enable **Google Sign-In API**
4. Create **OAuth 2.0 Client ID**:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
5. Copy the **Client ID**
6. Update `shell-app/src/auth/authService.js`:
   ```javascript
   const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
   ```

---

## 🏃 Running the Application

### Development Mode

You need **4 terminal windows** running simultaneously:

```bash
# Terminal 1 - Shell App (Port 3000)
cd shell-app
npm start

# Terminal 2 - Products MFE (Port 3001)
cd products-mfe-react
npm start

# Terminal 3 - Cart MFE (Port 3002)
cd cart-mfe-vue
npm start

# Terminal 4 - User MFE (Port 3003)
cd user-mfe-angular
npm start
```

### Access Points

| URL | Description |
|-----|-------------|
| http://localhost:3000 | **Main application** (Shell with all MFEs) |
| http://localhost:3001 | Products MFE (standalone) |
| http://localhost:3002 | Cart MFE (standalone) |
| http://localhost:3003 | User Profile MFE (standalone) |

### Testing the Application

1. **Open** http://localhost:3000
2. **Click** "Try Demo Account" (or sign in with Google)
3. **Add products** to cart
4. **Observe** cart count updates in User Profile (Angular)
5. **Test fault isolation**: Stop one MFE (Ctrl+C) and refresh - others still work!

### Stopping All Servers

```bash
# In each terminal window
Ctrl + C

# Or kill all at once (Mac/Linux)
lsof -ti:3000,3001,3002,3003 | xargs kill -9
```

---

## ⚙️ How It Works

### 1. Application Bootstrap Flow

```
User visits localhost:3000
    ↓
Shell App loads
    ↓
Authentication check
    ↓
If not authenticated → Show Login screen
If authenticated → Load all MFEs
    ↓
Shell dynamically imports MFEs via Module Federation
    ↓
Each MFE mounts into its designated container
    ↓
Application ready
```

### 2. Module Federation (Webpack 5)

**Shell App webpack.config.js:**
```javascript
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    productsMFE: 'productsMFE@http://localhost:3001/remoteEntry.js',
    cartMFE: 'cartMFE@http://localhost:3002/remoteEntry.js',
  },
})
```

**Products MFE webpack.config.js:**
```javascript
new ModuleFederationPlugin({
  name: 'productsMFE',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductsApp': './src/bootstrap',
  },
})
```

This allows the shell to dynamically load MFEs at **runtime**, not build time.

### 3. Cross-MFE Communication

**Products MFE (React) - Emitting Event:**
```javascript
// When user clicks "Add to Cart"
window.dispatchEvent(
  new CustomEvent('addToCart', { 
    detail: product 
  })
);
```

**Cart MFE (Vue) - Listening for Event:**
```javascript
// Listen for products being added
window.addEventListener('addToCart', (event) => {
  cartItems.value.push(event.detail);
  
  // Notify others about cart update
  window.dispatchEvent(
    new CustomEvent('cartUpdated', {
      detail: { itemCount: cartItems.value.length }
    })
  );
});
```

**User MFE (Angular) - Listening for Updates:**
```typescript
// Listen for cart changes
ngOnInit() {
  this.cartListener = (event: any) => {
    this.cartItemCount = event.detail.itemCount;
  };
  window.addEventListener('cartUpdated', this.cartListener);
}
```

### 4. Authentication Flow

```
1. User visits app → authService checks sessionStorage
2. If no session → Show login screen
3. User clicks "Demo Login" or "Google Sign-In"
4. authService stores user in sessionStorage
5. authService notifies all subscribers
6. App.js receives auth state change
7. App re-renders with authenticated view
8. All MFEs load
9. User MFE reads user from sessionStorage
```

### 5. Fault Isolation

```javascript
// In shell-app/src/App.js
async loadMicroFrontends() {
  for (const mfe of mfes) {
    try {
      const module = await mfe.import();
      mfe.mount(module);
      loadedCount++;
    } catch (error) {
      failedCount++;
      // Show error UI but continue loading others
      this.showMFEStatus(mfe.containerId, 'error', ...);
    }
  }
}
```

If one MFE fails to load, the shell catches the error and shows a friendly message while other MFEs continue working.

---

## 🆕 Adding New Micro-Frontends

### Example: Adding a "Reviews MFE" (React)

**Step 1: Create the new MFE repository**

```bash
cd micro-frontend-shop
mkdir reviews-mfe-react
cd reviews-mfe-react
```

**Step 2: Create package.json**

```json
{
  "name": "reviews-mfe-react",
  "version": "1.0.0",
  "scripts": {
    "start": "npx webpack serve",
    "build": "npx webpack --mode production"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-react": "^7.22.0",
    "babel-loader": "^9.1.3",
    "html-webpack-plugin": "^5.5.3",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1"
  }
}
```

**Step 3: Create webpack.config.js**

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    port: 3004, // New port
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    publicPath: 'http://localhost:3004/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'reviewsMFE',
      filename: 'remoteEntry.js',
      exposes: {
        './ReviewsApp': './src/bootstrap',
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
```

**Step 4: Create the component**

```javascript
// src/ReviewsApp.jsx
import React from 'react';

export default function ReviewsApp() {
  return (
    <div>
      <h2>Product Reviews</h2>
      <p>Reviews will appear here...</p>
    </div>
  );
}

// src/bootstrap.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import ReviewsApp from './ReviewsApp';

export function mount(elementId) {
  const container = document.getElementById(elementId);
  const root = createRoot(container);
  root.render(<ReviewsApp />);
}

// src/index.js
import('./bootstrap');
```

**Step 5: Update Shell App**

In `shell-app/webpack.config.js`, add the new remote:

```javascript
remotes: {
  productsMFE: 'productsMFE@http://localhost:3001/remoteEntry.js',
  cartMFE: 'cartMFE@http://localhost:3002/remoteEntry.js',
  reviewsMFE: 'reviewsMFE@http://localhost:3004/remoteEntry.js', // NEW
},
```

In `shell-app/src/App.js`, add to the MFEs array:

```javascript
const mfes = [
  // ... existing MFEs
  {
    name: 'Reviews',
    tech: 'React',
    import: () => import('reviewsMFE/ReviewsApp'),
    mount: (module) => module.mount('reviews-mfe'),
    containerId: 'reviews-container',
    port: 3004
  }
];
```

Add the container in the render method:

```javascript
<div id="reviews-container" style="...">
  <div style="...">
    📦 reviews-mfe-react @ localhost:3004 | Tech: React
  </div>
  <div style="padding: 20px;">
    <div id="reviews-mfe"></div>
  </div>
</div>
```

**Step 6: Run the new MFE**

```bash
cd reviews-mfe-react
npm install
npm start
```

Now refresh localhost:3000 and you'll see the Reviews MFE!

---

## 📡 Cross-MFE Communication

### Event-Based Communication Pattern

**Best Practices:**
1. Use descriptive event names (e.g., `product.selected`, `cart.updated`)
2. Always include relevant data in `event.detail`
3. Clean up event listeners in component unmount/destroy
4. Document all events in a shared events catalog

### Example: Product Selection Event

**1. Define the event contract:**

```javascript
// docs/events.md
/**
 * Event: product.selected
 * Emitted by: Products MFE
 * Payload: { id, name, price, image }
 * Listeners: Reviews MFE, Cart MFE
 */
```

**2. Emit from Products MFE:**

```javascript
function handleProductClick(product) {
  window.dispatchEvent(
    new CustomEvent('product.selected', {
      detail: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }
    })
  );
}
```

**3. Listen in Reviews MFE:**

```javascript
useEffect(() => {
  const handler = (event) => {
    setSelectedProduct(event.detail);
    loadReviews(event.detail.id);
  };
  
  window.addEventListener('product.selected', handler);
  
  return () => {
    window.removeEventListener('product.selected', handler);
  };
}, []);
```

### Alternative: Shared State Management

For more complex state, consider:
- **Redux** with shared store
- **RxJS** BehaviorSubjects
- **Zustand** or other lightweight state managers

Example with a shared state service:

```javascript
// shared-state-service (separate npm package)
class StateService {
  constructor() {
    this.state = { cart: [], user: null };
    this.listeners = [];
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }
  
  getState() {
    return this.state;
  }
}

export default new StateService();
```

---

## 🚢 Deployment

### Production Build

**Step 1: Build all MFEs**

```bash
# Build Shell
cd shell-app
npm run build

# Build Products
cd ../products-mfe-react
npm run build

# Build Cart
cd ../cart-mfe-vue
npm run build

# Build User
cd ../user-mfe-angular
npm run build
```

**Step 2: Deploy to separate hosts**

Each MFE should be deployed to its own domain or subdomain:

```
shell-app         → https://app.microshop.com
products-mfe      → https://products.microshop.com
cart-mfe          → https://cart.microshop.com
user-mfe          → https://user.microshop.com
```

**Step 3: Update webpack configs with production URLs**

```javascript
// shell-app/webpack.config.js
remotes: {
  productsMFE: 'productsMFE@https://products.microshop.com/remoteEntry.js',
  cartMFE: 'cartMFE@https://cart.microshop.com/remoteEntry.js',
}
```

### Deployment Platforms

| Platform | Best For | Notes |
|----------|----------|-------|
| **AWS S3 + CloudFront** | Static hosting | Cost-effective, CDN included |
| **Netlify** | Simple deployments | Great DX, automatic HTTPS |
| **Vercel** | Next.js/React apps | Excellent for React MFEs |
| **Azure Static Web Apps** | Enterprise | Good for Angular MFEs |
| **Google Cloud Storage** | GCP ecosystem | Integrates with Google OAuth |

### CI/CD Pipeline Example (GitHub Actions)

```yaml
# .github/workflows/deploy-products-mfe.yml
name: Deploy Products MFE

on:
  push:
    branches: [main]
    paths:
      - 'products-mfe-react/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./products-mfe-react
        run: npm ci
      
      - name: Build
        working-directory: ./products-mfe-react
        run: npm run build
      
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: products-microshop
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: 'products-mfe-react/dist'
```

### Environment Configuration

**Use environment variables for different stages:**

```javascript
// webpack.config.js
const isProd = process.env.NODE_ENV === 'production';
const baseUrl = isProd 
  ? 'https://products.microshop.com'
  : 'http://localhost:3001';

module.exports = {
  output: {
    publicPath: baseUrl,
  },
  // ...
};
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Problem:** One or more MFEs aren't running.

**Solution:**
```bash
# Check which ports are in use
lsof -i :3000
lsof -i :3001
lsof -i :3002
lsof -i :3003

# Start the missing MFE
cd <mfe-directory>
npm start
```

---

#### 2. "Module not found: Error: Can't resolve 'productsMFE/ProductsApp'"

**Problem:** Shell app can't find the remote MFE.

**Solution:**
1. Verify the MFE is running on the correct port
2. Check `webpack.config.js` remotes configuration
3. Clear browser cache and restart

```bash
# Restart all servers
# Stop all (Ctrl+C in each terminal)
# Then start again
```

---

#### 3. "TypeError: Cannot read property 'mount' of undefined"

**Problem:** MFE doesn't expose the mount function correctly.

**Solution:**
Check `bootstrap.jsx/js` exports:
```javascript
// Must export 'mount' function
export function mount(elementId) {
  // mounting logic
}
```

---

#### 4. CORS Errors

**Problem:** Cross-origin resource sharing blocked.

**Solution:**
Add CORS headers to webpack dev server:

```javascript
// webpack.config.js
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
}
```

---

#### 5. Angular "app-root" not found

**Problem:** Angular can't find its bootstrap element.

**Solution:**
Ensure `main.ts` creates the element:

```typescript
if (targetElement && containerId) {
  const appRoot = document.createElement('app-root');
  targetElement.appendChild(appRoot);
}
```

---

#### 6. Styles Not Loading

**Problem:** CSS not applied to components.

**Solution:**
- **React**: Use CSS modules or styled-components
- **Vue**: Scoped styles should work automatically
- **Angular**: Check `styleUrls` in component decorator

---

#### 7. Blank Screen After Login

**Problem:** MFEs load but don't render.

**Solution:**
1. Open browser DevTools console
2. Check for JavaScript errors
3. Verify mount functions are being called
4. Check if containers exist in DOM

```javascript
// Add debugging
console.log('Container:', document.getElementById('products-mfe'));
```

---

### Debugging Tips

**1. Enable Verbose Logging:**

```javascript
// In shell-app/src/App.js
console.log('🔍 Debug: Loading MFE:', mfe.name);
console.log('🔍 Debug: Container exists:', !!document.getElementById(mfe.containerId));
```

**2. Test MFEs in Isolation:**

Visit each MFE directly:
- http://localhost:3001 (Products)
- http://localhost:3002 (Cart)
- http://localhost:3003 (User)

If they don't work standalone, fix them first before integrating.

**3. Check Network Tab:**

In DevTools → Network:
- Look for `remoteEntry.js` files
- Check if they return 200 status
- Verify correct URLs

**4. Module Federation Debug:**

```javascript
// In webpack.config.js
optimization: {
  runtimeChunk: false, // Set to true for debugging
}
```

---

## 📚 Best Practices

### 1. Repository Organization

**Monorepo vs. Polyrepo:**

| Approach | Pros | Cons |
|----------|------|------|
| **Monorepo** | Easier coordination, shared tooling | Potential merge conflicts, large repo |
| **Polyrepo** | True independence, clear ownership | More complex coordination |

**Recommendation:** Use **polyrepo** for true micro-frontend independence.

---

### 2. Versioning Strategy

**Semantic Versioning for MFEs:**

```json
// package.json
{
  "version": "1.2.3"
  //         │ │ │
  //         │ │ └─── Patch: Bug fixes
  //         │ └───── Minor: New features (backward compatible)
  //         └─────── Major: Breaking changes
}
```

**Version Pinning in Shell:**

```javascript
// webpack.config.js - Pin to specific versions
remotes: {
  productsMFE: 'productsMFE@https://cdn.app.com/v1.2.3/remoteEntry.js',
}
```

---

### 3. Error Boundaries

**React Error Boundary:**

```javascript
class MFEErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, info) {
    console.error('MFE Error:', error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>This feature is temporarily unavailable.</div>;
    }
    return this.props.children;
  }
}
```

---

### 4. Performance Optimization

**Code Splitting:**

```javascript
// Load MFEs on demand, not upfront
const loadProducts = () => import('productsMFE/ProductsApp');

// Only load when needed
if (userNavigatedToProducts) {
  loadProducts().then(module => module.mount('container'));
}
```

**Preloading:**

```html
<!-- In shell index.html -->
<link rel="preload" href="http://localhost:3001/remoteEntry.js" as="script">
```

**Caching:**

```javascript
// webpack.config.js
output: {
  filename: '[name].[contenthash].js', // Cache busting
}
```

---

### 5. Testing Strategy

**Unit Tests:** Test components in isolation

```javascript
// products-mfe-react/src/ProductCard.test.jsx
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

test('displays product name', () => {
  render(<ProductCard product={{ name: 'iPhone' }} />);
  expect(screen.getByText('iPhone')).toBeInTheDocument();
});
```

**Integration Tests:** Test cross-MFE communication

```javascript
test('adding to cart updates user profile', async () => {
  // Mount all MFEs
  await mountProducts();
  await mountCart();
  await mountUser();
  
  // Trigger add to cart
  fireEvent.click(screen.getByText('Add to Cart'));
  
  // Verify cart updated
  await waitFor(() => {
    expect(screen.getByText('1 items')).toBeInTheDocument();
  });
});
```

**E2E Tests:** Test full user flows

```javascript
// Using Cypress or Playwright
describe('Shopping Flow', () => {
  it('should add product and checkout', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-testid="demo-login"]').click();
    cy.get('[data-testid="product-1"] button').click();
    cy.get('[data-testid="cart-count"]').should('contain', '1');
  });
});
```

---

### 6. Security Considerations

**Content Security Policy:**

```html
<!-- In shell index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' http://localhost:3001 http://localhost:3002 http://localhost:3003">
```

**Authentication Token Sharing:**

```javascript
// Don't store sensitive tokens in sessionStorage
// Use httpOnly cookies instead

// authService.js
async login(credentials) {
  const response = await fetch('/api/login', {
    credentials: 'include', // Include cookies
  });
  // Token stored in httpOnly cookie by backend
}
```

**CORS Configuration:**

```javascript
// In production, be specific about origins
headers: {
  'Access-Control-Allow-Origin': 'https://app.microshop.com',
  'Access-Control-Allow-Credentials': 'true'
}
```

---

### 7. Monitoring & Observability

**Error Tracking:**

```javascript
// Integrate Sentry or similar
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN",
  environment: process.env.NODE_ENV,
});

// In each MFE
try {
  await loadMFE();
} catch (error) {
  Sentry.captureException(error, {
    tags: { mfe: 'products-mfe' }
  });
}
```

**Performance Monitoring:**

```javascript
// Measure MFE load times
const start = performance.now();
await import('productsMFE/ProductsApp');
const loadTime = performance.now() - start;

console.log(`Products MFE loaded in ${loadTime}ms`);
```

---

### 8. Documentation

**Maintain these documents:**

1. **Architecture Decision Records (ADRs)**
   ```
   docs/adr/001-use-module-federation.md
   docs/adr/002-event-based-communication.md
   ```

2. **API/Event Contracts**
   ```
   docs/events.md        # All custom events
   docs/shared-types.md  # TypeScript types
   ```

3. **Runbooks**
   ```
   docs/runbooks/deploy-new-mfe.md
   docs/runbooks/rollback-procedure.md
   ```

4. **Team Ownership**
   ```
   docs/CODEOWNERS
   products-mfe-react/  @catalog-team
   cart-mfe-vue/        @commerce-team
   ```

---

## 🎓 Learning Resources

### Micro-Frontend Patterns
- [Micro Frontends](https://micro-frontends.org/) - martinfowler.com
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)
- [Single-SPA Documentation](https://single-spa.js.org/)

### Webpack Module Federation
- [Webpack 5 Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Practical Module Federation Book](https://module-federation.github.io/)

### Framework-Specific
- [React Documentation](https://react.dev/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Angular Documentation](https://angular.io/)

---

## 📞 Support & Contribution

### Getting Help

1. Check the [Troubleshooting](#troubleshooting) section
2. Review browser console for error messages
3. Test MFEs individually before integration
4. Check network tab for failed requests

### Contributing

When adding features:
1. Update this documentation
2. Add tests for new functionality
3. Ensure backward compatibility
4. Update version numbers appropriately
5. Document breaking changes

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 Conclusion

You now have a fully functional micro-frontend architecture that demonstrates:

✅ **Multiple frameworks** working together seamlessly  
✅ **Independent development** and deployment  
✅ **Fault isolation** - resilient to individual failures  
✅ **Real-world patterns** - authentication, communication, state management  
✅ **Scalable architecture** - easy to add new MFEs  

**Next Steps:**
1. Experiment with stopping/starting individual MFEs
2. Add new features to existing MFEs
3. Create a new MFE from scratch
4. Deploy to production
5. Add monitoring and analytics
6. Implement more sophisticated state management

**Happy coding!** 🚀

---

*Last updated: November 2025*  
*For questions or issues, refer to the troubleshooting section or consult the team documentation.*