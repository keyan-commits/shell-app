// ============================================================================
// FILE: shell-app/src/loaders/AngularLoader.js
// ============================================================================
// STRATEGY: Load Angular MFEs via sequential script loading
// Angular requires: runtime → polyfills → vendor → main
// ============================================================================

export class AngularLoader {
    constructor(baseUrl, mountId, allowedOrigins = []) {
        this.baseUrl = baseUrl;
        this.mountId = mountId;
        this.allowedOrigins = allowedOrigins;
    }

    /**
     * Load Angular scripts with security validation
     * @returns {Promise<void>}
     */
    async load() {
        // Security: Validate origin
        await this.validateOrigin();

        // Check if already loaded
        if (window.mountUserMFE) {
            return Promise.resolve();
        }

        // Load scripts in sequence
        await this.loadScript('runtime.js');
        await this.loadScript('polyfills.js');
        await this.loadScript('vendor.js');
        await this.loadScript('main.js');

        // Wait for Angular to initialize
        await this.waitForAngular();
    }

    /**
     * Mount the Angular application
     * @returns {Promise<void>}
     */
    async mount() {
        if (window.mountUserMFE) {
            window.mountUserMFE(this.mountId);
        } else {
            throw new Error('Angular mount function not available');
        }
    }

    /**
     * Validate script origin for security
     * @private
     */
    async validateOrigin() {
        try {
            const origin = new URL(this.baseUrl).origin;

            if (this.allowedOrigins.length > 0 && !this.allowedOrigins.includes(origin)) {
                const error = `Security Error: Untrusted origin: ${origin}`;
                console.error('🚨', error);
                console.log('📋 Allowed origins:', this.allowedOrigins);
                throw new Error(error);
            }

            console.log('✅ Security check passed:', origin);
        } catch (error) {
            throw new Error('Invalid Angular MFE URL format');
        }
    }

    /**
     * Load a single script file
     * @private
     */
    loadScript(filename) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `${this.baseUrl}/${filename}`;
            script.defer = true;
            script.crossOrigin = 'anonymous';

            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${filename}`));

            document.body.appendChild(script);
        });
    }

    /**
     * Wait for Angular to be ready
     * @private
     */
    waitForAngular(timeout = 2000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkAngular = () => {
                if (window.mountUserMFE) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Angular initialization timeout'));
                } else {
                    setTimeout(checkAngular, 100);
                }
            };

            checkAngular();
        });
    }
}