// Adzuna API Job Source
import axios from 'axios';
import { config } from '../config.js';
import { normalizeJobData } from '../utils/jobFilter.js';
import { RateLimiter } from '../utils/delay.js';

const rateLimiter = new RateLimiter(config.crawler.rateLimitDelay);

export async function crawlAdzuna(profile) {
    const jobs = [];
    const { appId, appKey } = config.apiKeys.adzuna;

    if (!appId || !appKey) {
        console.warn('Adzuna API credentials not configured');
        return jobs;
    }

    const locations = profile?.target_locations || [];
    const roles = profile?.preferred_roles || [];

    // Map locations to Adzuna country codes
    const countryMap = {
        'Ireland': 'ie',
        'Netherlands': 'nl',
        'United Kingdom': 'gb',
        'England': 'gb'
    };

    for (const location of locations) {
        // Extract country from location
        let countryCode = 'ie'; // Default to Ireland
        for (const [country, code] of Object.entries(countryMap)) {
            if (location.includes(country)) {
                countryCode = code;
                break;
            }
        }

        for (const role of roles) {
            try {
                await rateLimiter.wait();

                const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1`;
                const params = {
                    app_id: appId,
                    app_key: appKey,
                    results_per_page: 50,
                    what: role,
                    where: location,
                    sort_by: 'date',
                    content_type: 'application/json'
                };

                const response = await axios.get(url, { params, timeout: 10000 });
                
                if (response.data && response.data.results) {
                    const adzunaJobs = response.data.results.map(result => {
                        const job = normalizeJobData({
                            id: result.id || result.guid,
                            title: result.title,
                            company: result.company?.display_name || 'Unknown',
                            location: result.location?.display_name || location,
                            url: result.redirect_url,
                            description: result.description,
                            created: result.created,
                            salary: result.salary_min && result.salary_max 
                                ? `${result.salary_min} - ${result.salary_max} ${result.salary_is_predicted ? '(est.)' : ''}`
                                : null,
                            type: result.contract_type || 'Full-time',
                            remote: result.remote ? 'Remote' : 'On-site'
                        }, 'Adzuna');
                        return job;
                    });

                    jobs.push(...adzunaJobs);
                }
            } catch (error) {
                console.error(`Error fetching Adzuna jobs for ${location} - ${role}:`, error.message);
            }
        }
    }

    return jobs;
}

