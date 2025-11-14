// ============================================================================
// SHELL APPLICATION - MICRO-FRONTEND ORCHESTRATOR
// ============================================================================
// This file manages loading and coordination of all micro-frontends (MFEs)
//
// QUICK START GUIDE:
// 1. To add a new MFE: Go to "MFE REGISTRY" section below
// 2. Add your MFE configuration to the array
// 3. That's it! The shell will handle the rest automatically
// ============================================================================

import authService from './auth/authService';
import Login from './auth/Login';

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================
// These URLs come from webpack config based on BUILD_ENV (dev/sit/uat/prod)
// Fallback to localhost if not set (for local development)
// ============================================================================

const MFE_URLS = {
    products: process.env.MFE_PRODUCTS_URL || 'http://localhost:3001',
    cart: process.env.MFE_CART_URL || 'http://localhost:3002',
    user: process.env.MFE_USER_URL || 'http://localhost:3003',
    
    // ========================================================================
    // 📝 ADD NEW MFE URLS HERE
    // ========================================================================
    // Example:
    // reviews: process.env.MFE_REVIEWS_URL || 'http://localhost:3004',
    // checkout: process.env.MFE_CHECKOUT_URL || 'http://localhost:3005',
    // ========================================================================
};

// ============================================================================
// MAIN APPLICATION CLASS
// ============================================================================

export default class App {
    constructor() {
        this.isAuthenticated = false;
        this.loginScreen = new Login();
        
        // Subscribe to authentication state changes
        authService.subscribe((authState) => {
            this.isAuthenticated = authState.isAuthenticated;
            this.render();
            
            if (this.isAuthenticated) {
                this.loadMicroFrontends();
            }
        });
    }

    // ========================================================================
    // RENDER METHOD - Builds the UI Layout
    // ========================================================================
    
    render() {
        const root = document.getElementById('root');
        
        // Show login screen if not authenticated
        if (!this.isAuthenticated) {
            this.loginScreen.render('root');
            return;
        }

        // Build authenticated application layout
        root.innerHTML = `
            <div style="min-height: 100vh; background: #f5f5f5;">
                
                <!-- ======================================================= -->
                <!-- HEADER - Navigation Bar                                 -->
                <!-- ======================================================= -->
                <header style="background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 15px 20px; margin-bottom: 20px; position: sticky; top: 0; z-index: 100;">
                    <div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🛍️</div>
                            <div>
                                <h1 style="color: #333; font-size: 22px; margin: 0;">MicroShop</h1>
                                <p style="font-size: 11px; color: #999; margin: 0;">Micro-Frontend Architecture</p>
                            </div>
                        </div>
                        <button id="logout-btn" style="
                            padding: 10px 24px;
                            background: #f44336;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 14px;
                            transition: all 0.3s;
                        "
                        onmouseover="this.style.background='#d32f2f'"
                        onmouseout="this.style.background='#f44336'">
                            Logout
                        </button>
                    </div>
                </header>

                <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px 40px;">
                    
                    <!-- ======================================================= -->
                    <!-- USER PROFILE MFE (Angular)                              -->
                    <!-- Full width container at the top                         -->
                    <!-- ======================================================= -->
                    <div id="user-mfe-container" style="background: white; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                        <div style="background: #f8f9fa; padding: 8px 20px; border-bottom: 1px solid #e0e0e0;">
                            <span style="font-size: 11px; color: #666; font-family: 'Courier New', monospace; font-weight: 600;">
                                📦 user-mfe-angular @ localhost:3003 | Tech: Angular 17
                            </span>
                        </div>
                        <div style="padding: 20px;">
                            <div id="user-mfe"></div>
                        </div>
                    </div>

                    <!-- ======================================================= -->
                    <!-- TWO-COLUMN LAYOUT                                       -->
                    <!-- Products (left) and Cart (right)                       -->
                    <!-- ======================================================= -->
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                        
                        <!-- PRODUCTS MFE (React) -->
                        <div id="products-container" style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                            <div style="background: #f8f9fa; padding: 8px 20px; border-bottom: 1px solid #e0e0e0;">
                                <span style="font-size: 11px; color: #666; font-family: 'Courier New', monospace; font-weight: 600;">
                                    📦 products-mfe-react @ localhost:3001 | Tech: React 18
                                </span>
                            </div>
                            <div style="padding: 20px;">
                                <div id="products-mfe"></div>
                            </div>
                        </div>

                        <!-- CART MFE (Vue) -->
                        <div id="cart-mfe-container" style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                            <div style="background: #f8f9fa; padding: 8px 20px; border-bottom: 1px solid #e0e0e0;">
                                <span style="font-size: 11px; color: #666; font-family: 'Courier New', monospace; font-weight: 600;">
                                    📦 cart-mfe-vue @ localhost:3002 | Tech: Vue 3
                                </span>
                            </div>
                            <div style="padding: 20px;">
                                <div id="cart-mfe"></div>
                            </div>
                        </div>
                        
                        <!-- ================================================== -->
                        <!-- 📝 ADD NEW MFE CONTAINERS HERE                     -->
                        <!-- ================================================== -->
                        <!-- Example: Reviews MFE Container
                        <div id="reviews-container" style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                            <div style="background: #f8f9fa; padding: 8px 20px; border-bottom: 1px solid #e0e0e0;">
                                <span style="font-size: 11px; color: #666; font-family: 'Courier New', monospace; font-weight: 600;">
                                    📦 reviews-mfe-react @ localhost:3004 | Tech: React
                                </span>
                            </div>
                            <div style="padding: 20px;">
                                <div id="reviews-mfe"></div>
                            </div>
                        </div>
                        -->
                        <!-- ================================================== -->
                        
                    </div>
                </div>
            </div>
        `;

        // Attach logout button handler
        document.getElementById('logout-btn').addEventListener('click', () => {
            authService.logout();
        });
    }

