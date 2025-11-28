# Project Directory Structure

This document describes the complete directory structure of the Job Application Tracker project, including all files, their purposes, and path references.

## Root Directory

```
applyJob/
├── paths.config.js              # Centralized path configuration (frontend)
├── index.html                   # Main HTML file
├── script.js                    # Main application logic
├── styles.css                   # Application styles
├── job-api-config.js            # Job API configuration
│
├── my-profile.json              # User profile (gitignored - create from example)
├── my-profile.example.json      # Profile template
├── application-history.json     # Application history data (optional)
│
├── favicon.svg                  # SVG favicon
├── favicon-32x32.png            # 32x32 PNG favicon
├── favicon-16x16.png            # 16x16 PNG favicon
├── apple-touch-icon.png         # Apple touch icon
│
├── README.md                    # Main project documentation
├── QUICK_START.md               # Quick start guide
├── DEPLOYMENT.md                # Deployment instructions
├── CRAWLER_SETUP.md             # Crawler setup guide
├── USER_STORIES.md              # User stories documentation
├── PROJECT_BRIEF.md             # Project brief
├── PROJECT_SUMMARY.md           # Project summary
├── IMPLEMENTATION_STATUS.md     # Implementation status
├── STRATEGIES_IMPLEMENTATION_PLAN.md  # Strategy implementation plan
├── ACCESSIBILITY_IMPROVEMENTS.md # Accessibility documentation
├── GPT_AGENT_SETUP_GUIDE.md    # GPT agent setup
├── JOB_FILTERING_IMPROVEMENTS.md # Job filtering documentation
├── SUGGESTED_JOBS_GUIDE.md      # Suggested jobs guide
├── UX_REVIEW.md                 # UX review documentation
├── DIRECTORY_STRUCTURE.md       # This file
│
├── LICENSE                      # MIT License
├── Masih-Sadri-Resume.md       # Resume (markdown)
├── Masih-Sadri-Resume.pdf       # Resume (PDF)
│
└── crawler/                     # Backend crawler service
    ├── paths.config.js          # Centralized path configuration (backend)
    ├── config.js                # Crawler configuration
    ├── crawler.js               # Main crawler orchestrator
    ├── server.js                # Express API server
    ├── test-crawler.js          # Crawler test script
    ├── package.json             # Node.js dependencies
    ├── package-lock.json        # Dependency lock file
    ├── README.md                # Crawler documentation
    │
    ├── sources/                 # Job source crawlers
    │   ├── adzuna.js            # Adzuna API crawler
    │   ├── indeed.js            # Indeed crawler
    │   ├── linkedin.js          # LinkedIn crawler (via SerpAPI)
    │   ├── reed.js              # Reed API crawler
    │   ├── telegram.js          # Telegram channel crawler
    │   └── jaabz.js             # Jaabz crawler (visa sponsorship)
    │
    └── utils/                   # Utility modules
        ├── delay.js             # Rate limiting and delays
        ├── jobFilter.js         # Job filtering and normalization
        └── robots.js             # Robots.txt checking
```

## Path Configuration

### Frontend Paths

All frontend paths are defined in `paths.config.js` and accessible via `window.PATHS`:

```javascript
window.PATHS.FRONTEND.PROFILE          // 'my-profile.json'
window.PATHS.FRONTEND.PROFILE_EXAMPLE  // 'my-profile.example.json'
window.PATHS.FRONTEND.APPLICATION_HISTORY // 'application-history.json'
window.PATHS.FRONTEND.STYLES           // 'styles.css'
window.PATHS.FRONTEND.SCRIPT           // 'script.js'
window.PATHS.FRONTEND.JOB_API_CONFIG  // 'job-api-config.js'
```

### Backend Paths

All backend paths are defined in `crawler/paths.config.js`:

```javascript
import { PROFILE_PATHS, SOURCE_PATHS, UTIL_PATHS } from './paths.config.js';

PROFILE_PATHS.PROFILE        // Absolute path to my-profile.json
PROFILE_PATHS.PROFILE_EXAMPLE // Absolute path to my-profile.example.json
SOURCE_PATHS.ADZUNA          // './sources/adzuna.js'
SOURCE_PATHS.INDEED          // './sources/indeed.js'
UTIL_PATHS.DELAY             // './utils/delay.js'
```

### API Paths

API endpoints and URLs are defined in `paths.config.js`:

```javascript
window.PATHS.API.CRAWLER_BASE              // 'http://localhost:3000/api'
window.PATHS.API.CRAWLER_ENDPOINTS.CRAWL   // '/crawl'
window.PATHS.API.CRAWLER_ENDPOINTS.STATUS  // '/status'
window.PATHS.API.EXTERNAL.REMOTIVE         // 'https://remotive.com/api/remote-jobs'
window.PATHS.API.EXTERNAL.ARBEITNOW        // 'https://www.arbeitnow.com/api/job-board-api'
```

### LocalStorage Keys

All localStorage keys are defined in `paths.config.js`:

```javascript
window.PATHS.STORAGE.APPLICATIONS           // 'applications'
window.PATHS.STORAGE.SUGGESTED_JOBS        // 'suggestedJobs'
window.PATHS.STORAGE.HR_CONTACTS           // 'hrContacts'
window.PATHS.STORAGE.RECRUITERS            // 'recruiters'
// ... and more
```

## File Descriptions

### Core Application Files

- **index.html**: Main HTML structure, contains all page templates and modals
- **script.js**: Main application logic, data management, UI rendering
- **styles.css**: All CSS styles, responsive design, accessibility features
- **job-api-config.js**: Configuration for external job APIs and crawler service
- **paths.config.js**: Centralized path configuration for frontend

### Configuration Files

