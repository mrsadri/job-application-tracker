# Job Crawler Setup Guide

This guide explains how to set up and use the job crawler service for the Dublin Job Application Tracker.

## Overview

The crawler service is a Node.js backend that aggregates job postings from multiple sources:
- **Adzuna** - Free tier available (1000 requests/month)
- **Indeed** - Free scraping or SerpAPI integration
- **LinkedIn** - Requires SerpAPI key
- **Reed** - Requires API key

## Quick Start

### 1. Install Dependencies

```bash
cd crawler
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API keys (at least one source recommended).

### 3. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

### 4. Update Frontend Configuration

In your `index.html` or `script.js`, set the crawler API URL:

```javascript
// Add this before script.js loads
<script>
    window.CRAWLER_API_URL = 'http://localhost:3000/api/crawl';
</script>
```

Or update `script.js` directly to use your production API URL.

## API Keys (Optional but Recommended)

### Adzuna (Free - Recommended to Start)
1. Visit https://developer.adzuna.com/
2. Sign up for free account
3. Get App ID and App Key
4. Add to `.env`:
   ```
   ADZUNA_APP_ID=your_app_id
   ADZUNA_APP_KEY=your_app_key
   ```

### SerpAPI (For LinkedIn & Enhanced Indeed)
1. Visit https://serpapi.com/
2. Sign up (has free tier)
3. Get API key
4. Add to `.env`:
   ```
   SERPAPI_KEY=your_serpapi_key
   ```

### Reed (UK Jobs)
1. Visit https://www.reed.co.uk/developers
2. Sign up and get API key
3. Add to `.env`:
   ```
   REED_API_KEY=your_reed_api_key
   ```

## How It Works

1. **User clicks "Update Jobs"** in the frontend
2. **Frontend calls crawler API** with user profile
3. **Crawler searches multiple sources** based on profile preferences
4. **Jobs are filtered** by location, role, and skills
5. **Duplicates are removed**
6. **Only jobs from last 2 weeks** are returned
7. **Frontend displays results** in suggested jobs section

## Profile-Based Filtering

The crawler uses your `my-profile.json` to filter jobs:
- **target_locations**: Only jobs in these locations
- **preferred_roles**: Jobs matching these roles
- **skills**: Jobs mentioning these skills

## Deployment Options

### Local Development
```bash
npm start
```

### Production Server
Deploy to:
- Heroku
- DigitalOcean
- AWS EC2
- Any Node.js hosting

### Serverless
Adapt for:
- Vercel Functions
- Netlify Functions
- AWS Lambda

## Testing

Test the crawler API:

```bash
# Health check
curl http://localhost:3000/health

# Get status
curl http://localhost:3000/api/status

# Crawl jobs
curl -X POST http://localhost:3000/api/crawl \
  -H "Content-Type: application/json" \
  -d '{"profile": {"target_locations": ["Dublin, Ireland"], "preferred_roles": ["Software Engineer"]}}'
```

## Troubleshooting

### Frontend can't connect to crawler
- Ensure server is running: `npm start`
- Check CORS settings in `.env`
- Verify API URL in frontend matches server port

### No jobs returned
- Check API keys are valid
- Verify profile preferences aren't too restrictive
- Check server logs for errors

### Rate limiting errors
- Increase `RATE_LIMIT_DELAY` in `.env`
- Reduce `MAX_JOBS_PER_SOURCE`

## Next Steps

1. Set up at least one API key (Adzuna recommended)
2. Start the crawler server
3. Test the integration
4. Deploy to production when ready

For detailed API documentation, see `crawler/README.md`.

