/**
 * ============================================================================
 * AUTHENTICATION CONFIGURATION WITH VALIDATION
 * ============================================================================
 * Central configuration for all authentication providers.
 * 
 * To add a new provider:
 * 1. Add configuration here with proper structure
 * 2. Create provider file in providers/ folder
 * 3. Import and register in authService.js
 * 
 * Validation ensures all configs are properly formatted.
 */

/**
 * Validate provider configuration
 * @param {string} name - Provider name
 * @param {Object} config - Provider configuration
 * @returns {Object} Validation result
 */
function validateProviderConfig(name, config) {
    const errors = [];
    const warnings = [];

    // Required fields
    if (typeof config.enabled !== 'boolean') {
        errors.push(`${name}: 'enabled' must be a boolean`);
    }

    if (!config.name || typeof config.name !== 'string') {
        errors.push(`${name}: 'name' is required and must be a string`);
    }

    // Optional but recommended fields
    if (config.enabled && !config.clientId && !config.appId && name !== 'demo') {
        warnings.push(`${name}: Provider is enabled but missing credentials (clientId/appId)`);
    }

    // UI configuration validation
    if (config.ui) {
        if (config.ui.buttonColor && !/^#[0-9A-Fa-f]{6}$/.test(config.ui.buttonColor)) {
            warnings.push(`${name}: 'ui.buttonColor' should be a valid hex color`);
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Provider UI configuration for auto-generated buttons
 * Using SVG icons for better cross-browser compatibility
 */
const PROVIDER_UI = {
    google: {
        iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>`,
        buttonColor: '#4285f4',
        hoverColor: '#357ae8',
        textColor: '#ffffff',
        displayName: 'Google'
    },
    facebook: {
        iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="white"/>
        </svg>`,
        buttonColor: '#1877f2',
        hoverColor: '#166fe5',
        textColor: '#ffffff',
        displayName: 'Facebook'
    },
    demo: {
        iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="white"/>
        </svg>`,
        buttonColor: '#4CAF50',
        hoverColor: '#45a049',
        textColor: '#ffffff',
        displayName: 'Demo'
    }
    // Add more providers here with SVG icons
};

/**
 * Main authentication configuration
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
        scopes: ['profile', 'email'],
        ui: PROVIDER_UI.google
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
        scopes: ['public_profile'],
        ui: PROVIDER_UI.facebook
    },

    /**
     * Demo Authentication (No external service)
     */
    demo: {
        enabled: true,
        name: 'Demo',
        ui: PROVIDER_UI.demo
    }

    // Add more providers here following the same pattern:
    /*
    keycloak: {
        enabled: false,
        url: process.env.KEYCLOAK_URL || '',
        realm: process.env.KEYCLOAK_REALM || '',
        clientId: process.env.KEYCLOAK_CLIENT_ID || '',
        name: 'Keycloak',
        ui: {
            iconSvg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="white"/>
            </svg>`,
            buttonColor: '#008aaa',
            hoverColor: '#006e89',
            textColor: '#ffffff',
            displayName: 'SSO'
        }
    }
    */
};

/**
 * Validate all provider configurations on load
 */
function validateAllConfigs() {
    console.log('🔍 Validating authentication configurations...');
    
    let hasErrors = false;
    
    Object.entries(AUTH_CONFIG).forEach(([name, config]) => {
        const result = validateProviderConfig(name, config);
        
        if (!result.valid) {
            hasErrors = true;
            console.error(`❌ ${name} configuration errors:`);
            result.errors.forEach(error => console.error(`   - ${error}`));
        }
        
        if (result.warnings.length > 0) {
            console.warn(`⚠️  ${name} configuration warnings:`);
            result.warnings.forEach(warning => console.warn(`   - ${warning}`));
        }
    });
    
    if (!hasErrors) {
        const enabledCount = Object.values(AUTH_CONFIG).filter(c => c.enabled).length;
        console.log(`✅ All configurations valid. ${enabledCount} provider(s) enabled.`);
    }
    
    return !hasErrors;
}

// Run validation on load
validateAllConfigs();

export default AUTH_CONFIG;
export { PROVIDER_UI, validateProviderConfig };