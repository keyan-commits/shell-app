import authService from './authService';

export default class Login {
    constructor() {
        this.container = null;
    }

    render(containerId) {
        this.container = document.getElementById(containerId);
        
        this.container.innerHTML = `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <div style="background: white; padding: 50px 40px; border-radius: 16px; box-shadow: 0 25px 80px rgba(0,0,0,0.3); max-width: 420px; width: 90%; text-align: center;">
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 40px;">
                        🛍️
                    </div>
                    
                    <h1 style="color: #333; margin-bottom: 10px; font-size: 32px; font-weight: 700;">MicroShop</h1>
                    <p style="color: #666; margin-bottom: 35px; font-size: 15px; line-height: 1.6;">
                        Enterprise Micro-Frontend Architecture<br>
                        <span style="font-size: 13px; color: #999;">React • Vue • Angular • Module Federation</span>
                    </p>
                    
                    <!-- Social Login Section -->
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                        <!-- Google Sign-In -->
                        <div id="google-signin-button" style="display: flex; justify-content: center; margin-bottom: 15px;"></div>
                        
                        <!-- Facebook Sign-In Button -->
                        <button id="facebook-login-btn" style="
                            width: 100%;
                            padding: 12px;
                            background: #1877f2;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-size: 15px;
                            font-weight: 600;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            transition: all 0.3s;
                            margin-bottom: 15px;
                        "
                        onmouseover="this.style.background='#166fe5'; this.style.transform='translateY(-1px)';"
                        onmouseout="this.style.background='#1877f2'; this.style.transform='translateY(0)';">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Continue with Facebook
                        </button>
                        
                        <p style="font-size: 11px; color: #999; margin: 0;">
                            Sign in with your preferred account
                        </p>
                    </div>
                    
                    <div style="margin: 25px 0; display: flex; align-items: center; gap: 10px;">
                        <div style="flex: 1; height: 1px; background: #e0e0e0;"></div>
                        <span style="color: #999; font-size: 13px; font-weight: 500;">OR</span>
                        <div style="flex: 1; height: 1px; background: #e0e0e0;"></div>
                    </div>
                    
                    <button id="demo-login-btn" style="
                        width: 100%;
                        padding: 14px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                    "
                    onmouseover="this.style.background='#45a049'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(76, 175, 80, 0.4)';"
                    onmouseout="this.style.background='#4CAF50'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(76, 175, 80, 0.3)';">
                        🚀 Try Demo Account
                    </button>
                    
                    <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #666; line-height: 1.8; margin: 0;">
                            <strong style="color: #333;">Architecture Demo</strong><br>
                            Products (React) • Cart (Vue) • Profile (Angular)<br>
                            <span style="font-size: 11px; color: #999;">Independent deployments • Module Federation</span>
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Render Google Sign-In button
        setTimeout(() => {
            authService.renderGoogleButton('google-signin-button');
        }, 100);

        // Facebook login button handler
        const fbBtn = document.getElementById('facebook-login-btn');
        if (fbBtn) {
            fbBtn.addEventListener('click', async () => {
                fbBtn.disabled = true;
                const originalHTML = fbBtn.innerHTML;
                fbBtn.innerHTML = '⏳ Signing in...';
                
                try {
                    await authService.loginWithFacebook();
                } catch (error) {
                    console.error('Facebook login error:', error);
                    fbBtn.disabled = false;
                    fbBtn.innerHTML = originalHTML;
                    
                    // Optional: Show error message
                    alert('Facebook login failed. Please try again.');
                }
            });
        }

        // Demo login button
        document.getElementById('demo-login-btn').addEventListener('click', () => {
            authService.loginDemo();
        });
    }
}