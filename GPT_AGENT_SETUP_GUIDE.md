# 🤖 GPT AI Agent Setup Guide for Daily Job Search

## Overview

This guide will help you set up a GPT AI Agent (using ChatGPT or OpenAI API) to:
1. **Daily Job Search**: Find top 5 matching job positions every day
2. **Application Strategy**: Learn and apply best practices for job applications
3. **Daily Advice**: Receive personalized recommendations based on your activity

---

## Step 1: Create Your Profile Files

### 1.1 Create `my-profile.json`

Create a JSON file with your professional information extracted from your portfolio:

```json
{
  "name": "Your Name",
  "location": "Dublin, Ireland (or your current location)",
  "portfolio_url": "https://mrsadri.github.io/Portfolio/",
  "target_location": "Dublin, Ireland",
  "skills": [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "TypeScript",
    "HTML/CSS",
    "Git",
    "SQL",
    "MongoDB",
    "Express.js"
  ],
  "experience_years": 5,
  "education": "Your degree/education",
  "languages": ["English", "Other languages"],
  "work_authorization": "Need visa sponsorship / EU citizen / etc.",
  "preferred_roles": [
    "Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer"
  ],
  "industries": [
    "Technology",
    "FinTech",
    "E-commerce"
  ],
  "salary_expectations": "€XX,XXX - €XX,XXX",
  "remote_preference": "Remote / Hybrid / On-site",
  "availability": "Immediate / 2 weeks notice / etc."
}
```

**Action**: Fill this file with your actual information from your portfolio.

---

### 1.2 Create `application-strategies.md`

This file documents your application approach and strategies:

```markdown
# My Job Application Strategies

## Current Strategies

### 1. Application Timing
- Apply within 24-48 hours of job posting
- Best days: Tuesday-Thursday
- Best times: 9 AM - 11 AM (when recruiters check emails)

### 2. Resume/CV Customization
- Tailor resume for each position
- Highlight relevant skills from job description
- Use keywords from job posting
- Keep resume to 2 pages maximum

### 3. Cover Letter Approach
- Write personalized cover letters
- Mention specific company projects/products
- Connect your experience to job requirements
- Show enthusiasm for the role

### 4. Application Channels
- LinkedIn (primary)
- Company websites (direct applications)
- Job boards: Indeed, Glassdoor, IrishJobs.ie
- Recruiters and agencies

### 5. Follow-up Strategy
- Follow up after 1 week if no response
- Send thank-you email after interviews
- Connect with recruiters on LinkedIn

### 6. Networking
- Attend virtual/in-person tech meetups
- Engage with companies on LinkedIn
- Reach out to employees at target companies

## Strategies to Test (GPT will suggest these)

### A. A/B Testing Resume Versions
- Create 2-3 versions of resume with different focuses
- Track which version gets more responses

### B. Application Volume
- Target: 5-10 applications per week
- Quality over quantity, but consistency matters

### C. Skill Gap Analysis
- Identify missing skills in job descriptions
- Take quick courses/certifications to fill gaps

### D. Company Research
- Research company culture before applying
- Understand their tech stack
- Check employee reviews on Glassdoor

### E. Interview Preparation
- Prepare STAR method stories
- Research common interview questions
- Practice coding challenges (if applicable)

## Metrics to Track
- Application response rate
- Interview conversion rate
- Time from application to response
- Most successful application channels
```

---

### 1.3 Create `application-history.json`

This file tracks your applications (you can export from your HTML tracker):

```json
{
  "total_applications": 0,
  "applications": [],
  "statistics": {
    "applied": 0,
    "interview": 0,
    "rejected": 0,
    "accepted": 0,
    "response_rate": 0,
    "interview_rate": 0
  },
  "last_updated": "2024-01-01T00:00:00Z"
}
```

**Note**: You can manually update this or create a script to export from your HTML tracker's localStorage.

---

### 1.4 Create `job-search-prompt.md`

