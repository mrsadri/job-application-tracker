# 🎯 Job Application Tracker

A modern, feature-rich web application to help you organize and track your job applications. Built with vanilla JavaScript, this tool includes an intelligent job crawler that aggregates positions from multiple sources.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## ✨ Features

### Frontend Application
- ✅ **Track Applications**: Add, edit, and delete job applications with detailed information
- 📊 **Statistics Dashboard**: Real-time stats showing your application progress
- 🔍 **Advanced Filtering**: Search and filter by company, position, status, and source
- 📝 **Change History**: Track all modifications to your applications over time
- 💾 **Local Storage**: All data saved securely in your browser
- 📱 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- ♿ **Accessible**: WCAG AA compliant with screen reader support
- 🎨 **Modern UI**: Beautiful interface with smooth animations

### Job Crawler Service
- 🔍 **Multi-source Aggregation**: Searches Adzuna, Indeed, LinkedIn, and Reed
- 🎯 **Smart Filtering**: Only shows jobs matching your profile preferences
- 🔄 **Auto-deduplication**: Removes duplicate job postings
- 📅 **Recent Jobs**: Filters to jobs posted in the last 2 weeks
- 🤖 **Respectful Crawling**: Follows robots.txt and implements rate limiting
- 🚀 **RESTful API**: Easy integration with the frontend

## 🚀 Quick Start

### Option 1: Use Frontend Only (Simplest)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/job-application-tracker.git
   cd job-application-tracker
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
   ```bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Using Node.js
   npx http-server -p 8080
   ```

3. **Visit** `http://localhost:8080`

That's it! The app works without any backend. Job suggestions will use demo data.

### Option 2: With Job Crawler (Full Features)

To enable automatic job searching from multiple sources:

1. **Set up the crawler backend**
   ```bash
   cd crawler
   npm install
   cp .env.example .env
   # Edit .env with your API keys (optional)
   npm start
   ```

2. **Open the frontend**
   - In a new terminal:
   ```bash
   cd ..
   python3 -m http.server 8080
   ```

3. **Visit** `http://localhost:8080`

The frontend will automatically connect to the crawler API on port 3000.

## 📋 Detailed Setup

### Prerequisites

**For Frontend Only:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: Local web server (Python, Node.js, or similar)

**For Crawler Service:**
- Node.js 18+ 
- npm or yarn

### Frontend Configuration

1. **Copy your profile template**
   ```bash
   cp my-profile.example.json my-profile.json
   ```

2. **Edit** `my-profile.json` with your details:
   ```json
   {
     "name": "Your Name",
     "target_locations": ["Dublin, Ireland", "Amsterdam, Netherlands"],
     "preferred_roles": ["Product Designer", "UX Designer"],
     "skills": ["Product Design", "Figma", "JavaScript"]
   }
   ```

### Crawler Configuration (Optional)

1. **Navigate to crawler directory**
   ```bash
   cd crawler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Get API keys** (optional, but recommended for better results):

   - **Adzuna** (Free - 1000 requests/month)
     - Sign up at https://developer.adzuna.com/
     - Add `ADZUNA_APP_ID` and `ADZUNA_APP_KEY` to `.env`
   
   - **SerpAPI** (For LinkedIn and enhanced Indeed)
     - Sign up at https://serpapi.com/
     - Add `SERPAPI_KEY` to `.env`
   
   - **Reed** (UK jobs)
     - Sign up at https://www.reed.co.uk/developers
     - Add `REED_API_KEY` to `.env`

5. **Start the server**
   ```bash
   npm start
   ```

   The crawler API will be available at `http://localhost:3000`

## 📖 Usage Guide

### Adding Applications

1. Click "**+ Add New Application**" button
2. Fill in the form with job details:
   - Company name (required)
   - Position/Title (required)
   - Location (select from dropdown)
   - Job URL (optional)
   - Application date (required)
   - Status (Applied, Interview, Rejected, Accepted)
   - Notes, contact person, and source
3. Click "**Save Application**"

### Managing Applications

- **Edit**: Click the "Edit" button on any job card
- **Delete**: Click the "Delete" button to remove an application
- **View History**: Click "Change History" to see all modifications
- **Filter**: Use the sidebar to search and filter applications
- **Sort**: Sort by application date or status update date

