import authService from './authService';

/**
 * Login UI Component
 * Dynamically renders login buttons based on available providers
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
     * Generate HTML for login page
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
                    
                    <!-- OAuth Login Section -->
                    ${this._generateOAuthSection()}
                    
                    <!-- Divider (only if both OAuth and Demo are available) -->
                    ${this._shouldShowDivider() ? this._generateDivider() : ''}
                    
                    <!-- Demo Login Section -->
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
     * Generate OAuth login buttons section
     * @private
     * @returns {string} HTML string
     */
    _generateOAuthSection() {
        const hasOAuthProviders = this.availableProviders.some(p => p !== 'demo');
        
        if (!hasOAuthProviders) {
            return '';
        }

        return `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                ${this._generateGoogleButton()}
                ${this._generateFacebookButton()}
                <!-- Add more OAuth buttons here -->
                
                <p style="font-size: 11px; color: #999; margin: 15px 0 0 0;">
                    Sign in with your preferred account
                </p>
            </div>
        `;
    }

    /**
     * Generate Google login button
     * @private
     * @returns {string} HTML string
     */
    _generateGoogleButton() {
        if (!this.availableProviders.includes('google')) {
            return '';
        }

        return `
            <div id="google-signin-button" style="display: flex; justify-content: center; margin-bottom: 15px;"></div>
        `;
    }

    /**
     * Generate Facebook login button
     * @private
     * @returns {string} HTML string
     */
    _generateFacebookButton() {
        if (!this.availableProviders.includes('facebook')) {
            return '';
        }

        return `
            <button id="facebook-login-btn" data-provider="facebook" style="
                width: 100%;
                padding: 12px;
                background: #1877f2;
                color: white;
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
            onmouseover="this.style.background='#166fe5'; this.style.transform='translateY(-1px)';"
            onmouseout="this.style.background='#1877f2'; this.style.transform='translateY(0)';">
                ${this._getFacebookIcon()}
                Continue with Facebook
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

        return `
            <button id="demo-login-btn" data-provider="demo" style="
                width: 100%;
                padding: 14px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
            "
            onmouseover="this.style.background='#45a049'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(76, 175, 80, 0.4)';"
            onmouseout="this.style.background='#4CAF50'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(76, 175, 80, 0.3)';">
                🚀 Try Demo Account
            </button>
        `;
    }

    /**
     * Generate divider
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
     * Attach event handlers to buttons
     * @private
     */
    _attachEventHandlers() {
        // Render Google button (special case - uses Google's SDK button)
        if (this.availableProviders.includes('google')) {
            setTimeout(() => {
                authService.renderGoogleButton('google-signin-button');
            }, 100);
        }

        // Attach handlers to all provider buttons
        this.availableProviders.forEach(provider => {
            if (provider === 'google') return; // Google uses SDK button
            
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

    /**
     * Get Facebook icon SVG
     * @private
     * @returns {string} SVG string
     */
    _getFacebookIcon() {
        return `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        `;
    }
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================
/**
 * To add a new OAuth provider:
 * 
 * 1. Add configuration in authService.js:
 *    github: {
 *        enabled: true,
 *        clientId: process.env.GITHUB_CLIENT_ID || '',
 *        sdkUrl: 'https://github.com/login/oauth/authorize',
 *        name: 'GitHub',
 *        scopes: ['user:email']
 *    }
 * 
 * 2. Create a new provider class extending AuthProvider:
 *    class GitHubAuthProvider extends AuthProvider { ... }
 * 
 * 3. Add to providerClasses map in AuthService:
 *    const providerClasses = {
 *        google: GoogleAuthProvider,
 *        facebook: FacebookAuthProvider,
 *        github: GitHubAuthProvider  // <-- Add here
 *    };
 * 
 * 4. Add button generation method in Login.js:
 *    _generateGitHubButton() {
 *        if (!this.availableProviders.includes('github')) return '';
 *        return `<button id="github-login-btn" ...>...</button>`;
 *    }
 * 
 * 5. Call it in _generateOAuthSection():
 *    ${this._generateGitHubButton()}
 * 
 * That's it! The system will automatically:
 * - Initialize the provider
 * - Show/hide the button based on configuration
 * - Handle login/logout flows
 * - Normalize user data
 */