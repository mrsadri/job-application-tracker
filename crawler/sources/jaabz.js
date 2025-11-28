// Jaabz.com Job Crawler
// Fetches jobs with visa sponsorship from jaabz.com
import axios from 'axios';
import * as cheerio from 'cheerio';
import { delay } from '../utils/delay.js';
import { checkRobotsTxt } from '../utils/robots.js';

export async function crawlJaabz(profile) {
    const jobs = [];
    
    try {
        // Map location names to Jaabz location IDs
        // Based on the example URL: included_location_ids[]=234,346,342,270
        const locationIdMap = {
            'dublin': [234],
            'amsterdam': [346],
            'eindhoven': [342],
            'rotterdam': [270],
            'utrecht': [270], // May need adjustment
            'cork': [234], // Using Ireland ID
            'leeds': [234], // Using UK ID
            'netherlands': [346, 342, 270],
            'ireland': [234],
            'england': [234],
            'uk': [234]
        };
        
        // Get location IDs for target locations
        const locationIds = new Set();
        const targetLocations = profile?.target_locations || [];
        
        targetLocations.forEach(location => {
            const locationLower = location.toLowerCase();
            for (const [key, ids] of Object.entries(locationIdMap)) {
                if (locationLower.includes(key)) {
                    ids.forEach(id => locationIds.add(id));
                }
            }
        });
        
        // If no location IDs found, use default IDs from the example
        if (locationIds.size === 0) {
            [234, 346, 342, 270].forEach(id => locationIds.add(id));
        }
        
        // Build search keywords from roles
        const preferredRoles = profile?.preferred_roles || ['Designer'];
        const keywords = preferredRoles.slice(0, 2).map(role => {
            const roleLower = role.toLowerCase();
            if (roleLower.includes('designer')) return 'Designer';
            if (roleLower.includes('engineer')) return 'Engineer';
            if (roleLower.includes('developer')) return 'Developer';
            return role.split(' ').pop();
        });
        
        const keyword = keywords[0] || 'Designer';
        
        // Build URL
        const locationParams = Array.from(locationIds).map(id => `included_location_ids[]=${id}`).join('&');
        const url = `https://jaabz.com/jobs?visa_sponsorship=1&keyword=${encodeURIComponent(keyword)}&${locationParams}&posted=14`;
        
        // Check robots.txt
        await checkRobotsTxt('https://jaabz.com');
        
        // Fetch the page
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });
        
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            
            // Try different selectors based on common job listing patterns
            const jobSelectors = [
                '[data-job-id]',
                '.job-card',
                '.job-listing',
                'article.job',
                '.job-item',
                '[class*="job"]'
            ];
            
            let jobElements = $();
            for (const selector of jobSelectors) {
                jobElements = $(selector);
                if (jobElements.length > 0) {
                    console.log(`Found ${jobElements.length} jobs using selector: ${selector}`);
                    break;
                }
            }
            
            jobElements.each((index, element) => {
                try {
                    const $el = $(element);
                    
                    // Extract job information
                    const titleEl = $el.find('h2, h3, .job-title, [class*="title"], a[href*="/jobs/"]').first();
                    const companyEl = $el.find('.company, [class*="company"], .employer, [class*="employer"]').first();
                    const locationEl = $el.find('.location, [class*="location"]').first();
                    const linkEl = $el.find('a[href*="/jobs/"], a[href*="/job/"]').first();
                    const descriptionEl = $el.find('.description, [class*="description"], .summary').first();
                    
                    const title = titleEl.text().trim() || titleEl.attr('title') || '';
                    const company = companyEl.text().trim() || 'Unknown';
                    const location = locationEl.text().trim() || targetLocations[0] || 'Unknown';
                    let jobUrl = linkEl.attr('href') || '';
                    
                    if (jobUrl && !jobUrl.startsWith('http')) {
                        jobUrl = `https://jaabz.com${jobUrl}`;
                    } else if (!jobUrl) {
                        jobUrl = url; // Fallback to search URL
                    }
                    
                    const description = descriptionEl.text().trim() || $el.text().substring(0, 300) + '...';
                    
                    if (title) {
                        jobs.push({
                            id: `jaabz-${Date.now()}-${index}`,
                            title: title,
                            company: company,
                            location: location,
                            url: jobUrl,
                            description: description,
                            created: new Date().toISOString(), // Jaabz shows recent jobs (posted=14)
                            salary: null,
                            type: 'Full-time',
                            remote: 'On-site',
                            source: 'Jaabz'
                        });
                    }
                } catch (error) {
                    console.warn(`Error parsing Jaabz job element ${index}:`, error.message);
                }
            });
            
            // If no jobs found with selectors, try to find any links to /jobs/ or /job/
            if (jobs.length === 0) {
                console.log('No jobs found with standard selectors, trying alternative method...');
                const jobLinks = $('a[href*="/jobs/"], a[href*="/job/"]');
                console.log(`Found ${jobLinks.length} potential job links`);
                
                jobLinks.each((index, element) => {
                    const $el = $(element);
                    const title = $el.text().trim();
                    const href = $el.attr('href');
                    
                    if (title && href && title.length > 5 && !title.toLowerCase().includes('view all')) {
                        // Try to find company and location from parent elements
                        const parent = $el.parent().parent();
                        const company = parent.find('[class*="company"], [class*="employer"]').first().text().trim() || 'Unknown';
                        const location = parent.find('[class*="location"]').first().text().trim() || targetLocations[0] || 'Unknown';
                        
                        jobs.push({
                            id: `jaabz-${Date.now()}-${index}`,
                            title: title,
                            company: company,
                            location: location,
                            url: href.startsWith('http') ? href : `https://jaabz.com${href}`,
                            description: '',
                            created: new Date().toISOString(),
                            salary: null,
                            type: 'Full-time',
                            remote: 'On-site',
                            source: 'Jaabz'
                        });
                    }
                });
                
                console.log(`Extracted ${jobs.length} jobs from links`);
            }
            
            if (jobs.length === 0) {
                console.warn('⚠️ No jobs found from Jaabz. Possible reasons:');
                console.warn('   1. The page structure may have changed');
                console.warn('   2. No jobs match the search criteria');
                console.warn('   3. The URL parameters may be incorrect');
                console.warn(`   URL used: ${url}`);
            } else {
                console.log(`✅ Successfully extracted ${jobs.length} jobs from Jaabz`);
            }
        }
        
        // Add delay to be respectful
        await delay(1000);
        
    } catch (error) {
        console.error('Error crawling Jaabz:', error.message);
        throw error;
    }
    
    return jobs;
}

