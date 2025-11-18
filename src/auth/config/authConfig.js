/**
 * ============================================================================
 * AUTHENTICATION CONFIGURATION
 * ============================================================================
 * Central configuration for all authentication providers.
 * 
 * To add a new provider:
 * 1. Add configuration here
 * 2. Create provider file in providers/ folder
 * 3. Import and register in authService.js
 */

const AUTH_CONFIG = {
    /**
     * Google OAuth Configuration
     */
    google: {
        enabled: true,
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        sdkUrl: 'https://accounts.google.com/gsi/client',
        name: 'Google',
        scopes: ['profile', 'email']
    },

    /**
     * Facebook OAuth Configuration
     */
    facebook: {
        enabled: true,
        appId: process.env.FACEBOOK_APP_ID || '',
        sdkUrl: 'https://connect.facebook.net/en_US/sdk.js',
        name: 'Facebook',
        version: 'v18.0',
        scopes: ['public_profile']
    },

    /**
     * Demo Authentication (No external service)
     */
    demo: {
        enabled: true,
        name: 'Demo'
    }

    // Add more providers here:
    // keycloak: { ... },
    // okta: { ... },
    // github: { ... }
};

export default AUTH_CONFIG;