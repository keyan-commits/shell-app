// ============================================================================
// SHELL APPLICATION - MICRO-FRONTEND ORCHESTRATOR
// ============================================================================
// Main application class that manages loading and coordination of all MFEs
// NOW WITH JAVASCRIPT-BASED ENVIRONMENT BADGE (No CSS template errors!)
// ============================================================================

import authService from './auth/authService';
import Login from './auth/Login';
import { MFELoader } from './core/MFELoader.js';
import { MFE_REGISTRY } from './config/mfe-registry.js';

export default class App {
    constructor() {
        this.isAuthenticated = false;
        this.loginScreen = new Login();
        this.mfeLoader = new MFELoader(MFE_REGISTRY);
        
        // Add environment badge (replaces CSS template)
        this.addEnvironmentBadge();
        
        // Subscribe to authentication changes
        authService.subscribe((authState) => {
            this.isAuthenticated = authState.isAuthenticated;
            this.render();
            
            if (this.isAuthenticated) {
                this.loadMicroFrontends();
            }
        });
    }

    /**
     * Add environment indicator badge
     * Only shows in non-production environments
     */
    addEnvironmentBadge() {
        // Get environment from webpack config
        const env = process.env.BUILD_ENV || 'dev';
        
        // Don't show badge in production
        if (env === 'prod' || env === 'production') {
            return;
        }
        
        // Create badge element
        const badge = document.createElement('div');
        badge.id = 'environment-badge';
        badge.textContent = env.toUpperCase();
        
        // Style the badge based on environment
        const colors = {
            dev: '#4CAF50',       // Green for development
            sit: '#2196F3',       // Blue for SIT
            uat: '#FF9800'        // Orange for UAT
        };
        
        const backgroundColor = colors[env] || '#9C27B0'; // Purple fallback
        
        badge.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: ${backgroundColor};
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            cursor: default;
            user-select: none;
        `;
        
        // Add to body
        document.body.appendChild(badge);
        
        // Log environment
        console.log(`🌍 Running in ${env.toUpperCase()} environment`);
    }

    /**
     * Render the application UI
     */
    render() {
        const root = document.getElementById('root');
        
        // Show login if not authenticated
        if (!this.isAuthenticated) {
            this.loginScreen.render('root');
            return;
        }

        // Render authenticated layout
        root.innerHTML = `
            <div style="min-height: 100vh; background: #f5f5f5;">
                
                <!-- ================================================== -->
                <!-- HEADER - Navigation Bar                            -->
                <!-- ================================================== -->
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
                    
                    <!-- ================================================== -->
                    <!-- USER PROFILE MFE (Angular)                         -->
                    <!-- ================================================== -->
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
                        
                        <!-- ================================================== -->
                        <!-- PRODUCTS MFE (React)                               -->
                        <!-- ================================================== -->
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

                        <!-- ================================================== -->
                        <!-- CART MFE (Vue)                                     -->
                        <!-- ================================================== -->
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
                    </div>
                </div>
            </div>
        `;

        // Attach logout handler
        document.getElementById('logout-btn').addEventListener('click', () => {
            authService.logout();
        });
    }

    /**
     * Load all micro-frontends using the MFELoader
     */
    async loadMicroFrontends() {
        await this.mfeLoader.loadAll();
    }
}