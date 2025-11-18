/**
 * ============================================================================
 * AUTHENTICATION SERVICE (Main Controller)
 * ============================================================================
 * Manages all authentication providers and handles user sessions.
 * 
 * This service is much cleaner now - all provider logic is in separate files!
 */

import AUTH_CONFIG from './config/authConfig';
import GoogleAuthProvider from './providers/GoogleAuthProvider';
import FacebookAuthProvider from './providers/FacebookAuthProvider';
import DemoAuthProvider from './providers/DemoAuthProvider';
// Import new providers here:
// import KeycloakAuthProvider from './providers/KeycloakAuthProvider';
// import OktaAuthProvider from './providers/OktaAuthProvider';

/**
 * Main Authentication Service
 */
class AuthService {
    constructor(config) {
        this.config = config;
        this.providers = new Map();
        this.user = null;
        this.isAuthenticated = false;
        this.listeners = [];
        
        this._initializeProviders();
    }

    /**
     * Initialize all enabled providers
     * @private
     */
    _initializeProviders() {
        // Map provider names to their implementation classes
        const providerClasses = {
            google: GoogleAuthProvider,
            facebook: FacebookAuthProvider,
            demo: DemoAuthProvider
            // Add new providers here:
            // keycloak: KeycloakAuthProvider,
            // okta: OktaAuthProvider
        };

        // Instantiate enabled providers
        Object.entries(this.config).forEach(([name, config]) => {
            if (config.enabled && providerClasses[name]) {
                const ProviderClass = providerClasses[name];
                const provider = new ProviderClass(config);
                this.providers.set(name, provider);
                
                // Initialize provider asynchronously
                provider.initialize().catch(error => {
                    console.error(`❌ Failed to initialize ${name}:`, error);
                });
            }
        });

        console.log(`🔐 Auth Service initialized with ${this.providers.size} providers`);
    }

    /**
     * Get a specific provider by name
     * @param {string} name - Provider name (e.g., 'google', 'facebook')
     * @returns {AuthProvider|null}
     */
    getProvider(name) {
        return this.providers.get(name) || null;
    }

    /**
     * Get all enabled and configured providers
     * @returns {Array<string>} List of provider names
     */
    getAvailableProviders() {
        return Array.from(this.providers.keys()).filter(name => {
            const provider = this.providers.get(name);
            return provider.isConfigured();
        });
    }

    /**
     * Login using a specific provider
     * @param {string} providerName - Provider to use for login
     * @returns {Promise<Object>} User object
     */
    async login(providerName) {
        const provider = this.getProvider(providerName);
        
        if (!provider) {
            throw new Error(`Provider '${providerName}' not found or not enabled`);
        }

        if (!provider.isConfigured()) {
            throw new Error(`Provider '${providerName}' is not properly configured`);
        }

        try {
            console.log(`🔐 Logging in with ${providerName}...`);
            const userData = await provider.login();
            
            this.user = userData;
            this.isAuthenticated = true;
            this._storeSession();
            this._notifyListeners();
            
            console.log(`✅ Login successful with ${providerName}`);
            return userData;
        } catch (error) {
            console.error(`❌ Login failed with ${providerName}:`, error);
            throw error;
        }
    }

    /**
     * Logout current user
     * @returns {Promise<void>}
     */
    async logout() {
        if (this.user && this.user.provider) {
            const provider = this.getProvider(this.user.provider);
            if (provider) {
                await provider.logout();
            }
        }

        this.user = null;
        this.isAuthenticated = false;
        sessionStorage.removeItem('mfe_user');
        this._notifyListeners();
        
        console.log(`✅ Logged out successfully`);
    }

    /**
     * Store user session in sessionStorage
     * @private
     */
    _storeSession() {
        sessionStorage.setItem('mfe_user', JSON.stringify(this.user));
    }

    /**
     * Load existing session from sessionStorage
     */
    loadSession() {
        const stored = sessionStorage.getItem('mfe_user');
        if (stored) {
            this.user = JSON.parse(stored);
            this.isAuthenticated = true;
            this._notifyListeners();
            console.log(`✅ Session restored for ${this.user.name}`);
        }
    }

    /**
     * Subscribe to authentication state changes
     * @param {Function} callback - Called when auth state changes
     */
    subscribe(callback) {
        this.listeners.push(callback);
        // Immediately call with current state
        callback({ user: this.user, isAuthenticated: this.isAuthenticated });
    }

    /**
     * Notify all listeners of state change
     * @private
     */
    _notifyListeners() {
        this.listeners.forEach(callback => {
            callback({ user: this.user, isAuthenticated: this.isAuthenticated });
        });
    }

    /**
     * Get current user
     * @returns {Object|null}
     */
    getUser() {
        return this.user;
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    /**
     * Helper method for Google button rendering
     * @param {string} elementId - DOM element ID
     */
    renderGoogleButton(elementId) {
        const googleProvider = this.getProvider('google');
        if (googleProvider && googleProvider.isConfigured()) {
            // Set callback for Google's button-based login
            googleProvider.onLoginSuccess = (userData) => {
                this.user = userData;
                this.isAuthenticated = true;
                this._storeSession();
                this._notifyListeners();
            };
            googleProvider.renderButton(elementId);
        }
    }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================
const authService = new AuthService(AUTH_CONFIG);

// Load existing session on startup
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        authService.loadSession();
    });
} else {
    authService.loadSession();
}

export default authService;