- **my-profile.json**: User profile with preferences (target locations, roles, skills)
- **my-profile.example.json**: Template for creating user profile
- **application-history.json**: Optional file for storing application history

### Assets

- **favicon.svg**: SVG favicon (modern browsers)
- **favicon-32x32.png**: PNG favicon (32x32)
- **favicon-16x16.png**: PNG favicon (16x16)
- **apple-touch-icon.png**: Apple touch icon for iOS devices

### Documentation Files

- **README.md**: Main project documentation with features and setup
- **QUICK_START.md**: 5-minute getting started guide
- **DEPLOYMENT.md**: Deployment instructions for GitHub Pages and backend
- **CRAWLER_SETUP.md**: Detailed crawler configuration guide
- **USER_STORIES.md**: Complete user stories (72 stories)
- **PROJECT_BRIEF.md**: Project brief with Phase 1 vision
- **PROJECT_SUMMARY.md**: Comprehensive project overview
- **IMPLEMENTATION_STATUS.md**: Current implementation status
- **STRATEGIES_IMPLEMENTATION_PLAN.md**: Strategy implementation roadmap
- **ACCESSIBILITY_IMPROVEMENTS.md**: Accessibility features documentation
- **GPT_AGENT_SETUP_GUIDE.md**: AI assistant setup guide
- **JOB_FILTERING_IMPROVEMENTS.md**: Job filtering documentation
- **SUGGESTED_JOBS_GUIDE.md**: Suggested jobs feature guide
- **UX_REVIEW.md**: UX review documentation
- **DIRECTORY_STRUCTURE.md**: This file

### Crawler Service Files

- **crawler/paths.config.js**: Centralized path configuration for backend
- **crawler/config.js**: Crawler configuration (API keys, settings)
- **crawler/crawler.js**: Main crawler orchestrator class
- **crawler/server.js**: Express API server
- **crawler/test-crawler.js**: Test script for crawler
- **crawler/package.json**: Node.js dependencies
- **crawler/README.md**: Crawler API documentation

### Job Source Crawlers

- **crawler/sources/adzuna.js**: Adzuna API integration
- **crawler/sources/indeed.js**: Indeed job board crawler
- **crawler/sources/linkedin.js**: LinkedIn crawler (via SerpAPI)
- **crawler/sources/reed.js**: Reed API integration
- **crawler/sources/telegram.js**: Telegram channel crawler
- **crawler/sources/jaabz.js**: Jaabz crawler (visa sponsorship jobs)

### Utility Modules

- **crawler/utils/delay.js**: Rate limiting and delay utilities
- **crawler/utils/jobFilter.js**: Job filtering, normalization, and scoring
- **crawler/utils/robots.js**: Robots.txt checking utilities

## Path Usage Guidelines

### Frontend (Browser)

1. **Always use `window.PATHS`** for file paths:
   ```javascript
   const profilePath = window.PATHS.FRONTEND.PROFILE;
   fetch(profilePath).then(...)
   ```

2. **Use relative paths** for assets referenced in HTML:
   ```html
   <link rel="stylesheet" href="styles.css">
   <script src="paths.config.js"></script>
   ```

3. **Use `window.PATHS.API`** for API endpoints:
   ```javascript
   const apiUrl = window.PATHS.API.CRAWLER_BASE + window.PATHS.API.CRAWLER_ENDPOINTS.CRAWL;
   ```

4. **Use `window.PATHS.STORAGE`** for localStorage keys:
   ```javascript
   localStorage.setItem(window.PATHS.STORAGE.APPLICATIONS, JSON.stringify(data));
   ```

### Backend (Node.js)

1. **Import path configuration**:
   ```javascript
   import { PROFILE_PATHS, SOURCE_PATHS } from './paths.config.js';
   ```

2. **Use absolute paths** for file system operations:
   ```javascript
   import { readFileSync } from 'fs';
   const profile = readFileSync(PROFILE_PATHS.PROFILE, 'utf-8');
   ```

3. **Use relative paths** for module imports:
   ```javascript
   import { crawlAdzuna } from SOURCE_PATHS.ADZUNA;
   ```

## Environment-Specific Paths

### Development

- Frontend: `http://localhost:8080` (or any local server)
- Crawler API: `http://localhost:3000/api`

### Production (GitHub Pages)

- Frontend: `https://mrsadri.github.io/job-application-tracker/`
- Crawler API: Configure in `job-api-config.js` or environment variable

### Environment Variables

The crawler uses environment variables for configuration:
- `CRAWLER_API_URL`: Override crawler API URL
- `PORT`: Server port (default: 3000)
- `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`: Adzuna API credentials
- `REED_API_KEY`: Reed API key
- `SERPAPI_KEY`: SerpAPI key for LinkedIn

## Path Maintenance

### Adding New Paths

1. **Frontend paths**: Add to `paths.config.js` in `FRONTEND_PATHS` object
2. **Backend paths**: Add to `crawler/paths.config.js` in appropriate object
3. **API paths**: Add to `paths.config.js` in `API_PATHS` object
4. **Storage keys**: Add to `paths.config.js` in `STORAGE_KEYS` object

### Updating Existing Paths

1. Update the path in the configuration file
2. All files using that path will automatically use the new value
3. No need to update individual files

### Best Practices

1. **Never hardcode paths** - Always use the configuration files
2. **Use constants** - Import from `paths.config.js` instead of string literals
3. **Document new paths** - Update this file when adding new paths
4. **Test path changes** - Verify all paths work after updates

## Related Documentation

- [README.md](README.md) - Main project documentation
- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [CRAWLER_SETUP.md](CRAWLER_SETUP.md) - Crawler setup guide

---

*Last Updated: December 2024*

