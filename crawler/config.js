// Crawler Configuration
import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    apiKeys: {
        adzuna: {
            appId: process.env.ADZUNA_APP_ID || '',
            appKey: process.env.ADZUNA_APP_KEY || ''
        },
        reed: {
            apiKey: process.env.REED_API_KEY || ''
        },
        serpapi: {
            apiKey: process.env.SERPAPI_KEY || ''
        }
    },
    crawler: {
        enabled: process.env.CRAWLER_ENABLED === 'true',
        schedule: process.env.CRAWLER_SCHEDULE || '0 9 * * *', // Daily at 9 AM
        rateLimitDelay: parseInt(process.env.RATE_LIMIT_DELAY) || 2000,
        maxJobsPerSource: parseInt(process.env.MAX_JOBS_PER_SOURCE) || 50,
        respectRobotsTxt: process.env.RESPECT_ROBOTS_TXT !== 'false'
    },
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:8080', 'http://localhost:8088', 'http://localhost:5500', 'http://127.0.0.1:5500']
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
};

// User profile preferences (can be loaded from my-profile.json)
// Based on Masih Sadri's resume: Senior Product Designer with 6+ years experience
// Transitioning to Software Engineering while leveraging design and data analysis expertise
export const defaultProfile = {
    target_locations: [
        "Dublin, Ireland",
        "Amsterdam, Netherlands",
        "Eindhoven, Netherlands",
        "Rotterdam, Netherlands",
        "Utrecht, Netherlands",
        "Cork, Ireland",
        "Leeds, England"
    ],
    preferred_roles: [
        // Primary: Product/Design roles (6+ years expertise - matches actual experience)
        "Product Designer",
        "Senior Product Designer",
        "UX Designer",
        "User Experience Designer",
        "UI/UX Designer",
        "Product Design Lead",
        "Design Lead",
        "Senior UX Designer",
        "Lead Product Designer",
        // Secondary: Hybrid roles (design + technical collaboration)
        "Product Engineer",
        "Design Engineer",
        "UX Engineer",
        "Design Technologist"
    ],
    skills: [
        // Core Design & UX Skills (Primary - 6+ years experience)
        "Product Design",
        "User Experience Design",
        "UX Design",
        "UI Design",
        "Design Systems",
        "UI/UX Design",
        "Wireframing",
        "Prototyping",
        "Usability Testing",
        "User Research",
        "Interaction Design",
        "Micro-interactions",
        // Data-Driven Design (Strong expertise)
        "Data Analysis",
        "Statistical Analysis",
        "A/B Testing",
        "Funnel Analytics",
        "CRO",
        "Business Metrics",
        "Data Preprocessing",
        // Tools & Platforms (Expert level)
        "Figma",
        "Framer",
        "Claude",
        "Cursor",
        "NotebookLM",
        // Business & Strategy (Product experience)
        "Market Analysis",
        "Competitive Analysis",
        "Roadmapping",
        "OKR Alignment",
        "Product Strategy",
        "BI Tools",
        // Technical Skills (Supporting - for hybrid roles)
        "Python",
        "JavaScript"
    ]
};

