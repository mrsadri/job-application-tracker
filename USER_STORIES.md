# User Stories - Dublin Job Application Tracker

## Application Management

### US-001: Create New Application
**As a** job seeker,  
**I want to** add a new job application with company name, position, location, and application date,  
**So that** I can track all my job applications in one place.

**Acceptance Criteria:**
- User can open a modal form by clicking "Add New Application"
- Required fields: Company Name, Position, Application Date, Status
- Optional fields: Location, Job URL, Notes, Contact Person, Contact Email, Source
- Application is saved to localStorage upon submission
- Application appears in the applications list immediately after creation

---

### US-002: Edit Existing Application
**As a** job seeker,  
**I want to** edit details of an existing job application,  
**So that** I can update information as my application progresses or correct any mistakes.

**Acceptance Criteria:**
- User can click "Edit" button on any application card
- Modal opens with pre-filled form data
- All fields can be modified
- Changes are tracked in application history
- Updated application reflects changes immediately

---

### US-003: Delete Application
**As a** job seeker,  
**I want to** delete a job application,  
**So that** I can remove applications that are no longer relevant or were added by mistake.

**Acceptance Criteria:**
- User can click "Delete" button on any application card
- Confirmation dialog appears before deletion
- Application is permanently removed from localStorage
- Statistics are updated immediately after deletion

---

### US-004: View Application Details
**As a** job seeker,  
**I want to** view all details of a job application in a card format,  
**So that** I can quickly see all relevant information without opening the edit form.

**Acceptance Criteria:**
- Each application displays: Company, Position, Location, Application Date, Status, Source, Contact Info, Notes, Job URL
- Information is clearly organized and readable
- Status is displayed with a visual badge
- Job URL is clickable and opens in a new tab

---

## Status Management

### US-005: Update Application Status
**As a** job seeker,  
**I want to** update the status of my application (Applied, Interview, Rejected, Accepted),  
**So that** I can track the progress of each application through the hiring process.

**Acceptance Criteria:**
- User can change status via the edit form
- Status options: Applied, Interview, Rejected, Accepted
- Status change is tracked in application history
- Status badge updates immediately with appropriate color coding

---

### US-006: View Status Statistics
**As a** job seeker,  
**I want to** see statistics showing total applications, pending, interviews, rejections, and acceptances,  
**So that** I can understand my application funnel and track my job search progress.

**Acceptance Criteria:**
- Statistics card displays: Total Applications, Pending, Interviews, Rejected, Accepted
- Statistics update in real-time as applications are added, edited, or deleted
- Statistics are visible in the sidebar at all times

---

## Search and Filter

### US-007: Search Applications by Text
**As a** job seeker,  
**I want to** search my applications by company name, position, or location,  
**So that** I can quickly find specific applications when I have many entries.

**Acceptance Criteria:**
- Search input field is available in the sidebar
- Search is case-insensitive
- Search filters applications in real-time as user types
- Search works across company name, position, and location fields

---

### US-008: Filter by Status
**As a** job seeker,  
**I want to** filter applications by status (Applied, Interview, Rejected, Accepted, or All),  
**So that** I can focus on applications in a specific stage of the hiring process.

**Acceptance Criteria:**
- Status filter dropdown is available in the sidebar
- Options: All Statuses, Applied, Interview, Rejected, Accepted
- Filtering updates the application list immediately
- Filter works in combination with search and source filter

---

### US-009: Filter by Job Source
**As a** job seeker,  
**I want to** filter applications by their source (LinkedIn, Telegram channels, Indeed, etc.),  
**So that** I can identify which job sources are most effective for my search.

**Acceptance Criteria:**
- Source filter dropdown includes all available sources
- Options include: All Sources, specific Telegram channels, LinkedIn, Indeed, Company Website, Referral, Other
- "All Telegram Channels" option filters for any Telegram source
- Filter works in combination with search and status filter

---

## Sorting

### US-010: Sort by Application Date
**As a** job seeker,  
**I want to** sort applications by application date (newest or oldest first),  
**So that** I can view my most recent applications first or review applications chronologically.

**Acceptance Criteria:**
- Sort dropdown includes "Application Date (Newest First)" and "Application Date (Oldest First)"
- Sorting updates the application list immediately
- Sort works in combination with filters

---

### US-011: Sort by Status Update Date
**As a** job seeker,  
**I want to** sort applications by when their status was last updated,  
**So that** I can prioritize following up on applications that were recently updated.

**Acceptance Criteria:**
- Sort dropdown includes "Status Update Date (Recent First)" and "Status Update Date (Oldest First)"
- Sorting uses the most recent status change from application history
- Applications without status changes use application date as fallback

---

## Suggested Jobs

### US-012: View Suggested Job Positions
**As a** job seeker,  
**I want to** see a list of suggested job positions that match my profile preferences,  
**So that** I can discover new opportunities I might have missed.

**Acceptance Criteria:**
- Suggested jobs section displays at the top of the main content area
- Jobs older than 2 weeks are marked as "Deprecated" but still visible
- Each job card displays: Title, Company, Location, Post Date, Description, Salary, Job Type, Remote Options, Source/Resource
- Jobs are matched based on profile preferences (locations, roles, skills)
- Job source/resource is prominently displayed on each card

---

