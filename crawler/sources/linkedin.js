// LinkedIn Job Source (using SerpAPI or basic scraping)
import axios from 'axios';
import { config } from '../config.js';
import { normalizeJobData } from '../utils/jobFilter.js';
import { RateLimiter } from '../utils/delay.js';

const rateLimiter = new RateLimiter(config.crawler.rateLimitDelay);

export async function crawlLinkedIn(profile) {
    const jobs = [];
    const { apiKey } = config.apiKeys.serpapi;

    // LinkedIn requires SerpAPI for reliable results
    if (!apiKey) {
        console.warn('SerpAPI key not configured. LinkedIn crawling requires SerpAPI.');
        return jobs;
    }

    const locations = profile?.target_locations || [];
    const roles = profile?.preferred_roles || [];

    for (const location of locations) {
        for (const role of roles) {
            try {
                await rateLimiter.wait();

                const url = 'https://serpapi.com/search.json';
                const params = {
                    engine: 'linkedin_jobs',
                    keywords: role,
                    location: location,
                    api_key: apiKey
                };

                const response = await axios.get(url, { params, timeout: 15000 });
                
                if (response.data && response.data.jobs_results) {
                    const linkedinJobs = response.data.jobs_results.map(result => {
                        return normalizeJobData({
                            title: result.title,
                            company: result.company_name || '',
                            location: result.location || location,
                            url: result.link,
                            description: result.description,
                            salary: result.salary || null,
                            type: result.schedule_type || 'Full-time',
                            remote: result.remote_job ? 'Remote' : 'On-site'
                        }, 'LinkedIn');
                    });

                    jobs.push(...linkedinJobs);
                }
            } catch (error) {
                console.error(`Error fetching LinkedIn jobs for ${location} - ${role}:`, error.message);
            }
        }
    }

    return jobs;
}