### Finding Suggested Jobs

1. Ensure your `my-profile.json` is configured
2. Click "**🔄 Update Jobs**" in the Suggested Jobs section
3. Review the suggested jobs matching your profile
4. Click actions:
   - **View Job →**: Opens the job posting in a new tab
   - **✓ Apply**: Marks as applied and adds to your applications
   - **○ Save for Later**: Bookmarks for future review
   - **✗ Decline**: Hides the job

## 🎨 Features in Detail

### Application Statuses

- **Applied** (○): Initial application submitted
- **Interview** (◐): Invited for interview or in interview process
- **Rejected** (✕): Application was not successful
- **Accepted** (✓): Job offer received! 🎉

### Filters and Search

- **Search**: Find applications by company name, position, or location
- **Status Filter**: Show only applications with specific status
- **Source Filter**: Filter by where you found the job (LinkedIn, Telegram channels, etc.)
- **Sort Options**: 
  - Application Date (newest/oldest first)
  - Status Update Date (recent/oldest first)

### Change History

Every application tracks:
- When it was created
- All field changes with before/after values
- Timestamps for each modification

### Keyboard Shortcuts

- `Ctrl/Cmd + N`: Add new application
- `Ctrl/Cmd + K`: Focus search bar
- `Esc`: Close modals or mobile menu

### Mobile Support

- Responsive design adapts to all screen sizes
- Mobile menu for easy navigation on small screens
- Touch-optimized buttons (44px minimum touch target)
- Swipe-friendly interface

## 🌐 Deployment

### Deploy to GitHub Pages (Frontend)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/job-application-tracker.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Click Save

3. **Access your site** at `https://yourusername.github.io/job-application-tracker`

### Deploy Crawler Service

The crawler needs a backend server. Options:

1. **Heroku**
   ```bash
   cd crawler
   heroku create your-app-name
   git push heroku main
   ```

2. **Vercel** (with serverless functions)
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Railway**
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy

4. **VPS/Cloud Server**
   ```bash
   # On your server
   git clone your-repo
   cd crawler
   npm install
   npm start
   # Use PM2 or similar for process management
   ```

After deploying the crawler, update the frontend's API URL in `job-api-config.js`:
```javascript
window.CRAWLER_API_URL = 'https://your-crawler-api.com/api/crawl';
```

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - 5-minute getting started guide
- **[CRAWLER_SETUP.md](CRAWLER_SETUP.md)** - Detailed crawler configuration
- **[crawler/README.md](crawler/README.md)** - Crawler API documentation
- **[GPT_AGENT_SETUP_GUIDE.md](GPT_AGENT_SETUP_GUIDE.md)** - AI assistant setup
- **[ACCESSIBILITY_IMPROVEMENTS.md](ACCESSIBILITY_IMPROVEMENTS.md)** - Accessibility features
- **[USER_STORIES.md](USER_STORIES.md)** - User stories and use cases

## 🛠️ Technology Stack

**Frontend:**
- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript (ES6+)
- LocalStorage API

**Backend (Crawler):**
- Node.js 18+
- Express.js
- Axios for HTTP requests
- Cheerio for HTML parsing
- Puppeteer for JavaScript-rendered pages
- node-cron for scheduling

## 🔒 Privacy & Data

- All application data is stored locally in your browser
- No data is sent to external servers (unless you use the crawler)
- Crawler API only processes job search queries
- Your profile data stays on your device

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Job search APIs: Adzuna, Reed, SerpAPI
- Icons: Native emoji support
- Inspiration: Personal job search experiences

## 📧 Contact

**Masih Sadri**
- Portfolio: [https://mrsadri.github.io/Portfolio/](https://mrsadri.github.io/Portfolio/)
- GitHub: [@yourusername](https://github.com/yourusername)

## 🔮 Future Enhancements

Potential features for future versions:
- [ ] Export/Import functionality (CSV/JSON)
- [ ] Email reminders for follow-ups
- [ ] Interview preparation tools
- [ ] Salary comparison charts
- [ ] Application timeline visualization
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Cloud sync (optional)

---

**Good luck with your job search!** 🍀🎉

If you find this project helpful, please give it a ⭐ on GitHub!