### US-013: Update Suggested Jobs List
**As a** job seeker,  
**I want to** update the suggested jobs list by adding new job postings,  
**So that** I can discover newly posted positions that match my criteria without losing previously found jobs.

**Acceptance Criteria:**
- "Update Jobs" button is available in the suggested jobs section
- Clicking the button triggers a new job search from the internet
- Loading state is displayed while fetching jobs
- New jobs are added to the existing list (duplicates are avoided based on job ID or URL)
- Previously found jobs remain in the list
- Update operation is additive, not replacing the entire list

---

### US-014: Mark Suggested Job as Applied
**As a** job seeker,  
**I want to** mark a suggested job as "Applied" and add it to my applications,  
**So that** I can track that I've applied to this position and have it appear in my main applications list.

**Acceptance Criteria:**
- "Apply" button is available on each suggested job card
- Clicking "Apply" opens the add application modal with pre-filled data
- Job is marked with an "Applied" state badge
- User can complete the form and save the application
- Suggested job state persists in localStorage

---

### US-015: Decline Suggested Job
**As a** job seeker,  
**I want to** mark a suggested job as "Declined",  
**So that** I can indicate I'm not interested in this position and it won't clutter my view.

**Acceptance Criteria:**
- "Decline" button is available on each suggested job card
- Declined jobs are visually marked (grayed out) with a "Declined" badge
- Declined state persists in localStorage
- User can still view declined jobs but they are clearly marked

---

### US-016: Mark Deprecated Suggested Jobs
**As a** job seeker,  
**I want to** see suggested jobs older than 2 weeks marked as "Deprecated",  
**So that** I know which positions are likely no longer accepting applications and can focus on recent postings.

**Acceptance Criteria:**
- Jobs older than 2 weeks are automatically marked with a "Deprecated" state badge
- Deprecated jobs are visually distinct (e.g., grayed out or with warning styling)
- Deprecated jobs cannot be marked as "Applied" (button is disabled or removed)
- Deprecated state is calculated based on job posting date
- Deprecated jobs can still be viewed for reference but are clearly marked as outdated

---

### US-017: Paginate Lists
**As a** job seeker,  
**I want to** view all lists (suggested jobs, applications, etc.) in paginated pages,  
**So that** I can efficiently browse through long lists without overwhelming the interface.

**Acceptance Criteria:**
- All lists (Suggested Jobs, Applications List) support pagination
- Each list displays a configurable number of items per page (e.g., 10, 20, 50)
- Pagination controls show current page, total pages, and navigation buttons (Previous, Next, First, Last)
- Page numbers are clickable for direct navigation
- Pagination state persists in localStorage or sessionStorage per list
- Filtering and sorting work correctly with pagination
- Total count of items is displayed for each list
- Pagination settings can be configured independently for each list
- When filters are applied, pagination resets to page 1 and recalculates total pages

---

### US-018: Gather Jobs from Internet via Crawler
**As a** job seeker,  
**I want to** have suggested jobs automatically gathered from the internet by a crawler script,  
**So that** I can discover job postings from multiple sources without manually searching each job board.

**Acceptance Criteria:**
- A crawler script (backend service or serverless function) searches multiple job sources
- Crawler searches job boards, company career pages, and other job aggregators
- Crawler runs on a schedule (e.g., daily) or can be triggered manually
- Crawler respects robots.txt and rate limits of job sources
- Crawled jobs are stored in a database or API endpoint accessible to the frontend
- Crawler extracts: Job Title, Company, Location, Post Date, Description, Salary, Job Type, Remote Options, Source URL, Source Name
- Crawler filters jobs based on user profile preferences (locations, roles, skills)

**Implementation Status:** ✅ **Partially Implemented**
- Frontend integrates with multiple free job APIs: Remotive, Arbeitnow, GitHub Jobs
- Backend crawler service available for Adzuna, Indeed, LinkedIn, Reed (requires API keys)
- Real-time job fetching from public APIs when "Update Jobs" is clicked
- Jobs are scored for relevance based on profile preferences
- Automatic deduplication by URL
- Falls back gracefully when APIs are unavailable
- Backend crawler service can be deployed separately for enhanced functionality

---

### US-019: Display Job Source on Suggested Job Cards
**As a** job seeker,  
**I want to** see which resource or website each suggested job was gathered from,  
**So that** I can understand the credibility of the source and know where to find more similar opportunities.

**Acceptance Criteria:**
- Each suggested job card displays the source/resource name (e.g., "LinkedIn", "Indeed", "Company Website", "Adzuna")
- Source is displayed prominently on the job card (e.g., badge or label)
- Source information is clickable and links to the original job posting
- Source is stored with each job and persists in localStorage
- Source filter can be used to filter suggested jobs by source

---

### US-020: View Job Posting from Suggested Job
**As a** job seeker,  
**I want to** open the original job posting from a suggested job card,  
**So that** I can read the full job description and requirements before applying.

**Acceptance Criteria:**
- "View Job →" button/link is available on each suggested job card
- Clicking opens the job posting URL in a new tab
- Link uses proper security attributes (target="_blank" rel="noopener noreferrer")

---

## Telegram Integration

### US-021: Access Telegram Job Channels
**As a** job seeker,  
**I want to** quickly access Telegram job channels from the application,  
**So that** I can browse job postings on Telegram without manually searching for channels.

