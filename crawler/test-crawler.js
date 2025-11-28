// Simple test script for the crawler
import { JobCrawler } from './crawler.js';
import { readFileSync } from 'fs';
import { PROFILE_PATHS } from './paths.config.js';

// Load profile
let profile;
try {
    const profileData = readFileSync(PROFILE_PATHS.PROFILE, 'utf-8');
    profile = JSON.parse(profileData);
    console.log('Loaded profile from my-profile.json');
} catch (error) {
    console.warn('Could not load profile, using defaults');
    profile = null;
}

// Test crawler
async function test() {
    console.log('Testing Job Crawler...\n');
    
    const crawler = new JobCrawler(profile);
    
    try {
        const result = await crawler.crawlAll();
        
        console.log('\n=== Crawler Results ===');
        console.log(`Total jobs found: ${result.stats.total}`);
        console.log(`Recent jobs (last 2 weeks): ${result.stats.recent}`);
        console.log(`Sources crawled: ${result.stats.sources.join(', ')}`);
        console.log(`\nFirst 5 jobs:`);
        
        result.jobs.slice(0, 5).forEach((job, index) => {
            console.log(`\n${index + 1}. ${job.title} at ${job.company}`);
            console.log(`   Location: ${job.location}`);
            console.log(`   Source: ${job.source}`);
            console.log(`   URL: ${job.url}`);
        });
        
    } catch (error) {
        console.error('Crawler test failed:', error);
        process.exit(1);
    }
}

test();

