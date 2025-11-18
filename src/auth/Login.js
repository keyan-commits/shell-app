import authService from './authService';
import AUTH_CONFIG from './config/authConfig';

/**
 * ============================================================================
 * LOGIN COMPONENT - AUTO-GENERATED BUTTONS
 * ============================================================================
 * Automatically generates login buttons based on available providers.
 * No need to manually add HTML for each provider!
 */
export default class Login {
    constructor() {
        this.container = null;
        this.availableProviders = [];
    }

    /**
     * Render the login page
     * @param {string} containerId - DOM element ID to render into
     */
    render(containerId) {
        this.container = document.getElementById(containerId);
        this.availableProviders = authService.getAvailableProviders();
        
        this.container.innerHTML = this._generateHTML();
        this._attachEventHandlers();
    }

    /**
     * Generate complete HTML for login page
     * @private
     * @returns {string} HTML string
     */
    _generateHTML() {
        return `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <div style="background: white; padding: 50px 40px; border-radius: 16px; box-shadow: 0 25px 80px rgba(0,0,0,0.3); max-width: 420px; width: 90%; text-align: center;">
                    
                    <!-- App Logo -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 40px;">
                        🛍️
                    </div>
                    
                    <!-- App Title -->
                    <h1 style="color: #333; margin-bottom: 10px; font-size: 32px; font-weight: 700;">MicroShop</h1>
                    <p style="color: #666; margin-bottom: 35px; font-size: 15px; line-height: 1.6;">
                        Enterprise Micro-Frontend Architecture<br>
                        <span style="font-size: 13px; color: #999;">React • Vue • Angular • Module Federation</span>
                    </p>
                    
                    <!-- OAuth Login Section (Auto-generated) -->
                    ${this._generateOAuthSection()}
                    
                    <!-- Divider (only if both OAuth and Demo are available) -->
                    ${this._shouldShowDivider() ? this._generateDivider() : ''}
                    
                    <!-- Demo Login Section (Auto-generated) -->
                    ${this._generateDemoSection()}
                    
                    <!-- Footer -->
                    <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #666; line-height: 1.8; margin: 0;">
                            <strong style="color: #333;">Architecture Demo</strong><br>
                            Products (React) • Cart (Vue) • Profile (Angular)<br>
                            <span style="font-size: 11px; color: #999;">Independent deployments • Module Federation</span>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate OAuth login section with auto-generated buttons
     * @private
     * @returns {string} HTML string
     */
    _generateOAuthSection() {
        const oauthProviders = this.availableProviders.filter(p => p !== 'demo');
        
        if (oauthProviders.length === 0) {
            return '';
        }

        const buttons = oauthProviders.map(provider => {
            // Special handling for Google (uses SDK button)
            if (provider === 'google') {
                return this._generateGoogleButton();
            }
            
            // Auto-generate button for other providers
            return this._generateProviderButton(provider);
        }).join('');

        return `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                ${buttons}
                <p style="font-size: 11px; color: #999; margin: 15px 0 0 0;">
                    Sign in with your preferred account
                </p>
            </div>
        `;
    }

    /**
     * Generate Google login button (uses Google SDK)
     * @private
     * @returns {string} HTML string
     */
    _generateGoogleButton() {
        return `
            <div id="google-signin-button" style="display: flex; justify-content: center; margin-bottom: 15px;"></div>
        `;
    }

    /**
     * Auto-generate button for any provider
     * @private
     * @param {string} provider - Provider name
     * @returns {string} HTML string
     */
    _generateProviderButton(provider) {
        const config = AUTH_CONFIG[provider];
        const ui = config.ui || this._getDefaultUI(provider);

        return `
            <button 
                id="${provider}-login-btn" 
                data-provider="${provider}"
                style="
                    width: 100%;
                    padding: 12px;
                    background: ${ui.buttonColor};
                    color: ${ui.textColor};
                    border: none;
                    border-radius: 6px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s;
                    margin-bottom: 15px;
                "
                onmouseover="this.style.background='${ui.hoverColor}'; this.style.transform='translateY(-1px)';"
                onmouseout="this.style.background='${ui.buttonColor}'; this.style.transform='translateY(0)';">
                <span style="display: inline-flex; align-items: center;">${ui.iconSvg || ''}</span>
                Continue with ${ui.displayName || config.name}
            </button>
        `;
    }

    /**
     * Generate demo login section
     * @private
     * @returns {string} HTML string
     */
    _generateDemoSection() {
        if (!this.availableProviders.includes('demo')) {
            return '';
        }

        const demoConfig = AUTH_CONFIG.demo;
        const ui = demoConfig.ui || this._getDefaultUI('demo');

        return `
            <button 
                id="demo-login-btn" 
                data-provider="demo"
                style="
                    width: 100%;
                    padding: 14px;
                    background: ${ui.buttonColor};
                    color: ${ui.textColor};
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                "
                onmouseover="this.style.background='${ui.hoverColor}'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(76, 175, 80, 0.4)';"
                onmouseout="this.style.background='${ui.buttonColor}'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(76, 175, 80, 0.3)';">
                <span style="display: inline-flex; align-items: center;">${ui.iconSvg || ''}</span>
                Try ${ui.displayName || 'Demo'} Account
            </button>
        `;
    }

    /**
     * Generate divider between OAuth and Demo sections
     * @private
     * @returns {string} HTML string
     */
    _generateDivider() {
        return `
            <div style="margin: 25px 0; display: flex; align-items: center; gap: 10px;">
                <div style="flex: 1; height: 1px; background: #e0e0e0;"></div>
                <span style="color: #999; font-size: 13px; font-weight: 500;">OR</span>
                <div style="flex: 1; height: 1px; background: #e0e0e0;"></div>
            </div>
        `;
    }

    /**
     * Check if divider should be shown
     * @private
     * @returns {boolean}
     */
    _shouldShowDivider() {
        const hasOAuth = this.availableProviders.some(p => p !== 'demo');
        const hasDemo = this.availableProviders.includes('demo');
        return hasOAuth && hasDemo;
    }

    /**
     * Get default UI configuration for a provider with SVG icons
     * @private
     * @param {string} provider - Provider name
     * @returns {Object} UI configuration
     */
    _getDefaultUI(provider) {
        const defaults = {
            github: {
                iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="white"/>
                </svg>`,
                buttonColor: '#24292e',
                hoverColor: '#1b1f23',
                textColor: '#ffffff',
                displayName: 'GitHub'
            },
            keycloak: {
                iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="white"/>
                </svg>`,
                buttonColor: '#008aaa',
                hoverColor: '#006e89',
                textColor: '#ffffff',
                displayName: 'SSO'
            },
            okta: {
                iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="white"/>
                </svg>`,
                buttonColor: '#007dc1',
                hoverColor: '#005f92',
                textColor: '#ffffff',
                displayName: 'Okta'
            },
            microsoft: {
                iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" fill="white"/>
                </svg>`,
                buttonColor: '#0078d4',
                hoverColor: '#005a9e',
                textColor: '#ffffff',
                displayName: 'Microsoft'
            }
        };

        return defaults[provider] || {
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="white"/>
            </svg>`,
            buttonColor: '#6c757d',
            hoverColor: '#5a6268',
            textColor: '#ffffff',
            displayName: provider.charAt(0).toUpperCase() + provider.slice(1)
        };
    }

    /**
     * Attach event handlers to all generated buttons
     * @private
     */
    _attachEventHandlers() {
        // Special handling for Google (uses SDK button)
        if (this.availableProviders.includes('google')) {
            setTimeout(() => {
                authService.renderGoogleButton('google-signin-button');
            }, 100);
        }

        // Attach click handlers to all other provider buttons
        this.availableProviders.forEach(provider => {
            if (provider === 'google') return; // Skip Google (handled above)
            
            const button = document.getElementById(`${provider}-login-btn`);
            if (button) {
                button.addEventListener('click', () => this._handleLogin(provider, button));
            }
        });
    }

    /**
     * Handle login button click
     * @private
     * @param {string} provider - Provider name
     * @param {HTMLElement} button - Button element
     */
    async _handleLogin(provider, button) {
        // Disable button and show loading state
        button.disabled = true;
        const originalHTML = button.innerHTML;
        button.innerHTML = '⏳ Signing in...';
        
        try {
            await authService.login(provider);
            // Success - AuthService will handle state change and navigation
        } catch (error) {
            console.error(`Login failed with ${provider}:`, error);
            
            // Restore button state
            button.disabled = false;
            button.innerHTML = originalHTML;
            
            // Show error message
            this._showError(`Login failed with ${provider}. Please try again.`);
        }
    }

    /**
     * Show error message to user
     * @private
     * @param {string} message - Error message
     */
    _showError(message) {
        // Simple alert for now - could be replaced with a nicer UI component
        alert(message);
    }
}

/**
 * ============================================================================
 * USAGE NOTES
 * ============================================================================
 * 
 * This Login component now automatically generates buttons for ALL providers!
 * Uses SVG icons instead of emojis for better cross-browser compatibility.
 * 
 * To add a new provider (e.g., Keycloak):
 * 
 * 1. Add to authConfig.js:
 *    keycloak: {
 *        enabled: true,
 *        clientId: process.env.KEYCLOAK_CLIENT_ID,
 *        name: 'Keycloak',
 *        ui: {
 *            iconSvg: `<svg>...</svg>`,  // Your SVG icon
 *            buttonColor: '#008aaa',
 *            hoverColor: '#006e89',
 *            textColor: '#ffffff',
 *            displayName: 'SSO'
 *        }
 *    }
 * 
 * 2. Create KeycloakAuthProvider.js (same as before)
 * 
 * 3. Register in authService.js (same as before)
 * 
 * That's it! The button will appear automatically with SVG icon!
 * 
 * ============================================================================
 */