**Acceptance Criteria:**
- Telegram channels section is visible in the sidebar
- Links to multiple Telegram channels are provided (@jobs_finding, @jaabz_com, @get_joboffer, @theyobby, @netherlandsjobs)
- Each link opens in a new tab
- Channel links are clearly labeled with icons

---

### US-022: Add Job from Telegram Source
**As a** job seeker,  
**I want to** add a job application with the Telegram source pre-filled when I click a Telegram channel link,  
**So that** I can quickly track jobs I find on Telegram channels.

**Acceptance Criteria:**
- Clicking a Telegram channel link stores the channel as pending source
- "Add Job from Telegram" button opens the add application modal
- Modal opens with the Telegram source field pre-filled
- Job URL field is focused for easy pasting of Telegram post URLs

---

## Application History

### US-023: View Application Change History
**As a** job seeker,  
**I want to** view the complete history of changes made to an application,  
**So that** I can track how my application has progressed over time and see what information was updated when.

**Acceptance Criteria:**
- "Update Log" button is available on each application card
- Clicking toggles the display of change history
- History shows: Timestamp, Field changed, Old value, New value
- History entries are displayed in chronological order (newest first)
- History includes initial creation entry

---

### US-024: Track Field Changes
**As a** job seeker,  
**I want to** have all changes to application fields automatically tracked,  
**So that** I have a complete audit trail of modifications without manual effort.

**Acceptance Criteria:**
- All field changes (company, position, location, status, notes, contacts, source, etc.) are automatically detected
- Changes are logged with timestamp when application is edited
- Only actual changes are recorded (no duplicate entries for unchanged fields)
- Change log includes field name, old value, and new value

---

## Data Management

### US-025: Persist Applications Locally
**As a** job seeker,  
**I want to** have all my applications saved automatically in browser localStorage,  
**So that** my data persists between browser sessions without requiring login or cloud storage.

**Acceptance Criteria:**
- All applications are automatically saved to localStorage on create, update, or delete
- Data persists when browser is closed and reopened
- No manual save action is required
- Data is stored in JSON format

---

### US-026: Persist Suggested Jobs Locally
**As a** job seeker,  
**I want to** have suggested jobs and their states saved in localStorage,  
**So that** I don't lose track of which suggested jobs I've already reviewed or acted upon.

**Acceptance Criteria:**
- Suggested jobs list is saved to localStorage
- Job states (Applied, Declined, Deprecated, Do Nothing) are persisted
- Data persists between browser sessions
- Duplicate jobs are avoided when updating

---

## Profile and Preferences

### US-027: Load Profile Preferences
**As a** job seeker,  
**I want to** have my profile preferences (locations, roles, skills) loaded from my-profile.json,  
**So that** suggested jobs are matched to my actual preferences and target locations.

**Acceptance Criteria:**
- Profile is loaded from my-profile.json file on application initialization
- Profile data includes: target_locations, preferred_roles, skills
- Profile data is used to filter and match suggested jobs
- Application handles missing or invalid profile data gracefully

---

## Contact Management

### US-028: Store Contact Information
**As a** job seeker,  
**I want to** store contact person name and email for each application,  
**So that** I can easily reach out to recruiters or hiring managers for follow-ups.

**Acceptance Criteria:**
- Contact Person and Contact Email fields are available in the application form
- Contact information is displayed on the application card
- Contact information is optional (not required)
- Contact email is validated as a proper email format

---

## Notes Management

### US-029: Add Notes to Application
**As a** job seeker,  
**I want to** add notes to each application,  
**So that** I can record important information like interview dates, feedback, salary discussions, or other relevant details.

**Acceptance Criteria:**
- Notes field is available in the application form (textarea)
- Notes are displayed on the application card
- Notes support multi-line text
- Notes are optional (not required)

---

## Location Management

### US-030: Select Application Location
**As a** job seeker,  
**I want to** select or specify the location for each job application,  
**So that** I can track applications by geographic location and filter by target cities.

**Acceptance Criteria:**
- Location dropdown includes: Dublin (Ireland), Amsterdam, Eindhoven, Rotterdam, Utrecht (Netherlands), Cork (Ireland), Leeds (England), Other
- Default location is "Dublin, Ireland"
- Location is displayed on each application card
- Location can be used in search functionality

---

## Date Management

### US-031: Set Application Date
**As a** job seeker,  
**I want to** set the date when I applied for each position,  
**So that** I can track application timelines and identify when follow-ups are needed.

**Acceptance Criteria:**
- Application Date field is required in the form
- Date picker defaults to today's date
- Date is displayed in a readable format on the application card
- Date can be used for sorting applications

---

## User Interface

### US-032: Responsive Design
**As a** job seeker,  
**I want to** use the application on desktop, tablet, and mobile devices,  
**So that** I can track my applications regardless of which device I'm using.

**Acceptance Criteria:**
- Application layout adapts to different screen sizes
- All features are accessible on mobile devices
- Touch interactions work properly on tablets and phones
- Text and buttons are appropriately sized for each device type

---

### US-033: Empty State Handling
**As a** job seeker,  
**I want to** see helpful messages when I have no applications or no suggested jobs,  
**So that** I understand what actions I can take to get started.

**Acceptance Criteria:**
- Empty state message appears when applications list is empty
- Empty state message appears when suggested jobs list is empty
- Messages include actionable guidance (e.g., "Click Add New Application to get started")
- Empty states are visually distinct and user-friendly

