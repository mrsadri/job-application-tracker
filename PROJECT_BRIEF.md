# 📋 Project Brief - Job Application Tracker

## Vision Statement

**Phase 1 Goal:** Create a local, browser-based tool that helps job seekers quickly get hired by automating profile setup, job discovery, and application tracking with AI-powered insights.

---

## Target User

**Primary User:** Job seekers who want to get hired quickly and efficiently.

**User Characteristics:**
- Actively searching for employment
- Comfortable with basic technical setup (cloning from GitHub, running local commands)
- Willing to use AI services (GPT API) for enhanced features
- Values efficiency and automation in job search process

---

## Project Overview

### Phase 1: Local Tool with AI Integration

A local web application that runs in the browser, helping users:
1. **Set up their profile** by uploading LinkedIn PDF and using AI to extract key information
2. **Discover relevant jobs** from multiple online sources
3. **Track applications** and receive AI-powered recommendations
4. **Monitor progress** with activity logging and insights

### Key Differentiators

- **100% Local**: All data stored locally, no cloud dependency for core features
- **AI-Powered**: Uses GPT API for intelligent profile analysis and recommendations
- **Multi-Strategy Support**: Three complementary job search strategies
- **Open Source**: Free to use, clone, and customize

---

## Core Features (Phase 1)

### 1. Initial Setup & Profile Creation

#### 1.1 Local Installation
- Clone from GitHub
- Run with simple command
- Opens in browser automatically

#### 1.2 Profile Setup Wizard
- **Step 1**: Upload LinkedIn Profile PDF
  - Instructions for standard PDF download method
  - File validation and upload
  
- **Step 2**: Provide GPT API Key
  - Secure input (masked)
  - Local storage only
  - Validation before saving
  
- **Step 3**: Resume Processing
  - PDF to Markdown conversion
  - Store in local project directory
  - User can view/edit markdown

- **Step 4**: AI Profile Extraction
  - Send markdown to GPT API
  - Extract: 3 job titles, skills list
  - Display results to user

- **Step 5**: Profile Customization
  - Edit/delete job titles
  - Edit/delete skills
  - Add custom entries
  - Select job location(s)
  - Select work type (Remote/Hybrid/On-site)

- **Step 6**: Strategy Selection
  - Choose hiring strategies:
    - Strategy 1: Enhanced Application Process & Learning
    - Strategy 2: Network Building & Recruiter Management
    - Strategy 3: LinkedIn Presence & Personal Branding
  - Select effort level (Low/Medium/High/Maximum)
  - Can select multiple strategies

- **Step 7**: Profile Completion
  - Review all information
  - Confirm and save
  - Profile ready for use

### 2. Job Discovery

- **Multi-Source Aggregation**: Fetch jobs from multiple online sources
- **Smart Filtering**: Based on profile (location, skills, job titles, work type)
- **Relevance Scoring**: Jobs scored by match quality
- **Update Mechanism**: "Update Jobs" button to fetch latest opportunities
- **Job Display**: Title, Company, Location, Post Date, Description, Source

### 3. Application Management

- **Apply to Jobs**: One-click application tracking
- **Activity Logging**: Automatic and manual activity entries
- **Activity Types**: Applied, Interview Scheduled, Follow-up, Rejection, etc.
- **Log Details**: Date, Type, Description, Outcome

### 4. AI-Powered Features

#### 4.1 Job Match Scoring (Optional)
- **Feature**: Analyze job description and provide match score
- **User Control**: Behind a button with clear warning
- **Credit Check**: Verify API credits before processing
- **Output**: Match score (1-10 or %) with explanation
- **Cost Awareness**: Clear indication of credit usage

#### 4.2 Personalized Recommendations
- **Input**: User's application history, activities, profile
- **Analysis**: AI analyzes patterns and progress
- **Output**: Actionable recommendations:
  - What to do next
  - Which jobs to prioritize
  - How to improve applications
  - Skills to highlight
  - Networking suggestions

#### 4.3 API Credit Monitoring
- **Floating Widget**: Always-visible credit balance display
- **Multi-Provider**: Support GPT and avalAI
- **Auto-Update**: Updates after each API call
- **Low Credit Warning**: Alert when credits < 20%
- **Detailed View**: Click to see detailed credit information

---

## Technical Architecture

### Frontend
- **Technology**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: Browser localStorage for user data
- **File System**: Local file storage for markdown and profile data
- **PDF Processing**: Client-side PDF parsing library
- **Markdown**: Generated and stored in project directory

### AI Integration
- **Primary**: OpenAI GPT API
- **Alternative**: avalAI support
- **API Key**: Stored locally, never transmitted to external servers
- **Rate Limiting**: Client-side rate limiting and caching

### Job Discovery
- **Sources**: Multiple job boards and APIs
- **Crawler**: Optional backend service (can be deployed separately)
- **Fallback**: Works with free public APIs if crawler unavailable

### Data Flow
1. User uploads LinkedIn PDF → Local storage
2. PDF → Markdown conversion → Local file
3. Markdown → GPT API → Job titles & skills → Display & Edit
4. Profile → Job matching → Suggested jobs list
5. User activities → Local storage → AI analysis → Recommendations

---

## User Experience Flow

### First-Time User Journey

1. **Clone & Setup** (5 minutes)
   - Clone repository from GitHub
   - Run setup command
   - Browser opens automatically

