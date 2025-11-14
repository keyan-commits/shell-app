import authService from './auth/authService';
import Login from './auth/Login';

const MFE_URLS = {
    products: process.env.MFE_PRODUCTS_URL || 'http://localhost:3001',
    cart: process.env.MFE_CART_URL || 'http://localhost:3002',
    user: process.env.MFE_USER_URL || 'http://localhost:3003',
};

export default class App {
    constructor() {
        this.isAuthenticated = false;
        this.loginScreen = new Login();

        authService.subscribe((authState) => {
            this.isAuthenticated = authState.isAuthenticated;
            this.render();

            if (this.isAuthenticated) {
                this.loadMicroFrontends();
            }
        });
    }

    render() {
        const root = document.getElementById('root');

        if (!this.isAuthenticated) {
            this.loginScreen.render('root');
            return;
        }

        root.innerHTML = `
            <div style="min-height: 100vh; background: #f5f5f5;">
                <!-- Header -->
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
                    <!-- User Profile MFE (Angular) -->
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

                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                        <!-- Products MFE (React) -->
                        <div id="products-container" style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                            <div style="background: #f8f9fa; padding: 8px 20px; border-bottom: 1px solid #e0e0e0;">
                                <span style="font-size: 11px; color: #666; font-family: 'Courier New', monospace; font-weight: 600;">
                                    📦 products-mfe-react @ localhost:3001 | Tech: React 18
                                </span>
                            </div>
                            <div style="padding: 20px;">
                                <div id="products-mfe">
                                    <div style="text-align: center; padding: 40px; color: #999;">
                                        <div style="font-size: 32px; margin-bottom: 10px;">⏳</div>
                                        <p>Loading Products MFE...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cart MFE (Vue) -->
                        <div id="cart-mfe-container" style="background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;">
                            <div style="background: #f8f9fa; padding: 8px 20px; border-bottom: 1px solid #e0e0e0;">
                                <span style="font-size: 11px; color: #666; font-family: 'Courier New', monospace; font-weight: 600;">
                                    📦 cart-mfe-vue @ localhost:3002 | Tech: Vue 3
                                </span>
                            </div>
                            <div style="padding: 20px;">
                                <div id="cart-mfe">
                                    <div style="text-align: center; padding: 40px; color: #999;">
                                        <div style="font-size: 32px; margin-bottom: 10px;">⏳</div>
                                        <p>Loading Cart MFE...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('logout-btn').addEventListener('click', () => {
            authService.logout();
        });
    }

    async loadMicroFrontends() {
        const mfes = [
            {
                name: 'User Profile',
                tech: 'Angular',
                import: () => this.loadAngularMFE(),
                mount: () => { },
                containerId: 'user-mfe-container',
                port: 3003
            },
            {
                name: 'Products',
                tech: 'React',
                import: () => import('productsMFE/ProductsApp'),
                mount: (module) => module.mount('products-mfe'),
                containerId: 'products-container',
                port: 3001
            },
            {
                name: 'Cart',
                tech: 'Vue',
                import: () => import('cartMFE/CartApp'),
                mount: (module) => module.mount('cart-mfe'),
                containerId: 'cart-mfe-container',
                port: 3002
            }
        ];
        let loadedCount = 0;
        let failedCount = 0;

        for (const mfe of mfes) {
            try {
                console.log(`🔄 Loading ${mfe.name} MFE (${mfe.tech})...`);
                const module = await mfe.import();
                mfe.mount(module);
                loadedCount++;
                console.log(`✅ ${mfe.name} MFE loaded successfully`);

                this.showMFEStatus(mfe.containerId, 'success', mfe.name, mfe.tech);
            } catch (error) {
                failedCount++;
                console.error(`❌ Failed to load ${mfe.name} MFE:`, error.message);

                this.showMFEStatus(mfe.containerId, 'error', mfe.name, mfe.tech, mfe.port);
            }
        }

        console.log(`\n📊 MFE Load Summary: ${loadedCount} loaded, ${failedCount} failed`);

        if (failedCount > 0) {
            console.log('\n💡 Tip: Some MFEs failed to load, but the app continues working!');
            console.log('This demonstrates fault isolation in micro-frontend architecture.');
        }
    }

loadAngularMFE() {
    return new Promise((resolve, reject) => {
        // ✅ Define allowed origins based on environment
        const baseUrl = process.env.MFE_USER_URL || 'http://localhost:3003';
        const isDev = process.env.BUILD_ENV === 'dev';
        
        // ✅ Environment-aware allowed origins
        const ALLOWED_ORIGINS = isDev 
            ? ['http://localhost:3003'] // Development: only localhost
            : [
                'https://user-sit.microshop.com',
                'https://user-uat.microshop.com',
                'https://user.microshop.com'
              ]; // Production environments
        
        // ✅ Validate origin
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
        
        // Check if already loaded
        if (window.mountUserMFE) {
            window.mountUserMFE();
            resolve({});
            return;
        }

        // ✅ Helper function to create secure script
        const createSecureScript = (filename) => {
            const script = document.createElement('script');
            script.src = `${baseUrl}/${filename}`;
            script.defer = true;
            script.crossOrigin = 'anonymous'; // Security: Enable CORS
            
            // Add error handling
            script.onerror = () => {
                console.error(`❌ Failed to load Angular script: ${filename}`);
            };
            
            return script;
        };

        // Load runtime first
        const runtime = createSecureScript('runtime.js');
        
        runtime.onload = () => {
            // Then polyfills
            const polyfills = createSecureScript('polyfills.js');
            
            polyfills.onload = () => {
                // Then vendor
                const vendor = createSecureScript('vendor.js');
                
                vendor.onload = () => {
                    // Finally main
                    const main = createSecureScript('main.js');
                    
                    main.onload = () => {
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

    showMFEStatus(containerId, status, name, tech, port) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const containerDiv = container.closest('[style*="background: white"]');
        if (!containerDiv) return;

        if (status === 'success') {
            const header = containerDiv.querySelector('[style*="background: #f8f9fa"]');
            if (header) {
                header.style.background = '#e8f5e9';
            }

            // Clear loading message on success
            const loadingDiv = containerDiv.querySelector('[style*="text-align: center"]');
            if (loadingDiv && loadingDiv.textContent.includes('Loading')) {
                loadingDiv.remove();
            }
        } else if (status === 'error') {
            // Show user-friendly error message
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