---

### US-034: Modal Form Interaction
**As a** job seeker,  
**I want to** open and close the application form modal easily,  
**So that** I can add or edit applications without navigating away from the main view.

**Acceptance Criteria:**
- Modal opens when "Add New Application" or "Edit" is clicked
- Modal closes when "Cancel" or "X" button is clicked
- Modal closes when clicking outside the modal content area
- Form resets when modal is closed
- Modal has smooth open/close animations

---

## Job URL Management

### US-035: Store Job Posting URL
**As a** job seeker,  
**I want to** save the URL of the original job posting,  
**So that** I can quickly return to the job description to review requirements or check application status.

**Acceptance Criteria:**
- Job URL field accepts valid URLs
- URL is displayed as a clickable link on the application card
- Link opens in a new tab with proper security attributes
- URL field is optional (not required)

---

## Application Workflow

### US-036: Quick Apply from Suggested Job
**As a** job seeker,  
**I want to** quickly convert a suggested job into a tracked application with pre-filled data,  
**So that** I can efficiently add jobs I'm interested in without manually entering all the information.

**Acceptance Criteria:**
- Clicking "Apply" on a suggested job opens the add application modal
- Modal is pre-filled with: Company, Position, Location, Job URL, Application Date (today), Status (Applied), Source (from job source field)
- User can modify any pre-filled data before saving
- Application is saved to the main applications list upon submission

---

## Deployment and Hosting

### US-037: Deploy to GitHub Pages
**As a** project owner,  
**I want to** publish this application as a live webpage on GitHub Pages,  
**So that** the application works in a real production environment and can be accessed by anyone via a URL.

**Acceptance Criteria:**
- Application is configured for GitHub Pages deployment
- All static files (HTML, CSS, JavaScript, JSON) are properly structured
- Application works correctly when served from GitHub Pages (no local server required)
- All file paths are relative and work in the GitHub Pages environment
- CORS and API configurations work in production environment
- Application handles missing API keys gracefully (shows appropriate messages)
- README includes deployment instructions
- Application is accessible via `https://[username].github.io/[repository-name]/`
- All features function correctly in the hosted environment (localStorage, modals, filtering, etc.)

**Implementation Status:** ✅ **Fully Implemented**
- Application successfully deployed to GitHub Pages
- Live site: https://mrsadri.github.io/job-application-tracker/
- All features tested and working in production environment
- HTTPS enforced
- All static assets properly configured
- Deployment documentation included in README and DEPLOYMENT.md

---

## Strategy 1: Enhanced Application Process & Learning

### US-038: Log HR Contact Information
**As a** job seeker,  
**I want to** store HR email addresses and contact information for each application,  
**So that** I can maintain a database of HR contacts for future opportunities and follow-ups.

**Acceptance Criteria:**
- HR email field is available in the application form
- HR contact name and email are stored with each application
- HR contact information is displayed on the application card
- Multiple HR contacts can be stored per application
- HR email addresses are validated for proper format
- HR contacts can be searched and filtered across all applications

---

### US-039: Store Rejection Emails
**As a** job seeker,  
**I want to** save rejection emails I receive for each application,  
**So that** I can analyze rejection patterns, learn from feedback, and improve future applications.

**Acceptance Criteria:**
- Rejection email content can be stored with each application
- Rejection email date is automatically recorded when saved
- Rejection emails are displayed in the application details
- Rejection emails can be searched and filtered
- Rejection email template/format can be analyzed for patterns
- Rejection reasons can be extracted and categorized

---

### US-040: Store Cover Letters
**As a** job seeker,  
**I want to** save the cover letter I used for each application,  
**So that** I can track which cover letters were most effective and reuse successful templates.

**Acceptance Criteria:**
- Cover letter field (textarea or file upload) is available in the application form
- Cover letter content is stored with each application
- Cover letter can be viewed and edited from the application details
- Cover letter can be copied for reuse in future applications
- Cover letter version history can be tracked
- Cover letters can be searched by content

---

### US-041: Track Application Process Log
**As a** job seeker,  
**I want to** maintain a detailed log of each step in my application process,  
**So that** I can learn from each application experience and identify what works best.

**Acceptance Criteria:**
- Process log section is available for each application
- Each log entry includes: timestamp, step description, outcome, notes
- Log entries can be added manually or automatically
- Log entries are displayed chronologically
- Log entries can include: application submitted, HR contacted, interview scheduled, rejection received, etc.
- Log entries can be exported for analysis
- Process log can be filtered by step type or outcome

---

### US-042: Learn from Application Results
**As a** job seeker,  
**I want to** analyze application results and outcomes to identify patterns and improvements,  
**So that** I can continuously improve my application strategy and success rate.

**Acceptance Criteria:**
- Application results dashboard shows success rates by source, company, role type
- Rejection reasons are categorized and analyzed
- Success patterns are identified (e.g., which cover letters led to interviews)
- Recommendations are generated based on historical data
- Comparison view shows what worked vs. what didn't
- Learning insights are displayed in a dedicated section

---

### US-043: Store Application Source Details
**As a** job seeker,  
**I want to** record detailed information about where I found each job posting,  
**So that** I can identify the most effective job sources and focus my efforts accordingly.

