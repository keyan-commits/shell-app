/**
 * ============================================================================
 * FACEBOOK AUTH PROVIDER
 * ============================================================================
 * Implements Facebook OAuth authentication using Facebook SDK
 */

import AuthProvider from './AuthProvider';

class FacebookAuthProvider extends AuthProvider {
    constructor(config) {
        super(config);
        this.isInitialized = false;
    }

    /**
     * Load and initialize Facebook SDK
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) return;
        
        if (!this.isConfigured()) {
            console.warn(`⚠️  ${this.name} OAuth not configured`);
            return;
        }

        return new Promise((resolve) => {
            // Facebook SDK initialization callback
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

            // Load Facebook SDK script
            const script = document.createElement('script');
            script.src = this.config.sdkUrl;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        });
    }

    /**
     * Perform Facebook login
     * @returns {Promise<Object>} Normalized user data
     */
    async login() {
        if (!this.isInitialized || typeof FB === 'undefined') {
            throw new Error(`${this.name} SDK not loaded`);
        }

        return new Promise((resolve, reject) => {
            FB.login((response) => {
                if (response.authResponse) {
                    // User logged in successfully, fetch user info
                    FB.api(
                        '/me', 
                        { fields: 'id,name,email,picture.width(200).height(200)' },
                        (userInfo) => {
                            const userData = {
                                id: userInfo.id,
                                name: userInfo.name,
                                email: userInfo.email || `${userInfo.id}@facebook.com`,
                                picture: userInfo.picture?.data?.url || 
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}`
                            };
                            resolve(this.normalizeUserData(userData));
                        }
                    );
                } else {
                    // User cancelled login or didn't authorize
                    reject(`${this.name} login cancelled`);
                }
            }, { 
                scope: this.config.scopes.join(',')
            });
        });
    }

    /**
     * Logout from Facebook
     * @returns {Promise<void>}
     */
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

    /**
     * Check if Facebook OAuth is properly configured
     * @returns {boolean}
     */
    isConfigured() {
        const isValid = this.config.appId && this.config.appId !== '';
        
        if (!isValid) {
            console.warn(`⚠️  ${this.name} App ID is missing`);
        }
        
        return isValid;
    }
}

export default FacebookAuthProvider;