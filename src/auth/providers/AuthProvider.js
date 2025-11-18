/**
 * ============================================================================
 * BASE AUTH PROVIDER (Abstract Class)
 * ============================================================================
 * All authentication providers must extend this class.
 * Enforces a consistent interface across all providers.
 * 
 * Follows the Open/Closed Principle:
 * - Open for extension (create new provider classes)
 * - Closed for modification (don't change this base class)
 */

class AuthProvider {
    /**
     * Constructor
     * @param {Object} config - Provider configuration
     */
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
     * @returns {Promise<void>}
     */
    async initialize() {
        throw new Error(`${this.name}: initialize() must be implemented by subclass`);
    }

    /**
     * Perform login flow
     * Must be implemented by subclasses
     * @returns {Promise<Object>} User object with standardized format
     */
    async login() {
        throw new Error(`${this.name}: login() must be implemented by subclass`);
    }

    /**
     * Perform logout flow
     * Must be implemented by subclasses
     * @returns {Promise<void>}
     */
    async logout() {
        throw new Error(`${this.name}: logout() must be implemented by subclass`);
    }

    /**
     * Check if provider is properly configured
     * Must be implemented by subclasses
     * @returns {boolean}
     */
    isConfigured() {
        throw new Error(`${this.name}: isConfigured() must be implemented by subclass`);
    }

    /**
     * Standardize user data format across all providers
     * All providers must return user data in this format
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

export default AuthProvider;