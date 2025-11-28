// Robots.txt checker utility
import robotsParser from 'robots-parser';
import axios from 'axios';

const robotsCache = new Map();

export async function checkRobotsTxt(url, userAgent = 'JobCrawler/1.0') {
    try {
        const baseUrl = new URL(url).origin;
        
        // Check cache first
        if (robotsCache.has(baseUrl)) {
            return robotsCache.get(baseUrl);
        }

        const robotsUrl = `${baseUrl}/robots.txt`;
        const response = await axios.get(robotsUrl, {
            timeout: 5000,
            headers: {
                'User-Agent': userAgent
            }
        });

        const robots = robotsParser(robotsUrl, response.data);
        robotsCache.set(baseUrl, robots);
        
        return robots;
    } catch (error) {
        // If robots.txt doesn't exist or can't be fetched, allow crawling
        console.warn(`Could not fetch robots.txt for ${url}:`, error.message);
        return null;
    }
}

export async function canCrawl(url, userAgent = 'JobCrawler/1.0') {
    const robots = await checkRobotsTxt(url, userAgent);
    
    if (!robots) {
        return true; // Allow if robots.txt is not available
    }

    return robots.isAllowed(url, userAgent);
}