**Acceptance Criteria:**
- Source field includes: platform name, specific channel/URL, date found, referrer
- Source effectiveness metrics are tracked (application rate, interview rate, offer rate)
- Source information is displayed prominently on application cards
- Source analytics dashboard shows which sources yield best results
- Source can be filtered and searched across all applications

---

## Strategy 2: Network Building & Recruiter Management

### US-044: Manage Recruiter Contacts
**As a** job seeker,  
**I want to** maintain a list of recruiters with their contact information and specializations,  
**So that** I can build relationships and get connected to relevant opportunities.

**Acceptance Criteria:**
- Recruiter management section is available in the application
- Each recruiter entry includes: name, email, phone, LinkedIn profile, company/agency, specialization, location focus
- Recruiters can be added, edited, and deleted
- Recruiters can be categorized by type (internal recruiter, agency recruiter, headhunter)
- Recruiter list can be searched and filtered
- Recruiter contacts are stored in localStorage

---

### US-045: Track Recruiter Interactions
**As a** job seeker,  
**I want to** log all interactions with recruiters (emails, calls, meetings),  
**So that** I can maintain relationship history and follow up appropriately.

**Acceptance Criteria:**
- Interaction log is available for each recruiter
- Each interaction includes: date, type (email/call/meeting/LinkedIn), summary, outcome, next steps
- Interactions are displayed chronologically
- Interaction history can be viewed per recruiter
- Upcoming follow-ups are highlighted
- Interaction reminders can be set

---

### US-046: Manage Hiring Manager Contacts
**As a** job seeker,  
**I want to** maintain a list of hiring managers and lead designers I've connected with,  
**So that** I can build professional relationships and get direct referrals.

**Acceptance Criteria:**
- Hiring manager/designer contact section is available
- Each contact includes: name, title, company, email, LinkedIn, department, location
- Contacts can be categorized (hiring manager, lead designer, design director, etc.)
- Contact list can be searched and filtered by company, role, location
- Contacts are linked to applications when relevant
- Contact information is stored securely

---

### US-047: Track Networking Activities
**As a** job seeker,  
**I want to** log networking activities and conversations with industry professionals,  
**So that** I can track relationship building progress and identify warm leads.

**Acceptance Criteria:**
- Networking activity log is available
- Each activity includes: date, contact person, type (coffee chat, LinkedIn message, event, etc.), topic discussed, outcome, follow-up needed
- Activities can be linked to specific companies or roles
- Networking metrics are tracked (contacts made, meetings scheduled, referrals received)
- Activity calendar view shows upcoming networking events
- Networking goals can be set and tracked

---

### US-048: AI Job Adviser - Task Management
**As a** job seeker,  
**I want to** receive a list of tasks and subtasks from ChatGPT as my job adviser,  
**So that** I can have a structured action plan to achieve my job search goals.

**Acceptance Criteria:**
- AI Job Adviser section is available in the application
- Tasks are organized by strategy (Application Strategy, Networking Strategy, LinkedIn Strategy)
- Each task includes: title, description, priority, due date, status, subtasks
- Tasks can be marked as complete, in progress, or pending
- Subtasks can be checked off individually
- Task progress is tracked and visualized
- AI can generate new tasks based on current application status
- Task recommendations are personalized based on profile and history

---

### US-049: AI Job Adviser - Personalized Guidance
**As a** job seeker,  
**I want to** receive personalized advice and recommendations from ChatGPT based on my application history and profile,  
**So that** I can make data-driven decisions about my job search strategy.

**Acceptance Criteria:**
- AI adviser analyzes application history, success rates, and patterns
- Recommendations are generated for: which jobs to apply to, how to improve cover letters, networking opportunities, LinkedIn content strategy
- Advice is contextual and based on actual data from the application
- AI can answer questions about job search strategy
- Advice is updated as new data is added
- AI suggestions can be saved and referenced later

---

### US-050: Recruiter Effectiveness Analytics
**As a** job seeker,  
**I want to** see analytics on which recruiters and networking contacts are most effective,  
**So that** I can prioritize relationships that lead to opportunities.

**Acceptance Criteria:**
- Analytics dashboard shows recruiter effectiveness metrics
- Metrics include: jobs referred, interviews secured, offers received, response rate
- Networking contact effectiveness is tracked
- Top performers are highlighted
- Recommendations are provided for which contacts to prioritize
- Historical trends show relationship value over time

---

## Strategy 3: LinkedIn Presence & Personal Branding

### US-051: Plan LinkedIn Content
**As a** job seeker,  
**I want to** plan and track LinkedIn articles and posts I want to publish,  
**So that** I can build my personal brand and attract companies to approach me.

**Acceptance Criteria:**
- LinkedIn content planning section is available
- Content ideas can be added with: title, topic, target audience, draft content, publish date, status
- Content calendar view shows planned posts and articles
- Content can be categorized (article, post, carousel, video)
- Content performance can be tracked (views, likes, comments, shares)
- Content ideas can be generated based on profile and expertise

---

### US-052: Track LinkedIn Activity
**As a** job seeker,  
**I want to** log my LinkedIn activities (posts, articles, comments, connections),  
**So that** I can maintain consistency and track my personal branding efforts.

