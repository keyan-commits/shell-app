// ============================================================================
// FILE: shell-app/src/config/mfe-registry.js
// ============================================================================
// 🎯 MFE REGISTRY - SINGLE SOURCE OF TRUTH
// ============================================================================
// TO ADD A NEW MFE: Just add a new object to this array!
// No need to modify any other files except webpack.config.js
// ============================================================================

import { AngularLoader } from '../loaders/AngularLoader.js';
import { MFEUIManager } from '../ui/MFEUIManager.js';

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

const MFE_URLS = {
    products: process.env.MFE_PRODUCTS_URL || 'http://localhost:3001',
    cart: process.env.MFE_CART_URL || 'http://localhost:3002',
    user: process.env.MFE_USER_URL || 'http://localhost:3003',
    
    // ========================================================================
    // 📝 ADD NEW MFE URLS HERE
    // ========================================================================
    // reviews: process.env.MFE_REVIEWS_URL || 'http://localhost:3004',
};

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================

const isDev = process.env.BUILD_ENV === 'dev';

const ANGULAR_ALLOWED_ORIGINS = isDev 
    ? ['http://localhost:3003']
    : [
        'https://user-sit.microshop.com',
        'https://user-uat.microshop.com',
        'https://user.microshop.com'
      ];

// ============================================================================
// 🎯 MFE REGISTRY - MAIN CONFIGURATION
// ============================================================================
// Each MFE needs:
// - name: Display name
// - tech: Technology/framework
// - containerId: HTML container element ID
// - mountId: Element ID to mount into
// - port: Development port number
// - loader: Object with load() and mount() functions
// - onSuccess: Callback when MFE loads successfully
// - onError: Callback when MFE fails to load
// ============================================================================

export const MFE_REGISTRY = [
    
    // ========================================================================
    // USER PROFILE MFE (Angular)
    // ========================================================================
    // Special loader required for Angular's multi-script loading
    // ========================================================================
    {
        name: 'User Profile',
        tech: 'Angular',
        containerId: 'user-mfe-container',
        mountId: 'user-mfe',
        port: 3003,
        
        // Angular requires special loader due to multiple script files
        loader: new AngularLoader(
            MFE_URLS.user,
            'user-mfe',
            ANGULAR_ALLOWED_ORIGINS
        ),
        
        onSuccess: () => MFEUIManager.showSuccess('user-mfe-container'),
        onError: () => MFEUIManager.showError('user-mfe-container', 'User Profile', 'Angular', 3003)
    },

    // ========================================================================
    // PRODUCTS MFE (React)
    // ========================================================================
    // Uses Webpack Module Federation - direct import
    // ========================================================================
    {
        name: 'Products',
        tech: 'React',
        containerId: 'products-container',
        mountId: 'products-mfe',
        port: 3001,
        
        // Simple loader object for Module Federation MFEs
        // Webpack handles the import magic automatically
        loader: {
            // Load function: Returns a promise with the module
            load: () => import('productsMFE/ProductsApp'),
            
            // Mount function: Calls the module's mount method
            mount: (module) => module.mount('products-mfe')
        },
        
        onSuccess: () => MFEUIManager.showSuccess('products-container'),
        onError: () => MFEUIManager.showError('products-container', 'Products', 'React', 3001)
    },

    // ========================================================================
    // CART MFE (Vue)
    // ========================================================================
    // Uses Webpack Module Federation - direct import
    // ========================================================================
    {
        name: 'Cart',
        tech: 'Vue',
        containerId: 'cart-mfe-container',
        mountId: 'cart-mfe',
        port: 3002,
        
        // Simple loader object for Module Federation MFEs
        loader: {
            // Load function: Returns a promise with the module
            load: () => import('cartMFE/CartApp'),
            
            // Mount function: Calls the module's mount method
            mount: (module) => module.mount('cart-mfe')
        },
        
        onSuccess: () => MFEUIManager.showSuccess('cart-mfe-container'),
        onError: () => MFEUIManager.showError('cart-mfe-container', 'Cart', 'Vue', 3002)
    },

    // ========================================================================
    // 📝 ADD NEW MFEs HERE - TEMPLATE
    // ========================================================================
    // Copy this template to add a new React or Vue MFE
    // ========================================================================
    /*
    {
        name: 'Reviews',
        tech: 'React',
        containerId: 'reviews-container',
        mountId: 'reviews-mfe',
        port: 3004,
        
        loader: {
            // IMPORTANT: Must match webpack.config.js remote name
            load: () => import('reviewsMFE/ReviewsApp'),
            mount: (module) => module.mount('reviews-mfe')
        },
        
        onSuccess: () => MFEUIManager.showSuccess('reviews-container'),
        onError: () => MFEUIManager.showError('reviews-container', 'Reviews', 'React', 3004)
    },
    */
    // ========================================================================

];

// ============================================================================
// 📚 NOTES
// ============================================================================
//
// WHY NO ModuleFederationLoader CLASS FOR REACT/VUE?
// - Webpack Module Federation requires direct import() statements
// - These imports must be statically analyzable at build time
// - A class wrapper can't dynamically construct these imports
// - Simple inline loader objects work perfectly
//
// WHY AngularLoader CLASS?
// - Angular needs to load 4 scripts in sequence (runtime, polyfills, vendor, main)
// - Requires security validation of script sources
// - Complex orchestration logic worth encapsulating in a class
//
// ============================================================================