This is the main prompt you'll use daily with GPT:

```markdown
# Daily Job Search Prompt

You are an expert job search assistant helping me find the best job opportunities in Dublin, Ireland.

## My Profile
[Paste contents from my-profile.json]

## My Application History
[Paste recent statistics from application-history.json]

## Today's Task

Please help me find the TOP 5 best matching job positions for today, [DATE].

### Requirements:
1. Search for NEW job postings (posted in last 7 days)
2. Match positions based on my skills: [LIST SKILLS]
3. Focus on: [TARGET LOCATION]
4. Preferred roles: [LIST ROLES]
5. Consider visa sponsorship requirements: [YES/NO]

### For each job, provide:
1. **Job Title** and **Company Name**
2. **Job Posting URL** (LinkedIn, company website, or job board)
3. **Match Score** (1-10) and why it's a good match
4. **Key Requirements** from the job description
5. **How my skills align** with the requirements
6. **Application Deadline** (if mentioned)
7. **Application Method** (LinkedIn Easy Apply, company website, email, etc.)
8. **Why this is in top 5** - what makes it stand out

### Format:
```
## Job 1: [Job Title] at [Company]
- **URL**: [link]
- **Match Score**: 9/10
- **Why**: [explanation]
- **Requirements**: [key points]
- **My Fit**: [how I match]
- **Apply Via**: [method]
- **Deadline**: [date]
```

### Additional Notes:
- Prioritize companies that sponsor work visas (if applicable)
- Look for remote/hybrid options if preferred
- Consider company size and growth stage
- Check if they mention relocation assistance

### After providing the 5 jobs, also provide:
1. **Application Priority Order** (which to apply to first)
2. **Quick Tips** for each application
3. **Any red flags** or concerns about any positions
```

---

### 1.5 Create `daily-advice-prompt.md`

This prompt gets personalized advice based on your activity:

```markdown
# Daily Advice Prompt

You are my job search coach. Analyze my recent activity and provide personalized advice.

## My Profile
[Paste my-profile.json]

## My Application Statistics
[Paste current stats from application-history.json]

## Recent Activity (Last 7 Days)
- Applications submitted: [number]
- Interviews scheduled: [number]
- Responses received: [number]
- Rejections: [number]
- Status updates: [list any]

## My Application Strategies
[Paste relevant sections from application-strategies.md]

## Today's Request

Please analyze my job search progress and provide:

### 1. Performance Analysis
- What's working well?
- What needs improvement?
- Response rate trends
- Interview conversion rate

### 2. Strategic Recommendations
- Which strategies should I continue?
- What new strategies should I try?
- Any adjustments to my approach?

### 3. Action Items for Today
- Specific tasks I should complete
- Applications to follow up on
- Skills to highlight or develop
- Networking opportunities

### 4. Motivation & Encouragement
- Celebrate wins
- Address any concerns
- Keep me motivated

### 5. Market Insights
- Trends in the Dublin job market
- In-demand skills I should highlight
- Companies actively hiring

Format your response in a friendly, actionable way.
```

---

## Step 2: Set Up ChatGPT Custom Instructions

### Option A: Using ChatGPT (Web/App)

1. Go to ChatGPT settings
2. Navigate to "Custom Instructions"
3. Add the following:

```
You are my dedicated job search assistant for finding opportunities in Dublin, Ireland.

My Portfolio: https://mrsadri.github.io/Portfolio/

When helping me:
1. Always consider my skills, experience, and visa requirements
2. Provide actionable, specific advice
3. Focus on quality over quantity
4. Help me understand why certain strategies work
5. Be encouraging but honest about my progress

I track my applications manually in a local HTML tracker. When I share statistics, use them to provide personalized insights.

Always format job recommendations clearly with:
- Match score (1-10)
- Why it's a good fit
- Application method
- Priority level
```

### Option B: Using OpenAI API (Advanced)

If you want to automate this, you can create a script that:
1. Reads your profile files
2. Calls OpenAI API with the prompts
3. Saves results to a file