**Acceptance Criteria:**
- LinkedIn activity log is available
- Each activity includes: date, type (post/article/comment/connection), content summary, engagement metrics, link to post
- Activities are displayed chronologically
- Activity frequency and consistency are tracked
- Engagement trends are visualized
- Activity goals can be set (e.g., post 3 times per week)

---

### US-053: Manage Portfolio Content
**As a** job seeker,  
**I want to** plan and track portfolio content including photos of college activities and projects,  
**So that** I can showcase my work and attract potential employers.

**Acceptance Criteria:**
- Portfolio content management section is available
- Each portfolio item includes: title, description, type (project/activity/achievement), date, media (photos/videos), LinkedIn post link, status
- Portfolio items can be organized by category or project
- Portfolio items can be scheduled for LinkedIn publication
- Portfolio content can be linked to specific job applications
- Media files can be referenced (stored locally or in cloud)

---

### US-054: Track LinkedIn Profile Views
**As a** job seeker,  
**I want to** log when companies or recruiters view my LinkedIn profile,  
**So that** I can identify potential opportunities and follow up with interested parties.

**Acceptance Criteria:**
- LinkedIn profile views can be manually logged
- Each view includes: viewer name, company, title, date, source (if known), follow-up action
- Profile views are displayed in a dedicated section
- Views from target companies are highlighted
- Follow-up reminders can be set for profile viewers
- Profile view trends are tracked over time

---

### US-055: LinkedIn Engagement Analytics
**As a** job seeker,  
**I want to** see analytics on my LinkedIn content performance,  
**So that** I can understand what content resonates and optimize my personal branding strategy.

**Acceptance Criteria:**
- Analytics dashboard shows LinkedIn engagement metrics
- Metrics include: total views, likes, comments, shares, profile views, connection requests
- Content performance is compared (which posts/articles perform best)
- Audience insights are provided (who engages with content)
- Recommendations are generated for content optimization
- Trends show growth in engagement over time

---

### US-056: Content Calendar for LinkedIn
**As a** job seeker,  
**I want to** have a content calendar to plan my LinkedIn posts and articles,  
**So that** I can maintain consistent presence and build my professional brand systematically.

**Acceptance Criteria:**
- Content calendar view is available (monthly/weekly views)
- Content items can be scheduled with specific dates
- Calendar shows planned, published, and draft content
- Content can be rescheduled or moved
- Reminders can be set for content publication
- Calendar integrates with LinkedIn activity log

---

### US-057: Track Inbound Opportunities
**As a** job seeker,  
**I want to** log when companies or recruiters approach me directly through LinkedIn,  
**So that** I can track the effectiveness of my personal branding and LinkedIn presence.

**Acceptance Criteria:**
- Inbound opportunities section is available
- Each opportunity includes: company, recruiter/contact name, date contacted, role offered, source (LinkedIn message/profile view), status, notes
- Inbound opportunities are linked to applications when converted
- Opportunity source is tracked (which content led to the contact)
- Inbound opportunity trends are analyzed
- Success metrics show conversion from LinkedIn presence to opportunities

---

### US-058: AI Job Adviser - Weekly LinkedIn Tasks
**As a** job seeker,  
**I want to** receive a weekly list of tasks and subtasks from ChatGPT specifically for building my LinkedIn presence,  
**So that** I can systematically work towards becoming a recognized talented product designer and attract companies to approach me.

**Acceptance Criteria:**
- AI Job Adviser provides weekly task lists specifically for LinkedIn strategy
- Tasks are organized by week and include: content creation, engagement activities, profile optimization, networking actions
- Each weekly task includes: title, description, priority, due date, status, subtasks
- Tasks are personalized based on:
  - Current LinkedIn activity level
  - Content performance history
  - Profile completeness
  - Engagement goals
  - Portfolio items available
- Weekly tasks can include:
  - "Write and publish 1 article about [topic]"
  - "Post 3 times this week about [theme]"
  - "Engage with 10 posts from target companies"
  - "Update profile section: [section name]"
  - "Share portfolio project: [project name]"
  - "Connect with 5 hiring managers from [companies]"
  - "Comment thoughtfully on 3 industry posts"
- Tasks can be marked as complete, in progress, or pending
- Subtasks can be checked off individually
- Weekly task progress is tracked and visualized
- AI generates new weekly tasks based on:
  - Previous week's completion rate
  - Current LinkedIn engagement metrics
  - Upcoming portfolio items to showcase
  - Industry trends and relevant topics
- Task recommendations adapt to user's schedule and capacity
- Weekly summary shows what was accomplished and what's planned for next week

---

## Summary

These 57 user stories cover all major features of the Job Application Tracker:

