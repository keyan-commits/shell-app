/**
 * ============================================================================
 * DEMO AUTH PROVIDER
 * ============================================================================
 * Provides demo authentication without any external service
 * Useful for testing and development
 */

import AuthProvider from './AuthProvider';

class DemoAuthProvider extends AuthProvider {
    /**
     * Initialize demo provider (no external setup needed)
     * @returns {Promise<void>}
     */
    async initialize() {
        console.log(`✅ ${this.name} provider ready`);
    }

    /**
     * Perform demo login (returns mock user data)
     * @returns {Promise<Object>} Normalized user data
     */
    async login() {
        console.log(`🎭 ${this.name} login used`);
        
        const userData = {
            id: 'demo-user-123',
            name: 'Sarah Chen',
            email: 'sarah.chen@example.com',
            picture: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=667eea&color=fff&size=200'
        };
        
        return this.normalizeUserData(userData);
    }

    /**
     * Perform demo logout (no external service to logout from)
     * @returns {Promise<void>}
     */
    async logout() {
        console.log(`✅ Logged out from ${this.name}`);
    }

    /**
     * Demo is always configured (no credentials needed)
     * @returns {boolean}
     */
    isConfigured() {
        return true;
    }
}

export default DemoAuthProvider;