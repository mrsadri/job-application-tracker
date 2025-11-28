// Job filtering utility based on user profile
export function filterJobsByProfile(jobs, profile) {
    if (!profile || !jobs || jobs.length === 0) {
        return jobs;
    }

    const targetLocations = profile.target_locations || [];
    const preferredRoles = profile.preferred_roles || [];
    const skills = profile.skills || [];

    return jobs.filter(job => {
        // Check location match
        const locationMatch = targetLocations.some(location => {
            const jobLocation = (job.location || '').toLowerCase();
            return jobLocation.includes(location.toLowerCase()) || 
                   location.toLowerCase().includes(jobLocation);
        });

        // Check role match
        const roleMatch = preferredRoles.some(role => {
            const jobTitle = (job.title || '').toLowerCase();
            const jobDescription = (job.description || '').toLowerCase();
            const roleLower = role.toLowerCase();
            return jobTitle.includes(roleLower) || 
                   jobDescription.includes(roleLower);
        });

        // Check skills match (at least one skill should match)
        const skillMatch = skills.length === 0 || skills.some(skill => {
            const skillLower = skill.toLowerCase();
            const jobTitle = (job.title || '').toLowerCase();
            const jobDescription = (job.description || '').toLowerCase();
            return jobTitle.includes(skillLower) || 
                   jobDescription.includes(skillLower);
        });

        // Job matches if location matches AND (role matches OR skill matches)
        return locationMatch && (roleMatch || skillMatch);
    });
}

export function normalizeJobData(job, source) {
    return {
        id: job.id || `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: job.title || job.jobTitle || '',
        company: job.company || job.companyName || job.employer || '',
        location: job.location || job.city || '',
        url: job.url || job.jobUrl || job.link || '',
        description: job.description || job.summary || '',
        created: job.created || job.postedDate || job.datePosted || new Date().toISOString(),
        salary: job.salary || job.salaryRange || null,
        type: job.type || job.jobType || job.employmentType || 'Full-time',
        remote: job.remote || job.remoteWork || job.workFromHome || null,
        source: source || 'Unknown',
        raw: job // Keep original data for reference
    };
}

export function deduplicateJobs(jobs) {
    const seen = new Set();
    const unique = [];

    for (const job of jobs) {
        // Create a unique key based on title, company, and location
        const key = `${(job.title || '').toLowerCase()}-${(job.company || '').toLowerCase()}-${(job.location || '').toLowerCase()}`;
        
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(job);
        }
    }

    return unique;
}

