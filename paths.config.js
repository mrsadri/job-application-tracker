/**
 * Centralized Path Configuration
 * 
 * This file contains all file paths, URLs, and directory references used throughout the project.
 * Update paths here to maintain consistency across the entire application.
 */

// Project root directory (for Node.js/backend)
const PROJECT_ROOT = process.cwd();

// Frontend file paths (relative to index.html)
const FRONTEND_PATHS = {
    // Configuration files
    PROFILE: 'my-profile.json',
    PROFILE_EXAMPLE: 'my-profile.example.json',
    APPLICATION_HISTORY: 'application-history.json',
    
    // Assets
    FAVICON_SVG: 'favicon.svg',
    FAVICON_32: 'favicon-32x32.png',
    FAVICON_16: 'favicon-16x16.png',
    APPLE_TOUCH_ICON: 'apple-touch-icon.png',
    
    // Styles and scripts
    STYLES: 'styles.css',
    SCRIPT: 'script.js',
    JOB_API_CONFIG: 'job-api-config.js',
    
    // HTML
    INDEX: 'index.html'
};

// Backend/Crawler file paths (relative to crawler directory)
const BACKEND_PATHS = {
    // Configuration
    CONFIG: './config.js',
    PROFILE: '../my-profile.json',
    PROFILE_EXAMPLE: '../my-profile.example.json',
    
    // Source files
    CRAWLER: './crawler.js',
    SERVER: './server.js',
    TEST_CRAWLER: './test-crawler.js',
    
    // Sources directory
    SOURCES_DIR: './sources',
    SOURCES: {
        ADZUNA: './sources/adzuna.js',
        INDEED: './sources/indeed.js',
        LINKEDIN: './sources/linkedin.js',
        REED: './sources/reed.js',
        TELEGRAM: './sources/telegram.js',
        JAABZ: './sources/jaabz.js'
    },
    
    // Utils directory
    UTILS_DIR: './utils',
    UTILS: {
        DELAY: './utils/delay.js',
        JOB_FILTER: './utils/jobFilter.js',
        ROBOTS: './utils/robots.js'
    }
};

// API endpoints and URLs
const API_PATHS = {
    // Crawler API (backend)
    CRAWLER_BASE: process.env.CRAWLER_API_URL || 'http://localhost:3000/api',
    CRAWLER_ENDPOINTS: {
        CRAWL: '/crawl',
        CRAWL_SOURCE: '/crawl/:source',
        STATUS: '/status',
        HEALTH: '/health'
    },
    
    // External job APIs
    EXTERNAL: {
        REMOTIVE: 'https://remotive.com/api/remote-jobs',
        ARBEITNOW: 'https://www.arbeitnow.com/api/job-board-api',
        GITHUB_JOBS: 'https://jobs.github.com/positions.json',
        ADZUNA: 'https://api.adzuna.com/v1/api/jobs',
        REED: 'https://www.reed.co.uk/api/1.0/search',
        SERPAPI: 'https://serpapi.com/search'
    }
};

// LocalStorage keys
const STORAGE_KEYS = {
    APPLICATIONS: 'applications',
    SUGGESTED_JOBS: 'suggestedJobs',
    HR_CONTACTS: 'hrContacts',
    REJECTION_EMAILS: 'rejectionEmails',
    COVER_LETTERS: 'coverLetters',
    PROCESS_LOGS: 'processLogs',
    RECRUITERS: 'recruiters',
    RECRUITER_INTERACTIONS: 'recruiterInteractions',
    HIRING_MANAGERS: 'hiringManagers',
    NETWORKING_ACTIVITIES: 'networkingActivities',
    AI_TASKS: 'aiTasks',
    LINKEDIN_CONTENT: 'linkedinContent',
    CONTENT_IDEAS: 'contentIdeas', // Alias for linkedinContent
    LINKEDIN_ACTIVITIES: 'linkedinActivities',
    PORTFOLIO_ITEMS: 'portfolioItems',
    PROFILE_VIEWS: 'profileViews',
    INBOUND_OPPORTUNITIES: 'inboundOpportunities',
    LINKEDIN_WEEKLY_TASKS: 'linkedinWeeklyTasks',
    WEEKLY_TASKS: 'weeklyTasks' // Alias for linkedinWeeklyTasks
};

// Documentation files
const DOCS_PATHS = {
    README: 'README.md',
    QUICK_START: 'QUICK_START.md',
    DEPLOYMENT: 'DEPLOYMENT.md',
    CRAWLER_SETUP: 'CRAWLER_SETUP.md',
    USER_STORIES: 'USER_STORIES.md',
    PROJECT_BRIEF: 'PROJECT_BRIEF.md',
    PROJECT_SUMMARY: 'PROJECT_SUMMARY.md',
    IMPLEMENTATION_STATUS: 'IMPLEMENTATION_STATUS.md',
    STRATEGIES_PLAN: 'STRATEGIES_IMPLEMENTATION_PLAN.md',
    ACCESSIBILITY: 'ACCESSIBILITY_IMPROVEMENTS.md',
    GPT_AGENT_SETUP: 'GPT_AGENT_SETUP_GUIDE.md',
    JOB_FILTERING: 'JOB_FILTERING_IMPROVEMENTS.md',
    SUGGESTED_JOBS: 'SUGGESTED_JOBS_GUIDE.md',
    UX_REVIEW: 'UX_REVIEW.md',
    CRAWLER_README: 'crawler/README.md'
};

// Export for different environments
if (typeof window !== 'undefined') {
    // Browser environment
    window.PATHS = {
        FRONTEND: FRONTEND_PATHS,
        API: API_PATHS,
        STORAGE: STORAGE_KEYS
    };
}

if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        PROJECT_ROOT,
        FRONTEND_PATHS,
        BACKEND_PATHS,
        API_PATHS,
        STORAGE_KEYS,
        DOCS_PATHS
    };
}

// ES6 module export (for crawler)
export {
    PROJECT_ROOT,
    FRONTEND_PATHS,
    BACKEND_PATHS,
    API_PATHS,
    STORAGE_KEYS,
    DOCS_PATHS
};