2. **Profile Creation** (10-15 minutes)
   - Upload LinkedIn PDF
   - Provide GPT API key
   - Review AI-extracted information
   - Customize profile (edit job titles, skills)
   - Select location and work type
   - Choose strategies and effort level
   - Complete profile

3. **Job Discovery** (5 minutes)
   - View suggested jobs
   - Click "Update Jobs" to fetch latest
   - Browse filtered, relevant positions

4. **Application** (Ongoing)
   - Click "Apply" on interesting jobs
   - Log application activities
   - Track progress

5. **Get Insights** (As needed)
   - Request AI recommendations
   - Optional: Get match scores for jobs
   - Monitor API credit balance

### Returning User Journey

1. Open application (already running or restart)
2. View suggested jobs
3. Apply to new positions
4. Log activities
5. Get recommendations when needed

---

## Success Metrics

### User Success
- **Profile Setup Time**: < 15 minutes for first-time users
- **Job Discovery**: Find 10+ relevant jobs per update
- **Application Tracking**: 100% of applications logged
- **User Satisfaction**: Positive feedback on ease of use

### Technical Success
- **Local Storage**: All data persists between sessions
- **API Integration**: Successful GPT API calls with error handling
- **Performance**: Page loads in < 2 seconds
- **Reliability**: < 1% error rate for core features

### Business Success
- **Adoption**: Users complete profile setup
- **Engagement**: Users return to track applications
- **Value**: Users report finding jobs through the tool

---

## Constraints & Considerations

### Technical Constraints
- **Browser-Based**: Must work in modern browsers (Chrome, Firefox, Safari, Edge)
- **Local Storage Limits**: Browser localStorage has size limits (~5-10MB)
- **API Costs**: GPT API usage incurs costs (user's responsibility)
- **PDF Parsing**: Accuracy depends on PDF quality and structure

### Privacy & Security
- **Local Data**: All user data stored locally, never sent to external servers (except API calls)
- **API Keys**: Stored securely in localStorage, never exposed
- **PDF Content**: Processed locally, not uploaded anywhere
- **No Tracking**: No analytics or user tracking

### User Constraints
- **Technical Skill**: Requires basic command-line knowledge
- **API Access**: User must have GPT API key
- **Internet**: Required for job fetching and AI features
- **Browser**: Modern browser required

---

## Future Enhancements (Post Phase 1)

### Phase 2: Enhanced Features
- Strategy 1, 2, 3 full implementation
- Advanced analytics and insights
- Export/import functionality
- Email integration
- Calendar integration

### Phase 3: Advanced AI
- Automated cover letter generation
- Resume optimization suggestions
- Interview preparation assistance
- Salary negotiation guidance

### Phase 4: Collaboration
- Share job opportunities with network
- Team/group job search features
- Community features

---

## Project Scope (Phase 1)

### In Scope ✅
- Local installation and setup
- LinkedIn PDF upload and processing
- GPT API integration
- Profile creation wizard
- Job discovery from multiple sources
- Application tracking
- Activity logging
- AI recommendations
- Optional job match scoring
- API credit monitoring

### Out of Scope ❌
- Cloud sync (Phase 1 is local-only)
- User accounts and authentication
- Mobile app (browser-based only)
- Email notifications
- Calendar integration
- Advanced analytics (Phase 2)
- Strategy 1, 2, 3 full features (Phase 2)

---

## Timeline & Milestones

### Milestone 1: Setup & Profile Creation (Weeks 1-2)
- Local installation
- PDF upload
- Markdown conversion
- GPT API integration
- Profile wizard

### Milestone 2: Job Discovery (Week 3)
- Job fetching from multiple sources
- Filtering and matching
- Job display

### Milestone 3: Application Tracking (Week 4)
- Apply functionality
- Activity logging
- Application management

### Milestone 4: AI Features (Week 5)
- Recommendations
- Optional match scoring
- Credit monitoring

### Milestone 5: Polish & Testing (Week 6)
- UI/UX improvements
- Error handling
- Documentation
- User testing

---

## Success Criteria

### Phase 1 Complete When:
- ✅ User can clone, setup, and run application locally
- ✅ User can upload LinkedIn PDF and create profile
- ✅ AI extracts job titles and skills successfully
- ✅ User can discover and view relevant jobs
- ✅ User can apply to jobs and log activities
- ✅ AI recommendations work correctly
- ✅ API credit monitoring functional
- ✅ All core features tested and working
- ✅ Documentation complete

---

## Risk Management

### Technical Risks
- **PDF Parsing Accuracy**: Mitigate with multiple parsing libraries and fallbacks
- **API Rate Limits**: Implement caching and rate limiting
- **Browser Compatibility**: Test on multiple browsers early

### User Risks
- **Complexity**: Mitigate with clear instructions and wizard flow
- **API Costs**: Clear communication about costs and usage
- **Data Loss**: Implement backup/export functionality

---

## Stakeholders

### Primary Stakeholder
- **Job Seekers**: End users who need to find employment quickly

### Secondary Stakeholders
- **Open Source Community**: Contributors and users
- **Future Employers**: Benefit from better-matched candidates

---

## Documentation Requirements

### User Documentation
- Quick Start Guide
- Setup Instructions
- Feature Documentation
- Troubleshooting Guide

### Developer Documentation
- Architecture Overview
- API Integration Guide
- Contribution Guidelines
- Code Documentation

---

*Last Updated: December 2024*  
*Version: 1.0 - Phase 1 Vision*

