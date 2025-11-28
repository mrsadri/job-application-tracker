/**
 * Backend/Crawler Path Configuration
 * 
 * This file contains all file paths and directory references for the crawler backend.
 * Import this file to use consistent paths across all crawler modules.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Project root (parent directory of crawler)
export const PROJECT_ROOT = join(__dirname, '..');

// Profile file paths
export const PROFILE_PATHS = {
    PROFILE: join(PROJECT_ROOT, 'my-profile.json'),
    PROFILE_EXAMPLE: join(PROJECT_ROOT, 'my-profile.example.json')
};

// Crawler source files
export const SOURCE_PATHS = {
    ADZUNA: './sources/adzuna.js',
    INDEED: './sources/indeed.js',
    LINKEDIN: './sources/linkedin.js',
    REED: './sources/reed.js',
    TELEGRAM: './sources/telegram.js',
    JAABZ: './sources/jaabz.js'
};

// Utility files
export const UTIL_PATHS = {
    DELAY: './utils/delay.js',
    JOB_FILTER: './utils/jobFilter.js',
    ROBOTS: './utils/robots.js'
};

// Main crawler files
export const CRAWLER_PATHS = {
    CONFIG: './config.js',
    CRAWLER: './crawler.js',
    SERVER: './server.js',
    TEST_CRAWLER: './test-crawler.js'
};

