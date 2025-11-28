// Job API Configuration
// This file contains configuration for different job search APIs
// You can uncomment and configure the API you want to use

const JobAPIConfig = {
    // Adzuna API (https://developer.adzuna.com/)
    // Free tier: 1000 requests/month
    adzuna: {
        enabled: false,
        appId: 'YOUR_APP_ID', // Get from https://developer.adzuna.com/
        appKey: 'YOUR_APP_KEY',
        baseUrl: 'https://api.adzuna.com/v1/api/jobs',
        countries: {
            'Ireland': 'ie',
            'Netherlands': 'nl',
            'United Kingdom': 'gb'
        }
    },

    // Reed API (https://www.reed.co.uk/developers)
    // Requires API key
    reed: {
        enabled: false,
        apiKey: 'YOUR_API_KEY', // Get from https://www.reed.co.uk/developers
        baseUrl: 'https://www.reed.co.uk/api/1.0/search'
    },

    // SerpAPI (https://serpapi.com/)
    // Paid service but has free tier
    serpapi: {
        enabled: false,
        apiKey: 'YOUR_API_KEY', // Get from https://serpapi.com/
        baseUrl: 'https://serpapi.com/search'
    },

    // CORS Proxy (for APIs that don't support CORS)
    // You can use services like https://cors-anywhere.herokuapp.com/ or run your own
    corsProxy: {
        enabled: false,
        url: 'https://cors-anywhere.herokuapp.com/' // Replace with your own proxy if needed
    },

    // Job Crawler Service (Backend API)
    // Set this to your crawler service URL when deployed
    crawler: {
        enabled: true,
        baseUrl: (window.PATHS && window.PATHS.API && window.PATHS.API.CRAWLER_BASE) || window.CRAWLER_API_URL || 'http://localhost:3000/api',
        endpoints: {
            crawl: (window.PATHS && window.PATHS.API && window.PATHS.API.CRAWLER_ENDPOINTS && window.PATHS.API.CRAWLER_ENDPOINTS.CRAWL) || '/crawl',
            status: (window.PATHS && window.PATHS.API && window.PATHS.API.CRAWLER_ENDPOINTS && window.PATHS.API.CRAWLER_ENDPOINTS.STATUS) || '/status'
        }
    }
};

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JobAPIConfig;
}

