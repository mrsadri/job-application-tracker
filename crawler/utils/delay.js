// Utility function to add delays between requests
export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Rate limiter to respect API limits
export class RateLimiter {
    constructor(delayMs = 2000) {
        this.delayMs = delayMs;
        this.lastRequest = 0;
    }

    async wait() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequest;
        
        if (timeSinceLastRequest < this.delayMs) {
            const waitTime = this.delayMs - timeSinceLastRequest;
            await delay(waitTime);
        }
        
        this.lastRequest = Date.now();
    }
}