    // ========================================================================
    // 🎯 MFE REGISTRY - MAIN CONFIGURATION POINT
    // ========================================================================
    // This is where you register all micro-frontends
    // Each MFE needs a configuration object with these properties
    // ========================================================================
    
    async loadMicroFrontends() {
        
        // ====================================================================
        // 📋 MFE CONFIGURATION ARRAY
        // ====================================================================
        // ADD YOUR NEW MICRO-FRONTENDS HERE!
        // Just copy-paste an existing entry and modify it
        // ====================================================================
        
        const mfes = [
            // ================================================================
            // USER PROFILE MFE (Angular)
            // ================================================================
            {
                // Human-readable name (used in logs and error messages)
                name: 'User Profile',
                
                // Technology/Framework used
                tech: 'Angular',
                
                // How to load this MFE (special Angular loader)
                import: () => this.loadAngularMFE(),
                
                // How to mount (Angular mounts itself)
                mount: () => {},
                
                // Container ID in the HTML (must match render() method above)
                containerId: 'user-mfe-container',
                
                // Development port number
                port: 3003
            },
            
            // ================================================================
            // PRODUCTS MFE (React)
            // ================================================================
            {
                name: 'Products',
                tech: 'React',
                
                // Webpack Module Federation import
                // Format: import('remoteName/exposedModule')
                import: () => import('productsMFE/ProductsApp'),
                
                // Mount function expects the module's mount function
                mount: (module) => module.mount('products-mfe'),
                
                containerId: 'products-container',
                port: 3001
            },
            
            // ================================================================
            // CART MFE (Vue)
            // ================================================================
            {
                name: 'Cart',
                tech: 'Vue',
                
                // Webpack Module Federation import
                import: () => import('cartMFE/CartApp'),
                
                // Mount function for Vue
                mount: (module) => module.mount('cart-mfe'),
                
                containerId: 'cart-mfe-container',
                port: 3002
            },
            
            // ================================================================
            // 📝 ADD NEW MFEs HERE - Template Below
            // ================================================================
            /*
            {
                // Step 1: Give it a descriptive name
                name: 'Reviews',
                
                // Step 2: Specify the technology
                tech: 'React',
                
                // Step 3: Import statement (must match webpack.config.js remote name)
                import: () => import('reviewsMFE/ReviewsApp'),
                
                // Step 4: Mount function (call the MFE's mount with container ID)
                mount: (module) => module.mount('reviews-mfe'),
                
                // Step 5: Container ID (must match HTML element ID in render())
                containerId: 'reviews-container',
                
                // Step 6: Development port
                port: 3004
            },
            */
            // ================================================================
            
        ];

        // ====================================================================
        // MFE LOADING LOGIC
        // ====================================================================
        // Don't modify this section - it automatically loads all MFEs above
        // ====================================================================
        
        let loadedCount = 0;
        let failedCount = 0;

        // Loop through each MFE and try to load it
        for (const mfe of mfes) {
            try {
                console.log(`🔄 Loading ${mfe.name} MFE (${mfe.tech})...`);
                
                // Dynamically import the MFE
                const module = await mfe.import();
                
                // Mount the MFE
                mfe.mount(module);
                
                loadedCount++;
                console.log(`✅ ${mfe.name} MFE loaded successfully`);
                
                // Show success indicator in the UI
                this.showMFEStatus(mfe.containerId, 'success', mfe.name, mfe.tech);
                
            } catch (error) {
                failedCount++;
                console.error(`❌ Failed to load ${mfe.name} MFE:`, error.message);
                
                // Show error message in the UI (app continues working!)
                this.showMFEStatus(mfe.containerId, 'error', mfe.name, mfe.tech, mfe.port);
            }
        }

        // Summary log
        console.log(`\n📊 MFE Load Summary: ${loadedCount} loaded, ${failedCount} failed`);
        
        if (failedCount > 0) {
            console.log('\n💡 Tip: Some MFEs failed to load, but the app continues working!');
            console.log('This demonstrates fault isolation in micro-frontend architecture.');
        }
    }

