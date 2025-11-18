
class AuthService {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.listeners = [];

        // 🐛 DEBUG: Check what Client ID is being used
        console.log('🔑 Auth Service - Google Client ID from env:', process.env.GOOGLE_CLIENT_ID);

        this.loadGoogleSDK();
    }

    loadGoogleSDK() {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => this.initializeGoogle();
        document.head.appendChild(script);
    }

    initializeGoogle() {
        if (typeof google === 'undefined') {
            console.error('❌ Google SDK not loaded');
            return;
        }

        // Use process.env directly
        const clientId = process.env.GOOGLE_CLIENT_ID;
        
        // 🐛 DEBUG: Check what we're using
        console.log('🔐 Initializing Google Auth with Client ID:', clientId);
        console.log('🔐 Client ID length:', clientId ? clientId.length : 0);
        console.log('🔐 Is placeholder?', clientId && clientId.includes('123456789'));

        // Validate Client ID
        if (!clientId || clientId === '' || clientId.includes('123456789')) {
            console.error('❌ Invalid or placeholder Google Client ID!');
            console.error('❌ Google OAuth will not work. Using Demo login only.');
            return;
        }

        // Check if it looks like a valid Google Client ID
        if (!clientId.includes('.apps.googleusercontent.com')) {
            console.error('❌ Client ID format invalid! Should end with .apps.googleusercontent.com');
            return;
        }

        try {
            google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => this.handleGoogleResponse(response)
            });
            console.log('✅ Google Auth initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Google Auth:', error);
        }
    }

    renderGoogleButton(elementId) {
        if (typeof google !== 'undefined') {
            const element = document.getElementById(elementId);
            if (!element) {
                console.error('❌ Google button element not found:', elementId);
                return;
            }

            try {
                google.accounts.id.renderButton(element, {
                    theme: 'filled_blue',
                    size: 'large',
                    text: 'signin_with',
                    width: 280
                });
                console.log('✅ Google button rendered');
            } catch (error) {
                console.error('❌ Error rendering Google button:', error);
            }
        } else {
            console.error('❌ Google SDK not available for button render');
        }
    }

    handleGoogleResponse(response) {
        console.log('✅ Google login successful');
        
        // Decode JWT token
        const payload = this.parseJwt(response.credential);

        this.user = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            provider: 'google'
        };

        this.isAuthenticated = true;
        this.notifyListeners();
        this.storeSession();
    }

    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    // Demo login (works without OAuth setup)
    loginDemo() {
        console.log('🎭 Demo login used');
        this.user = {
            id: 'demo-user-123',
            name: 'Sarah Chen',
            email: 'sarah.chen@example.com',
            picture: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=667eea&color=fff&size=200',
            provider: 'demo'
        };
        this.isAuthenticated = true;
        this.notifyListeners();
        this.storeSession();
    }

    logout() {
        this.user = null;
        this.isAuthenticated = false;
        sessionStorage.removeItem('mfe_user');
        this.notifyListeners();

        if (typeof google !== 'undefined') {
            google.accounts.id.disableAutoSelect();
        }
    }

    storeSession() {
        sessionStorage.setItem('mfe_user', JSON.stringify(this.user));
    }

    loadSession() {
        const stored = sessionStorage.getItem('mfe_user');
        if (stored) {
            this.user = JSON.parse(stored);
            this.isAuthenticated = true;
            this.notifyListeners();
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
        // Immediately call with current state
        callback({ user: this.user, isAuthenticated: this.isAuthenticated });
    }

    notifyListeners() {
        this.listeners.forEach(callback => {
            callback({ user: this.user, isAuthenticated: this.isAuthenticated });
        });
    }

    getUser() {
        return this.user;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }
}

// Export singleton instance
const authService = new AuthService();

// Check for existing session on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        authService.loadSession();
    });
} else {
    authService.loadSession();
}

export default authService;