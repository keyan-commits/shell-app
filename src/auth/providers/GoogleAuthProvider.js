/**
 * ============================================================================
 * GOOGLE AUTH PROVIDER
 * ============================================================================
 * Implements Google OAuth authentication using Google Sign-In SDK
 */

import AuthProvider from './AuthProvider';

class GoogleAuthProvider extends AuthProvider {
    constructor(config) {
        super(config);
        this.isInitialized = false;
    }

    /**
     * Load and initialize Google Sign-In SDK
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) return;
        
        if (!this.isConfigured()) {
            console.warn(`⚠️  ${this.name} OAuth not configured`);
            return;
        }

        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = this.config.sdkUrl;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                this._initializeGoogleAuth();
                this.isInitialized = true;
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize Google Auth with client ID
     * @private
     */
    _initializeGoogleAuth() {
        if (typeof google === 'undefined') {
            console.error(`❌ ${this.name} SDK not loaded`);
            return;
        }

        try {
            google.accounts.id.initialize({
                client_id: this.config.clientId,
                callback: (response) => this._handleGoogleResponse(response)
            });
            console.log(`✅ ${this.name} Auth initialized`);
        } catch (error) {
            console.error(`❌ Error initializing ${this.name} Auth:`, error);
        }
    }

    /**
     * Handle Google Sign-In response
     * @private
     * @param {Object} response - Google credential response
     */
    _handleGoogleResponse(response) {
        const payload = this._parseJwt(response.credential);
        const userData = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture
        };
        
        // Trigger callback if set
        if (this.onLoginSuccess) {
            this.onLoginSuccess(this.normalizeUserData(userData));
        }
    }

    /**
     * Parse JWT token from Google
     * @private
     * @param {string} token - JWT token
     * @returns {Object} Decoded token payload
     */
    _parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    }

    /**
     * Google uses button-based login (not programmatic)
     * Use renderButton() method instead
     * @throws {Error}
     */
    async login() {
        throw new Error('Google login is handled via renderButton()');
    }

    /**
     * Render Google Sign-In button
     * @param {string} elementId - DOM element ID to render button into
     */
    renderButton(elementId) {
        if (!this.isInitialized || typeof google === 'undefined') {
            console.error(`❌ ${this.name} not initialized`);
            return;
        }

        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`❌ Element #${elementId} not found`);
            return;
        }

        try {
            google.accounts.id.renderButton(element, {
                theme: 'filled_blue',
                size: 'large',
                text: 'signin_with',
                width: 280
            });
            console.log(`✅ ${this.name} button rendered`);
        } catch (error) {
            console.error(`❌ Error rendering ${this.name} button:`, error);
        }
    }

    /**
     * Logout from Google
     * @returns {Promise<void>}
     */
    async logout() {
        if (typeof google !== 'undefined') {
            google.accounts.id.disableAutoSelect();
            console.log(`✅ Logged out from ${this.name}`);
        }
    }

    /**
     * Check if Google OAuth is properly configured
     * @returns {boolean}
     */
    isConfigured() {
        const isValid = 
            this.config.clientId && 
            !this.config.clientId.includes('123456789') &&
            this.config.clientId.includes('.apps.googleusercontent.com');
        
        if (!isValid) {
            console.warn(`⚠️  ${this.name} Client ID is invalid or missing`);
        }
        
        return isValid;
    }
}

export default GoogleAuthProvider;