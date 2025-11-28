# Suggested Jobs Feature Guide

## Overview

The Suggested Jobs feature automatically finds job postings from the internet based on your profile preferences. It shows jobs posted in the last 2 weeks and allows you to track your actions (Applied, Declined, or Do Nothing).

## Features

- **Automatic Job Discovery**: Fetches jobs based on your profile preferences (locations, roles, skills)
- **2-Week Filter**: Only shows jobs posted in the last 2 weeks
- **Action Tracking**: Track whether you've applied, declined, or taken no action on each job
- **Persistent Storage**: Your job states are saved in localStorage
- **Quick Apply**: Click "Apply" to automatically open the application form with pre-filled data

## How to Use

1. **Refresh Jobs**: Click the "🔄 Refresh Jobs" button to search for new job postings
2. **View Job**: Click "View Job →" to open the job posting in a new tab
3. **Mark as Applied**: Click "✓ Apply" to mark the job as applied and optionally add it to your applications
4. **Mark as Declined**: Click "✗ Decline" to mark the job as declined (it will be grayed out)
5. **Do Nothing**: Click "○ Do Nothing" to mark that you haven't taken action yet

## Setting Up Real Job APIs

Currently, the app uses mock data for demonstration. To connect to real job APIs:

### Option 1: Adzuna API (Recommended - Free Tier Available)

1. Sign up at https://developer.adzuna.com/
2. Get your App ID and App Key
3. Open `job-api-config.js`
4. Update the Adzuna configuration:
   ```javascript
   adzuna: {
       enabled: true,
       appId: 'YOUR_APP_ID',
       appKey: 'YOUR_APP_KEY',
       // ...
   }
   ```
5. In `script.js`, uncomment the Adzuna API code in the `searchJobsFromAPI` method

### Option 2: Reed API

1. Sign up at https://www.reed.co.uk/developers
2. Get your API key
3. Update `job-api-config.js` with your Reed API key
4. Implement the Reed API integration in `script.js`

### Option 3: Custom Backend Proxy

If you want to use APIs that don't support CORS:
1. Create a simple backend server (Node.js, Python, etc.)
2. Have your backend fetch jobs from various APIs
3. Update the `searchJobsFromAPI` method to call your backend endpoint

## Job Card Information

Each suggested job card displays:
- **Job Title**: The position title
- **Company Name**: The hiring company
- **Location**: Job location
- **Post Date**: When the job was posted (with "X days ago" indicator)
- **Description**: Job description (if available)
- **Salary**: Salary range (if available)
- **Job Type**: Full-time, Part-time, etc.
- **Remote Options**: Remote, Hybrid, or On-site
- **State Badge**: Shows if you've applied, declined, or done nothing

## Filtering

Jobs are automatically filtered to:
- Match your preferred locations from `my-profile.json`
- Match your preferred roles from `my-profile.json`
- Only show jobs posted in the last 2 weeks
- Exclude duplicates (jobs you've already seen)

## Data Storage

Suggested jobs and their states are stored in browser localStorage under the key `suggestedJobs`. This means:
- Your data persists between browser sessions
- Data is stored locally on your device
- Clearing browser data will remove your job states

## Troubleshooting

**No jobs showing up?**
- Make sure you've clicked "Refresh Jobs"
- Check that your profile preferences are set in `my-profile.json`
- If using real APIs, verify your API keys are correct

**Jobs not updating?**
- Click "Refresh Jobs" to fetch new postings
- Old jobs (older than 2 weeks) are automatically filtered out

**Want to clear all suggested jobs?**
- Open browser console (F12)
- Run: `localStorage.removeItem('suggestedJobs')`
- Refresh the page

## Future Enhancements

Potential improvements you could add:
- Integration with more job boards (LinkedIn, Indeed, etc.)
- Email notifications for new matching jobs
- Job matching score based on your skills
- Export suggested jobs to CSV
- Integration with calendar for application deadlines

