# Job Crawler Service

A comprehensive web crawler service for aggregating job postings from multiple sources including Adzuna, Indeed, LinkedIn, and Reed.

## Features

- 🔍 Multi-source job aggregation (Adzuna, Indeed, LinkedIn, Reed)
- 🎯 Profile-based job filtering (location, role, skills)
- 🤖 Robots.txt compliance
- ⏱️ Rate limiting and respectful crawling
- 🔄 Deduplication of job postings
- 📅 Filters jobs from last 2 weeks
- 🚀 RESTful API for easy integration
- ⚙️ Configurable via environment variables

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. Navigate to the crawler directory:
```bash
cd crawler
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment example file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your API keys (optional for some sources):
```env
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
SERPAPI_KEY=your_serpapi_key  # For LinkedIn and enhanced Indeed
REED_API_KEY=your_reed_api_key
```

## API Keys Setup

### Adzuna (Free Tier - 1000 requests/month)
1. Sign up at https://developer.adzuna.com/
2. Get your App ID and App Key
3. Add to `.env` file

### SerpAPI (Paid, but has free tier)
1. Sign up at https://serpapi.com/
2. Get your API key
3. Add to `.env` file
4. Required for LinkedIn crawling and enhanced Indeed results

### Reed (Requires API Key)
1. Sign up at https://www.reed.co.uk/developers
2. Get your API key
3. Add to `.env` file

## Usage

### Start the Server

```bash
npm start
```

The server will start on port 3000 (or the port specified in `.env`).

### API Endpoints

#### Health Check
```bash
GET http://localhost:3000/health
```

#### Get Crawler Status
```bash
GET http://localhost:3000/api/status
```

Returns:
```json
{
  "enabled": true,
  "schedule": "0 9 * * *",
  "sources": {
    "adzuna": true,
    "indeed": true,
    "linkedin": true,
    "reed": false
  }
}
```

#### Crawl All Sources
```bash
POST http://localhost:3000/api/crawl
Content-Type: application/json

{
  "profile": {
    "target_locations": ["Dublin, Ireland"],
    "preferred_roles": ["Software Engineer"],
    "skills": ["JavaScript", "Python"]
  }
}
```

Response:
```json
{
  "success": true,
  "jobs": [...],
  "stats": {
    "total": 150,
    "recent": 45,
    "sources": ["Adzuna", "Indeed", "LinkedIn"]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Crawl Specific Source
```bash
POST http://localhost:3000/api/crawl/Adzuna
Content-Type: application/json

{
  "profile": {...}
}
```

## Frontend Integration

Update your frontend to call the crawler API. The crawler service is already integrated in `script.js`:

```javascript
// The fetchSuggestedJobs method automatically tries to use the crawler
// Set the API URL if different from default:
window.CRAWLER_API_URL = 'http://localhost:3000/api/crawl';
```

## Configuration

Edit `.env` to configure:

- **PORT**: Server port (default: 3000)
- **CRAWLER_ENABLED**: Enable/disable crawler (default: true)
- **CRAWLER_SCHEDULE**: Cron schedule for automatic crawling (default: daily at 9 AM)
- **RATE_LIMIT_DELAY**: Delay between requests in milliseconds (default: 2000)
- **MAX_JOBS_PER_SOURCE**: Maximum jobs to fetch per source (default: 50)
- **RESPECT_ROBOTS_TXT**: Whether to respect robots.txt (default: true)
- **CORS_ORIGIN**: Allowed CORS origins (comma-separated)

## Project Structure

```
crawler/
├── server.js              # Express API server
├── crawler.js             # Main crawler orchestrator
├── config.js              # Configuration management
├── package.json           # Dependencies
├── .env                   # Environment variables (not in git)
├── sources/               # Job source crawlers
│   ├── adzuna.js
│   ├── indeed.js
│   ├── linkedin.js
│   └── reed.js
└── utils/                 # Utility functions
    ├── delay.js           # Rate limiting
    ├── robots.js          # Robots.txt checking
    └── jobFilter.js       # Job filtering and normalization
```

## Deployment

### Option 1: Standalone Server
Run the server on a VPS or cloud instance:
```bash
npm start
```

### Option 2: Serverless Function
Deploy to Vercel, Netlify Functions, or AWS Lambda. You'll need to adapt `server.js` for serverless.

### Option 3: Docker
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Rate Limiting

The crawler respects rate limits:
- Default delay: 2 seconds between requests
- Configurable via `RATE_LIMIT_DELAY` in `.env`
- Each source has its own rate limiter

## Robots.txt Compliance

The crawler checks robots.txt before crawling:
- Enabled by default (`RESPECT_ROBOTS_TXT=true`)
- Caches robots.txt per domain
- Skips crawling if disallowed

## Error Handling

- Failed sources don't stop the entire crawl
- Errors are logged but don't crash the service
- Frontend gracefully falls back to cached/mock data

## Troubleshooting

### "Crawler API not available"
- Ensure the server is running: `npm start`
- Check the port matches your frontend configuration
- Verify CORS settings allow your frontend origin

### "No jobs found"
- Check API keys are configured correctly
- Verify profile preferences match available jobs
- Some sources may require paid API keys

### Rate Limiting Issues
- Increase `RATE_LIMIT_DELAY` in `.env`
- Reduce `MAX_JOBS_PER_SOURCE`
- Check API provider rate limits

## License

MIT

