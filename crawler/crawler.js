// Main Crawler Orchestrator
import { crawlAdzuna } from './sources/adzuna.js';
import { crawlIndeed } from './sources/indeed.js';
import { crawlLinkedIn } from './sources/linkedin.js';
import { crawlReed } from './sources/reed.js';
import { filterJobsByProfile, deduplicateJobs } from './utils/jobFilter.js';
import { config, defaultProfile } from './config.js';

export class JobCrawler {
    constructor(profile = null) {
        this.profile = profile || defaultProfile;
        this.sources = [];
    }

    // Register available sources
    registerSources() {
        this.sources = [
            { name: 'Adzuna', enabled: !!config.apiKeys.adzuna.appId, crawl: crawlAdzuna },
            { name: 'Indeed', enabled: true, crawl: crawlIndeed },
            { name: 'LinkedIn', enabled: !!config.apiKeys.serpapi.apiKey, crawl: crawlLinkedIn },
            { name: 'Reed', enabled: !!config.apiKeys.reed.apiKey, crawl: crawlReed }
        ];
    }

    async crawlAll() {
        console.log('Starting job crawl...');
        console.log(`Profile: ${JSON.stringify(this.profile, null, 2)}`);

        this.registerSources();
        const allJobs = [];

        // Crawl each enabled source
        for (const source of this.sources) {
            if (!source.enabled) {
                console.log(`Skipping ${source.name} - not enabled or missing API key`);
                continue;
            }

            try {
                console.log(`Crawling ${source.name}...`);
                const jobs = await source.crawl(this.profile);
                console.log(`Found ${jobs.length} jobs from ${source.name}`);
                allJobs.push(...jobs);
            } catch (error) {
                console.error(`Error crawling ${source.name}:`, error.message);
            }
        }

        // Filter jobs by profile
        console.log(`Total jobs before filtering: ${allJobs.length}`);
        const filteredJobs = filterJobsByProfile(allJobs, this.profile);
        console.log(`Total jobs after filtering: ${filteredJobs.length}`);

        // Remove duplicates
        const uniqueJobs = deduplicateJobs(filteredJobs);
        console.log(`Total unique jobs: ${uniqueJobs.length}`);

        // Filter jobs from last 2 weeks
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        const recentJobs = uniqueJobs.filter(job => {
            const jobDate = new Date(job.created);
            return jobDate >= twoWeeksAgo;
        });

        console.log(`Total recent jobs (last 2 weeks): ${recentJobs.length}`);

        return {
            jobs: recentJobs,
            stats: {
                total: uniqueJobs.length,
                recent: recentJobs.length,
                sources: this.sources.filter(s => s.enabled).map(s => s.name)
            }
        };
    }

    async crawlSource(sourceName) {
        this.registerSources();
        const source = this.sources.find(s => s.name === sourceName);

        if (!source) {
            throw new Error(`Source ${sourceName} not found`);
        }

        if (!source.enabled) {
            throw new Error(`Source ${sourceName} is not enabled`);
        }

        console.log(`Crawling ${sourceName}...`);
        const jobs = await source.crawl(this.profile);
        const filteredJobs = filterJobsByProfile(jobs, this.profile);
        const uniqueJobs = deduplicateJobs(filteredJobs);

        return {
            jobs: uniqueJobs,
            source: sourceName
        };
    }
}

