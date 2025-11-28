# Job Filtering and Relevance Improvements

## Summary
Implemented intelligent job filtering and relevance scoring to show only jobs that match your profile, plus added multiple new job sources including LinkedIn and Telegram channels.

## New Features

### 1. **Job Relevance Scoring System**
- **Scoring Algorithm**: Each job is scored 0-100 based on:
  - **Role Match** (40 points): Matches your preferred roles (Product Designer, UX Designer, etc.)
  - **Location Match** (25 points): Matches your target locations (Dublin, Amsterdam, etc.)
  - **Skills Match** (25 points): Contains your skills (Figma, Design Systems, etc.)
  - **Industry Match** (10 points): Matches your industries (Technology, FinTech, E-commerce)
  - **Penalties**: Unrelated roles (sales, marketing, etc.) get -30 points
  
- **Visual Indicator**: Jobs show a colored match score badge:
  - 🟢 **High** (70-100%): Great match - green badge
  - 🟡 **Medium** (40-69%): Good match - yellow badge
  - 🔴 **Low** (20-39%): Basic match - red badge
  - ❌ **Filtered Out**: Jobs below 20% are not shown

### 2. **New Job Sources**

#### **LinkedIn Jobs**
- Integrated via backend crawler API
- Requires SerpAPI key (optional) or backend scraping
- Fetches jobs matching your profile from LinkedIn

#### **Telegram Channels**
- Scrapes from multiple public Telegram channels:
  - `@jobs_finding`
  - `@jaabz_com`
  - `@get_joboffer`
  - `@theyobby`
  - `@netherlandsjobs`
- Requires backend API setup with Telegram API credentials
- Automatically filters job postings from messages

#### **GitHub Jobs**
- Fetches from GitHub Jobs API (positions.json)
- Focuses on remote developer/designer roles

#### **We Work Remotely**
- Infrastructure added for future integration
- Requires backend scraping implementation

### 3. **Smart Filtering**
- **Automatic Filtering**: Only jobs with relevance score >= 20 are shown
- **Sorting**: Jobs sorted by relevance score (highest first)
- **Deduplication**: Removes duplicate jobs by URL
- **Date Filtering**: Shows jobs from last 4 weeks (relaxed from 2 weeks)

## Implementation Details

### Files Modified
1. **script.js**
   - Added `calculateJobRelevanceScore()` method
   - Added `fetchLinkedInJobs()` method
   - Added `fetchGitHubJobs()` method
   - Added `fetchWeWorkRemotelyJobs()` method
   - Added `fetchTelegramJobs()` method
   - Updated `searchJobsFromAPI()` to score and filter jobs
   - Updated `createSuggestedJobCard()` to display relevance scores
   - Updated `fetchJobsFromCrawler()` to calculate scores

2. **styles.css**
   - Added `.relevance-score` styles
   - Added score badge color coding (high/medium/low)

3. **crawler/crawler.js**
   - Added Telegram source registration

4. **crawler/server.js**
   - Added `/api/crawl/linkedin` endpoint
   - Added `/api/crawl/telegram` endpoint

5. **crawler/sources/telegram.js** (NEW)
   - Telegram channel scraping implementation
   - Job posting extraction from Telegram messages

## Configuration

### LinkedIn Integration
To enable LinkedIn jobs, add to `.env`:
```
SERPAPI_KEY=your_serpapi_key
```

### Telegram Integration
To enable Telegram scraping, add to `.env`:
```
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
TELEGRAM_SESSION_STRING=your_session_string
```

Get credentials from: https://my.telegram.org/

## Usage

1. **Automatic Filtering**: Jobs are automatically filtered when you click "Refresh suggested jobs"
2. **Match Score**: Look for the colored match score badge on each job card
3. **Sorting**: Most relevant jobs appear first
4. **Manual Review**: You can still see all jobs by adjusting the relevance threshold in code

## Benefits

✅ **Only Relevant Jobs**: No more unrelated jobs cluttering your feed  
✅ **Better Matching**: Intelligent scoring based on your exact profile  
✅ **More Sources**: Jobs from LinkedIn, Telegram, GitHub, and more  
✅ **Visual Feedback**: See at a glance which jobs are best matches  
✅ **Save Time**: Focus on jobs that actually match your skills  

## Future Enhancements

- [ ] Allow users to adjust relevance threshold in UI
- [ ] Add "Show all jobs" toggle for manual review
- [ ] Machine learning-based scoring improvements
- [ ] Custom keyword preferences
- [ ] Job similarity detection

