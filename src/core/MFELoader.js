// ============================================================================
// FILE: shell-app/src/core/MFELoader.js
// ============================================================================
// MICRO-FRONTEND LOADER - Core orchestration class
// Handles loading, mounting, and error handling for all MFEs
// FOLLOWS OPEN/CLOSED PRINCIPLE: Extend by adding MFE configs, not modifying this
// ============================================================================

export class MFELoader {
    constructor(mfeRegistry = []) {
        this.mfeRegistry = mfeRegistry;
        this.loadedMFEs = new Map();
        this.failedMFEs = new Map();
    }

    /**
     * Load all registered micro-frontends
     * @returns {Promise<Object>} Summary of loaded/failed MFEs
     */
    async loadAll() {
        console.log('🚀 Starting MFE orchestration...\n');

        const results = await Promise.allSettled(
            this.mfeRegistry.map(mfe => this.loadSingle(mfe))
        );

        const summary = this.generateSummary(results);
        this.logSummary(summary);

        return summary;
    }

    /**
     * Load a single micro-frontend
     * @param {MFEConfig} mfeConfig - MFE configuration object
     * @returns {Promise<void>}
     */
    async loadSingle(mfeConfig) {
        try {
            console.log(`🔄 Loading ${mfeConfig.name} MFE (${mfeConfig.tech})...`);

            // Execute the import strategy
            const module = await mfeConfig.loader.load();

            // Execute the mount strategy
            await mfeConfig.loader.mount(module);

            // Mark as successful
            this.loadedMFEs.set(mfeConfig.name, mfeConfig);
            
            console.log(`✅ ${mfeConfig.name} MFE loaded successfully`);

            // Notify UI of success
            if (mfeConfig.onSuccess) {
                mfeConfig.onSuccess();
            }

        } catch (error) {
            console.error(`❌ Failed to load ${mfeConfig.name} MFE:`, error.message);

            // Store failure
            this.failedMFEs.set(mfeConfig.name, { mfeConfig, error });

            // Notify UI of failure
            if (mfeConfig.onError) {
                mfeConfig.onError(error);
            }

            throw error; // Re-throw for Promise.allSettled
        }
    }

    /**
     * Generate loading summary
     * @private
     */
    generateSummary(results) {
        const loaded = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        return {
            total: this.mfeRegistry.length,
            loaded,
            failed,
            loadedMFEs: Array.from(this.loadedMFEs.values()),
            failedMFEs: Array.from(this.failedMFEs.values())
        };
    }

    /**
     * Log summary to console
     * @private
     */
    logSummary(summary) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📊 MFE Load Summary`);
        console.log(`${'='.repeat(60)}`);
        console.log(`Total:   ${summary.total}`);
        console.log(`Loaded:  ${summary.loaded} ✅`);
        console.log(`Failed:  ${summary.failed} ❌`);
        console.log(`${'='.repeat(60)}\n`);

        if (summary.failed > 0) {
            console.log('💡 Some MFEs failed, but the app continues working!');
            console.log('This demonstrates fault isolation in micro-frontend architecture.\n');
        }
    }

    /**
     * Get status of a specific MFE
     * @param {string} name - MFE name
     * @returns {string} 'loaded' | 'failed' | 'unknown'
     */
    getStatus(name) {
        if (this.loadedMFEs.has(name)) return 'loaded';
        if (this.failedMFEs.has(name)) return 'failed';
        return 'unknown';
    }
}