    // ========================================================================
    // ANGULAR MFE LOADER (Special Handling)
    // ========================================================================
    // Angular requires loading multiple script files in sequence
    // This method handles the complex loading process with security checks
    // ========================================================================
    
    loadAngularMFE() {
        return new Promise((resolve, reject) => {
            
            // ================================================================
            // SECURITY: Validate Script Origin
            // ================================================================
            // Only allow loading Angular from trusted sources
            // ================================================================
            
            const baseUrl = MFE_URLS.user;
            const isDev = process.env.BUILD_ENV === 'dev';
            
            // Define allowed origins based on environment
            const ALLOWED_ORIGINS = isDev 
                ? ['http://localhost:3003'] // Development
                : [
                    'https://user-sit.microshop.com',  // SIT
                    'https://user-uat.microshop.com',  // UAT
                    'https://user.microshop.com'       // Production
                  ];
            
            // Validate the origin
            try {
                const origin = new URL(baseUrl).origin;
                
                if (!ALLOWED_ORIGINS.includes(origin)) {
                    const error = `Security Error: Untrusted Angular MFE origin: ${origin}`;
                    console.error('🚨', error);
                    console.log('📋 Allowed origins:', ALLOWED_ORIGINS);
                    reject(new Error(error));
                    return;
                }
                
                console.log('✅ Security check passed for:', origin);
            } catch (error) {
                reject(new Error('Invalid Angular MFE URL format'));
                return;
            }
            
            // ================================================================
            // Check if Angular is Already Loaded
            // ================================================================
            
            if (window.mountUserMFE) {
                window.mountUserMFE('user-mfe');
                resolve({});
                return;
            }

            // ================================================================
            // Script Loading Helper
            // ================================================================
            // Creates a secure script tag with proper attributes
            // ================================================================
            
            const createSecureScript = (filename) => {
                const script = document.createElement('script');
                script.src = `${baseUrl}/${filename}`;
                script.defer = true;
                script.crossOrigin = 'anonymous'; // Enable CORS
                
                // Error handling
                script.onerror = () => {
                    console.error(`❌ Failed to load Angular script: ${filename}`);
                };
                
                return script;
            };

            // ================================================================
            // Load Angular Scripts in Sequence
            // ================================================================
            // Order matters! runtime → polyfills → vendor → main
            // ================================================================

            // 1. Load runtime.js
            const runtime = createSecureScript('runtime.js');
            
            runtime.onload = () => {
                // 2. Load polyfills.js
                const polyfills = createSecureScript('polyfills.js');
                
                polyfills.onload = () => {
                    // 3. Load vendor.js
                    const vendor = createSecureScript('vendor.js');
                    
                    vendor.onload = () => {
                        // 4. Load main.js
                        const main = createSecureScript('main.js');
                        
                        main.onload = () => {
                            // Give Angular time to initialize
                            setTimeout(() => {
                                if (window.mountUserMFE) {
                                    window.mountUserMFE('user-mfe');
                                    resolve({});
                                } else {
                                    reject(new Error('Angular mount function not available'));
                                }
                            }, 1500);
                        };
                        main.onerror = () => reject(new Error('Failed to load main.js'));
                        document.body.appendChild(main);
                    };
                    vendor.onerror = () => reject(new Error('Failed to load vendor.js'));
                    document.body.appendChild(vendor);
                };
                polyfills.onerror = () => reject(new Error('Failed to load polyfills.js'));
                document.body.appendChild(polyfills);
            };
            runtime.onerror = () => reject(new Error('Failed to load runtime.js'));
            document.body.appendChild(runtime);
        });
    }

