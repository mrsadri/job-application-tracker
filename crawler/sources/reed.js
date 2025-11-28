// Reed.co.uk Job Source
import axios from 'axios';
import { config } from '../config.js';
import { normalizeJobData } from '../utils/jobFilter.js';
import { RateLimiter } from '../utils/delay.js';
import { Buffer } from 'buffer';

const rateLimiter = new RateLimiter(config.crawler.rateLimitDelay);

export async function crawlReed(profile) {
    const jobs = [];
    const { apiKey } = config.apiKeys.reed;

    if (!apiKey) {
        console.warn('Reed API key not configured');
        return jobs;
    }

    const locations = profile?.target_locations || [];
    const roles = profile?.preferred_roles || [];

    for (const location of locations) {
        for (const role of roles) {
            try {
                await rateLimiter.wait();

                const url = 'https://www.reed.co.uk/api/1.0/search';
                const params = {
                    keywords: role,
                    locationName: location,
                    resultsToTake: 50,
                    resultsToSkip: 0
                };

                const response = await axios.get(url, {
                    params,
                    headers: {
                        'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`
                    },
                    timeout: 10000
                });

                if (response.data && response.data.results) {
                    const reedJobs = response.data.results.map(result => {
                        return normalizeJobData({
                            id: result.jobId,
                            title: result.jobTitle,
                            company: result.employerName || '',
                            location: result.locationName || location,
                            url: result.jobUrl,
                            description: result.jobDescription,
                            created: result.date,
                            salary: result.salary || null,
                            type: result.jobType || 'Full-time',
                            remote: result.workFromHome ? 'Remote' : 'On-site'
                        }, 'Reed');
                    });

                    jobs.push(...reedJobs);
                }
            } catch (error) {
                console.error(`Error fetching Reed jobs for ${location} - ${role}:`, error.message);
            }
        }
    }

    return jobs;
}

