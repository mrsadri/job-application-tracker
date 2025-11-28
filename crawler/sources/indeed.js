// Indeed Job Source (using SerpAPI or direct scraping)
import axios from 'axios';
import * as cheerio from 'cheerio';
import { config } from '../config.js';
import { normalizeJobData } from '../utils/jobFilter.js';
import { canCrawl } from '../utils/robots.js';
import { RateLimiter } from '../utils/delay.js';

const rateLimiter = new RateLimiter(config.crawler.rateLimitDelay);

export async function crawlIndeed(profile) {
    const jobs = [];
    const locations = profile?.target_locations || [];
    const roles = profile?.preferred_roles || [];

    // Indeed uses SerpAPI for better results, but we can also try direct scraping
    if (config.apiKeys.serpapi.apiKey) {
        return await crawlIndeedViaSerpAPI(profile);
    }

    // Fallback to basic scraping (limited and may be blocked)
    for (const location of locations) {
        for (const role of roles) {
            try {
                await rateLimiter.wait();

                const searchUrl = `https://ie.indeed.com/jobs?q=${encodeURIComponent(role)}&l=${encodeURIComponent(location)}&sort=date`;
                
                // Check robots.txt
                if (config.crawler.respectRobotsTxt) {
                    const allowed = await canCrawl(searchUrl);
                    if (!allowed) {
                        console.warn(`Crawling not allowed for ${searchUrl} by robots.txt`);
                        continue;
                    }
                }

                const response = await axios.get(searchUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout: 10000
                });

                const $ = cheerio.load(response.data);
                
                $('.job_seen_beacon, .jobCard').each((i, element) => {
                    if (jobs.length >= config.crawler.maxJobsPerSource) return false;

                    const $el = $(element);
                    const title = $el.find('h2.jobTitle a, .jobTitle a').text().trim();
                    const company = $el.find('.companyName').text().trim();
                    const locationText = $el.find('.companyLocation').text().trim();
                    const url = $el.find('h2.jobTitle a, .jobTitle a').attr('href');
                    const description = $el.find('.job-snippet').text().trim();
                    const salary = $el.find('.salary-snippet').text().trim();

                    if (title && company) {
                        const job = normalizeJobData({
                            title,
                            company,
                            location: locationText || location,
                            url: url ? `https://ie.indeed.com${url}` : '',
                            description,
                            salary: salary || null,
                            type: 'Full-time',
                            remote: null
                        }, 'Indeed');
                        jobs.push(job);
                    }
                });
            } catch (error) {
                console.error(`Error fetching Indeed jobs for ${location} - ${role}:`, error.message);
            }
        }
    }

    return jobs;
}

async function crawlIndeedViaSerpAPI(profile) {
    const jobs = [];
    const { apiKey } = config.apiKeys.serpapi;
    const locations = profile?.target_locations || [];
    const roles = profile?.preferred_roles || [];

    for (const location of locations) {
        for (const role of roles) {
            try {
                await rateLimiter.wait();

                const url = 'https://serpapi.com/search.json';
                const params = {
                    engine: 'indeed',
                    q: role,
                    location: location,
                    api_key: apiKey,
                    sort: 'date'
                };

                const response = await axios.get(url, { params, timeout: 15000 });
                
                if (response.data && response.data.organic_results) {
                    const indeedJobs = response.data.organic_results.map(result => {
                        return normalizeJobData({
                            title: result.title,
                            company: result.company_name || result.snippet?.split(' - ')[0] || '',
                            location: result.location || location,
                            url: result.link,
                            description: result.snippet,
                            salary: result.salary || null,
                            type: 'Full-time',
                            remote: null
                        }, 'Indeed');
                    });

                    jobs.push(...indeedJobs);
                }
            } catch (error) {
                console.error(`Error fetching Indeed jobs via SerpAPI for ${location} - ${role}:`, error.message);
            }
        }
    }

    return jobs;
}