---

## Step 3: Daily Workflow

### Morning Routine (15 minutes)

1. **Update Application History**
   - Open your HTML tracker
   - Note any new responses, interviews, or status changes
   - Update `application-history.json` if needed

2. **Run Daily Job Search**
   - Open ChatGPT
   - Copy the prompt from `job-search-prompt.md`
   - Fill in the date and any updates
   - Paste and send
   - Save the results (copy to a file or note-taking app)

3. **Review and Prioritize**
   - Read through the 5 job recommendations
   - Check the job postings yourself
   - Decide which ones to apply to
   - Add them to your HTML tracker when you apply

### Evening Routine (10 minutes)

1. **Get Daily Advice**
   - Open ChatGPT
   - Copy the prompt from `daily-advice-prompt.md`
   - Update with today's activity
   - Paste and send
   - Review the advice and plan tomorrow

2. **Update Strategies**
   - If GPT suggests new strategies, add them to `application-strategies.md`
   - Note which strategies you're testing
   - Track what works

---

## Step 4: Best Practices for GPT Interaction

### ✅ DO:
- Be specific about what you need
- Share your actual statistics and progress
- Ask follow-up questions
- Request explanations for recommendations
- Update your profile files as you learn new skills

### ❌ DON'T:
- Share sensitive personal information (use general info)
- Rely solely on GPT without verifying job postings
- Apply to jobs without reading the full description
- Ignore your own judgment in favor of GPT's suggestions

---

## Step 5: Advanced: Automation Script (Optional)

If you want to automate the daily prompts, create `daily-job-search.js`:

```javascript
// This is a template - you'll need to set up OpenAI API key
const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function dailyJobSearch() {
  // Read profile files
  const profile = JSON.parse(fs.readFileSync('my-profile.json', 'utf8'));
  const history = JSON.parse(fs.readFileSync('application-history.json', 'utf8'));
  const prompt = fs.readFileSync('job-search-prompt.md', 'utf8');
  
  // Replace placeholders
  const filledPrompt = prompt
    .replace('[Paste contents from my-profile.json]', JSON.stringify(profile, null, 2))
    .replace('[Paste recent statistics...]', JSON.stringify(history.statistics, null, 2))
    .replace('[DATE]', new Date().toLocaleDateString());
  
  // Call GPT
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an expert job search assistant." },
      { role: "user", content: filledPrompt }
    ]
  });
  
  // Save results
  const results = response.choices[0].message.content;
  const filename = `job-search-${new Date().toISOString().split('T')[0]}.md`;
  fs.writeFileSync(filename, results);
  
  console.log(`Results saved to ${filename}`);
}

dailyJobSearch();
```

**To use this:**
1. Install Node.js
2. Run: `npm install openai`
3. Set environment variable: `export OPENAI_API_KEY='your-key'`
4. Run: `node daily-job-search.js`

---

## Step 6: Application Strategies (Best Practices)

Here are proven strategies GPT can help you implement:

### Strategy 1: The 80% Match Rule
- Only apply to jobs where you meet 80%+ of requirements
- GPT can help assess match percentage

### Strategy 2: The 2-Hour Application
- Spend 2 hours per application (research + customize)
- GPT can help draft personalized cover letters

### Strategy 3: The Follow-up System
- Follow up after 1 week, 2 weeks, 1 month
- GPT can help draft follow-up emails

### Strategy 4: The Skill Gap Tracker
- Identify missing skills in job descriptions
- GPT can suggest learning resources

### Strategy 5: The Company Deep Dive
- Research 3-5 target companies thoroughly
- GPT can help create company research templates

### Strategy 6: The ATS Optimization
- Optimize resume for Applicant Tracking Systems
- GPT can help identify and add keywords

### Strategy 7: The Networking Script
- Prepare messages for reaching out to employees
- GPT can help draft personalized LinkedIn messages

---

