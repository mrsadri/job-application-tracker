// Express API Server for Job Crawler
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { JobCrawler } from './crawler.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors({
    origin: config.cors.origin,
    credentials: true
}));
app.use(express.json());

// Load user profile
function loadProfile() {
    try {
        const profilePath = join(__dirname, '..', 'my-profile.json');
        const profileData = readFileSync(profilePath, 'utf-8');
        return JSON.parse(profileData);
    } catch (error) {
        console.warn('Could not load profile, using defaults:', error.message);
        return null;
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get crawler status
app.get('/api/status', (req, res) => {
    res.json({
        enabled: config.crawler.enabled,
        schedule: config.crawler.schedule,
        sources: {
            adzuna: !!config.apiKeys.adzuna.appId,
            indeed: true,
            linkedin: !!config.apiKeys.serpapi.apiKey,
            reed: !!config.apiKeys.reed.apiKey
        }
    });
});

// Crawl all sources
app.post('/api/crawl', async (req, res) => {
    try {
        const profile = req.body.profile || loadProfile();
        const crawler = new JobCrawler(profile);
        
        const result = await crawler.crawlAll();
        
        res.json({
            success: true,
            ...result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Crawl error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Crawl specific source
app.post('/api/crawl/:source', async (req, res) => {
    try {
        const { source } = req.params;
        const profile = req.body.profile || loadProfile();
        const crawler = new JobCrawler(profile);
        
        // Handle LinkedIn and Telegram as special cases
        if (source.toLowerCase() === 'linkedin') {
            const { crawlLinkedIn } = await import('./sources/linkedin.js');
            const jobs = await crawlLinkedIn(profile);
            return res.json({
                success: true,
                jobs: jobs,
                source: 'LinkedIn',
                timestamp: new Date().toISOString()
            });
        }
        
        if (source.toLowerCase() === 'telegram') {
            const { crawlTelegram } = await import('./sources/telegram.js');
            const jobs = await crawlTelegram(profile);
            return res.json({
                success: true,
                jobs: jobs,
                source: 'Telegram',
                timestamp: new Date().toISOString()
            });
        }
        
        const result = await crawler.crawlSource(source);
        
        res.json({
            success: true,
            ...result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Crawl error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Job Crawler API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Crawl endpoint: POST http://localhost:${PORT}/api/crawl`);
});