    // ========================================================================
    // MFE STATUS DISPLAY
    // ========================================================================
    // Shows success/error messages in the MFE containers
    // Provides user-friendly feedback when MFEs load or fail
    // ========================================================================
    
    showMFEStatus(containerId, status, name, tech, port) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const containerDiv = container.closest('[style*="background: white"]');
        if (!containerDiv) return;

        if (status === 'success') {
            // ============================================================
            // SUCCESS: Change header background to green
            // ============================================================
            const header = containerDiv.querySelector('[style*="background: #f8f9fa"]');
            if (header) {
                header.style.background = '#e8f5e9';
            }
            
        } else if (status === 'error') {
            // ============================================================
            // ERROR: Show friendly error message
            // ============================================================
            const mfeContent = containerDiv.querySelector('[style*="padding: 20px"]');
            if (mfeContent) {
                mfeContent.innerHTML = `
                    <div style="
                        text-align: center;
                        padding: 60px 20px;
                        background: #fff3e0;
                        border-radius: 8px;
                        border: 2px dashed #ff9800;
                    ">
                        <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
                        <h3 style="color: #e65100; margin-bottom: 10px; font-size: 18px;">
                            ${name} MFE Unavailable
                        </h3>
                        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                            The ${name} micro-frontend (${tech}) is currently not responding.
                        </p>
                        <div style="
                            background: white;
                            padding: 15px;
                            border-radius: 6px;
                            margin: 0 auto;
                            max-width: 400px;
                            text-align: left;
                            font-size: 13px;
                            color: #666;
                            border: 1px solid #e0e0e0;
                        ">
                            <strong style="color: #333;">To fix this:</strong><br>
                            1. Open a new terminal<br>
                            2. Navigate to the MFE directory<br>
                            3. Run: <code style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px;">npm start</code><br>
                            4. Refresh this page
                        </div>
                        <p style="
                            margin-top: 20px;
                            font-size: 12px;
                            color: #999;
                            font-style: italic;
                        ">
                            💡 Notice: Other MFEs continue working normally!<br>
                            This demonstrates <strong>fault isolation</strong> in micro-frontend architecture.
                        </p>
                    </div>
                `;
            }
        }
    }
}

// ============================================================================
// 📚 QUICK REFERENCE GUIDE
// ============================================================================
//
// TO ADD A NEW MICRO-FRONTEND:
//
// 1. Add URL to MFE_URLS object (line ~35)
//    Example: reviews: process.env.MFE_REVIEWS_URL || 'http://localhost:3004'
//
// 2. Add container to render() method (line ~150)
//    Copy an existing container and change IDs
//
// 3. Add MFE config to mfes array (line ~220)
//    Copy template at line ~270 and fill in details
//
// 4. Update webpack.config.js remotes section
//    Add: reviewsMFE: 'reviewsMFE@http://localhost:3004/remoteEntry.js'
//
// 5. Start your new MFE on its port
//    npm start in the new MFE directory
//
// That's it! The shell will automatically load and manage your new MFE!
//
// ============================================================================