- **Application Management (US-001 to US-004)**: Core CRUD operations
- **Status Management (US-005 to US-006)**: Status tracking and statistics
- **Search and Filter (US-007 to US-009)**: Finding and filtering applications
- **Sorting (US-010 to US-011)**: Organizing applications by date
- **Suggested Jobs (US-012 to US-020)**: Job discovery, update functionality, deprecated state, crawler integration, and source display
- **Pagination (US-017)**: Pagination for all lists (suggested jobs, applications, etc.)
- **Telegram Integration (US-021 to US-022)**: Telegram channel integration
- **Application History (US-023 to US-024)**: Change tracking and audit trail
- **Data Management (US-025 to US-026)**: Local storage persistence
- **Profile and Preferences (US-027)**: Profile-based job matching
- **Contact Management (US-028)**: Recruiter contact tracking
- **Notes Management (US-029)**: Additional information storage
- **Location Management (US-030)**: Geographic tracking
- **Date Management (US-031)**: Timeline tracking
- **User Interface (US-032 to US-034)**: UX and responsive design
- **Job URL Management (US-035)**: Link to original postings
- **Application Workflow (US-036)**: Streamlined application process
- **Deployment and Hosting (US-037)**: GitHub Pages deployment for production use ✅
- **Strategy 1: Enhanced Application Process (US-038 to US-043)**: HR contacts, rejection emails, cover letters, process logging, learning analytics, source tracking
- **Strategy 2: Network Building (US-044 to US-050)**: Recruiter management, interaction tracking, hiring manager contacts, networking activities, AI job adviser, effectiveness analytics
- **Strategy 3: LinkedIn Presence (US-051 to US-058)**: Content planning, activity tracking, portfolio management, profile views, engagement analytics, content calendar, inbound opportunities, AI weekly task management

### Implementation Status Summary

- **Total Stories**: 58
- **Fully Implemented**: 35 (60%) - Core application tracking features
- **Partially Implemented**: 1 (2%) - US-018 (Crawler with real API integrations)
- **Not Implemented**: 22 (38%) - New strategy features (US-038 to US-058)
- **Production Ready**: ✅ Yes - Core features deployed and accessible
- **Future Enhancements**: Strategy 1, 2, and 3 features ready for implementation

### Additional Enhancements Beyond User Stories

The application includes many enhancements beyond the original user stories:
- **Accessibility**: WCAG AA compliant with full screen reader support
- **User Experience**: Toast notifications, loading states, skeleton screens, enhanced empty states
- **Mobile Optimization**: Touch-optimized interface, mobile drawer menu, responsive design
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Keyboard Shortcuts**: Ctrl/Cmd+N for new application, Ctrl/Cmd+K for search, Esc to close modals
- **Form Validation**: Real-time validation with helpful error messages
- **Dashboard**: Overview page with recent applications and statistics

Each user story follows the standard format: "As a [user type], I want [goal], so that [benefit]" and includes acceptance criteria for implementation guidance.

---

## Phase 1: Initial Setup & Profile Creation (Vision)

### US-059: Clone and Run Project Locally
**As a** job seeker,  
**I want to** clone the project from GitHub and run it locally with a simple command,  
**So that** I can use the application on my own computer without sharing my data with others.

**Acceptance Criteria:**
- Project can be cloned from GitHub repository
- Simple command (e.g., `npm start` or `python -m http.server`) runs the application
- Application opens in default web browser automatically
- No complex setup or configuration required for basic usage
- Clear instructions provided in README for local setup

---

### US-060: Upload LinkedIn Profile PDF
**As a** job seeker,  
**I want to** upload my LinkedIn profile as a PDF file,  
**So that** the application can extract my professional information automatically.

**Acceptance Criteria:**
- Upload interface accepts PDF files
- Clear instructions provided on how to download LinkedIn profile as PDF using standard method
- File upload validation (file type, size limits)
- Upload progress indicator shown to user
- Error handling for invalid or corrupted PDF files
- Success confirmation after upload

---

### US-061: Provide GPT API Key
**As a** job seeker,  
**I want to** securely provide my GPT API key,  
**So that** the application can use AI services to analyze my profile and provide recommendations.

**Acceptance Criteria:**
- Secure input field for API key (masked/password type)
- API key stored locally (localStorage or local file, not sent to external servers)
- API key validation before saving
- Option to update or change API key later
- Clear information about API usage and costs
- Support for both OpenAI API and alternative AI services (avalAI)

---

### US-062: Convert Resume to Markdown
**As a** job seeker,  
**I want to** have my uploaded LinkedIn PDF automatically converted to markdown format,  
**So that** my profile information is stored in a structured, editable format.

**Acceptance Criteria:**
- PDF parsing extracts text content accurately
- Markdown conversion preserves structure (headings, lists, sections)
- Converted markdown stored in user's local project directory
- File path clearly displayed to user
- User can view and edit the generated markdown file
- Conversion handles common PDF formats and layouts

---

### US-063: Extract Job Titles and Skills via AI
**As a** job seeker,  
**I want to** have AI analyze my resume and extract three recommended job titles and my skills,  
**So that** I can understand what positions I'm qualified for and what skills I possess.

**Acceptance Criteria:**
- AI prompt sent to GPT API with resume markdown content
- Response includes exactly three job title recommendations
- Response includes comprehensive list of skills extracted from resume
- Results displayed clearly to user
- Loading state shown during AI processing
- Error handling if API call fails
- Results cached locally to avoid redundant API calls

---

### US-064: Edit and Delete Extracted Information
**As a** job seeker,  
**I want to** edit or delete the AI-extracted job titles and skills,  
**So that** I can correct any mistakes and customize the information to match my preferences.

**Acceptance Criteria:**
- Each job title has edit and delete buttons
- Each skill has edit and delete buttons
- Edit opens inline editing or modal form
- Changes saved immediately
- User can add new job titles or skills manually
- Visual feedback for all edit/delete actions

---

### US-065: Select Job Location and Work Type
**As a** job seeker,  
**I want to** select my preferred job location and work type (remote, hybrid, on-site),  
**So that** the application can filter and match jobs according to my preferences.

