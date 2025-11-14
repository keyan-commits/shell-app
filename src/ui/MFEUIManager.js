// ============================================================================
// FILE: shell-app/src/ui/MFEUIManager.js
// ============================================================================
// UI MANAGER - Handles visual feedback for MFE loading
// Separated from core logic for clean architecture
// ============================================================================

export class MFEUIManager {
    /**
     * Show success indicator in MFE container
     * @param {string} containerId - Container element ID
     */
    static showSuccess(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const containerDiv = container.closest('[style*="background: white"]');
        if (!containerDiv) return;

        const header = containerDiv.querySelector('[style*="background: #f8f9fa"]');
        if (header) {
            header.style.background = '#e8f5e9'; // Light green
        }
    }

    /**
     * Show error message in MFE container
     * @param {string} containerId - Container element ID
     * @param {string} name - MFE name
     * @param {string} tech - Technology/framework
     * @param {number} port - Development port
     */
    static showError(containerId, name, tech, port) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const containerDiv = container.closest('[style*="background: white"]');
        if (!containerDiv) return;

        const mfeContent = containerDiv.querySelector('[style*="padding: 20px"]');
        if (mfeContent) {
            mfeContent.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 60px 20px;
                    background: #fff3e0;
                    border-radius: 8px;
                    border: 2px dashed #ff9800;
                ">
                    <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
                    <h3 style="color: #e65100; margin-bottom: 10px; font-size: 18px;">
                        ${name} MFE Unavailable
                    </h3>
                    <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                        The ${name} micro-frontend (${tech}) is currently not responding.
                    </p>
                    <div style="
                        background: white;
                        padding: 15px;
                        border-radius: 6px;
                        margin: 0 auto;
                        max-width: 400px;
                        text-align: left;
                        font-size: 13px;
                        color: #666;
                        border: 1px solid #e0e0e0;
                    ">
                        <strong style="color: #333;">To fix this:</strong><br>
                        1. Open a new terminal<br>
                        2. Navigate to the MFE directory<br>
                        3. Run: <code style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px;">npm start</code><br>
                        4. Refresh this page
                    </div>
                    <p style="
                        margin-top: 20px;
                        font-size: 12px;
                        color: #999;
                        font-style: italic;
                    ">
                        💡 Notice: Other MFEs continue working normally!<br>
                        This demonstrates <strong>fault isolation</strong> in micro-frontend architecture.
                    </p>
                </div>
            `;
        }
    }
}