## Step 7: Tracking and Measuring Success

### Weekly Review Template

Ask GPT to help you review:

```
Weekly Job Search Review - Week of [DATE]

1. Applications Submitted: [number]
2. Responses Received: [number]
3. Response Rate: [percentage]
4. Interviews Scheduled: [number]
5. Interview Rate: [percentage]
6. Rejections: [number]
7. Still Pending: [number]

Analysis:
- What worked this week?
- What didn't work?
- Best performing application channel?
- Most common rejection reasons?

Next Week Goals:
- [ ] Apply to X jobs
- [ ] Follow up on Y applications
- [ ] Network with Z people
- [ ] Improve [specific skill/strategy]
```

---

## Step 8: Files Structure

Your project folder should now have:

```
applyJob/
├── index.html (your existing tracker)
├── script.js
├── styles.css
├── README.md
├── GPT_AGENT_SETUP_GUIDE.md (this file)
├── my-profile.json (CREATE THIS)
├── application-strategies.md (CREATE THIS)
├── application-history.json (CREATE THIS)
├── job-search-prompt.md (CREATE THIS)
├── daily-advice-prompt.md (CREATE THIS)
└── daily-job-search.js (OPTIONAL - for automation)
```

---

## Step 9: Quick Start Checklist

- [ ] Create `my-profile.json` with your information
- [ ] Create `application-strategies.md` (start with template)
- [ ] Create `application-history.json` (initialize with current stats)
- [ ] Create `job-search-prompt.md`
- [ ] Create `daily-advice-prompt.md`
- [ ] Set up ChatGPT Custom Instructions
- [ ] Test the job search prompt once
- [ ] Test the daily advice prompt once
- [ ] Establish your daily routine
- [ ] Start tracking results

---

## Step 10: Example Daily Interaction

### Morning (Job Search):

**You**: [Paste filled job-search-prompt.md]

**GPT**: [Provides 5 job recommendations with details]

**You**: "Can you help me draft a cover letter for Job #1?"

**GPT**: [Drafts personalized cover letter]

### Evening (Advice):

**You**: [Paste filled daily-advice-prompt.md]

**GPT**: [Provides analysis and recommendations]

**You**: "I got rejected from 3 applications this week. What should I do differently?"

**GPT**: [Provides specific advice based on your situation]

---

## Troubleshooting

### GPT gives generic advice
- **Solution**: Be more specific in your prompts. Include exact numbers, dates, and details.

### GPT recommends jobs that don't match
- **Solution**: Refine your profile. Be clearer about must-haves vs. nice-to-haves.

### Too many job recommendations
- **Solution**: Ask GPT to be more selective. Emphasize quality over quantity.

### GPT doesn't understand your skills
- **Solution**: Update `my-profile.json` with more detail. Include specific technologies, frameworks, and tools.

---

## Next Steps

1. **Start Today**: Create the profile files and test the prompts
2. **Establish Routine**: Set aside 15-20 minutes daily
3. **Iterate**: Refine your prompts based on what works
4. **Track Results**: Use your HTML tracker to measure success
5. **Adjust Strategies**: Let GPT help you optimize your approach

---

## Additional Resources

- **Job Boards**: LinkedIn, Indeed, IrishJobs.ie, Glassdoor
- **Visa Info**: Citizens Information Ireland, INIS website
- **Networking**: Dublin Tech Meetups, LinkedIn Groups
- **Resume Help**: Ask GPT to review your resume format

---

## Final Tips

1. **Consistency is Key**: Daily routine > sporadic effort
2. **Quality Matters**: 5 well-targeted applications > 20 generic ones
3. **Learn and Adapt**: Use GPT's advice to improve continuously
4. **Stay Positive**: Job searching is a marathon, not a sprint
5. **Verify Everything**: Always check job postings yourself before applying

---

**Good luck with your job search! 🍀**

Remember: GPT is a tool to help you, but your judgment, persistence, and authentic self are what will land you the job.