**Acceptance Criteria:**
- Location dropdown or multi-select with common job locations
- Work type selection (Remote, Hybrid, On-site, Any)
- Selections saved with profile
- Can be updated later
- Used for job matching and filtering

---

### US-066: Complete Profile Creation
**As a** job seeker,  
**I want to** complete my profile setup and see a confirmation,  
**So that** I know my profile is ready and I can proceed to the next steps.

**Acceptance Criteria:**
- Profile creation wizard or step-by-step process
- Progress indicator shows completion status
- Final confirmation screen when profile is complete
- Profile data saved to local storage
- User can return to edit profile later
- Profile status clearly displayed in application

---

### US-067: Select Hiring Strategies and Effort Level
**As a** job seeker,  
**I want to** select which hiring strategies I want to use and my preferred effort level,  
**So that** the application can tailor its recommendations and tasks to my preferences.

**Acceptance Criteria:**
- Strategy selection interface with multiple options:
  - Strategy 1: Enhanced Application Process & Learning
  - Strategy 2: Network Building & Recruiter Management
  - Strategy 3: LinkedIn Presence & Personal Branding
- Effort level selection (Low, Medium, High, Maximum)
- Can select multiple strategies
- Selections saved with profile
- Can be updated later
- Selections influence job recommendations and task generation

---

### US-068: View Suggested Jobs from Internet
**As a** job seeker,  
**I want to** see a list of job positions found from the internet that match my profile,  
**So that** I can discover opportunities I might have missed.

**Acceptance Criteria:**
- Jobs fetched from multiple online sources
- Jobs filtered based on profile (location, skills, job titles, work type)
- Job list displays: Title, Company, Location, Post Date, Description, Source
- Jobs sorted by relevance or date
- "Update Jobs" button to fetch latest opportunities
- Loading state during job fetching
- Error handling if job fetching fails

---

### US-069: Apply to Jobs and Log Activities
**As a** job seeker,  
**I want to** mark jobs as applied and log my application activities,  
**So that** I can track my job search progress and maintain a record of all applications.

**Acceptance Criteria:**
- "Apply" button on each suggested job
- Clicking "Apply" adds job to applications list
- Activity log entry created automatically
- User can add manual log entries for other activities
- Log entries include: Date, Activity Type, Description, Outcome
- Log entries displayed in chronological order
- Can edit or delete log entries

---

### US-070: Get Job Match Score (Optional)
**As a** job seeker,  
**I want to** see a match score for a job based on the job description,  
**So that** I can prioritize which jobs to apply to first.

**Acceptance Criteria:**
- "Get Match Score" button on job cards (optional feature)
- Warning message displayed that this feature uses GPT API credits
- API credit balance checked before processing
- If insufficient credits, user is notified and feature disabled
- Job description sent to GPT API for analysis
- Match score returned (e.g., 1-10 or percentage)
- Score explanation provided (why this score, what matches, what doesn't)
- Score displayed prominently on job card
- Credit usage clearly indicated

---

### US-071: Receive AI Recommendations Based on Activities
**As a** job seeker,  
**I want to** receive personalized recommendations from AI based on my application activities,  
**So that** I can improve my job search strategy and increase my success rate.

**Acceptance Criteria:**
- "Get Recommendations" feature available
- AI analyzes user's application history, activities, and profile
- Recommendations include:
  - What to do next
  - Which jobs to prioritize
  - How to improve applications
  - Skills to highlight
  - Networking suggestions
- Recommendations displayed in clear, actionable format
- Can request new recommendations at any time
- Recommendations saved for reference

---

### US-072: View Remaining API Credits
**As a** job seeker,  
**I want to** see my remaining API credits (GPT or avalAI) in a floating box,  
**So that** I know how many credits I have left before making API calls.

**Acceptance Criteria:**
- Floating box/widget displays current credit balance
- Updates automatically after each API call
- Shows credit balance for both GPT and avalAI (if configured)
- Visible but not intrusive (can be minimized)
- Clicking box shows detailed credit information
- Warning when credits are low (e.g., < 20%)
- Error message if unable to fetch credit balance
- Credit balance checked periodically or on-demand

---

## Summary - Phase 1 Vision

These 14 new user stories (US-059 to US-072) define the Phase 1 vision for the Job Application Tracker:

**Setup & Profile Creation:**
- Local installation and setup (US-059)
- LinkedIn PDF upload (US-060)
- API key configuration (US-061)
- Resume to markdown conversion (US-062)
- AI-powered profile extraction (US-063)
- Profile editing capabilities (US-064)
- Location and work type selection (US-065)
- Profile completion (US-066)

**Strategy Selection:**
- Hiring strategy and effort level selection (US-067)

**Job Discovery & Application:**
- View suggested jobs from internet (US-068)
- Apply and log activities (US-069)
- Optional job match scoring (US-070)

**AI Features:**
- Personalized recommendations (US-071)
- API credit monitoring (US-072)

**Implementation Priority:**
- **High Priority**: US-059, US-060, US-061, US-062, US-063, US-064, US-065, US-066, US-067, US-068, US-069
- **Medium Priority**: US-071, US-072
- **Low Priority** (Optional): US-070

**Total User Stories**: 72 (58 existing + 14 new Phase 1 vision stories)

