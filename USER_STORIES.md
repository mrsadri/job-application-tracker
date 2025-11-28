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

---

## Summary

These 37 user stories cover all major features of the Dublin Job Application Tracker:

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
- **Deployment and Hosting (US-037)**: GitHub Pages deployment for production use

Each user story follows the standard format: "As a [user type], I want [goal], so that [benefit]" and includes acceptance criteria for implementation guidance.

