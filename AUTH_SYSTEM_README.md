// ============================================================================
// AUTH CONFIGURATION
// ============================================================================
/**
 * Central configuration for all authentication providers.
 * Add new providers here to enable them.
 */
const AUTH_CONFIG = {
    google: {
        enabled: true,
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        sdkUrl: 'https://accounts.google.com/gsi/client',
        name: 'Google',
        scopes: ['profile', 'email']
    },
    facebook: {
        enabled: true,
        appId: process.env.FACEBOOK_APP_ID || '',
        sdkUrl: 'https://connect.facebook.net/en_US/sdk.js',
        name: 'Facebook',
        version: 'v18.0',
        scopes: ['public_profile']
    },
    demo: {
        enabled: true,
        name: 'Demo'
    }
    // Add more providers here following the same pattern:
    // github: {
    //     enabled: false,
    //     clientId: process.env.GITHUB_CLIENT_ID || '',
    //     sdkUrl: 'https://github.com/login/oauth/authorize',
    //     name: 'GitHub',
    //     scopes: ['user:email']
    // }
};

// ============================================================================
// BASE AUTH PROVIDER (Abstract Class Pattern)
// ============================================================================
/**
 * Base class for all authentication providers.
 * Follows Open/Closed Principle - open for extension, closed for modification.
 */
class AuthProvider {
    constructor(config) {
        if (this.constructor === AuthProvider) {
            throw new Error('AuthProvider is abstract and cannot be instantiated directly');
        }
        this.config = config;
        this.name = config.name;
    }

    /**
     * Initialize the provider (load SDK, setup, etc.)
     * Must be implemented by subclasses
     */
    async initialize() {
        throw new Error('initialize() must be implemented by subclass');
    }

    /**
     * Perform login flow
     * Must be implemented by subclasses
     * @returns {Promise<Object>} User object with standardized format
     */
    async login() {
        throw new Error('login() must be implemented by subclass');
    }

    /**
     * Perform logout flow
     * Must be implemented by subclasses
     */
    async logout() {
        throw new Error('logout() must be implemented by subclass');
    }

    /**
     * Check if provider is properly configured
     * @returns {boolean}
     */
    isConfigured() {
        throw new Error('isConfigured() must be implemented by subclass');
    }

    /**
     * Standardize user data format across all providers
     * @param {Object} rawUserData - Provider-specific user data
     * @returns {Object} Standardized user object
     */
    normalizeUserData(rawUserData) {
        return {
            id: rawUserData.id,
            name: rawUserData.name,
            email: rawUserData.email,
            picture: rawUserData.picture,
            provider: this.name.toLowerCase()
        };
    }
}

// ============================================================================
// GOOGLE AUTH PROVIDER
// ============================================================================
/**
 * Google OAuth implementation
 */
class GoogleAuthProvider extends AuthProvider {
    constructor(config) {
        super(config);
        this.isInitialized = false;
    }

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

    _parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    async login() {
        // Google uses button-based login, handled by renderButton
        throw new Error('Google login is handled via renderButton()');
    }

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

    async logout() {
        if (typeof google !== 'undefined') {
            google.accounts.id.disableAutoSelect();
        }
    }

    isConfigured() {
        const isValid = this.config.clientId && 
                       !this.config.clientId.includes('123456789') &&
                       this.config.clientId.includes('.apps.googleusercontent.com');
        
        if (!isValid) {
            console.warn(`⚠️  ${this.name} Client ID is invalid or missing`);
        }
        
        return isValid;
    }
}

// ============================================================================
// FACEBOOK AUTH PROVIDER
// ============================================================================
/**
 * Facebook OAuth implementation
 */
class FacebookAuthProvider extends AuthProvider {
    constructor(config) {
        super(config);
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;
        if (!this.isConfigured()) {
            console.warn(`⚠️  ${this.name} OAuth not configured`);
            return;
        }

        return new Promise((resolve) => {
            window.fbAsyncInit = () => {
                FB.init({
                    appId: this.config.appId,
                    cookie: true,
                    xfbml: true,
                    version: this.config.version
                });
                this.isInitialized = true;
                console.log(`✅ ${this.name} SDK initialized`);
                resolve();
            };

            const script = document.createElement('script');
            script.src = this.config.sdkUrl;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        });
    }

    async login() {
        if (!this.isInitialized || typeof FB === 'undefined') {
            throw new Error(`${this.name} SDK not loaded`);
        }

        return new Promise((resolve, reject) => {
            FB.login((response) => {
                if (response.authResponse) {
                    // Get user info
                    FB.api('/me', { fields: 'id,name,email,picture.width(200).height(200)' }, (userInfo) => {
                        const userData = {
                            id: userInfo.id,
                            name: userInfo.name,
                            email: userInfo.email || `${userInfo.id}@facebook.com`,
                            picture: userInfo.picture?.data?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}`
                        };
                        resolve(this.normalizeUserData(userData));
                    });
                } else {
                    reject(`${this.name} login cancelled`);
                }
            }, { scope: this.config.scopes.join(',') });
        });
    }

    async logout() {
        if (this.isInitialized && typeof FB !== 'undefined') {
            return new Promise((resolve) => {
                FB.logout(() => {
                    console.log(`✅ Logged out from ${this.name}`);
                    resolve();
                });
            });
        }
    }

    isConfigured() {
        const isValid = this.config.appId && this.config.appId !== '';
        
        if (!isValid) {
            console.warn(`⚠️  ${this.name} App ID is missing`);
        }
        
        return isValid;
    }
}

// ============================================================================
// DEMO AUTH PROVIDER
// ============================================================================
/**
 * Demo authentication provider (no external service)
 */
class DemoAuthProvider extends AuthProvider {
    async initialize() {
        // No initialization needed for demo
        console.log(`✅ ${this.name} provider ready`);
    }

    async login() {
        const userData = {
            id: 'demo-user-123',
            name: 'Sarah Chen',
            email: 'sarah.chen@example.com',
            picture: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=667eea&color=fff&size=200'
        };
        return this.normalizeUserData(userData);
    }

    async logout() {
        // No logout needed for demo
        console.log(`✅ Logged out from ${this.name}`);
    }

    isConfigured() {
        return true; // Demo is always available
    }
}

// ============================================================================
// AUTH SERVICE (Main Controller)
// ============================================================================
/**
 * Main authentication service that manages all providers.
 * Follows Single Responsibility Principle and Dependency Inversion.
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
            // Add new provider classes here
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
     * Store user session
     * @private
     */
    _storeSession() {
        sessionStorage.setItem('mfe_user', JSON.stringify(this.user));
    }

    /**
     * Load existing session
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