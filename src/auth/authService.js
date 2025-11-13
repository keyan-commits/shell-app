// OAuth Authentication Service
class AuthService {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.listeners = [];
        this.loadGoogleSDK();
    }

    loadGoogleSDK() {
        // Load Google Identity Services
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => this.initializeGoogle();
        document.head.appendChild(script);
    }

    initializeGoogle() {
        // Replace with your Google Client ID from:
        // https://console.cloud.google.com/apis/credentials
        const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
        
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response) => this.handleGoogleResponse(response)
            });
        }
    }

    renderGoogleButton(elementId) {
        if (typeof google !== 'undefined') {
            google.accounts.id.renderButton(
                document.getElementById(elementId),
                { 
                    theme: 'filled_blue', 
                    size: 'large',
                    text: 'signin_with',
                    width: 280
                }
            );
        }
    }

    handleGoogleResponse(response) {
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