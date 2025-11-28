// Toast Notification System
class ToastNotification {
    constructor() {
        this.container = this.createContainer();
    }
    
    createContainer() {
        const container = document.getElementById('toast-container') || document.createElement('div');
        container.className = 'toast-container';
        container.setAttribute('role', 'status');
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        if (!document.getElementById('toast-container')) {
            document.body.appendChild(container);
        }
        return container;
    }
    
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        
        const icon = this.getIcon(type);
        toast.innerHTML = `
            <span class="toast-icon" aria-hidden="true">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Close notification" type="button">
                <span aria-hidden="true">×</span>
            </button>
        `;
        
        this.container.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Auto dismiss
        const timer = setTimeout(() => {
            this.dismiss(toast);
        }, duration);
        
        // Manual dismiss
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timer);
            this.dismiss(toast);
        });
        
        return toast;
    }
    
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
    
    dismiss(toast) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }
}

// Global toast instance
const toast = new ToastNotification();

// Simple Router for SPA navigation
class Router {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        // Handle hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial load
        this.handleRoute();
        
        // Handle navigation link clicks
        document.querySelectorAll('.nav-link, [data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                const page = link.getAttribute('data-page') || link.getAttribute('href')?.replace('#', '');
                if (page) {
                    e.preventDefault();
                    this.navigateTo(page);
                }
            });
        });
    }

    handleRoute() {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        this.navigateTo(hash);
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.style.display = 'none';
        });

        // Show target page
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.style.display = 'block';
            this.currentPage = page;
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
                if (link.getAttribute('data-page') === page || link.getAttribute('href') === `#${page}`) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });

            // Update URL without reload
            if (window.location.hash !== `#${page}`) {
                window.history.pushState(null, '', `#${page}`);
            }

            // Announce page change for screen readers
            const pageTitle = targetPage.querySelector('h2')?.textContent || page;
            this.announce(`Navigated to ${pageTitle}`);
            
            // Render strategy data when navigating to strategy pages
            if (page === 'strategy1' || page === 'strategy2' || page === 'strategy3') {
                this.renderAllStrategyData();
            }
        }
    }

    announce(message) {
        const announcer = document.getElementById('status-announcements');
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }
}

// Job Application Tracker
class JobTracker {
    constructor() {
        this.applications = this.loadApplications();
        this.suggestedJobs = this.loadSuggestedJobs();
        this.currentEditId = null;
        this.profile = null;
        this.deletePendingId = null;
        // Pagination state
        this.paginationState = {
            suggestedJobs: {
                currentPage: 1,
                itemsPerPage: 10
            },
            applications: {
                currentPage: 1,
                itemsPerPage: 10
            }
        };
        this.loadPaginationState();
        // Strategy 1 data
        this.hrContacts = this.loadData('hrContacts');
        this.rejectionEmails = this.loadData('rejectionEmails');
        this.coverLetters = this.loadData('coverLetters');
        this.processLogs = this.loadData('processLogs');
        // Strategy 2 data
        this.recruiters = this.loadData('recruiters');
        this.recruiterInteractions = this.loadData('recruiterInteractions');
        this.hiringManagers = this.loadData('hiringManagers');
        this.networkingActivities = this.loadData('networkingActivities');
        this.aiTasks = this.loadData('aiTasks');
        // Strategy 3 data
        this.contentIdeas = this.loadData('contentIdeas');
        this.linkedinActivities = this.loadData('linkedinActivities');
        this.portfolioItems = this.loadData('portfolioItems');
        this.profileViews = this.loadData('profileViews');
        this.inboundOpportunities = this.loadData('inboundOpportunities');
        this.weeklyTasks = this.loadData('weeklyTasks');
        this.init();
    }

    init() {
        this.loadProfile();
        this.setupEventListeners();
        this.setupRouter();
        this.filterApplications(); // Use filterApplications to apply sorting on initial load
        this.updateStats();
        this.updateDashboardStats();
        this.renderRecentApplications();
        this.setDefaultDate();
        this.renderSuggestedJobs();
        this.setupStrategyTabs();
        this.setupStrategyModals();
        this.renderAllStrategyData();
    }

    setupRouter() {
        this.router = new Router();
    }

    setupEventListeners() {
        // Navigation mobile toggle
        const navMobileToggle = document.getElementById('nav-mobile-toggle');
        if (navMobileToggle) {
            navMobileToggle.addEventListener('click', () => {
                const navLinks = document.getElementById('nav-links');
                if (navLinks) {
                    navLinks.classList.toggle('open');
                    navMobileToggle.setAttribute('aria-expanded', 
                        navLinks.classList.contains('open') ? 'true' : 'false');
                }
            });
        }

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            const navLinks = document.getElementById('nav-links');
            const navMobileToggle = document.getElementById('nav-mobile-toggle');
            if (navLinks && navMobileToggle && 
                !navLinks.contains(e.target) && 
                !navMobileToggle.contains(e.target)) {
                navLinks.classList.remove('open');
                navMobileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Modal controls
        const addJobBtn = document.getElementById('add-job-btn');
        if (addJobBtn) {
            addJobBtn.addEventListener('click', () => this.openModal());
        }
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('job-form').addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Empty state add button
        const emptyStateBtn = document.getElementById('empty-state-add-btn');
        if (emptyStateBtn) {
            emptyStateBtn.addEventListener('click', () => this.openModal());
        }
        
        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }

        // Filter, search, and sort
        document.getElementById('search-input').addEventListener('input', (e) => this.filterApplications());
        document.getElementById('status-filter').addEventListener('change', () => this.filterApplications());
        document.getElementById('source-filter').addEventListener('change', () => this.filterApplications());
        document.getElementById('sort-by').addEventListener('change', () => this.filterApplications());

        // Telegram integration
        document.getElementById('add-from-telegram-btn').addEventListener('click', () => this.openModalFromTelegram());
        
        // Handle Telegram channel link clicks to pre-fill source
        document.querySelectorAll('.telegram-channel-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const channel = link.getAttribute('data-channel');
                // Store the channel for when modal opens
                sessionStorage.setItem('pendingTelegramSource', `Telegram - @${channel}`);
            });
        });

        // Suggested jobs
        document.getElementById('refresh-jobs-btn').addEventListener('click', () => this.fetchSuggestedJobs());
        
        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => this.closeMobileMenu());
        }
        
        // Collapsible sidebar sections
        document.querySelectorAll('.sidebar-section .section-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.closest('.sidebar-section');
                const isCollapsed = section.getAttribute('data-collapsed') === 'true';
                section.setAttribute('data-collapsed', isCollapsed ? 'false' : 'true');
                header.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
            });
        });
        
        // Delete confirmation modal
        document.getElementById('close-delete-modal')?.addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('cancel-delete-btn')?.addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirm-delete-btn')?.addEventListener('click', () => this.confirmDelete());
        
        // Close modal on outside click
        document.getElementById('job-modal').addEventListener('click', (e) => {
            if (e.target.id === 'job-modal') {
                this.closeModal();
            }
        });
        
        // Close delete modal on outside click
        document.getElementById('delete-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'delete-modal') {
                this.closeDeleteModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Form validation
        this.setupFormValidation();
    }
    
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (sidebar && sidebarOverlay && mobileMenuBtn) {
            const isOpen = sidebar.classList.contains('open');
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                sidebar.classList.add('open');
                sidebarOverlay.classList.add('active');
                sidebarOverlay.setAttribute('aria-hidden', 'false');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        }
    }
    
    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (sidebar && sidebarOverlay && mobileMenuBtn) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            sidebarOverlay.setAttribute('aria-hidden', 'true');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }
    
    clearFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('status-filter').value = 'all';
        document.getElementById('source-filter').value = 'all';
        this.filterApplications();
        toast.show('Filters cleared', 'info', 2000);
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + N - New Application
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.openModal();
        }
        
        // Ctrl/Cmd + K - Focus Search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('search-input').focus();
        }
        
        // Escape - Close modals
        if (e.key === 'Escape') {
            const jobModal = document.getElementById('job-modal');
            const deleteModal = document.getElementById('delete-modal');
            
            if (jobModal && jobModal.classList.contains('active')) {
                this.closeModal();
            } else if (deleteModal && deleteModal.style.display !== 'none') {
                this.closeDeleteModal();
            } else {
                this.closeMobileMenu();
            }
        }
    }
    
    setupFormValidation() {
        // Real-time URL validation
        const urlInput = document.getElementById('job-url');
        if (urlInput) {
            urlInput.addEventListener('blur', (e) => {
                const url = e.target.value.trim();
                if (url && !this.isValidURL(url)) {
                    this.showFieldError(urlInput, 'Please enter a valid URL (e.g., https://example.com)');
                } else {
                    this.clearFieldError(urlInput);
                }
            });
            
            urlInput.addEventListener('input', () => {
                if (urlInput.getAttribute('aria-invalid') === 'true') {
                    const url = urlInput.value.trim();
                    if (!url || this.isValidURL(url)) {
                        this.clearFieldError(urlInput);
                    }
                }
            });
        }
        
        // Email validation
        const emailInput = document.getElementById('contact-email');
        if (emailInput) {
            emailInput.addEventListener('blur', (e) => {
                const email = e.target.value.trim();
                if (email && !this.isValidEmail(email)) {
                    this.showFieldError(emailInput, 'Please enter a valid email address');
                } else {
                    this.clearFieldError(emailInput);
                }
            });
        }
    }
    
    isValidURL(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showFieldError(input, message) {
        input.setAttribute('aria-invalid', 'true');
        const errorId = input.id + '-error';
        const errorEl = document.getElementById(errorId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }
    
    clearFieldError(input) {
        input.setAttribute('aria-invalid', 'false');
        const errorId = input.id + '-error';
        const errorEl = document.getElementById(errorId);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('show');
        }
    }

    setDefaultDate() {
        const dateInput = document.getElementById('application-date');
        if (!dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    loadApplications() {
        const storageKey = (window.PATHS && window.PATHS.STORAGE && window.PATHS.STORAGE.APPLICATIONS) || 'jobApplications';
        const stored = localStorage.getItem(storageKey);
        const apps = stored ? JSON.parse(stored) : [];
        // Ensure all applications have a history array and source field
        return apps.map(app => {
            if (!app.history) {
                app.history = [{
                    timestamp: app.createdAt || new Date().toISOString(),
                    changes: [{ field: 'Application', action: 'created', newValue: 'Application created' }]
                }];
            }
            // Ensure source field exists for backward compatibility
            if (!app.source) {
                app.source = '';
            }
            return app;
        });
    }

    loadProfile() {
        // Load profile from my-profile.json
        const profilePath = (window.PATHS && window.PATHS.FRONTEND && window.PATHS.FRONTEND.PROFILE) || 'my-profile.json';
        fetch(profilePath)
            .then(response => response.json())
            .then(profile => {
                this.profile = profile;
            })
            .catch(error => {
                console.error('Error loading profile:', error);
            });
    }

    loadSuggestedJobs() {
        const storageKey = (window.PATHS && window.PATHS.STORAGE && window.PATHS.STORAGE.SUGGESTED_JOBS) || 'suggestedJobs';
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    loadPaginationState() {
        const stored = localStorage.getItem('paginationState');
        if (stored) {
            this.paginationState = { ...this.paginationState, ...JSON.parse(stored) };
        }
    }

    savePaginationState() {
        localStorage.setItem('paginationState', JSON.stringify(this.paginationState));
    }

    saveSuggestedJobs() {
        const storageKey = (window.PATHS && window.PATHS.STORAGE && window.PATHS.STORAGE.SUGGESTED_JOBS) || 'suggestedJobs';
        localStorage.setItem(storageKey, JSON.stringify(this.suggestedJobs));
        this.renderSuggestedJobs();
    }

    saveApplications() {
        try {
            const storageKey = (window.PATHS && window.PATHS.STORAGE && window.PATHS.STORAGE.APPLICATIONS) || 'jobApplications';
            const data = JSON.stringify(this.applications);
            localStorage.setItem(storageKey, data);
            this.renderApplications();
            this.updateStats();
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                toast.show('Storage is full. Please delete some applications or clear browser data.', 'error', 5000);
                this.announce('Error: Storage is full. Unable to save data.');
            } else {
                toast.show('Failed to save data. Please check your browser settings.', 'error', 5000);
                this.announce('Error: Failed to save application data.');
            }
            console.error('Save error:', error);
        }
    }
    
    announce(message) {
        const announcer = document.getElementById('status-announcements');
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }

    openModal(jobId = null) {
        const modal = document.getElementById('job-modal');
        const form = document.getElementById('job-form');
        const title = document.getElementById('modal-title');
        
        // Close mobile menu if open
        this.closeMobileMenu();
        
        if (jobId) {
            this.currentEditId = jobId;
            const job = this.applications.find(app => app.id === jobId);
            title.textContent = 'Edit Job Application';
            this.populateForm(job);
            this.announce('Edit job application dialog opened');
        } else {
            this.currentEditId = null;
            title.textContent = 'Add New Job Application';
            form.reset();
            // Clear all error states
            form.querySelectorAll('[aria-invalid="true"]').forEach(input => {
                this.clearFieldError(input);
            });
            this.setDefaultDate();
            document.getElementById('location').value = 'Dublin, Ireland'; // Default to first target location
            
            // Check if there's a pending Telegram source
            const pendingSource = sessionStorage.getItem('pendingTelegramSource');
            if (pendingSource) {
                document.getElementById('job-source').value = pendingSource;
                sessionStorage.removeItem('pendingTelegramSource');
            }
            this.announce('Add new job application dialog opened');
        }
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';
        
        // Focus trap
        this.trapFocus(modal);
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }
    
    trapFocus(modalElement) {
        const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
            if (e.key === 'Escape') {
                this.closeModal();
            }
        };
        
        modalElement.addEventListener('keydown', handleKeyDown);
        
        // Store handler for cleanup
        modalElement._focusTrapHandler = handleKeyDown;
    }

    openModalFromTelegram() {
        // Open modal and show a helper message
        this.openModal();
        // Focus on URL field since Telegram posts have URLs
        setTimeout(() => {
            document.getElementById('job-url').focus();
            document.getElementById('job-url').placeholder = 'Paste Telegram post URL here (e.g., https://t.me/jobs_finding/3096)';
        }, 100);
    }

    closeModal() {
        const modal = document.getElementById('job-modal');
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        document.getElementById('job-form').reset();
        document.getElementById('job-url').placeholder = 'https://...';
        
        // Clear error states
        modal.querySelectorAll('[aria-invalid="true"]').forEach(input => {
            this.clearFieldError(input);
        });
        
        // Remove focus trap
        if (modal._focusTrapHandler) {
            modal.removeEventListener('keydown', modal._focusTrapHandler);
            delete modal._focusTrapHandler;
        }
        
        this.currentEditId = null;
        
        // Return focus to trigger button
        const addBtn = document.getElementById('add-job-btn');
        if (addBtn) {
            addBtn.focus();
        }
    }

    populateForm(job) {
        document.getElementById('job-id').value = job.id;
        document.getElementById('company-name').value = job.company;
        document.getElementById('position').value = job.position;
        // Set location, handling both select dropdown and text input
        const locationField = document.getElementById('location');
        if (locationField.tagName === 'SELECT') {
            // If it's a select, try to find matching option or set to first option
            const matchingOption = Array.from(locationField.options).find(opt => opt.value === job.location);
            locationField.value = matchingOption ? job.location : 'Dublin, Ireland';
        } else {
            locationField.value = job.location || 'Dublin, Ireland';
        }
        document.getElementById('job-url').value = job.url || '';
        document.getElementById('application-date').value = job.date;
        document.getElementById('status').value = job.status;
        document.getElementById('notes').value = job.notes || '';
        document.getElementById('contact-person').value = job.contactPerson || '';
        document.getElementById('contact-email').value = job.contactEmail || '';
        document.getElementById('job-source').value = job.source || '';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const submitText = submitButton.querySelector('.submit-text');
        const submitSpinner = submitButton.querySelector('.submit-spinner');
        
        // Validate form
        if (!form.checkValidity()) {
            // Find first invalid field and show error
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.reportValidity();
            }
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        if (submitText) submitText.style.display = 'none';
        if (submitSpinner) submitSpinner.style.display = 'inline-flex';
        
        // Validate URL if provided
        const urlInput = document.getElementById('job-url');
        const url = urlInput.value.trim();
        if (url && !this.isValidURL(url)) {
            this.showFieldError(urlInput, 'Please enter a valid URL');
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
            if (submitText) submitText.style.display = '';
            if (submitSpinner) submitSpinner.style.display = 'none';
            urlInput.focus();
            return;
        }
        
        // Validate email if provided
        const emailInput = document.getElementById('contact-email');
        const email = emailInput.value.trim();
        if (email && !this.isValidEmail(email)) {
            this.showFieldError(emailInput, 'Please enter a valid email address');
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
            if (submitText) submitText.style.display = '';
            if (submitSpinner) submitSpinner.style.display = 'none';
            emailInput.focus();
            return;
        }
        
        // Simulate async save (in real app, this would be an API call)
        setTimeout(() => {
            try {
                const formData = {
                    id: this.currentEditId || this.generateId(),
                    company: document.getElementById('company-name').value.trim(),
                    position: document.getElementById('position').value.trim(),
                    location: document.getElementById('location').value.trim() || 'Dublin, Ireland',
                    url: document.getElementById('job-url').value.trim(),
                    date: document.getElementById('application-date').value,
                    status: document.getElementById('status').value,
                    notes: document.getElementById('notes').value.trim(),
                    contactPerson: document.getElementById('contact-person').value.trim(),
                    contactEmail: document.getElementById('contact-email').value.trim(),
                    source: document.getElementById('job-source').value.trim(),
                    createdAt: this.currentEditId 
                        ? this.applications.find(app => app.id === this.currentEditId)?.createdAt || new Date().toISOString()
                        : new Date().toISOString(),
                    history: this.currentEditId 
                        ? this.applications.find(app => app.id === this.currentEditId)?.history || []
                        : []
                };

                if (this.currentEditId) {
                    // Track changes for existing application
                    const existingApp = this.applications.find(app => app.id === this.currentEditId);
                    if (existingApp) {
                        const changes = this.detectChanges(existingApp, formData);
                        if (changes.length > 0) {
                            formData.history = existingApp.history || [];
                            formData.history.unshift({
                                timestamp: new Date().toISOString(),
                                changes: changes
                            });
                        } else {
                            formData.history = existingApp.history || [];
                        }
                    }
                    
                    const index = this.applications.findIndex(app => app.id === this.currentEditId);
                    if (index !== -1) {
                        this.applications[index] = formData;
                    }
                } else {
                    // Add initial creation log for new application
                    formData.history = [{
                        timestamp: new Date().toISOString(),
                        changes: [{ field: 'Application', action: 'created', newValue: 'Application created' }]
                    }];
                    this.applications.unshift(formData);
                }

                this.saveApplications();
                this.renderRecentApplications(); // Update dashboard
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.removeAttribute('aria-busy');
                if (submitText) submitText.style.display = '';
                if (submitSpinner) submitSpinner.style.display = 'none';
                
                // Show success message
                const action = this.currentEditId ? 'updated' : 'added';
                toast.show(`Application ${action} successfully!`, 'success');
                this.announce(`Application ${action} successfully`);
                
                this.closeModal();
            } catch (error) {
                console.error('Submit error:', error);
                toast.show('Failed to save application. Please try again.', 'error');
                this.announce('Error: Failed to save application');
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.removeAttribute('aria-busy');
                if (submitText) submitText.style.display = '';
                if (submitSpinner) submitSpinner.style.display = 'none';
            }
        }, 300); // Small delay for UX
    }

    detectChanges(oldData, newData) {
        const changes = [];
        const fields = [
            { key: 'company', label: 'Company' },
            { key: 'position', label: 'Position' },
            { key: 'location', label: 'Location' },
            { key: 'url', label: 'Job URL' },
            { key: 'date', label: 'Application Date' },
            { key: 'status', label: 'Status' },
            { key: 'notes', label: 'Notes' },
            { key: 'contactPerson', label: 'Contact Person' },
            { key: 'contactEmail', label: 'Contact Email' },
            { key: 'source', label: 'Source' }
        ];

        fields.forEach(field => {
            const oldValue = oldData[field.key] || '';
            const newValue = newData[field.key] || '';
            
            if (oldValue !== newValue) {
                changes.push({
                    field: field.label,
                    oldValue: oldValue || '(empty)',
                    newValue: newValue || '(empty)'
                });
            }
        });

        return changes;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    deleteApplication(id) {
        const job = this.applications.find(app => app.id === id);
        const jobTitle = job ? `${job.position} at ${job.company}` : 'this application';
        
        this.deletePendingId = id;
        this.showDeleteModal(jobTitle);
    }
    
    showDeleteModal(jobTitle) {
        const modal = document.getElementById('delete-modal');
        const messageEl = document.getElementById('delete-message');
        
        if (modal && messageEl) {
            messageEl.textContent = `Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`;
            modal.style.display = 'flex';
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus trap
            this.trapFocus(modal);
            
            // Focus cancel button
            setTimeout(() => {
                document.getElementById('cancel-delete-btn')?.focus();
            }, 100);
        }
    }
    
    closeDeleteModal() {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            this.deletePendingId = null;
            
            // Remove focus trap
            if (modal._focusTrapHandler) {
                modal.removeEventListener('keydown', modal._focusTrapHandler);
                delete modal._focusTrapHandler;
            }
        }
    }
    
    confirmDelete() {
        if (this.deletePendingId) {
            const id = this.deletePendingId;
            this.applications = this.applications.filter(app => app.id !== id);
            this.saveApplications();
            this.renderRecentApplications(); // Update dashboard
            this.closeDeleteModal();
            toast.show('Application deleted successfully', 'success');
            this.announce('Application deleted');
        }
    }

    renderApplications(applicationsToRender = null) {
        const list = document.getElementById('applications-list');
        const emptyState = document.getElementById('empty-state');
        const filteredEmpty = document.getElementById('filtered-empty');
        const paginationEl = document.getElementById('applications-pagination');
        const apps = applicationsToRender || this.applications;
        const isFiltered = applicationsToRender !== null;

        if (apps.length === 0) {
            list.innerHTML = '';
            if (isFiltered && this.applications.length > 0) {
                // Show filtered empty state
                emptyState.style.display = 'none';
                if (filteredEmpty) {
                    filteredEmpty.style.display = 'block';
                }
            } else {
                // Show normal empty state
                if (filteredEmpty) {
                    filteredEmpty.style.display = 'none';
                }
                emptyState.style.display = 'block';
            }
            paginationEl.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        if (filteredEmpty) {
            filteredEmpty.style.display = 'none';
        }
        
        // Apply pagination
        const pagination = this.paginationState.applications;
        const totalPages = Math.ceil(apps.length / pagination.itemsPerPage);
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = startIndex + pagination.itemsPerPage;
        const paginatedApps = apps.slice(startIndex, endIndex);
        
        list.innerHTML = paginatedApps.map(app => this.createJobCard(app)).join('');
        
        // Render pagination
        if (apps.length > pagination.itemsPerPage) {
            this.renderPagination('applications', apps.length, pagination.currentPage, pagination.itemsPerPage);
            paginationEl.style.display = 'block';
        } else {
            paginationEl.style.display = 'none';
        }
        
        // Re-attach event listeners for dynamically created buttons
        paginatedApps.forEach(app => {
            const editBtn = document.querySelector(`[data-edit-id="${app.id}"]`);
            const deleteBtn = document.querySelector(`[data-delete-id="${app.id}"]`);
            const toggleHistoryBtn = document.querySelector(`[data-toggle-history="${app.id}"]`);
            
            if (editBtn) {
                editBtn.addEventListener('click', () => this.openModal(app.id));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteApplication(app.id));
            }
            if (toggleHistoryBtn) {
                toggleHistoryBtn.addEventListener('click', () => this.toggleHistory(app.id));
            }
        });
    }

    createJobCard(job) {
        const formattedDate = new Date(job.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const history = job.history || [];
        const historyCount = history.length;

        return `
            <div class="job-card ${job.status}">
                <div class="job-header">
                    <div class="job-title-section">
                        <h3>${this.escapeHtml(job.position)}</h3>
                        <div class="company">${this.escapeHtml(job.company)}</div>
                        <div class="location">📍 ${this.escapeHtml(job.location)}</div>
                    </div>
                    <span class="status-badge ${job.status}" 
                          role="status" 
                          aria-label="Application status: ${job.status}">
                        ${job.status}
                    </span>
                </div>
                <div class="job-details">
                    <div class="detail-item">
                        <span class="detail-label">Application Date</span>
                        <span class="detail-value">${formattedDate}</span>
                    </div>
                    ${job.source ? `
                    <div class="detail-item">
                        <span class="detail-label">Source</span>
                        <span class="detail-value">${this.escapeHtml(job.source)}</span>
                    </div>
                    ` : ''}
                    ${job.contactPerson ? `
                    <div class="detail-item">
                        <span class="detail-label">Contact Person</span>
                        <span class="detail-value">${this.escapeHtml(job.contactPerson)}</span>
                    </div>
                    ` : ''}
                    ${job.contactEmail ? `
                    <div class="detail-item">
                        <span class="detail-label">Contact Email</span>
                        <span class="detail-value">${this.escapeHtml(job.contactEmail)}</span>
                    </div>
                    ` : ''}
                </div>
                ${job.notes ? `
                <div class="job-notes">
                    <strong>Notes:</strong> ${this.escapeHtml(job.notes)}
                </div>
                ` : ''}
                ${job.url ? `
                <div style="margin: 10px 0;">
                    <a href="${job.url}" target="_blank" rel="noopener noreferrer" 
                       style="color: var(--primary-color); text-decoration: none;">
                        🔗 View Job Posting →
                    </a>
                </div>
                ` : ''}
                <div class="update-log-section">
                    <button class="btn-toggle-history" 
                            data-toggle-history="${job.id}"
                            aria-label="Show change history for this application"
                            aria-expanded="false"
                            aria-controls="history-${job.id}">
                        <span class="history-icon" aria-hidden="true">📋</span>
                        <span class="history-text">Change History (${historyCount})</span>
                        <span class="history-arrow" aria-hidden="true">▼</span>
                    </button>
                    <div class="update-log" 
                         id="history-${job.id}" 
                         style="display: none;"
                         role="region"
                         aria-label="Change history">
                        ${history.length > 0 ? this.renderHistory(history) : '<p class="no-history">No updates recorded yet.</p>'}
                    </div>
                </div>
                <div class="job-actions">
                    <button class="btn btn-primary btn-small" 
                            data-edit-id="${job.id}"
                            aria-label="Edit application for ${this.escapeHtml(job.position)} at ${this.escapeHtml(job.company)}">
                        Edit
                    </button>
                    <button class="btn btn-danger btn-small" 
                            data-delete-id="${job.id}"
                            aria-label="Delete application for ${this.escapeHtml(job.position)} at ${this.escapeHtml(job.company)}">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    renderHistory(history) {
        return history.map(entry => {
            const formattedTime = new Date(entry.timestamp).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            if (entry.changes && entry.changes.length > 0) {
                const changesHtml = entry.changes.map(change => {
                    if (change.action === 'created') {
                        return `<div class="history-change-item">
                            <span class="change-field">${this.escapeHtml(change.field)}</span>
                            <span class="change-action created">${this.escapeHtml(change.newValue)}</span>
                        </div>`;
                    } else {
                        return `<div class="history-change-item">
                            <span class="change-field">${this.escapeHtml(change.field)}:</span>
                            <span class="change-old">${this.escapeHtml(change.oldValue)}</span>
                            <span class="change-arrow">→</span>
                            <span class="change-new">${this.escapeHtml(change.newValue)}</span>
                        </div>`;
                    }
                }).join('');

                return `
                    <div class="history-entry">
                        <div class="history-header">
                            <span class="history-time">${formattedTime}</span>
                        </div>
                        <div class="history-changes">
                            ${changesHtml}
                        </div>
                    </div>
                `;
            }
            return '';
        }).join('');
    }

    toggleHistory(jobId) {
        const historyElement = document.getElementById(`history-${jobId}`);
        const toggleBtn = document.querySelector(`[data-toggle-history="${jobId}"]`);
        const arrow = toggleBtn.querySelector('.history-arrow');
        
        if (historyElement.style.display === 'none') {
            historyElement.style.display = 'block';
            arrow.textContent = '▲';
            toggleBtn.classList.add('active');
            toggleBtn.setAttribute('aria-expanded', 'true');
        } else {
            historyElement.style.display = 'none';
            arrow.textContent = '▼';
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        const stats = {
            total: this.applications.length,
            applied: this.applications.filter(app => app.status === 'applied').length,
            interview: this.applications.filter(app => app.status === 'interview').length,
            rejected: this.applications.filter(app => app.status === 'rejected').length,
            accepted: this.applications.filter(app => app.status === 'accepted').length
        };

        const totalEl = document.getElementById('total-apps');
        const pendingEl = document.getElementById('pending-apps');
        const interviewEl = document.getElementById('interview-apps');
        const rejectedEl = document.getElementById('rejected-apps');
        const acceptedEl = document.getElementById('accepted-apps');
        
        if (totalEl) {
            totalEl.textContent = stats.total;
            totalEl.setAttribute('aria-label', `Total applications: ${stats.total}`);
        }
        if (pendingEl) {
            pendingEl.textContent = stats.applied;
            pendingEl.setAttribute('aria-label', `Pending applications: ${stats.applied}`);
        }
        if (interviewEl) {
            interviewEl.textContent = stats.interview;
            interviewEl.setAttribute('aria-label', `Interview applications: ${stats.interview}`);
        }
        if (rejectedEl) {
            rejectedEl.textContent = stats.rejected;
            rejectedEl.setAttribute('aria-label', `Rejected applications: ${stats.rejected}`);
        }
        if (acceptedEl) {
            acceptedEl.textContent = stats.accepted;
            acceptedEl.setAttribute('aria-label', `Accepted applications: ${stats.accepted}`);
        }
        
        // Update dashboard stats
        this.updateDashboardStats();
        
        // Announce stats update
        this.announce(`Statistics updated: ${stats.total} total applications`);
    }

    updateDashboardStats() {
        const stats = {
            total: this.applications.length,
            applied: this.applications.filter(app => app.status === 'applied').length,
            interview: this.applications.filter(app => app.status === 'interview').length,
            rejected: this.applications.filter(app => app.status === 'rejected').length,
            accepted: this.applications.filter(app => app.status === 'accepted').length
        };

        const dashboardTotal = document.getElementById('dashboard-total-apps');
        const dashboardPending = document.getElementById('dashboard-pending-apps');
        const dashboardInterview = document.getElementById('dashboard-interview-apps');
        const dashboardRejected = document.getElementById('dashboard-rejected-apps');
        const dashboardAccepted = document.getElementById('dashboard-accepted-apps');

        if (dashboardTotal) dashboardTotal.textContent = stats.total;
        if (dashboardPending) dashboardPending.textContent = stats.applied;
        if (dashboardInterview) dashboardInterview.textContent = stats.interview;
        if (dashboardRejected) dashboardRejected.textContent = stats.rejected;
        if (dashboardAccepted) dashboardAccepted.textContent = stats.accepted;
    }

    renderRecentApplications() {
        const container = document.getElementById('dashboard-recent-applications');
        if (!container) return;

        // Get 5 most recent applications
        const recentApps = [...this.applications]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (recentApps.length === 0) {
            container.innerHTML = '<p class="empty-state">No applications yet. <a href="#applications" data-page="applications">Add your first application</a></p>';
            return;
        }

        container.innerHTML = recentApps.map(app => this.createJobCard(app)).join('');

        // Re-attach event listeners
        recentApps.forEach(app => {
            const editBtn = document.querySelector(`[data-edit-id="${app.id}"]`);
            const deleteBtn = document.querySelector(`[data-delete-id="${app.id}"]`);
            const toggleHistoryBtn = document.querySelector(`[data-toggle-history="${app.id}"]`);
            
            if (editBtn) {
                editBtn.addEventListener('click', () => this.openModal(app.id));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteApplication(app.id));
            }
            if (toggleHistoryBtn) {
                toggleHistoryBtn.addEventListener('click', () => this.toggleHistory(app.id));
            }
        });
    }

    filterApplications() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;
        const sourceFilter = document.getElementById('source-filter').value;
        const sortBy = document.getElementById('sort-by').value;

        let filtered = this.applications.filter(app => {
            const matchesSearch = 
                app.company.toLowerCase().includes(searchTerm) ||
                app.position.toLowerCase().includes(searchTerm) ||
                (app.location && app.location.toLowerCase().includes(searchTerm));
            
            const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
            
            let matchesSource = true;
            if (sourceFilter !== 'all') {
                if (sourceFilter === 'Telegram') {
                    // Filter for any Telegram source
                    matchesSource = app.source && app.source.includes('Telegram');
                } else {
                    // Filter for specific source
                    matchesSource = app.source === sourceFilter;
                }
            }
            
            return matchesSearch && matchesStatus && matchesSource;
        });

        // Apply sorting
        if (sortBy !== 'none') {
            filtered = this.sortApplications(filtered, sortBy);
        }

        // Reset pagination when filtering
        this.paginationState.applications.currentPage = 1;
        this.savePaginationState();
        this.renderApplications(filtered);
    }

    sortApplications(applications, sortBy) {
        const sorted = [...applications];

        switch (sortBy) {
            case 'application-date-desc':
                sorted.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA; // Newest first
                });
                break;

            case 'application-date-asc':
                sorted.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA - dateB; // Oldest first
                });
                break;

            case 'status-update-desc':
                sorted.sort((a, b) => {
                    const dateA = this.getLastStatusUpdateDate(a);
                    const dateB = this.getLastStatusUpdateDate(b);
                    return dateB - dateA; // Recent first
                });
                break;

            case 'status-update-asc':
                sorted.sort((a, b) => {
                    const dateA = this.getLastStatusUpdateDate(a);
                    const dateB = this.getLastStatusUpdateDate(b);
                    return dateA - dateB; // Oldest first
                });
                break;
        }

        return sorted;
    }

    getLastStatusUpdateDate(application) {
        // Find the most recent status change in history
        if (!application.history || application.history.length === 0) {
            // If no history, use application date as fallback
            return new Date(application.date || application.createdAt || Date.now());
        }

        // Look for the most recent status change (checking both capitalized and lowercase)
        for (const entry of application.history) {
            if (entry.changes && Array.isArray(entry.changes)) {
                const statusChange = entry.changes.find(change => {
                    const field = change.field || '';
                    return field.toLowerCase() === 'status';
                });
                if (statusChange) {
                    return new Date(entry.timestamp);
                }
            }
        }

        // If no status change found in history, use the most recent update timestamp
        // This handles cases where status was set initially or updated before history tracking
        const mostRecentUpdate = application.history[0];
        if (mostRecentUpdate && mostRecentUpdate.timestamp) {
            return new Date(mostRecentUpdate.timestamp);
        }

        // Final fallback to application date or creation date
        return new Date(application.date || application.createdAt || Date.now());
    }

    async fetchSuggestedJobs() {
        const loadingEl = document.getElementById('suggested-jobs-loading');
        const emptyEl = document.getElementById('suggested-jobs-empty');
        const listEl = document.getElementById('suggested-jobs-list');
        const paginationEl = document.getElementById('suggested-jobs-pagination');

        // Show skeleton loading
        loadingEl.style.display = 'block';
        emptyEl.style.display = 'none';
        listEl.innerHTML = this.renderSkeletonCards(5);
        if (paginationEl) paginationEl.style.display = 'none';
        
        this.announce('Loading suggested jobs');
        
        try {
            // Try to fetch from crawler API first
            const crawlerJobs = await this.fetchJobsFromCrawler();
            if (crawlerJobs && crawlerJobs.length > 0) {
                // Merge with existing suggested jobs (avoid duplicates)
                const existingJobIds = new Set(this.suggestedJobs.map(j => j.id));
                const newJobs = crawlerJobs.filter(job => !existingJobIds.has(job.id));
                
                // Add new jobs to the list
                this.suggestedJobs = [...this.suggestedJobs, ...newJobs];
                this.saveSuggestedJobs();
                loadingEl.style.display = 'none';
                this.announce(`Loaded ${newJobs.length} new jobs from crawler`);
                return;
            }
        } catch (error) {
            console.warn('Crawler API not available, falling back to mock data:', error.message);
        }
        
        // Fallback to original method

        try {
            // Calculate date 2 weeks ago
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            const dateFrom = twoWeeksAgo.toISOString().split('T')[0];

            if (!this.profile) {
                await this.loadProfile();
            }

            // Build search query based on profile
            const locations = this.profile?.target_locations || ['Dublin, Ireland'];
            const roles = this.profile?.preferred_roles || ['Software Engineer'];
            const skills = this.profile?.skills || [];

            // Use Adzuna API (free tier) - you'll need to get an API key from https://developer.adzuna.com/
            // For now, we'll use a mock approach that can be easily connected to real APIs
            const jobs = await this.searchJobsFromAPI(locations, roles, skills, dateFrom);

            // Filter jobs to only include those from the last 4 weeks (more flexible)
            // Some job boards may have delayed posting dates
            const fourWeeksAgo = new Date();
            fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
            
            const filteredJobs = jobs.filter(job => {
                // Filter by date first
                let passesDateFilter = true;
                if (job.created) {
                    const jobDate = new Date(job.created);
                    if (!isNaN(jobDate.getTime())) {
                        passesDateFilter = jobDate >= fourWeeksAgo;
                    }
                }
                
                if (!passesDateFilter) return false;
                
                // Filter out excluded locations (unless they mention relocation)
                const isExcluded = this.isLocationExcluded(job.location, this.profile);
                const mentionsReloc = this.mentionsRelocation(job, this.profile);
                
                // Exclude jobs from unwanted locations unless they mention relocation
                if (isExcluded && !mentionsReloc) {
                    return false;
                }
                
                return true;
            });

            // Merge with existing suggested jobs (avoid duplicates)
            const existingJobIds = new Set(this.suggestedJobs.map(j => j.id));
            const newJobs = filteredJobs.filter(job => !existingJobIds.has(job.id));
            
            console.log(`Filtered ${jobs.length} jobs -> ${filteredJobs.length} recent -> ${newJobs.length} new`);
            
            // Add new jobs to the list
            this.suggestedJobs = [...this.suggestedJobs, ...newJobs];
            this.saveSuggestedJobs();
            
            if (newJobs.length > 0) {
                toast.show(`Found ${newJobs.length} new job opportunities!`, 'success');
            }

        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.show('Failed to fetch jobs. Please try again or check your internet connection.', 'warning');
            // Don't overwrite existing cached jobs with empty data
            if (this.suggestedJobs.length === 0) {
                // Show helpful message in UI
                const listEl = document.getElementById('suggested-jobs-list');
                const emptyEl = document.getElementById('suggested-jobs-empty');
                if (listEl) listEl.innerHTML = '';
                if (emptyEl) {
                    emptyEl.style.display = 'block';
                    emptyEl.innerHTML = `
                        <p style="margin-bottom: 12px;">Unable to fetch jobs from job boards.</p>
                        <p style="font-size: 0.9em; opacity: 0.8;">
                            This app fetches real jobs from Remotive, Arbeitnow, and Jaabz APIs.<br>
                            <strong>Note:</strong> Jaabz jobs require the backend crawler to be running.<br>
                            Check your internet connection and click "Refresh" to try again.
                        </p>
                        <details style="margin-top: 15px; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
                            <summary style="cursor: pointer; font-weight: 600;">How to enable Jaabz jobs</summary>
                            <ol style="text-align: left; margin-top: 10px; padding-left: 20px;">
                                <li>Open terminal in the project directory</li>
                                <li>Run: <code>cd crawler && npm install && npm start</code></li>
                                <li>The crawler will run on <code>http://localhost:3000</code></li>
                                <li>Refresh jobs in the app</li>
                            </ol>
                        </details>
                    `;
                }
            }
        } finally {
            loadingEl.style.display = 'none';
            this.announce(`Loaded ${this.suggestedJobs.length} suggested jobs`);
        }
    }
    
    async fetchJobsFromCrawler() {
        // Get crawler API URL from config or use default
        const apiBase = (window.PATHS && window.PATHS.API && window.PATHS.API.CRAWLER_BASE) || (window.CRAWLER_API_URL || 'http://localhost:3000/api');
        const crawlEndpoint = (window.PATHS && window.PATHS.API && window.PATHS.API.CRAWLER_ENDPOINTS && window.PATHS.API.CRAWLER_ENDPOINTS.CRAWL) || '/crawl';
        const crawlerApiUrl = window.CRAWLER_API_URL || `${apiBase}${crawlEndpoint}`;
        
        try {
            // Load profile for crawler
            if (!this.profile) {
                await this.loadProfile();
            }
            
            const response = await fetch(crawlerApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    profile: this.profile
                })
            });
            
            if (!response.ok) {
                throw new Error(`Crawler API returned ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.jobs) {
                // Transform crawler jobs to match our format and calculate relevance
                const profile = this.profile;
                const formattedJobs = data.jobs.map(job => {
                    const formattedJob = {
                        id: job.id || `crawler-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        title: job.title,
                        company: job.company,
                        location: job.location,
                        url: job.url,
                        description: job.description,
                        created: job.created,
                        salary: job.salary,
                        type: job.type,
                        remote: job.remote,
                        source: job.source || 'Crawler'
                    };
                    // Calculate relevance score
                    formattedJob.relevanceScore = this.calculateJobRelevanceScore(formattedJob, profile);
                    return formattedJob;
                });
                
                // Filter out excluded locations (unless they mention relocation)
                return formattedJobs.filter(job => {
                    // Keep jobs with negative scores only if they mention relocation
                    if (job.relevanceScore < 0) {
                        return this.mentionsRelocation(job, profile);
                    }
                    return job.relevanceScore >= 20; // Only keep relevant jobs
                });
            }
            
            return [];
        } catch (error) {
            console.error('Error fetching from crawler:', error);
            // Return empty array to trigger fallback
            return [];
        }
    }
    
    renderSkeletonCards(count) {
        return Array(count).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-text-short"></div>
            </div>
        `).join('');
    }

    // Check if location should be excluded
    isLocationExcluded(location, profile) {
        if (!location) return false;
        
        const locationLower = location.toLowerCase();
        
        // Define excluded locations (countries/regions to avoid)
        const excludedLocations = [
            'usa', 'united states', 'us', 'america', 'american',
            'canada', 'mexico',
            'china', 'japan', 'south korea', 'korea',
            'india', 'pakistan', 'bangladesh',
            'brazil', 'argentina',
            'russia', 'ukraine',
            'worldwide', 'world-wide', 'world wide', // Exclude worldwide jobs
            // Add more if needed
        ];
        
        // Check if location contains any excluded location
        for (const excluded of excludedLocations) {
            if (locationLower.includes(excluded)) {
                return true;
            }
        }
        
        return false;
    }

    // Check if job mentions relocation or visa sponsorship
    mentionsRelocation(job, profile) {
        if (!job) return false;
        
        const description = (job.description || '').toLowerCase();
        const title = (job.title || '').toLowerCase();
        const location = (job.location || '').toLowerCase();
        const combinedText = `${title} ${description} ${location}`.toLowerCase();
        
        // Keywords that indicate relocation support
        const relocationKeywords = [
            'relocation', 'relocate', 'relocation support', 'relocation assistance',
            'visa sponsorship', 'sponsor visa', 'work visa', 'visa support',
            'immigration support', 'help with visa', 'visa assistance',
            'willing to relocate', 'open to relocation', 'relocation package',
            'relocation bonus', 'sponsor', 'sponsorship', 'work permit',
            'international candidates', 'remote from', 'work from anywhere',
            'anywhere in', 'europe', 'eu', 'european union'
        ];
        
        // Check if any relocation keyword is mentioned
        for (const keyword of relocationKeywords) {
            if (combinedText.includes(keyword)) {
                return true;
            }
        }
        
        // Check if it's a remote job that could work from target locations
        const remoteKeywords = ['remote', 'anywhere', 'work from home', 'wfh', 'distributed'];
        const isRemote = remoteKeywords.some(keyword => combinedText.includes(keyword));
        
        if (isRemote) {
            // Remote jobs are generally good for relocation
            return true;
        }
        
        return false;
    }

    // Job relevance scoring system
    calculateJobRelevanceScore(job, profile) {
        if (!profile) return 0;
        
        // First check: exclude jobs from unwanted locations (unless they mention relocation)
        const location = (job.location || '').toLowerCase();
        const isExcluded = this.isLocationExcluded(location, profile);
        const mentionsReloc = this.mentionsRelocation(job, profile);
        
        // If location is excluded AND doesn't mention relocation, heavily penalize
        if (isExcluded && !mentionsReloc) {
            return -100; // This will be filtered out
        }
        
        let score = 0;
        const title = (job.title || '').toLowerCase();
        const description = (job.description || '').toLowerCase();
        const combinedText = `${title} ${description}`.toLowerCase();
        
        const preferredRoles = profile.preferred_roles || [];
        const skills = profile.skills || [];
        const targetLocations = profile.target_locations || [];
        const industries = profile.industries || [];
        
        // Role match (high weight - up to 40 points)
        const roleMatches = preferredRoles.filter(role => {
            const roleLower = role.toLowerCase().replace(/senior |lead |junior /gi, '').trim();
            return title.includes(roleLower) || combinedText.includes(roleLower);
        });
        if (roleMatches.length > 0) {
            score += Math.min(40, 20 + (roleMatches.length * 10)); // Exact title match gets more points
            if (title.includes(roleMatches[0].toLowerCase())) score += 10;
        }
        
        // Location match (high weight - up to 30 points)
        const locationMatches = targetLocations.filter(targetLoc => {
            const targetLower = targetLoc.toLowerCase();
            return location.includes(targetLower);
        });
        if (locationMatches.length > 0) {
            score += 30; // Exact location match gets highest score
        } else if (mentionsReloc) {
            // Jobs that mention relocation get bonus points
            score += 25; // Relocation support is very valuable
        } else if (location.includes('remote') || location.includes('anywhere')) {
            score += 20; // Remote is good but less than specific location or relocation
        }
        
        // Bonus for relocation keywords in description
        if (mentionsReloc) {
            score += 10; // Extra bonus for explicit relocation mention
        }
        
        // Skills match (medium weight - up to 25 points)
        const matchingSkills = skills.filter(skill => {
            const skillLower = skill.toLowerCase();
            return combinedText.includes(skillLower);
        });
        if (matchingSkills.length > 0) {
            score += Math.min(25, 5 + (matchingSkills.length * 3));
        }
        
        // Industry match (low weight - up to 10 points)
        industries.forEach(industry => {
            if (combinedText.includes(industry.toLowerCase())) {
                score += 5;
            }
        });
        
        // Penalty for unrelated roles (marketing, sales, etc.)
        const unrelatedKeywords = ['sales', 'marketing', 'account manager', 'recruiter', 'hr ', 'human resources'];
        unrelatedKeywords.forEach(keyword => {
            if (title.includes(keyword) && !preferredRoles.some(role => role.toLowerCase().includes(keyword))) {
                score -= 30; // Heavy penalty
            }
        });
        
        // Bonus for exact role title match
        if (preferredRoles.some(role => title === role.toLowerCase())) {
            score += 10;
        }
        
        return Math.max(0, Math.min(100, score)); // Clamp between 0-100
    }
    
    async searchJobsFromAPI(locations, roles, skills, dateFrom) {
        const allJobs = [];
        
        // Search keywords based on profile roles
        const searchTerms = roles.slice(0, 3).map(role => 
            role.toLowerCase().replace(/senior |lead |junior /gi, '').trim()
        );
        
        // 1. Try Remotive API (free, no API key, remote jobs)
        try {
            const remotiveJobs = await this.fetchRemotiveJobs(searchTerms);
            allJobs.push(...remotiveJobs);
            console.log(`Fetched ${remotiveJobs.length} jobs from Remotive`);
        } catch (error) {
            console.warn('Remotive API error:', error.message);
        }
        
        // 2. Try Arbeitnow API (free, no API key, EU jobs)
        try {
            const arbeitnowJobs = await this.fetchArbeitnowJobs(searchTerms);
            allJobs.push(...arbeitnowJobs);
            console.log(`Fetched ${arbeitnowJobs.length} jobs from Arbeitnow`);
        } catch (error) {
            console.warn('Arbeitnow API error:', error.message);
        }
        
        // 3. Try LinkedIn Jobs via backend crawler
        try {
            const linkedinJobs = await this.fetchLinkedInJobs(locations, roles);
            allJobs.push(...linkedinJobs);
            console.log(`Fetched ${linkedinJobs.length} jobs from LinkedIn`);
        } catch (error) {
            console.warn('LinkedIn API error:', error.message);
        }
        
        // 4. Try GitHub Jobs
        try {
            const githubJobs = await this.fetchGitHubJobs(searchTerms);
            allJobs.push(...githubJobs);
            console.log(`Fetched ${githubJobs.length} jobs from GitHub Jobs`);
        } catch (error) {
            console.warn('GitHub Jobs API error:', error.message);
        }
        
        // 5. Try We Work Remotely
        try {
            const wwrJobs = await this.fetchWeWorkRemotelyJobs(searchTerms);
            allJobs.push(...wwrJobs);
            console.log(`Fetched ${wwrJobs.length} jobs from We Work Remotely`);
        } catch (error) {
            console.warn('We Work Remotely API error:', error.message);
        }
        
        // 6. Try Telegram channels
        try {
            const telegramJobs = await this.fetchTelegramJobs();
            allJobs.push(...telegramJobs);
            console.log(`Fetched ${telegramJobs.length} jobs from Telegram channels`);
        } catch (error) {
            console.warn('Telegram scraping error:', error.message);
        }
        
        // 7. Try Adzuna API if configured (requires API key)
        if (window.JobAPIConfig?.adzuna?.enabled && window.JobAPIConfig?.adzuna?.appId) {
            try {
                const adzunaJobs = await this.fetchAdzunaJobs(locations, roles);
                allJobs.push(...adzunaJobs);
                console.log(`Fetched ${adzunaJobs.length} jobs from Adzuna`);
            } catch (error) {
                console.warn('Adzuna API error:', error.message);
            }
        }
        
        // 8. Try Jaabz.com (visa sponsorship jobs)
        try {
            const jaabzJobs = await this.fetchJaabzJobs(locations, roles);
            if (jaabzJobs && jaabzJobs.length > 0) {
                allJobs.push(...jaabzJobs);
                console.log(`✅ Fetched ${jaabzJobs.length} jobs from Jaabz`);
            } else {
                console.log('⚠️ No jobs found from Jaabz (this is normal if crawler is not running or page structure changed)');
            }
        } catch (error) {
            console.warn('❌ Jaabz API error:', error.message);
            console.warn('Error details:', error);
        }
        
        // If we got real jobs, score and filter them
        if (allJobs.length > 0) {
            // Score each job based on relevance
            const profile = this.profile;
            allJobs.forEach(job => {
                job.relevanceScore = this.calculateJobRelevanceScore(job, profile);
            });
            
            // Deduplicate by URL
            const seen = new Set();
            const uniqueJobs = allJobs.filter(job => {
                if (seen.has(job.url)) return false;
                seen.add(job.url);
                return true;
            });
            
            // Filter out excluded locations (unless they mention relocation)
            const locationFilteredJobs = uniqueJobs.filter(job => {
                // Keep jobs with negative scores only if they mention relocation
                if (job.relevanceScore < 0) {
                    return this.mentionsRelocation(job, profile);
                }
                return true;
            });
            
            // Filter jobs with minimum relevance score (at least 20/100)
            // Sort by relevance score (highest first)
            const relevantJobs = locationFilteredJobs
                .filter(job => job.relevanceScore >= 20)
                .sort((a, b) => {
                    // Prioritize jobs that mention relocation
                    const aReloc = this.mentionsRelocation(a, profile) ? 1 : 0;
                    const bReloc = this.mentionsRelocation(b, profile) ? 1 : 0;
                    if (aReloc !== bReloc) {
                        return bReloc - aReloc; // Relocation jobs first
                    }
                    return b.relevanceScore - a.relevanceScore;
                });
            
            console.log(`Filtered ${uniqueJobs.length} jobs -> ${locationFilteredJobs.length} after location filter -> ${relevantJobs.length} relevant jobs (score >= 20)`);
            return relevantJobs;
        }
        
        // Fallback: return empty array (no mock data)
        console.log('No jobs found from APIs');
        return [];
    }
    
    async fetchRemotiveJobs(searchTerms) {
        // Remotive API - Free, no auth required
        // Docs: https://remotive.com/api/remote-jobs
        const jobs = [];
        
        // Map our search terms to Remotive categories
        const categoryMap = {
            'product designer': 'design',
            'ux designer': 'design',
            'ui designer': 'design',
            'design': 'design',
            'product engineer': 'software-dev',
            'software engineer': 'software-dev',
            'frontend': 'software-dev',
            'engineer': 'software-dev'
        };
        
        // Find matching categories
        const categories = new Set();
        for (const term of searchTerms) {
            for (const [keyword, category] of Object.entries(categoryMap)) {
                if (term.includes(keyword) || keyword.includes(term)) {
                    categories.add(category);
                }
            }
        }
        
        // Default to design if no match
        if (categories.size === 0) {
            categories.add('design');
        }
        
        for (const category of categories) {
            try {
                const response = await fetch(`https://remotive.com/api/remote-jobs?category=${category}&limit=25`);
                if (!response.ok) continue;
                
                const data = await response.json();
                if (data.jobs && Array.isArray(data.jobs)) {
                    const mappedJobs = data.jobs.map(job => ({
                        id: `remotive-${job.id}`,
                        title: job.title,
                        company: job.company_name || 'Unknown',
                        location: job.candidate_required_location || 'Remote',
                        url: job.url,
                        description: job.description ? this.stripHtml(job.description).substring(0, 300) + '...' : '',
                        created: job.publication_date,
                        salary: job.salary || null,
                        type: job.job_type || 'Full-time',
                        remote: 'Remote',
                        source: 'Remotive'
                    }));
                    jobs.push(...mappedJobs);
                }
            } catch (error) {
                console.warn(`Remotive category ${category} error:`, error.message);
            }
        }
        
        return jobs;
    }
    
    async fetchArbeitnowJobs(searchTerms) {
        // Arbeitnow API - Free, no auth required, EU-focused
        // Docs: https://www.arbeitnow.com/api
        const jobs = [];
        
        try {
            const response = await fetch('https://www.arbeitnow.com/api/job-board-api');
            if (!response.ok) return jobs;
            
            const data = await response.json();
            if (data.data && Array.isArray(data.data)) {
                // Filter jobs by search terms
                const relevantJobs = data.data.filter(job => {
                    const title = job.title?.toLowerCase() || '';
                    const description = job.description?.toLowerCase() || '';
                    return searchTerms.some(term => 
                        title.includes(term) || description.includes(term)
                    );
                }).slice(0, 25);
                
                const mappedJobs = relevantJobs.map(job => ({
                    id: `arbeitnow-${job.slug}`,
                    title: job.title,
                    company: job.company_name || 'Unknown',
                    location: job.location || 'Remote',
                    url: job.url,
                    description: job.description ? this.stripHtml(job.description).substring(0, 300) + '...' : '',
                    created: job.created_at,
                    salary: null,
                    type: 'Full-time',
                    remote: job.remote ? 'Remote' : 'On-site',
                    source: 'Arbeitnow'
                }));
                jobs.push(...mappedJobs);
            }
        } catch (error) {
            console.warn('Arbeitnow API error:', error.message);
        }
        
        return jobs;
    }
    
    async fetchAdzunaJobs(locations, roles) {
        // Adzuna API - Requires API key from https://developer.adzuna.com/
        const jobs = [];
        const config = window.JobAPIConfig?.adzuna;
        
        if (!config?.appId || !config?.appKey) return jobs;
        
        for (const location of locations.slice(0, 3)) {
            const countryCode = this.getCountryCode(location);
            const searchQuery = roles.slice(0, 2).join(' OR ');
            
            try {
                const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${config.appId}&app_key=${config.appKey}&results_per_page=20&what=${encodeURIComponent(searchQuery)}&where=${encodeURIComponent(location)}&sort_by=date`;
                
                const response = await fetch(url);
                if (!response.ok) continue;
                
                const data = await response.json();
                if (data.results) {
                    const mappedJobs = data.results.map(result => ({
                        id: `adzuna-${result.id}`,
                        title: result.title,
                        company: result.company?.display_name || 'Unknown',
                        location: result.location?.display_name || location,
                        url: result.redirect_url,
                        description: result.description || '',
                        created: result.created,
                        salary: result.salary_min && result.salary_max 
                            ? `${Math.round(result.salary_min)} - ${Math.round(result.salary_max)}${result.salary_is_predicted ? ' (est.)' : ''}`
                            : null,
                        type: result.contract_type || 'Full-time',
                        remote: result.remote ? 'Remote' : 'On-site',
                        source: 'Adzuna'
                    }));
                    jobs.push(...mappedJobs);
                }
            } catch (error) {
                console.warn(`Adzuna ${location} error:`, error.message);
            }
        }
        
        return jobs;
    }
    
    async fetchJaabzJobs(locations, roles) {
        // Jaabz.com - Jobs with visa sponsorship
        // URL format: https://jaabz.com/jobs?visa_sponsorship=1&keyword=Designer&included_location_ids[]=234&posted=14
        const jobs = [];
        
        try {
            if (!this.profile) {
                await this.loadProfile();
            }
            
            // Map location names to Jaabz location IDs
            // Based on the provided URL, these IDs seem to be:
            // 234 = Dublin, Ireland (or similar)
            // 346 = Amsterdam, Netherlands (or similar)
            // 342 = Eindhoven, Netherlands (or similar)
            // 270 = Rotterdam, Netherlands (or similar)
            // We'll use a mapping based on common location patterns
            const locationIdMap = {
                'dublin': [234],
                'amsterdam': [346],
                'eindhoven': [342],
                'rotterdam': [270],
                'utrecht': [270], // May need adjustment
                'cork': [234], // May need adjustment - using Ireland ID
                'leeds': [234], // May need adjustment - using UK ID
                'netherlands': [346, 342, 270],
                'ireland': [234],
                'england': [234], // May need adjustment
                'uk': [234] // May need adjustment
            };
            
            // Get location IDs for target locations
            const locationIds = new Set();
            locations.forEach(location => {
                const locationLower = location.toLowerCase();
                for (const [key, ids] of Object.entries(locationIdMap)) {
                    if (locationLower.includes(key)) {
                        ids.forEach(id => locationIds.add(id));
                    }
                }
            });
            
            // If no location IDs found, use default IDs from the example
            if (locationIds.size === 0) {
                [234, 346, 342, 270].forEach(id => locationIds.add(id));
            }
            
            // Build search keywords from roles
            const keywords = roles.slice(0, 2).map(role => {
                // Extract main keyword (e.g., "Designer" from "Product Designer")
                const roleLower = role.toLowerCase();
                if (roleLower.includes('designer')) return 'Designer';
                if (roleLower.includes('engineer')) return 'Engineer';
                if (roleLower.includes('developer')) return 'Developer';
                return role.split(' ').pop(); // Use last word as keyword
            });
            
            const keyword = keywords[0] || 'Designer';
            
            // Build URL
            const locationParams = Array.from(locationIds).map(id => `included_location_ids[]=${id}`).join('&');
            const url = `https://jaabz.com/jobs?visa_sponsorship=1&keyword=${encodeURIComponent(keyword)}&${locationParams}&posted=14`;
            
            // Try to fetch via backend proxy (CORS issue)
            const apiBase = (window.PATHS && window.PATHS.API && window.PATHS.API.CRAWLER_BASE) || (window.CRAWLER_API_URL || 'http://localhost:3000/api');
            const crawlerApiUrl = window.CRAWLER_API_URL || apiBase;
            console.log(`🔍 Attempting to fetch Jaabz jobs from: ${crawlerApiUrl}/crawl/jaabz`);
            
            try {
                const response = await fetch(`${crawlerApiUrl}/crawl/jaabz`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        profile: this.profile
                    })
                });
                
                console.log(`📡 Jaabz API response status: ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`📦 Jaabz API response:`, data);
                    
                    if (data.success && data.jobs && data.jobs.length > 0) {
                        console.log(`✅ Found ${data.jobs.length} jobs from Jaabz via crawler API`);
                        return data.jobs.map(job => ({
                            ...job,
                            source: 'Jaabz'
                        }));
                    } else {
                        console.log(`⚠️ Jaabz API returned success but no jobs (success: ${data.success}, jobs count: ${data.jobs?.length || 0})`);
                    }
                } else {
                    const errorText = await response.text();
                    console.warn(`❌ Jaabz API returned error status ${response.status}:`, errorText);
                }
            } catch (error) {
                console.warn('❌ Jaabz crawler API not available:', error.message);
                console.warn('💡 Make sure the crawler server is running: cd crawler && npm start');
                console.warn('💡 Or the crawler API URL is configured correctly in job-api-config.js');
            }
            
            // Direct fetch (may fail due to CORS, but worth trying)
            console.log(`🔍 Attempting direct fetch from Jaabz: ${url}`);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                console.log(`📡 Direct fetch response status: ${response.status}`);
                
                if (response.ok) {
                    const html = await response.text();
                    console.log(`📄 Fetched HTML (${html.length} characters)`);
                    
                    // Parse HTML to extract job listings
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    
                    // Try multiple selectors to find job listings
                    const selectors = [
                        '[data-job-id]',
                        '.job-card',
                        '.job-listing',
                        'article.job',
                        '.job-item',
                        '[class*="job-card"]',
                        '[class*="job-item"]',
                        'div[class*="job"]',
                        'li[class*="job"]'
                    ];
                    
                    let jobElements = [];
                    for (const selector of selectors) {
                        const elements = doc.querySelectorAll(selector);
                        if (elements.length > 0) {
                            console.log(`✅ Found ${elements.length} job elements using selector: ${selector}`);
                            jobElements = Array.from(elements);
                            break;
                        }
                    }
                    
                    // If no jobs found with selectors, try finding links
                    if (jobElements.length === 0) {
                        console.log('⚠️ No jobs found with standard selectors, trying to find job links...');
                        const jobLinks = doc.querySelectorAll('a[href*="/jobs/"], a[href*="/job/"]');
                        console.log(`Found ${jobLinks.length} potential job links`);
                        
                        jobLinks.forEach((link, index) => {
                            const href = link.getAttribute('href');
                            const text = link.textContent.trim();
                            if (text && text.length > 5 && href) {
                                jobs.push({
                                    id: `jaabz-${Date.now()}-${index}`,
                                    title: text,
                                    company: 'Unknown',
                                    location: locations[0] || 'Unknown',
                                    url: href.startsWith('http') ? href : `https://jaabz.com${href}`,
                                    description: '',
                                    created: new Date().toISOString(),
                                    salary: null,
                                    type: 'Full-time',
                                    remote: 'On-site',
                                    source: 'Jaabz'
                                });
                            }
                        });
                    } else {
                        // Parse found job elements
                        jobElements.forEach((element, index) => {
                            try {
                                const titleEl = element.querySelector('h2, h3, h4, .job-title, [class*="title"], a');
                                const companyEl = element.querySelector('.company, [class*="company"], .employer, [class*="employer"]');
                                const locationEl = element.querySelector('.location, [class*="location"]');
                                const linkEl = element.querySelector('a[href*="/jobs/"], a[href*="/job/"], a');
                                
                                const title = titleEl ? titleEl.textContent.trim() : '';
                                
                                if (title && title.length > 3) {
                                    const job = {
                                        id: `jaabz-${Date.now()}-${index}`,
                                        title: title,
                                        company: companyEl ? companyEl.textContent.trim() : 'Unknown',
                                        location: locationEl ? locationEl.textContent.trim() : locations[0] || 'Unknown',
                                        url: linkEl ? (linkEl.href.startsWith('http') ? linkEl.href : `https://jaabz.com${linkEl.href}`) : url,
                                        description: element.textContent.substring(0, 300).trim() + '...',
                                        created: new Date().toISOString(),
                                        salary: null,
                                        type: 'Full-time',
                                        remote: 'On-site',
                                        source: 'Jaabz'
                                    };
                                    jobs.push(job);
                                }
                            } catch (parseError) {
                                console.warn(`Error parsing Jaabz job element ${index}:`, parseError);
                            }
                        });
                    }
                    
                    console.log(`📊 Parsed ${jobs.length} jobs from Jaabz HTML`);
                } else {
                    console.warn(`❌ Direct fetch failed with status ${response.status}`);
                }
            } catch (error) {
                console.warn('❌ Direct Jaabz fetch failed (likely CORS):', error.message);
                console.warn('💡 To use Jaabz, you need to run the backend crawler:');
                console.warn('   1. cd crawler');
                console.warn('   2. npm install');
                console.warn('   3. npm start');
                console.warn('   Then the frontend will automatically use the crawler API');
            }
            
        } catch (error) {
            console.warn('Jaabz fetch error:', error.message);
        }
        
        return jobs;
    }
    
    async fetchLinkedInJobs(locations, roles) {
        // Try to use backend crawler API first (if available)
        const apiBase = (window.PATHS && window.PATHS.API && window.PATHS.API.CRAWLER_BASE) || (window.CRAWLER_API_URL || 'http://localhost:3000/api');
        const crawlEndpoint = (window.PATHS && window.PATHS.API && window.PATHS.API.CRAWLER_ENDPOINTS && window.PATHS.API.CRAWLER_ENDPOINTS.CRAWL) || '/crawl';
        const crawlerApiUrl = window.CRAWLER_API_URL || `${apiBase}${crawlEndpoint}`;
        
        try {
            if (!this.profile) {
                await this.loadProfile();
            }
            
            const response = await fetch(`${crawlerApiUrl}/linkedin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    profile: this.profile
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.jobs) {
                    return data.jobs.map(job => ({
                        ...job,
                        source: 'LinkedIn'
                    }));
                }
            }
        } catch (error) {
            console.warn('LinkedIn crawler API not available:', error.message);
        }
        
        // Fallback: Try LinkedIn RSS feeds (limited but free)
        const jobs = [];
        try {
            // LinkedIn doesn't have a public API, but we can try RSS feeds
            // Note: This requires backend proxy due to CORS
            const rssUrl = `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(roles.slice(0, 2).join(' OR '))}&location=${encodeURIComponent(locations[0] || '')}`;
            // For now, return empty - LinkedIn requires backend scraping
            console.info('LinkedIn jobs require backend scraping via crawler API');
        } catch (error) {
            console.warn('LinkedIn fetch error:', error.message);
        }
        
        return jobs;
    }
    
    async fetchGitHubJobs(searchTerms) {
        // GitHub Jobs API (deprecated but still accessible via RSS)
        const jobs = [];
        
        try {
            // GitHub Jobs moved to RSS feed
            const rssUrl = `https://jobs.github.com/positions.json?description=${encodeURIComponent(searchTerms.join(' '))}&location=remote`;
            
            // Note: GitHub Jobs API is deprecated, but positions.json still works
            const response = await fetch(rssUrl);
            if (!response.ok) return jobs;
            
            const data = await response.json();
            if (Array.isArray(data)) {
                const mappedJobs = data.slice(0, 25).map(job => ({
                    id: `github-${job.id}`,
                    title: job.title,
                    company: job.company || 'Unknown',
                    location: job.location || 'Remote',
                    url: job.url,
                    description: job.description ? this.stripHtml(job.description).substring(0, 300) + '...' : '',
                    created: job.created_at,
                    salary: null,
                    type: job.type || 'Full-time',
                    remote: job.location?.toLowerCase().includes('remote') ? 'Remote' : 'On-site',
                    source: 'GitHub Jobs'
                }));
                jobs.push(...mappedJobs);
            }
        } catch (error) {
            console.warn('GitHub Jobs API error:', error.message);
        }
        
        return jobs;
    }
    
    async fetchWeWorkRemotelyJobs(searchTerms) {
        // We Work Remotely - requires scraping, but has RSS feed
        const jobs = [];
        
        try {
            // We Work Remotely has categories: design, programming, etc.
            const categoryMap = {
                'product designer': 'design',
                'ux designer': 'design',
                'ui designer': 'design',
                'design': 'design',
                'product engineer': 'programming',
                'engineer': 'programming',
                'software': 'programming'
            };
            
            let category = 'design'; // Default
            for (const term of searchTerms) {
                for (const [keyword, cat] of Object.entries(categoryMap)) {
                    if (term.includes(keyword)) {
                        category = cat;
                        break;
                    }
                }
            }
            
            // Note: We Work Remotely doesn't have a public API
            // Would need backend scraping for full integration
            // For now, we'll try to use a RSS-like approach if available
            console.info('We Work Remotely requires backend scraping');
        } catch (error) {
            console.warn('We Work Remotely error:', error.message);
        }
        
        return jobs;
    }
    
    async fetchTelegramJobs() {
        // Telegram channel job scraping
        // Note: This requires backend API due to CORS and Telegram API requirements
        const jobs = [];
        const telegramChannels = [
            '@jobs_finding',
            '@jaabz_com',
            '@get_joboffer',
            '@theyobby',
            '@netherlandsjobs'
        ];
        
        try {
            const apiBase = (window.PATHS && window.PATHS.API && window.PATHS.API.CRAWLER_BASE) || (window.CRAWLER_API_URL || 'http://localhost:3000/api');
            const crawlEndpoint = (window.PATHS && window.PATHS.API && window.PATHS.API.CRAWLER_ENDPOINTS && window.PATHS.API.CRAWLER_ENDPOINTS.CRAWL) || '/crawl';
            const crawlerApiUrl = window.CRAWLER_API_URL || `${apiBase}${crawlEndpoint}`;
            
            // Try to fetch from backend crawler if available
            if (!this.profile) {
                await this.loadProfile();
            }
            
            const response = await fetch(`${crawlerApiUrl}/telegram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    profile: this.profile,
                    channels: telegramChannels
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.jobs) {
                    return data.jobs.map(job => ({
                        ...job,
                        source: job.source || `Telegram - ${job.channel || 'Unknown'}`
                    }));
                }
            }
        } catch (error) {
            console.warn('Telegram crawler API not available:', error.message);
        }
        
        // Fallback: Try to use Telegram public channel URLs
        // Note: This would require browser extension or backend proxy
        console.info('Telegram scraping requires backend API integration');
        
        return jobs;
    }
    
    stripHtml(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }

    getCountryCode(location) {
        // Map locations to Adzuna country codes
        const countryMap = {
            'Ireland': 'ie',
            'Netherlands': 'nl',
            'United Kingdom': 'gb',
            'England': 'gb'
        };
        
        for (const [country, code] of Object.entries(countryMap)) {
            if (location.includes(country)) {
                return code;
            }
        }
        return 'ie'; // Default to Ireland
    }

    getMockJobs() {
        // This method now returns an empty array
        // Real jobs are fetched from Remotive, Arbeitnow, and Adzuna APIs
        // If you want demo data, set window.USE_DEMO_DATA = true before loading
        if (window.USE_DEMO_DATA) {
            return [
                {
                    id: 'demo-1',
                    title: '[DEMO] Product Designer Position',
                    company: 'Demo Company',
                    location: 'Remote',
                    url: '#demo-job',
                    description: 'This is demo data. Click "Refresh" to fetch real jobs from job boards.',
                    created: new Date().toISOString(),
                    salary: 'N/A',
                    type: 'Demo',
                    remote: 'Remote',
                    source: 'Demo Data'
                }
            ];
        }
        return [];
    }

    renderSuggestedJobs() {
        const listEl = document.getElementById('suggested-jobs-list');
        const emptyEl = document.getElementById('suggested-jobs-empty');
        const paginationEl = document.getElementById('suggested-jobs-pagination');

        // Show all jobs (including deprecated ones)
        // Filter out excluded locations that don't mention relocation
        const allJobs = this.suggestedJobs.filter(job => {
            const isExcluded = this.isLocationExcluded(job.location, this.profile);
            const mentionsReloc = this.mentionsRelocation(job, this.profile);
            
            // Only show excluded locations if they mention relocation
            if (isExcluded && !mentionsReloc) {
                return false;
            }
            return true;
        });
        
        // Mark deprecated jobs (older than 2 weeks)
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        allJobs.forEach(job => {
            const jobDate = new Date(job.created);
            job.isDeprecated = jobDate < twoWeeksAgo;
        });

        if (allJobs.length === 0) {
            listEl.innerHTML = '';
            emptyEl.style.display = 'block';
            paginationEl.style.display = 'none';
            return;
        }

        emptyEl.style.display = 'none';
        
        // Apply pagination
        const pagination = this.paginationState.suggestedJobs;
        const totalPages = Math.ceil(allJobs.length / pagination.itemsPerPage);
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = startIndex + pagination.itemsPerPage;
        const paginatedJobs = allJobs.slice(startIndex, endIndex);
        
        listEl.innerHTML = paginatedJobs.map(job => this.createSuggestedJobCard(job)).join('');

        // Render pagination
        if (allJobs.length > pagination.itemsPerPage) {
            this.renderPagination('suggestedJobs', allJobs.length, pagination.currentPage, pagination.itemsPerPage);
            paginationEl.style.display = 'block';
        } else {
            paginationEl.style.display = 'none';
        }

        // Attach event listeners
        paginatedJobs.forEach(job => {
            const applyBtn = document.querySelector(`[data-apply-job="${job.id}"]`);
            const declineBtn = document.querySelector(`[data-decline-job="${job.id}"]`);
            const doNothingBtn = document.querySelector(`[data-donothing-job="${job.id}"]`);

            if (applyBtn) {
                applyBtn.addEventListener('click', () => this.handleJobAction(job.id, 'applied'));
            }
            if (declineBtn) {
                declineBtn.addEventListener('click', () => this.handleJobAction(job.id, 'declined'));
            }
            if (doNothingBtn) {
                doNothingBtn.addEventListener('click', () => this.handleJobAction(job.id, 'nothing'));
            }
        });
    }

    createSuggestedJobCard(job) {
        const jobDate = new Date(job.created);
        const formattedDate = jobDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const daysAgo = Math.floor((Date.now() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
        const dateLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;

        const state = job.state || 'nothing';
        const isDeprecated = job.isDeprecated || false;
        const stateClass = state === 'applied' ? 'applied' : state === 'declined' ? 'declined' : isDeprecated ? 'deprecated' : '';
        const deprecatedClass = isDeprecated ? 'deprecated' : '';
        
        // Check if job mentions relocation
        const mentionsReloc = this.mentionsRelocation(job, this.profile);
        const isExcludedLocation = this.isLocationExcluded(job.location, this.profile);

        return `
            <div class="suggested-job-card ${stateClass} ${deprecatedClass}" data-job-id="${job.id}">
                <div class="suggested-job-header">
                    <div class="suggested-job-title-section">
                        <h3>${this.escapeHtml(job.title)}</h3>
                        <div class="suggested-job-company">${this.escapeHtml(job.company)}</div>
                        <div class="suggested-job-location">📍 ${this.escapeHtml(job.location)}</div>
                        ${mentionsReloc ? `
                        <div class="relocation-badge" title="This job mentions relocation support or visa sponsorship">
                            ✈️ Relocation Support Available
                        </div>
                        ` : ''}
                        ${job.source ? `
                        <div class="suggested-job-source">
                            <span class="source-label">Source:</span>
                            <span class="source-value">${this.escapeHtml(job.source)}</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="suggested-job-meta">
                        ${job.relevanceScore !== undefined ? `
                        <div class="relevance-score" title="Match score based on your profile (${job.relevanceScore}/100)">
                            <span class="score-label">Match:</span>
                            <span class="score-value score-${job.relevanceScore >= 70 ? 'high' : job.relevanceScore >= 40 ? 'medium' : 'low'}">
                                ${job.relevanceScore}%
                            </span>
                        </div>
                        ` : ''}
                        <div class="job-post-date">
                            <span class="date-label">Posted:</span>
                            <span class="date-value">${formattedDate}</span>
                            <span class="date-ago">(${dateLabel})</span>
                        </div>
                        ${isDeprecated ? `
                        <div class="job-state-badge deprecated">
                            ⚠️ Deprecated
                        </div>
                        ` : ''}
                        ${job.state && !isDeprecated ? `
                        <div class="job-state-badge ${job.state}">
                            ${job.state === 'applied' ? '✓ Applied' : job.state === 'declined' ? '✗ Declined' : '○ Saved for Later'}
                        </div>
                        ` : ''}
                    </div>
                </div>
                ${job.description ? `
                <div class="suggested-job-description">
                    ${this.escapeHtml(job.description)}
                </div>
                ` : ''}
                <div class="suggested-job-details">
                    ${job.salary ? `
                    <div class="suggested-detail-item">
                        <span class="detail-icon">💰</span>
                        <span>${this.escapeHtml(job.salary)}</span>
                    </div>
                    ` : ''}
                    ${job.type ? `
                    <div class="suggested-detail-item">
                        <span class="detail-icon">📋</span>
                        <span>${this.escapeHtml(job.type)}</span>
                    </div>
                    ` : ''}
                    ${job.remote ? `
                    <div class="suggested-detail-item">
                        <span class="detail-icon">🏠</span>
                        <span>${this.escapeHtml(job.remote)}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="suggested-job-actions">
                    <a href="${job.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-small">
                        View Job →
                    </a>
                    ${!isDeprecated ? `
                    <button class="btn btn-success btn-small" data-apply-job="${job.id}">
                        ✓ Apply
                    </button>
                    <button class="btn btn-secondary btn-small" data-donothing-job="${job.id}"
                            aria-label="Save job for later">
                        <span aria-hidden="true">○</span> Save for Later
                    </button>
                    <button class="btn btn-danger btn-small" data-decline-job="${job.id}">
                        ✗ Decline
                    </button>
                    ` : `
                    <button class="btn btn-secondary btn-small" disabled title="This job is deprecated (older than 2 weeks)">
                        ⚠️ Deprecated
                    </button>
                    `}
                </div>
            </div>
        `;
    }

    handleJobAction(jobId, action) {
        const job = this.suggestedJobs.find(j => j.id === jobId);
        if (!job) return;

        job.state = action;
        job.stateUpdated = new Date().toISOString();

        if (action === 'applied') {
            // Optionally open the add application modal with pre-filled data
            this.openModalFromSuggestedJob(job);
            toast.show('Job added to applications', 'success');
        } else if (action === 'declined') {
            toast.show('Job marked as declined', 'info');
        } else {
            toast.show('Job saved for later', 'info');
        }

        this.saveSuggestedJobs();
    }

    openModalFromSuggestedJob(job) {
        this.openModal();
        setTimeout(() => {
            document.getElementById('company-name').value = job.company;
            document.getElementById('position').value = job.title;
            document.getElementById('location').value = job.location;
            document.getElementById('job-url').value = job.url;
            document.getElementById('application-date').value = new Date().toISOString().split('T')[0];
            document.getElementById('status').value = 'applied';
            document.getElementById('job-source').value = job.source || 'Suggested Job';
        }, 100);
    }

    renderPagination(listType, totalItems, currentPage, itemsPerPage) {
        const paginationEl = document.getElementById(`${listType === 'suggestedJobs' ? 'suggested-jobs' : 'applications'}-pagination`);
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        if (totalPages <= 1) {
            paginationEl.style.display = 'none';
            return;
        }

        let paginationHTML = `
            <div class="pagination">
                <div class="pagination-info">
                    Showing ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items
                </div>
                <div class="pagination-controls">
        `;

        // First and Previous buttons
        if (currentPage > 1) {
            paginationHTML += `
                <button class="pagination-btn" data-page="1" data-list="${listType}">First</button>
                <button class="pagination-btn" data-page="${currentPage - 1}" data-list="${listType}">Previous</button>
            `;
        } else {
            paginationHTML += `
                <button class="pagination-btn" disabled>First</button>
                <button class="pagination-btn" disabled>Previous</button>
            `;
        }

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="1" data-list="${listType}">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                paginationHTML += `<button class="pagination-btn active" disabled>${i}</button>`;
            } else {
                paginationHTML += `<button class="pagination-btn" data-page="${i}" data-list="${listType}">${i}</button>`;
            }
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" data-page="${totalPages}" data-list="${listType}">${totalPages}</button>`;
        }

        // Next and Last buttons
        if (currentPage < totalPages) {
            paginationHTML += `
                <button class="pagination-btn" data-page="${currentPage + 1}" data-list="${listType}">Next</button>
                <button class="pagination-btn" data-page="${totalPages}" data-list="${listType}">Last</button>
            `;
        } else {
            paginationHTML += `
                <button class="pagination-btn" disabled>Next</button>
                <button class="pagination-btn" disabled>Last</button>
            `;
        }

        paginationHTML += `
                </div>
                <div class="pagination-settings">
                    <label for="items-per-page-${listType}">Items per page:</label>
                    <select id="items-per-page-${listType}" class="pagination-select" data-list="${listType}">
                        <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10</option>
                        <option value="20" ${itemsPerPage === 20 ? 'selected' : ''}>20</option>
                        <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50</option>
                    </select>
                </div>
            </div>
        `;

        paginationEl.innerHTML = paginationHTML;

        // Attach event listeners
        paginationEl.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.getAttribute('data-page'));
                const list = e.target.getAttribute('data-list');
                this.goToPage(list, page);
            });
        });

        paginationEl.querySelectorAll('.pagination-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const list = e.target.getAttribute('data-list');
                const itemsPerPage = parseInt(e.target.value);
                this.paginationState[list].itemsPerPage = itemsPerPage;
                this.paginationState[list].currentPage = 1;
                this.savePaginationState();
                if (list === 'suggestedJobs') {
                    this.renderSuggestedJobs();
                } else {
                    this.filterApplications();
                }
            });
        });
    }

    goToPage(listType, page) {
        this.paginationState[listType].currentPage = page;
        this.savePaginationState();
        if (listType === 'suggestedJobs') {
            this.renderSuggestedJobs();
        } else {
            this.filterApplications();
        }
    }

    // ==================== Strategy 1: Enhanced Application Process & Learning ====================
    
    // Data management helpers
    loadData(key) {
        // Map key to storage key format (e.g., 'hrContacts' -> 'HR_CONTACTS')
        const getStorageKey = (k) => {
            if (!window.PATHS || !window.PATHS.STORAGE) return k;
            // Convert camelCase to UPPER_SNAKE_CASE (e.g., 'hrContacts' -> 'HR_CONTACTS')
            const upperKey = k.replace(/([A-Z])/g, '_$1').toUpperCase();
            // Check if key exists in STORAGE object
            if (window.PATHS.STORAGE[upperKey]) {
                return window.PATHS.STORAGE[upperKey];
            }
            // Fallback: try direct lookup (for keys like 'contentIdeas', 'weeklyTasks')
            const directKey = Object.keys(window.PATHS.STORAGE).find(
                sk => window.PATHS.STORAGE[sk] === k
            );
            return directKey ? window.PATHS.STORAGE[directKey] : k;
        };
        const storageKey = getStorageKey(key);
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveData(key, data) {
        try {
            // Map key to storage key format (e.g., 'hrContacts' -> 'HR_CONTACTS')
            const getStorageKey = (k) => {
                if (!window.PATHS || !window.PATHS.STORAGE) return k;
                // Convert camelCase to UPPER_SNAKE_CASE (e.g., 'hrContacts' -> 'HR_CONTACTS')
                const upperKey = k.replace(/([A-Z])/g, '_$1').toUpperCase();
                // Check if key exists in STORAGE object
                if (window.PATHS.STORAGE[upperKey]) {
                    return window.PATHS.STORAGE[upperKey];
                }
                // Fallback: try direct lookup (for keys like 'contentIdeas', 'weeklyTasks')
                const directKey = Object.keys(window.PATHS.STORAGE).find(
                    sk => window.PATHS.STORAGE[sk] === k
                );
                return directKey ? window.PATHS.STORAGE[directKey] : k;
            };
            const storageKey = getStorageKey(key);
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                toast.show('Storage is full. Please clear some data.', 'error', 5000);
            }
            console.error(`Error saving ${key}:`, error);
        }
    }

    // Strategy tabs setup
    setupStrategyTabs() {
        document.querySelectorAll('.strategy-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                const page = e.target.closest('.page');
                if (!page) return;
                
                // Update active tab
                page.querySelectorAll('.strategy-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                // Show corresponding content
                page.querySelectorAll('.strategy-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                const content = page.querySelector(`#tab-${tabName}`);
                if (content) content.classList.add('active');
            });
        });
    }

    // Setup all strategy modals
    setupStrategyModals() {
        // Strategy 1 modals
        this.setupHRContactModal();
        this.setupRejectionEmailModal();
        this.setupCoverLetterModal();
        this.setupProcessLogModal();
        
        // Strategy 2 modals
        this.setupRecruiterModal();
        this.setupRecruiterInteractionModal();
        this.setupHiringManagerModal();
        this.setupNetworkingActivityModal();
        
        // Strategy 3 modals
        this.setupContentIdeaModal();
        this.setupLinkedInActivityModal();
        this.setupPortfolioItemModal();
        this.setupProfileViewModal();
        this.setupInboundOpportunityModal();
    }

    // Render all strategy data
    renderAllStrategyData() {
        this.renderHRContacts();
        this.renderRejectionEmails();
        this.renderCoverLetters();
        this.renderProcessLogs();
        this.renderRecruiters();
        this.renderRecruiterInteractions();
        this.renderHiringManagers();
        this.renderNetworkingActivities();
        this.renderAITasks();
        this.renderContentIdeas();
        this.renderLinkedInActivities();
        this.renderPortfolioItems();
        this.renderProfileViews();
        this.renderInboundOpportunities();
        this.renderWeeklyTasks();
        this.renderSourceDetails();
        this.renderContentCalendar();
        this.updateLearningAnalytics();
        this.updateRecruiterAnalytics();
        this.updateEngagementAnalytics();
        
        // Setup generate buttons
        const generateAITasksBtn = document.getElementById('generate-ai-tasks-btn');
        if (generateAITasksBtn) {
            generateAITasksBtn.addEventListener('click', () => this.generateAITasks());
        }
        
        const generateWeeklyTasksBtn = document.getElementById('generate-weekly-tasks-btn');
        if (generateWeeklyTasksBtn) {
            generateWeeklyTasksBtn.addEventListener('click', () => this.generateWeeklyTasks());
        }
        
        // Setup calendar event button
        const addCalendarEventBtn = document.getElementById('add-calendar-event-btn');
        if (addCalendarEventBtn) {
            addCalendarEventBtn.addEventListener('click', () => this.openContentIdeaModal());
        }
        
        // Setup process log add button
        const addProcessLogBtn = document.querySelector('#tab-process-logs .tab-header');
        if (addProcessLogBtn && !addProcessLogBtn.querySelector('button')) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary btn-small';
            btn.textContent = '+ Add Process Log Entry';
            btn.onclick = () => this.openProcessLogModal();
            addProcessLogBtn.appendChild(btn);
        }
    }

    // ==================== US-038: HR Contact Information ====================
    setupHRContactModal() {
        const modal = document.getElementById('hr-contact-modal');
        const form = document.getElementById('hr-contact-form');
        const addBtn = document.getElementById('add-hr-contact-btn');
        const closeBtn = document.getElementById('close-hr-contact-modal');
        const cancelBtn = document.getElementById('cancel-hr-contact-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openHRContactModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeHRContactModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeHRContactModal());
        if (form) form.addEventListener('submit', (e) => this.handleHRContactSubmit(e));
    }

    openHRContactModal(contactId = null) {
        const modal = document.getElementById('hr-contact-modal');
        const form = document.getElementById('hr-contact-form');
        const title = document.getElementById('hr-contact-modal-title');
        
        if (contactId) {
            const contact = this.hrContacts.find(c => c.id === contactId);
            title.textContent = 'Edit HR Contact';
            document.getElementById('hr-contact-id').value = contactId;
            document.getElementById('hr-name').value = contact.name || '';
            document.getElementById('hr-email').value = contact.email || '';
            document.getElementById('hr-company').value = contact.company || '';
            document.getElementById('hr-phone').value = contact.phone || '';
            document.getElementById('hr-linkedin').value = contact.linkedin || '';
            document.getElementById('hr-notes').value = contact.notes || '';
        } else {
            title.textContent = 'Add HR Contact';
            form.reset();
            document.getElementById('hr-contact-id').value = '';
        }
        modal.style.display = 'block';
    }

    closeHRContactModal() {
        document.getElementById('hr-contact-modal').style.display = 'none';
    }

    handleHRContactSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('hr-contact-id').value;
        const contact = {
            id: id || this.generateId(),
            name: document.getElementById('hr-name').value.trim(),
            email: document.getElementById('hr-email').value.trim(),
            company: document.getElementById('hr-company').value.trim(),
            phone: document.getElementById('hr-phone').value.trim(),
            linkedin: document.getElementById('hr-linkedin').value.trim(),
            notes: document.getElementById('hr-notes').value.trim(),
            createdAt: id ? this.hrContacts.find(c => c.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.hrContacts.findIndex(c => c.id === id);
            if (index !== -1) this.hrContacts[index] = contact;
        } else {
            this.hrContacts.unshift(contact);
        }

        this.saveData('hrContacts', this.hrContacts);
        this.renderHRContacts();
        this.closeHRContactModal();
        toast.show(`HR contact ${id ? 'updated' : 'added'} successfully!`, 'success');
    }

    renderHRContacts() {
        const container = document.getElementById('hr-contacts-list');
        const empty = document.getElementById('hr-contacts-empty');
        if (!container) return;

        if (this.hrContacts.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.hrContacts.map(contact => `
            <div class="data-card">
                <div class="data-card-header">
                    <h4 class="data-card-title">${this.escapeHtml(contact.name)}</h4>
                    <div class="data-card-actions">
                        <button class="btn btn-small btn-secondary" onclick="tracker.openHRContactModal('${contact.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="tracker.deleteHRContact('${contact.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-card-body">
                    <p><strong>Email:</strong> <a href="mailto:${this.escapeHtml(contact.email)}">${this.escapeHtml(contact.email)}</a></p>
                    ${contact.company ? `<p><strong>Company:</strong> ${this.escapeHtml(contact.company)}</p>` : ''}
                    ${contact.phone ? `<p><strong>Phone:</strong> ${this.escapeHtml(contact.phone)}</p>` : ''}
                    ${contact.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${this.escapeHtml(contact.linkedin)}" target="_blank">View Profile</a></p>` : ''}
                    ${contact.notes ? `<p><strong>Notes:</strong> ${this.escapeHtml(contact.notes)}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    deleteHRContact(id) {
        if (confirm('Are you sure you want to delete this HR contact?')) {
            this.hrContacts = this.hrContacts.filter(c => c.id !== id);
            this.saveData('hrContacts', this.hrContacts);
            this.renderHRContacts();
            toast.show('HR contact deleted successfully', 'success');
        }
    }

    // ==================== US-039: Rejection Emails ====================
    setupRejectionEmailModal() {
        const form = document.getElementById('rejection-email-form');
        const addBtn = document.getElementById('add-rejection-email-btn');
        const closeBtn = document.getElementById('close-rejection-email-modal');
        const cancelBtn = document.getElementById('cancel-rejection-email-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openRejectionEmailModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeRejectionEmailModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeRejectionEmailModal());
        if (form) form.addEventListener('submit', (e) => this.handleRejectionEmailSubmit(e));
    }

    openRejectionEmailModal(emailId = null) {
        const modal = document.getElementById('rejection-email-modal');
        const form = document.getElementById('rejection-email-form');
        const title = document.getElementById('rejection-email-modal-title');
        const appSelect = document.getElementById('rejection-application-select');
        
        // Populate application dropdown
        if (appSelect) {
            appSelect.innerHTML = '<option value="">Select application...</option>' +
                this.applications.map(app => `<option value="${app.id}">${this.escapeHtml(app.company)} - ${this.escapeHtml(app.position)}</option>`).join('');
        }

        if (emailId) {
            const email = this.rejectionEmails.find(e => e.id === emailId);
            title.textContent = 'Edit Rejection Email';
            document.getElementById('rejection-email-id').value = emailId;
            if (appSelect) appSelect.value = email.applicationId || '';
            document.getElementById('rejection-email-content').value = email.content || '';
            document.getElementById('rejection-date').value = email.date || '';
            document.getElementById('rejection-reason').value = email.reason || '';
        } else {
            title.textContent = 'Add Rejection Email';
            form.reset();
            document.getElementById('rejection-email-id').value = '';
            document.getElementById('rejection-date').value = new Date().toISOString().split('T')[0];
        }
        modal.style.display = 'block';
    }

    closeRejectionEmailModal() {
        document.getElementById('rejection-email-modal').style.display = 'none';
    }

    handleRejectionEmailSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('rejection-email-id').value;
        const email = {
            id: id || this.generateId(),
            applicationId: document.getElementById('rejection-application-select').value,
            content: document.getElementById('rejection-email-content').value.trim(),
            date: document.getElementById('rejection-date').value || new Date().toISOString().split('T')[0],
            reason: document.getElementById('rejection-reason').value.trim(),
            createdAt: id ? this.rejectionEmails.find(e => e.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.rejectionEmails.findIndex(e => e.id === id);
            if (index !== -1) this.rejectionEmails[index] = email;
        } else {
            this.rejectionEmails.unshift(email);
        }

        this.saveData('rejectionEmails', this.rejectionEmails);
        this.renderRejectionEmails();
        this.updateLearningAnalytics();
        this.closeRejectionEmailModal();
        toast.show(`Rejection email ${id ? 'updated' : 'added'} successfully!`, 'success');
    }

    renderRejectionEmails() {
        const container = document.getElementById('rejection-emails-list');
        const empty = document.getElementById('rejection-emails-empty');
        if (!container) return;

        if (this.rejectionEmails.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.rejectionEmails.map(email => {
            const app = this.applications.find(a => a.id === email.applicationId);
            return `
                <div class="data-card">
                    <div class="data-card-header">
                        <h4 class="data-card-title">${app ? `${this.escapeHtml(app.company)} - ${this.escapeHtml(app.position)}` : 'Unknown Application'}</h4>
                        <div class="data-card-actions">
                            <button class="btn btn-small btn-secondary" onclick="tracker.openRejectionEmailModal('${email.id}')">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="tracker.deleteRejectionEmail('${email.id}')">Delete</button>
                        </div>
                    </div>
                    <div class="data-card-body">
                        <p><strong>Date:</strong> ${new Date(email.date).toLocaleDateString()}</p>
                        ${email.reason ? `<p><strong>Reason:</strong> ${this.escapeHtml(email.reason)}</p>` : ''}
                        <p><strong>Email Content:</strong></p>
                        <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px; white-space: pre-wrap;">${this.escapeHtml(email.content)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    deleteRejectionEmail(id) {
        if (confirm('Are you sure you want to delete this rejection email?')) {
            this.rejectionEmails = this.rejectionEmails.filter(e => e.id !== id);
            this.saveData('rejectionEmails', this.rejectionEmails);
            this.renderRejectionEmails();
            this.updateLearningAnalytics();
            toast.show('Rejection email deleted successfully', 'success');
        }
    }

    // ==================== US-040: Cover Letters ====================
    setupCoverLetterModal() {
        const form = document.getElementById('cover-letter-form');
        const addBtn = document.getElementById('add-cover-letter-btn');
        const closeBtn = document.getElementById('close-cover-letter-modal');
        const cancelBtn = document.getElementById('cancel-cover-letter-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openCoverLetterModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeCoverLetterModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeCoverLetterModal());
        if (form) form.addEventListener('submit', (e) => this.handleCoverLetterSubmit(e));
    }

    openCoverLetterModal(letterId = null) {
        const modal = document.getElementById('cover-letter-modal');
        const form = document.getElementById('cover-letter-form');
        const title = document.getElementById('cover-letter-modal-title');
        const appSelect = document.getElementById('cover-letter-application-select');
        
        if (appSelect) {
            appSelect.innerHTML = '<option value="">Not linked to application</option>' +
                this.applications.map(app => `<option value="${app.id}">${this.escapeHtml(app.company)} - ${this.escapeHtml(app.position)}</option>`).join('');
        }

        if (letterId) {
            const letter = this.coverLetters.find(l => l.id === letterId);
            title.textContent = 'Edit Cover Letter';
            document.getElementById('cover-letter-id').value = letterId;
            document.getElementById('cover-letter-title').value = letter.title || '';
            if (appSelect) appSelect.value = letter.applicationId || '';
            document.getElementById('cover-letter-content').value = letter.content || '';
            document.getElementById('cover-letter-version').value = letter.version || '1.0';
        } else {
            title.textContent = 'Add Cover Letter';
            form.reset();
            document.getElementById('cover-letter-id').value = '';
            document.getElementById('cover-letter-version').value = '1.0';
        }
        modal.style.display = 'block';
    }

    closeCoverLetterModal() {
        document.getElementById('cover-letter-modal').style.display = 'none';
    }

    handleCoverLetterSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('cover-letter-id').value;
        const letter = {
            id: id || this.generateId(),
            title: document.getElementById('cover-letter-title').value.trim(),
            applicationId: document.getElementById('cover-letter-application-select').value || null,
            content: document.getElementById('cover-letter-content').value.trim(),
            version: document.getElementById('cover-letter-version').value || '1.0',
            createdAt: id ? this.coverLetters.find(l => l.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.coverLetters.findIndex(l => l.id === id);
            if (index !== -1) this.coverLetters[index] = letter;
        } else {
            this.coverLetters.unshift(letter);
        }

        this.saveData('coverLetters', this.coverLetters);
        this.renderCoverLetters();
        this.updateLearningAnalytics();
        this.closeCoverLetterModal();
        toast.show(`Cover letter ${id ? 'updated' : 'added'} successfully!`, 'success');
    }

    renderCoverLetters() {
        const container = document.getElementById('cover-letters-list');
        const empty = document.getElementById('cover-letters-empty');
        if (!container) return;

        if (this.coverLetters.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.coverLetters.map(letter => {
            const app = letter.applicationId ? this.applications.find(a => a.id === letter.applicationId) : null;
            return `
                <div class="data-card">
                    <div class="data-card-header">
                        <h4 class="data-card-title">${this.escapeHtml(letter.title)} <span style="font-size: 0.8em; color: #666;">v${letter.version}</span></h4>
                        <div class="data-card-actions">
                            <button class="btn btn-small btn-secondary" onclick="tracker.openCoverLetterModal('${letter.id}')">Edit</button>
                            <button class="btn btn-small btn-secondary" onclick="tracker.copyCoverLetter('${letter.id}')">Copy</button>
                            <button class="btn btn-small btn-danger" onclick="tracker.deleteCoverLetter('${letter.id}')">Delete</button>
                        </div>
                    </div>
                    <div class="data-card-body">
                        ${app ? `<p><strong>Application:</strong> ${this.escapeHtml(app.company)} - ${this.escapeHtml(app.position)}</p>` : ''}
                        <p><strong>Content Preview:</strong></p>
                        <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px; max-height: 200px; overflow-y: auto; white-space: pre-wrap;">${this.escapeHtml(letter.content.substring(0, 500))}${letter.content.length > 500 ? '...' : ''}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    copyCoverLetter(id) {
        const letter = this.coverLetters.find(l => l.id === id);
        if (letter) {
            navigator.clipboard.writeText(letter.content).then(() => {
                toast.show('Cover letter copied to clipboard!', 'success');
            });
        }
    }

    deleteCoverLetter(id) {
        if (confirm('Are you sure you want to delete this cover letter?')) {
            this.coverLetters = this.coverLetters.filter(l => l.id !== id);
            this.saveData('coverLetters', this.coverLetters);
            this.renderCoverLetters();
            this.updateLearningAnalytics();
            toast.show('Cover letter deleted successfully', 'success');
        }
    }

    // ==================== US-041: Process Logs ====================
    setupProcessLogModal() {
        const form = document.getElementById('process-log-form');
        const addBtn = document.querySelector('[onclick*="openProcessLogModal"]');
        const closeBtn = document.getElementById('close-process-log-modal');
        const cancelBtn = document.getElementById('cancel-process-log-btn');

        if (closeBtn) closeBtn.addEventListener('click', () => this.closeProcessLogModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeProcessLogModal());
        if (form) form.addEventListener('submit', (e) => this.handleProcessLogSubmit(e));
    }

    openProcessLogModal(logId = null) {
        const modal = document.getElementById('process-log-modal');
        const form = document.getElementById('process-log-form');
        const title = document.getElementById('process-log-modal-title');
        const appSelect = document.getElementById('process-log-application-select');
        
        if (appSelect) {
            appSelect.innerHTML = '<option value="">Select application...</option>' +
                this.applications.map(app => `<option value="${app.id}">${this.escapeHtml(app.company)} - ${this.escapeHtml(app.position)}</option>`).join('');
        }

        if (logId) {
            const log = this.processLogs.find(l => l.id === logId);
            title.textContent = 'Edit Process Log Entry';
            document.getElementById('process-log-id').value = logId;
            if (appSelect) appSelect.value = log.applicationId || '';
            document.getElementById('process-log-step').value = log.step || '';
            document.getElementById('process-log-outcome').value = log.outcome || 'pending';
            document.getElementById('process-log-notes').value = log.notes || '';
        } else {
            title.textContent = 'Add Process Log Entry';
            form.reset();
            document.getElementById('process-log-id').value = '';
        }
        modal.style.display = 'block';
    }

    closeProcessLogModal() {
        document.getElementById('process-log-modal').style.display = 'none';
    }

    handleProcessLogSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('process-log-id').value;
        const log = {
            id: id || this.generateId(),
            applicationId: document.getElementById('process-log-application-select').value,
            step: document.getElementById('process-log-step').value.trim(),
            outcome: document.getElementById('process-log-outcome').value,
            notes: document.getElementById('process-log-notes').value.trim(),
            timestamp: id ? this.processLogs.find(l => l.id === id)?.timestamp : new Date().toISOString()
        };

        if (id) {
            const index = this.processLogs.findIndex(l => l.id === id);
            if (index !== -1) this.processLogs[index] = log;
        } else {
            this.processLogs.unshift(log);
        }

        this.saveData('processLogs', this.processLogs);
        this.renderProcessLogs();
        this.closeProcessLogModal();
        toast.show(`Process log entry ${id ? 'updated' : 'added'} successfully!`, 'success');
    }

    renderProcessLogs() {
        const container = document.getElementById('process-logs-list');
        const empty = document.getElementById('process-logs-empty');
        const appFilter = document.getElementById('process-log-application-select');
        if (!container) return;

        let filteredLogs = this.processLogs;
        if (appFilter && appFilter.value) {
            filteredLogs = this.processLogs.filter(l => l.applicationId === appFilter.value);
        }

        // Update filter dropdown
        if (appFilter) {
            appFilter.innerHTML = '<option value="">All Applications</option>' +
                this.applications.map(app => `<option value="${app.id}">${this.escapeHtml(app.company)} - ${this.escapeHtml(app.position)}</option>`).join('');
            appFilter.addEventListener('change', () => this.renderProcessLogs());
        }

        if (filteredLogs.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = filteredLogs.map(log => {
            const app = this.applications.find(a => a.id === log.applicationId);
            return `
                <div class="data-card">
                    <div class="data-card-header">
                        <h4 class="data-card-title">${this.escapeHtml(log.step)}</h4>
                        <div class="data-card-actions">
                            <button class="btn btn-small btn-secondary" onclick="tracker.openProcessLogModal('${log.id}')">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="tracker.deleteProcessLog('${log.id}')">Delete</button>
                        </div>
                    </div>
                    <div class="data-card-body">
                        ${app ? `<p><strong>Application:</strong> ${this.escapeHtml(app.company)} - ${this.escapeHtml(app.position)}</p>` : ''}
                        <p><strong>Outcome:</strong> <span class="task-item-status ${log.outcome}">${log.outcome}</span></p>
                        <p><strong>Date:</strong> ${new Date(log.timestamp).toLocaleString()}</p>
                        ${log.notes ? `<p><strong>Notes:</strong> ${this.escapeHtml(log.notes)}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    deleteProcessLog(id) {
        if (confirm('Are you sure you want to delete this process log entry?')) {
            this.processLogs = this.processLogs.filter(l => l.id !== id);
            this.saveData('processLogs', this.processLogs);
            this.renderProcessLogs();
            toast.show('Process log entry deleted successfully', 'success');
        }
    }

    // ==================== US-042: Learning Analytics ====================
    updateLearningAnalytics() {
        // Source success rate
        const sourceStats = {};
        this.applications.forEach(app => {
            if (!app.source) return;
            if (!sourceStats[app.source]) {
                sourceStats[app.source] = { total: 0, accepted: 0, interviews: 0 };
            }
            sourceStats[app.source].total++;
            if (app.status === 'accepted') sourceStats[app.source].accepted++;
            if (app.status === 'interview') sourceStats[app.source].interviews++;
        });

        const sourceChart = document.getElementById('source-success-chart');
        if (sourceChart) {
            sourceChart.innerHTML = Object.keys(sourceStats).length === 0 
                ? '<p style="color: #999; font-style: italic;">No data available</p>'
                : Object.entries(sourceStats).map(([source, stats]) => {
                    const successRate = stats.total > 0 ? ((stats.accepted / stats.total) * 100).toFixed(1) : 0;
                    return `
                        <div style="margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span><strong>${this.escapeHtml(source)}</strong></span>
                                <span>${successRate}% success</span>
                            </div>
                            <div style="background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
                                <div style="background: var(--success-color); height: 100%; width: ${successRate}%;"></div>
                            </div>
                            <small style="color: #666;">${stats.accepted} accepted / ${stats.total} total</small>
                        </div>
                    `;
                }).join('');
        }

        // Rejection reasons
        const rejectionReasons = {};
        this.rejectionEmails.forEach(email => {
            if (email.reason) {
                rejectionReasons[email.reason] = (rejectionReasons[email.reason] || 0) + 1;
            }
        });

        const rejectionChart = document.getElementById('rejection-reasons-chart');
        if (rejectionChart) {
            rejectionChart.innerHTML = Object.keys(rejectionReasons).length === 0
                ? '<p style="color: #999; font-style: italic;">No rejection reasons tracked</p>'
                : Object.entries(rejectionReasons).sort((a, b) => b[1] - a[1]).map(([reason, count]) => `
                    <div style="margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>${this.escapeHtml(reason)}</span>
                            <span><strong>${count}</strong></span>
                        </div>
                    </div>
                `).join('');
        }

        // Cover letter effectiveness
        const coverLetterEffectiveness = document.getElementById('cover-letter-effectiveness');
        if (coverLetterEffectiveness) {
            const lettersWithApps = this.coverLetters.filter(l => l.applicationId);
            const effectiveness = lettersWithApps.map(letter => {
                const app = this.applications.find(a => a.id === letter.applicationId);
                return {
                    title: letter.title,
                    status: app ? app.status : 'unknown',
                    version: letter.version
                };
            });

            coverLetterEffectiveness.innerHTML = effectiveness.length === 0
                ? '<p style="color: #999; font-style: italic;">No cover letters linked to applications</p>'
                : effectiveness.map(e => `
                    <div style="margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                        <strong>${this.escapeHtml(e.title)}</strong> (v${e.version})<br>
                        <small>Status: ${e.status}</small>
                    </div>
                `).join('');
        }
    }

    // ==================== US-043: Enhanced Source Details ====================
    renderSourceDetails() {
        const container = document.getElementById('source-details-list');
        const empty = document.getElementById('source-details-empty');
        if (!container) return;

        const sourceMap = {};
        this.applications.forEach(app => {
            if (!app.source) return;
            if (!sourceMap[app.source]) {
                sourceMap[app.source] = {
                    source: app.source,
                    applications: [],
                    accepted: 0,
                    interviews: 0,
                    rejected: 0
                };
            }
            sourceMap[app.source].applications.push(app);
            if (app.status === 'accepted') sourceMap[app.source].accepted++;
            if (app.status === 'interview') sourceMap[app.source].interviews++;
            if (app.status === 'rejected') sourceMap[app.source].rejected++;
        });

        const sources = Object.values(sourceMap);
        if (sources.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = sources.map(source => {
            const successRate = source.applications.length > 0 
                ? ((source.accepted / source.applications.length) * 100).toFixed(1) 
                : 0;
            return `
                <div class="data-card">
                    <div class="data-card-header">
                        <h4 class="data-card-title">${this.escapeHtml(source.source)}</h4>
                    </div>
                    <div class="data-card-body">
                        <p><strong>Total Applications:</strong> ${source.applications.length}</p>
                        <p><strong>Accepted:</strong> ${source.accepted} | <strong>Interviews:</strong> ${source.interviews} | <strong>Rejected:</strong> ${source.rejected}</p>
                        <p><strong>Success Rate:</strong> ${successRate}%</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ==================== Strategy 2: Network Building & Recruiter Management ====================
    
    // ==================== US-044: Recruiter Management ====================
    setupRecruiterModal() {
        const form = document.getElementById('recruiter-form');
        const addBtn = document.getElementById('add-recruiter-btn');
        const closeBtn = document.getElementById('close-recruiter-modal');
        const cancelBtn = document.getElementById('cancel-recruiter-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openRecruiterModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeRecruiterModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeRecruiterModal());
        if (form) form.addEventListener('submit', (e) => this.handleRecruiterSubmit(e));
    }

    openRecruiterModal(recruiterId = null) {
        const modal = document.getElementById('recruiter-modal');
        const form = document.getElementById('recruiter-form');
        const title = document.getElementById('recruiter-modal-title');
        
        if (recruiterId) {
            const recruiter = this.recruiters.find(r => r.id === recruiterId);
            title.textContent = 'Edit Recruiter';
            document.getElementById('recruiter-id').value = recruiterId;
            document.getElementById('recruiter-name').value = recruiter.name || '';
            document.getElementById('recruiter-email').value = recruiter.email || '';
            document.getElementById('recruiter-phone').value = recruiter.phone || '';
            document.getElementById('recruiter-linkedin').value = recruiter.linkedin || '';
            document.getElementById('recruiter-company').value = recruiter.company || '';
            document.getElementById('recruiter-specialization').value = recruiter.specialization || '';
            document.getElementById('recruiter-location').value = recruiter.location || '';
            document.getElementById('recruiter-type').value = recruiter.type || 'internal';
        } else {
            title.textContent = 'Add Recruiter';
            form.reset();
            document.getElementById('recruiter-id').value = '';
        }
        modal.style.display = 'block';
    }

    closeRecruiterModal() {
        document.getElementById('recruiter-modal').style.display = 'none';
    }

    handleRecruiterSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('recruiter-id').value;
        const recruiter = {
            id: id || this.generateId(),
            name: document.getElementById('recruiter-name').value.trim(),
            email: document.getElementById('recruiter-email').value.trim(),
            phone: document.getElementById('recruiter-phone').value.trim(),
            linkedin: document.getElementById('recruiter-linkedin').value.trim(),
            company: document.getElementById('recruiter-company').value.trim(),
            specialization: document.getElementById('recruiter-specialization').value.trim(),
            location: document.getElementById('recruiter-location').value.trim(),
            type: document.getElementById('recruiter-type').value,
            createdAt: id ? this.recruiters.find(r => r.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.recruiters.findIndex(r => r.id === id);
            if (index !== -1) this.recruiters[index] = recruiter;
        } else {
            this.recruiters.unshift(recruiter);
        }

        this.saveData('recruiters', this.recruiters);
        this.renderRecruiters();
        this.updateRecruiterAnalytics();
        this.closeRecruiterModal();
        toast.show(`Recruiter ${id ? 'updated' : 'added'} successfully!`, 'success');
    }

    renderRecruiters() {
        const container = document.getElementById('recruiters-list');
        const empty = document.getElementById('recruiters-empty');
        if (!container) return;

        if (this.recruiters.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.recruiters.map(recruiter => `
            <div class="data-card">
                <div class="data-card-header">
                    <h4 class="data-card-title">${this.escapeHtml(recruiter.name)}</h4>
                    <div class="data-card-actions">
                        <button class="btn btn-small btn-secondary" onclick="tracker.openRecruiterModal('${recruiter.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="tracker.deleteRecruiter('${recruiter.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-card-body">
                    <p><strong>Type:</strong> ${this.escapeHtml(recruiter.type)}</p>
                    ${recruiter.company ? `<p><strong>Company:</strong> ${this.escapeHtml(recruiter.company)}</p>` : ''}
                    ${recruiter.email ? `<p><strong>Email:</strong> <a href="mailto:${this.escapeHtml(recruiter.email)}">${this.escapeHtml(recruiter.email)}</a></p>` : ''}
                    ${recruiter.phone ? `<p><strong>Phone:</strong> ${this.escapeHtml(recruiter.phone)}</p>` : ''}
                    ${recruiter.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${this.escapeHtml(recruiter.linkedin)}" target="_blank">View Profile</a></p>` : ''}
                    ${recruiter.specialization ? `<p><strong>Specialization:</strong> ${this.escapeHtml(recruiter.specialization)}</p>` : ''}
                    ${recruiter.location ? `<p><strong>Location Focus:</strong> ${this.escapeHtml(recruiter.location)}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    deleteRecruiter(id) {
        if (confirm('Are you sure you want to delete this recruiter?')) {
            this.recruiters = this.recruiters.filter(r => r.id !== id);
            this.recruiterInteractions = this.recruiterInteractions.filter(i => i.recruiterId !== id);
            this.saveData('recruiters', this.recruiters);
            this.saveData('recruiterInteractions', this.recruiterInteractions);
            this.renderRecruiters();
            this.renderRecruiterInteractions();
            this.updateRecruiterAnalytics();
            toast.show('Recruiter deleted successfully', 'success');
        }
    }

    // ==================== US-045: Recruiter Interactions ====================
    setupRecruiterInteractionModal() {
        const form = document.getElementById('recruiter-interaction-form');
        const addBtn = document.getElementById('add-recruiter-interaction-btn');
        const closeBtn = document.getElementById('close-recruiter-interaction-modal');
        const cancelBtn = document.getElementById('cancel-recruiter-interaction-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openRecruiterInteractionModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeRecruiterInteractionModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeRecruiterInteractionModal());
        if (form) form.addEventListener('submit', (e) => this.handleRecruiterInteractionSubmit(e));
    }

    openRecruiterInteractionModal(interactionId = null) {
        const modal = document.getElementById('recruiter-interaction-modal');
        const form = document.getElementById('recruiter-interaction-form');
        const title = document.getElementById('recruiter-interaction-modal-title');
        const recruiterSelect = document.getElementById('interaction-recruiter-select');
        
        if (recruiterSelect) {
            recruiterSelect.innerHTML = '<option value="">Select recruiter...</option>' +
                this.recruiters.map(r => `<option value="${r.id}">${this.escapeHtml(r.name)}</option>`).join('');
        }

        if (interactionId) {
            const interaction = this.recruiterInteractions.find(i => i.id === interactionId);
            title.textContent = 'Edit Recruiter Interaction';
            document.getElementById('recruiter-interaction-id').value = interactionId;
            if (recruiterSelect) recruiterSelect.value = interaction.recruiterId || '';
            document.getElementById('interaction-date').value = interaction.date || '';
            document.getElementById('interaction-type').value = interaction.type || 'email';
            document.getElementById('interaction-summary').value = interaction.summary || '';
            document.getElementById('interaction-outcome').value = interaction.outcome || '';
            document.getElementById('interaction-next-steps').value = interaction.nextSteps || '';
        } else {
            title.textContent = 'Log Recruiter Interaction';
            form.reset();
            document.getElementById('recruiter-interaction-id').value = '';
            document.getElementById('interaction-date').value = new Date().toISOString().split('T')[0];
        }
        modal.style.display = 'block';
    }

    closeRecruiterInteractionModal() {
        document.getElementById('recruiter-interaction-modal').style.display = 'none';
    }

    handleRecruiterInteractionSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('recruiter-interaction-id').value;
        const interaction = {
            id: id || this.generateId(),
            recruiterId: document.getElementById('interaction-recruiter-select').value,
            date: document.getElementById('interaction-date').value,
            type: document.getElementById('interaction-type').value,
            summary: document.getElementById('interaction-summary').value.trim(),
            outcome: document.getElementById('interaction-outcome').value.trim(),
            nextSteps: document.getElementById('interaction-next-steps').value.trim(),
            createdAt: id ? this.recruiterInteractions.find(i => i.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.recruiterInteractions.findIndex(i => i.id === id);
            if (index !== -1) this.recruiterInteractions[index] = interaction;
        } else {
            this.recruiterInteractions.unshift(interaction);
        }

        this.saveData('recruiterInteractions', this.recruiterInteractions);
        this.renderRecruiterInteractions();
        this.updateRecruiterAnalytics();
        this.closeRecruiterInteractionModal();
        toast.show(`Interaction ${id ? 'updated' : 'logged'} successfully!`, 'success');
    }

    renderRecruiterInteractions() {
        const container = document.getElementById('recruiter-interactions-list');
        const empty = document.getElementById('recruiter-interactions-empty');
        const filterSelect = document.getElementById('interaction-recruiter-select');
        if (!container) return;

        let filteredInteractions = this.recruiterInteractions;
        if (filterSelect && filterSelect.value) {
            filteredInteractions = this.recruiterInteractions.filter(i => i.recruiterId === filterSelect.value);
        }

        // Update filter dropdown
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">All Recruiters</option>' +
                this.recruiters.map(r => `<option value="${r.id}">${this.escapeHtml(r.name)}</option>`).join('');
            filterSelect.addEventListener('change', () => this.renderRecruiterInteractions());
        }

        if (filteredInteractions.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = filteredInteractions.map(interaction => {
            const recruiter = this.recruiters.find(r => r.id === interaction.recruiterId);
            return `
                <div class="data-card">
                    <div class="data-card-header">
                        <h4 class="data-card-title">${recruiter ? this.escapeHtml(recruiter.name) : 'Unknown Recruiter'} - ${this.escapeHtml(interaction.type)}</h4>
                        <div class="data-card-actions">
                            <button class="btn btn-small btn-secondary" onclick="tracker.openRecruiterInteractionModal('${interaction.id}')">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="tracker.deleteRecruiterInteraction('${interaction.id}')">Delete</button>
                        </div>
                    </div>
                    <div class="data-card-body">
                        <p><strong>Date:</strong> ${new Date(interaction.date).toLocaleDateString()}</p>
                        <p><strong>Summary:</strong> ${this.escapeHtml(interaction.summary)}</p>
                        ${interaction.outcome ? `<p><strong>Outcome:</strong> ${this.escapeHtml(interaction.outcome)}</p>` : ''}
                        ${interaction.nextSteps ? `<p><strong>Next Steps:</strong> ${this.escapeHtml(interaction.nextSteps)}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    deleteRecruiterInteraction(id) {
        if (confirm('Are you sure you want to delete this interaction?')) {
            this.recruiterInteractions = this.recruiterInteractions.filter(i => i.id !== id);
            this.saveData('recruiterInteractions', this.recruiterInteractions);
            this.renderRecruiterInteractions();
            this.updateRecruiterAnalytics();
            toast.show('Interaction deleted successfully', 'success');
        }
    }

    // ==================== US-046: Hiring Manager Contacts ====================
    setupHiringManagerModal() {
        const form = document.getElementById('hiring-manager-form');
        const addBtn = document.getElementById('add-hiring-manager-btn');
        const closeBtn = document.getElementById('close-hiring-manager-modal');
        const cancelBtn = document.getElementById('cancel-hiring-manager-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openHiringManagerModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeHiringManagerModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeHiringManagerModal());
        if (form) form.addEventListener('submit', (e) => this.handleHiringManagerSubmit(e));
    }

    openHiringManagerModal(managerId = null) {
        const modal = document.getElementById('hiring-manager-modal');
        const form = document.getElementById('hiring-manager-form');
        const title = document.getElementById('hiring-manager-modal-title');
        
        if (managerId) {
            const manager = this.hiringManagers.find(m => m.id === managerId);
            title.textContent = 'Edit Hiring Manager';
            document.getElementById('hiring-manager-id').value = managerId;
            document.getElementById('hm-name').value = manager.name || '';
            document.getElementById('hm-title').value = manager.title || '';
            document.getElementById('hm-company').value = manager.company || '';
            document.getElementById('hm-email').value = manager.email || '';
            document.getElementById('hm-linkedin').value = manager.linkedin || '';
            document.getElementById('hm-department').value = manager.department || '';
            document.getElementById('hm-location').value = manager.location || '';
            document.getElementById('hm-category').value = manager.category || 'hiring-manager';
        } else {
            title.textContent = 'Add Hiring Manager';
            form.reset();
            document.getElementById('hiring-manager-id').value = '';
        }
        modal.style.display = 'block';
    }

    closeHiringManagerModal() {
        document.getElementById('hiring-manager-modal').style.display = 'none';
    }

    handleHiringManagerSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('hiring-manager-id').value;
        const manager = {
            id: id || this.generateId(),
            name: document.getElementById('hm-name').value.trim(),
            title: document.getElementById('hm-title').value.trim(),
            company: document.getElementById('hm-company').value.trim(),
            email: document.getElementById('hm-email').value.trim(),
            linkedin: document.getElementById('hm-linkedin').value.trim(),
            department: document.getElementById('hm-department').value.trim(),
            location: document.getElementById('hm-location').value.trim(),
            category: document.getElementById('hm-category').value,
            createdAt: id ? this.hiringManagers.find(m => m.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.hiringManagers.findIndex(m => m.id === id);
            if (index !== -1) this.hiringManagers[index] = manager;
        } else {
            this.hiringManagers.unshift(manager);
        }

        this.saveData('hiringManagers', this.hiringManagers);
        this.renderHiringManagers();
        this.closeHiringManagerModal();
        toast.show(`Hiring manager ${id ? 'updated' : 'added'} successfully!`, 'success');
    }

    renderHiringManagers() {
        const container = document.getElementById('hiring-managers-list');
        const empty = document.getElementById('hiring-managers-empty');
        if (!container) return;

        if (this.hiringManagers.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.hiringManagers.map(manager => `
            <div class="data-card">
                <div class="data-card-header">
                    <h4 class="data-card-title">${this.escapeHtml(manager.name)}</h4>
                    <div class="data-card-actions">
                        <button class="btn btn-small btn-secondary" onclick="tracker.openHiringManagerModal('${manager.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="tracker.deleteHiringManager('${manager.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-card-body">
                    <p><strong>Category:</strong> ${this.escapeHtml(manager.category)}</p>
                    ${manager.title ? `<p><strong>Title:</strong> ${this.escapeHtml(manager.title)}</p>` : ''}
                    ${manager.company ? `<p><strong>Company:</strong> ${this.escapeHtml(manager.company)}</p>` : ''}
                    ${manager.email ? `<p><strong>Email:</strong> <a href="mailto:${this.escapeHtml(manager.email)}">${this.escapeHtml(manager.email)}</a></p>` : ''}
                    ${manager.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${this.escapeHtml(manager.linkedin)}" target="_blank">View Profile</a></p>` : ''}
                    ${manager.department ? `<p><strong>Department:</strong> ${this.escapeHtml(manager.department)}</p>` : ''}
                    ${manager.location ? `<p><strong>Location:</strong> ${this.escapeHtml(manager.location)}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    deleteHiringManager(id) {
        if (confirm('Are you sure you want to delete this hiring manager?')) {
            this.hiringManagers = this.hiringManagers.filter(m => m.id !== id);
            this.saveData('hiringManagers', this.hiringManagers);
            this.renderHiringManagers();
            toast.show('Hiring manager deleted successfully', 'success');
        }
    }

    // ==================== US-047: Networking Activities ====================
    setupNetworkingActivityModal() {
        const form = document.getElementById('networking-activity-form');
        const addBtn = document.getElementById('add-networking-activity-btn');
        const closeBtn = document.getElementById('close-networking-activity-modal');
        const cancelBtn = document.getElementById('cancel-networking-activity-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openNetworkingActivityModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeNetworkingActivityModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeNetworkingActivityModal());
        if (form) form.addEventListener('submit', (e) => this.handleNetworkingActivitySubmit(e));
    }

    openNetworkingActivityModal(activityId = null) {
        const modal = document.getElementById('networking-activity-modal');
        const form = document.getElementById('networking-activity-form');
        const title = document.getElementById('networking-activity-modal-title');
        
        if (activityId) {
            const activity = this.networkingActivities.find(a => a.id === activityId);
            title.textContent = 'Edit Networking Activity';
            document.getElementById('networking-activity-id').value = activityId;
            document.getElementById('networking-date').value = activity.date || '';
            document.getElementById('networking-contact').value = activity.contact || '';
            document.getElementById('networking-type').value = activity.type || '';
            document.getElementById('networking-topic').value = activity.topic || '';
            document.getElementById('networking-outcome').value = activity.outcome || '';
            document.getElementById('networking-follow-up').value = activity.followUp || '';
        } else {
            title.textContent = 'Log Networking Activity';
            form.reset();
            document.getElementById('networking-activity-id').value = '';
            document.getElementById('networking-date').value = new Date().toISOString().split('T')[0];
        }
        modal.style.display = 'block';
    }

    closeNetworkingActivityModal() {
        document.getElementById('networking-activity-modal').style.display = 'none';
    }

    handleNetworkingActivitySubmit(e) {
        e.preventDefault();
        const id = document.getElementById('networking-activity-id').value;
        const activity = {
            id: id || this.generateId(),
            date: document.getElementById('networking-date').value,
            contact: document.getElementById('networking-contact').value.trim(),
            type: document.getElementById('networking-type').value,
            topic: document.getElementById('networking-topic').value.trim(),
            outcome: document.getElementById('networking-outcome').value.trim(),
            followUp: document.getElementById('networking-follow-up').value.trim(),
            createdAt: id ? this.networkingActivities.find(a => a.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.networkingActivities.findIndex(a => a.id === id);
            if (index !== -1) this.networkingActivities[index] = activity;
        } else {
            this.networkingActivities.unshift(activity);
        }

        this.saveData('networkingActivities', this.networkingActivities);
        this.renderNetworkingActivities();
        this.closeNetworkingActivityModal();
        toast.show(`Networking activity ${id ? 'updated' : 'logged'} successfully!`, 'success');
    }

    renderNetworkingActivities() {
        const container = document.getElementById('networking-activities-list');
        const empty = document.getElementById('networking-activities-empty');
        if (!container) return;

        if (this.networkingActivities.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.networkingActivities.map(activity => `
            <div class="data-card">
                <div class="data-card-header">
                    <h4 class="data-card-title">${this.escapeHtml(activity.type)} - ${activity.contact ? this.escapeHtml(activity.contact) : 'Unknown Contact'}</h4>
                    <div class="data-card-actions">
                        <button class="btn btn-small btn-secondary" onclick="tracker.openNetworkingActivityModal('${activity.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="tracker.deleteNetworkingActivity('${activity.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-card-body">
                    <p><strong>Date:</strong> ${new Date(activity.date).toLocaleDateString()}</p>
                    ${activity.topic ? `<p><strong>Topic:</strong> ${this.escapeHtml(activity.topic)}</p>` : ''}
                    ${activity.outcome ? `<p><strong>Outcome:</strong> ${this.escapeHtml(activity.outcome)}</p>` : ''}
                    ${activity.followUp ? `<p><strong>Follow-up Needed:</strong> ${this.escapeHtml(activity.followUp)}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    deleteNetworkingActivity(id) {
        if (confirm('Are you sure you want to delete this networking activity?')) {
            this.networkingActivities = this.networkingActivities.filter(a => a.id !== id);
            this.saveData('networkingActivities', this.networkingActivities);
            this.renderNetworkingActivities();
            toast.show('Networking activity deleted successfully', 'success');
        }
    }

    // ==================== US-048 & US-049: AI Job Adviser ====================
    renderAITasks() {
        const container = document.getElementById('ai-tasks-list');
        const empty = document.getElementById('ai-adviser-empty');
        if (!container) return;

        if (this.aiTasks.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.aiTasks.map(task => `
            <div class="task-item ${task.status === 'completed' ? 'completed' : ''}">
                <div class="task-item-header">
                    <h4 class="task-item-title">${this.escapeHtml(task.title)}</h4>
                    <span class="task-item-status ${task.status}">${task.status}</span>
                </div>
                <div class="task-item-description">${this.escapeHtml(task.description)}</div>
                ${task.subtasks && task.subtasks.length > 0 ? `
                    <div class="task-item-subtasks">
                        ${task.subtasks.map((st, idx) => `
                            <div class="subtask-item">
                                <input type="checkbox" ${st.completed ? 'checked' : ''} 
                                       onchange="tracker.toggleSubtask('${task.id}', ${idx})">
                                <span ${st.completed ? 'style="text-decoration: line-through;"' : ''}>${this.escapeHtml(st.text)}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="data-card-actions" style="margin-top: 10px;">
                    <button class="btn btn-small btn-secondary" onclick="tracker.toggleTaskStatus('${task.id}')">
                        ${task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    <button class="btn btn-small btn-danger" onclick="tracker.deleteAITask('${task.id}')">Delete</button>
                </div>
            </div>
        `).join('');

        // Generate AI guidance
        this.generateAIGuidance();
    }

    generateAIGuidance() {
        const guidanceEl = document.getElementById('ai-guidance-text');
        if (!guidanceEl) return;

        const totalApps = this.applications.length;
        const acceptedApps = this.applications.filter(a => a.status === 'accepted').length;
        const interviewApps = this.applications.filter(a => a.status === 'interview').length;
        const successRate = totalApps > 0 ? ((acceptedApps / totalApps) * 100).toFixed(1) : 0;

        let guidance = `Based on your application history:\n\n`;
        guidance += `• Total Applications: ${totalApps}\n`;
        guidance += `• Success Rate: ${successRate}%\n`;
        guidance += `• Interviews Secured: ${interviewApps}\n\n`;

        if (totalApps === 0) {
            guidance += `Start by applying to jobs that match your profile. Focus on quality over quantity.\n`;
        } else if (successRate < 10) {
            guidance += `Your success rate is low. Consider:\n`;
            guidance += `- Reviewing and improving your resume\n`;
            guidance += `- Tailoring cover letters to each position\n`;
            guidance += `- Following up on applications\n`;
        } else if (interviewApps === 0) {
            guidance += `You're getting applications in but no interviews yet. Consider:\n`;
            guidance += `- Enhancing your LinkedIn profile\n`;
            guidance += `- Networking with recruiters\n`;
            guidance += `- Improving application quality\n`;
        } else {
            guidance += `Great progress! You're securing interviews. Focus on:\n`;
            guidance += `- Interview preparation\n`;
            guidance += `- Following up after interviews\n`;
            guidance += `- Building relationships with recruiters\n`;
        }

        guidanceEl.textContent = guidance;
    }

    toggleTaskStatus(taskId) {
        const task = this.aiTasks.find(t => t.id === taskId);
        if (task) {
            task.status = task.status === 'completed' ? 'pending' : 'completed';
            this.saveData('aiTasks', this.aiTasks);
            this.renderAITasks();
        }
    }

    toggleSubtask(taskId, subtaskIndex) {
        const task = this.aiTasks.find(t => t.id === taskId);
        if (task && task.subtasks && task.subtasks[subtaskIndex]) {
            task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
            this.saveData('aiTasks', this.aiTasks);
            this.renderAITasks();
        }
    }

    deleteAITask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.aiTasks = this.aiTasks.filter(t => t.id !== taskId);
            this.saveData('aiTasks', this.aiTasks);
            this.renderAITasks();
            toast.show('Task deleted successfully', 'success');
        }
    }

    generateAITasks() {
        const tasks = [
            {
                id: this.generateId(),
                title: 'Apply to 5 New Positions',
                description: 'Focus on positions that match your skills and experience',
                status: 'pending',
                strategy: 'Application Strategy',
                subtasks: [
                    { text: 'Review suggested jobs', completed: false },
                    { text: 'Tailor resume for each position', completed: false },
                    { text: 'Write personalized cover letters', completed: false },
                    { text: 'Submit applications', completed: false },
                    { text: 'Track applications in system', completed: false }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: 'Connect with 3 New Recruiters',
                description: 'Build your network by connecting with recruiters in your field',
                status: 'pending',
                strategy: 'Networking Strategy',
                subtasks: [
                    { text: 'Research recruiters in your industry', completed: false },
                    { text: 'Send personalized connection requests', completed: false },
                    { text: 'Follow up with a brief introduction', completed: false }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: 'Publish 1 LinkedIn Article',
                description: 'Share your expertise and build your personal brand',
                status: 'pending',
                strategy: 'LinkedIn Strategy',
                subtasks: [
                    { text: 'Choose a relevant topic', completed: false },
                    { text: 'Write the article', completed: false },
                    { text: 'Add relevant images/visuals', completed: false },
                    { text: 'Publish and engage with comments', completed: false }
                ],
                createdAt: new Date().toISOString()
            }
        ];

        this.aiTasks = [...this.aiTasks, ...tasks];
        this.saveData('aiTasks', this.aiTasks);
        this.renderAITasks();
        toast.show('AI tasks generated successfully!', 'success');
    }

    // ==================== US-050: Recruiter Analytics ====================
    updateRecruiterAnalytics() {
        // Top performing recruiters
        const recruiterStats = {};
        this.recruiterInteractions.forEach(interaction => {
            if (!interaction.recruiterId) return;
            if (!recruiterStats[interaction.recruiterId]) {
                recruiterStats[interaction.recruiterId] = {
                    interactions: 0,
                    applications: 0,
                    interviews: 0
                };
            }
            recruiterStats[interaction.recruiterId].interactions++;
        });

        // Link to applications
        this.applications.forEach(app => {
            // This would require linking applications to recruiters, simplified here
        });

        const topRecruitersChart = document.getElementById('top-recruiters-chart');
        if (topRecruitersChart) {
            const sorted = Object.entries(recruiterStats)
                .sort((a, b) => b[1].interactions - a[1].interactions)
                .slice(0, 5);

            topRecruitersChart.innerHTML = sorted.length === 0
                ? '<p style="color: #999; font-style: italic;">No recruiter data available</p>'
                : sorted.map(([recruiterId, stats]) => {
                    const recruiter = this.recruiters.find(r => r.id === recruiterId);
                    return `
                        <div style="margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span><strong>${recruiter ? this.escapeHtml(recruiter.name) : 'Unknown'}</strong></span>
                                <span>${stats.interactions} interactions</span>
                            </div>
                        </div>
                    `;
                }).join('');
        }
    }

    // ==================== Strategy 3: LinkedIn Presence & Personal Branding ====================
    
    // ==================== US-051: Content Planning ====================
    setupContentIdeaModal() {
        const form = document.getElementById('content-idea-form');
        const addBtn = document.getElementById('add-content-idea-btn');
        const closeBtn = document.getElementById('close-content-idea-modal');
        const cancelBtn = document.getElementById('cancel-content-idea-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openContentIdeaModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeContentIdeaModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeContentIdeaModal());
        if (form) form.addEventListener('submit', (e) => this.handleContentIdeaSubmit(e));
    }

    openContentIdeaModal(ideaId = null) {
        const modal = document.getElementById('content-idea-modal');
        const form = document.getElementById('content-idea-form');
        const title = document.getElementById('content-idea-modal-title');
        
        if (ideaId) {
            const idea = this.contentIdeas.find(i => i.id === ideaId);
            title.textContent = 'Edit Content Idea';
            document.getElementById('content-idea-id').value = ideaId;
            document.getElementById('content-title').value = idea.title || '';
            document.getElementById('content-topic').value = idea.topic || '';
            document.getElementById('content-type').value = idea.type || 'post';
            document.getElementById('content-target-audience').value = idea.targetAudience || '';
            document.getElementById('content-draft').value = idea.draft || '';
            document.getElementById('content-publish-date').value = idea.publishDate || '';
            document.getElementById('content-status').value = idea.status || 'draft';
        } else {
            title.textContent = 'Add Content Idea';
            form.reset();
            document.getElementById('content-idea-id').value = '';
            document.getElementById('content-status').value = 'draft';
        }
        modal.style.display = 'block';
    }

    closeContentIdeaModal() {
        document.getElementById('content-idea-modal').style.display = 'none';
    }

    handleContentIdeaSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('content-idea-id').value;
        const idea = {
            id: id || this.generateId(),
            title: document.getElementById('content-title').value.trim(),
            topic: document.getElementById('content-topic').value.trim(),
            type: document.getElementById('content-type').value,
            targetAudience: document.getElementById('content-target-audience').value.trim(),
            draft: document.getElementById('content-draft').value.trim(),
            publishDate: document.getElementById('content-publish-date').value,
            status: document.getElementById('content-status').value,
            createdAt: id ? this.contentIdeas.find(i => i.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.contentIdeas.findIndex(i => i.id === id);
            if (index !== -1) this.contentIdeas[index] = idea;
        } else {
            this.contentIdeas.unshift(idea);
        }

        this.saveData('contentIdeas', this.contentIdeas);
        this.renderContentIdeas();
        this.updateEngagementAnalytics();
        this.closeContentIdeaModal();
        toast.show(`Content idea ${id ? 'updated' : 'added'} successfully!`, 'success');
    }

    renderContentIdeas() {
        const container = document.getElementById('content-ideas-list');
        const empty = document.getElementById('content-ideas-empty');
        if (!container) return;

        if (this.contentIdeas.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.contentIdeas.map(idea => `
            <div class="data-card">
                <div class="data-card-header">
                    <h4 class="data-card-title">${this.escapeHtml(idea.title)}</h4>
                    <div class="data-card-actions">
                        <button class="btn btn-small btn-secondary" onclick="tracker.openContentIdeaModal('${idea.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="tracker.deleteContentIdea('${idea.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-card-body">
                    <p><strong>Type:</strong> ${this.escapeHtml(idea.type)} | <strong>Status:</strong> ${this.escapeHtml(idea.status)}</p>
                    ${idea.topic ? `<p><strong>Topic:</strong> ${this.escapeHtml(idea.topic)}</p>` : ''}
                    ${idea.targetAudience ? `<p><strong>Target Audience:</strong> ${this.escapeHtml(idea.targetAudience)}</p>` : ''}
                    ${idea.publishDate ? `<p><strong>Publish Date:</strong> ${new Date(idea.publishDate).toLocaleDateString()}</p>` : ''}
                    ${idea.draft ? `<p><strong>Draft:</strong> ${this.escapeHtml(idea.draft.substring(0, 200))}${idea.draft.length > 200 ? '...' : ''}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    deleteContentIdea(id) {
        if (confirm('Are you sure you want to delete this content idea?')) {
            this.contentIdeas = this.contentIdeas.filter(i => i.id !== id);
            this.saveData('contentIdeas', this.contentIdeas);
            this.renderContentIdeas();
            this.updateEngagementAnalytics();
            toast.show('Content idea deleted successfully', 'success');
        }
    }

    // ==================== US-052: LinkedIn Activity Tracking ====================
    setupLinkedInActivityModal() {
        const form = document.getElementById('linkedin-activity-form');
        const addBtn = document.getElementById('add-linkedin-activity-btn');
        const closeBtn = document.getElementById('close-linkedin-activity-modal');
        const cancelBtn = document.getElementById('cancel-linkedin-activity-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openLinkedInActivityModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeLinkedInActivityModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeLinkedInActivityModal());
        if (form) form.addEventListener('submit', (e) => this.handleLinkedInActivitySubmit(e));
    }

    openLinkedInActivityModal(activityId = null) {
        const modal = document.getElementById('linkedin-activity-modal');
        const form = document.getElementById('linkedin-activity-form');
        const title = document.getElementById('linkedin-activity-modal-title');
        
        if (activityId) {
            const activity = this.linkedinActivities.find(a => a.id === activityId);
            title.textContent = 'Edit LinkedIn Activity';
            document.getElementById('linkedin-activity-id').value = activityId;
            document.getElementById('linkedin-activity-date').value = activity.date || '';
            document.getElementById('linkedin-activity-type').value = activity.type || 'post';
            document.getElementById('linkedin-activity-summary').value = activity.summary || '';
            document.getElementById('linkedin-activity-link').value = activity.link || '';
            document.getElementById('linkedin-activity-views').value = activity.views || 0;
            document.getElementById('linkedin-activity-likes').value = activity.likes || 0;
            document.getElementById('linkedin-activity-comments').value = activity.comments || 0;
        } else {
            title.textContent = 'Log LinkedIn Activity';
            form.reset();
            document.getElementById('linkedin-activity-id').value = '';
            document.getElementById('linkedin-activity-date').value = new Date().toISOString().split('T')[0];
        }
        modal.style.display = 'block';
    }

    closeLinkedInActivityModal() {
        document.getElementById('linkedin-activity-modal').style.display = 'none';
    }

    handleLinkedInActivitySubmit(e) {
        e.preventDefault();
        const id = document.getElementById('linkedin-activity-id').value;
        const activity = {
            id: id || this.generateId(),
            date: document.getElementById('linkedin-activity-date').value,
            type: document.getElementById('linkedin-activity-type').value,
            summary: document.getElementById('linkedin-activity-summary').value.trim(),
            link: document.getElementById('linkedin-activity-link').value.trim(),
            views: parseInt(document.getElementById('linkedin-activity-views').value) || 0,
            likes: parseInt(document.getElementById('linkedin-activity-likes').value) || 0,
            comments: parseInt(document.getElementById('linkedin-activity-comments').value) || 0,
            createdAt: id ? this.linkedinActivities.find(a => a.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.linkedinActivities.findIndex(a => a.id === id);
            if (index !== -1) this.linkedinActivities[index] = activity;
        } else {
            this.linkedinActivities.unshift(activity);
        }

        this.saveData('linkedinActivities', this.linkedinActivities);
        this.renderLinkedInActivities();
        this.updateEngagementAnalytics();
        this.closeLinkedInActivityModal();
        toast.show(`LinkedIn activity ${id ? 'updated' : 'logged'} successfully!`, 'success');
    }

    renderLinkedInActivities() {
        const container = document.getElementById('linkedin-activities-list');
        const empty = document.getElementById('linkedin-activities-empty');
        if (!container) return;

        if (this.linkedinActivities.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.linkedinActivities.map(activity => `
            <div class="data-card">
                <div class="data-card-header">
                    <h4 class="data-card-title">${this.escapeHtml(activity.type)} - ${new Date(activity.date).toLocaleDateString()}</h4>
                    <div class="data-card-actions">
                        <button class="btn btn-small btn-secondary" onclick="tracker.openLinkedInActivityModal('${activity.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="tracker.deleteLinkedInActivity('${activity.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-card-body">
                    ${activity.summary ? `<p><strong>Summary:</strong> ${this.escapeHtml(activity.summary)}</p>` : ''}
                    <p><strong>Engagement:</strong> ${activity.views} views, ${activity.likes} likes, ${activity.comments} comments</p>
                    ${activity.link ? `<p><strong>Link:</strong> <a href="${this.escapeHtml(activity.link)}" target="_blank">View Post</a></p>` : ''}
                </div>
            </div>
        `).join('');
    }

    deleteLinkedInActivity(id) {
        if (confirm('Are you sure you want to delete this LinkedIn activity?')) {
            this.linkedinActivities = this.linkedinActivities.filter(a => a.id !== id);
            this.saveData('linkedinActivities', this.linkedinActivities);
            this.renderLinkedInActivities();
            this.updateEngagementAnalytics();
            toast.show('LinkedIn activity deleted successfully', 'success');
        }
    }

    // ==================== US-053: Portfolio Management ====================
    setupPortfolioItemModal() {
        const form = document.getElementById('portfolio-item-form');
        const addBtn = document.getElementById('add-portfolio-item-btn');
        const closeBtn = document.getElementById('close-portfolio-item-modal');
        const cancelBtn = document.getElementById('cancel-portfolio-item-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openPortfolioItemModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closePortfolioItemModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closePortfolioItemModal());
        if (form) form.addEventListener('submit', (e) => this.handlePortfolioItemSubmit(e));
    }

    openPortfolioItemModal(itemId = null) {
        const modal = document.getElementById('portfolio-item-modal');
        const form = document.getElementById('portfolio-item-form');
        const title = document.getElementById('portfolio-item-modal-title');
        
        if (itemId) {
            const item = this.portfolioItems.find(i => i.id === itemId);
            title.textContent = 'Edit Portfolio Item';
            document.getElementById('portfolio-item-id').value = itemId;
            document.getElementById('portfolio-title').value = item.title || '';
            document.getElementById('portfolio-description').value = item.description || '';
            document.getElementById('portfolio-type').value = item.type || 'project';
            document.getElementById('portfolio-date').value = item.date || '';
            document.getElementById('portfolio-linkedin-link').value = item.linkedinLink || '';
            document.getElementById('portfolio-status').value = item.status || 'draft';
        } else {
            title.textContent = 'Add Portfolio Item';
            form.reset();
            document.getElementById('portfolio-item-id').value = '';
            document.getElementById('portfolio-status').value = 'draft';
        }
        modal.style.display = 'block';
    }

    closePortfolioItemModal() {
        document.getElementById('portfolio-item-modal').style.display = 'none';
    }

    handlePortfolioItemSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('portfolio-item-id').value;
        const item = {
            id: id || this.generateId(),
            title: document.getElementById('portfolio-title').value.trim(),
            description: document.getElementById('portfolio-description').value.trim(),
            type: document.getElementById('portfolio-type').value,
            date: document.getElementById('portfolio-date').value,
            linkedinLink: document.getElementById('portfolio-linkedin-link').value.trim(),
            status: document.getElementById('portfolio-status').value,
            createdAt: id ? this.portfolioItems.find(i => i.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.portfolioItems.findIndex(i => i.id === id);
            if (index !== -1) this.portfolioItems[index] = item;
        } else {
            this.portfolioItems.unshift(item);
        }

        this.saveData('portfolioItems', this.portfolioItems);
        this.renderPortfolioItems();
        this.closePortfolioItemModal();
        toast.show(`Portfolio item ${id ? 'updated' : 'added'} successfully!`, 'success');
    }

    renderPortfolioItems() {
        const container = document.getElementById('portfolio-items-list');
        const empty = document.getElementById('portfolio-items-empty');
        if (!container) return;

        if (this.portfolioItems.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.portfolioItems.map(item => `
            <div class="data-card">
                <div class="data-card-header">
                    <h4 class="data-card-title">${this.escapeHtml(item.title)}</h4>
                    <div class="data-card-actions">
                        <button class="btn btn-small btn-secondary" onclick="tracker.openPortfolioItemModal('${item.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="tracker.deletePortfolioItem('${item.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-card-body">
                    <p><strong>Type:</strong> ${this.escapeHtml(item.type)} | <strong>Status:</strong> ${this.escapeHtml(item.status)}</p>
                    ${item.date ? `<p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>` : ''}
                    ${item.description ? `<p><strong>Description:</strong> ${this.escapeHtml(item.description)}</p>` : ''}
                    ${item.linkedinLink ? `<p><strong>LinkedIn:</strong> <a href="${this.escapeHtml(item.linkedinLink)}" target="_blank">View Post</a></p>` : ''}
                </div>
            </div>
        `).join('');
    }

    deletePortfolioItem(id) {
        if (confirm('Are you sure you want to delete this portfolio item?')) {
            this.portfolioItems = this.portfolioItems.filter(i => i.id !== id);
            this.saveData('portfolioItems', this.portfolioItems);
            this.renderPortfolioItems();
            toast.show('Portfolio item deleted successfully', 'success');
        }
    }

    // ==================== US-054: Profile Views ====================
    setupProfileViewModal() {
        const form = document.getElementById('profile-view-form');
        const addBtn = document.getElementById('add-profile-view-btn');
        const closeBtn = document.getElementById('close-profile-view-modal');
        const cancelBtn = document.getElementById('cancel-profile-view-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openProfileViewModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeProfileViewModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeProfileViewModal());
        if (form) form.addEventListener('submit', (e) => this.handleProfileViewSubmit(e));
    }

    openProfileViewModal(viewId = null) {
        const modal = document.getElementById('profile-view-modal');
        const form = document.getElementById('profile-view-form');
        const title = document.getElementById('profile-view-modal-title');
        
        if (viewId) {
            const view = this.profileViews.find(v => v.id === viewId);
            title.textContent = 'Edit Profile View';
            document.getElementById('profile-view-id').value = viewId;
            document.getElementById('profile-viewer-name').value = view.viewerName || '';
            document.getElementById('profile-viewer-company').value = view.viewerCompany || '';
            document.getElementById('profile-viewer-title').value = view.viewerTitle || '';
            document.getElementById('profile-view-date').value = view.date || '';
            document.getElementById('profile-view-source').value = view.source || '';
            document.getElementById('profile-view-follow-up').value = view.followUp || '';
        } else {
            title.textContent = 'Log Profile View';
            form.reset();
            document.getElementById('profile-view-id').value = '';
            document.getElementById('profile-view-date').value = new Date().toISOString().split('T')[0];
        }
        modal.style.display = 'block';
    }

    closeProfileViewModal() {
        document.getElementById('profile-view-modal').style.display = 'none';
    }

    handleProfileViewSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('profile-view-id').value;
        const view = {
            id: id || this.generateId(),
            viewerName: document.getElementById('profile-viewer-name').value.trim(),
            viewerCompany: document.getElementById('profile-viewer-company').value.trim(),
            viewerTitle: document.getElementById('profile-viewer-title').value.trim(),
            date: document.getElementById('profile-view-date').value,
            source: document.getElementById('profile-view-source').value.trim(),
            followUp: document.getElementById('profile-view-follow-up').value.trim(),
            createdAt: id ? this.profileViews.find(v => v.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.profileViews.findIndex(v => v.id === id);
            if (index !== -1) this.profileViews[index] = view;
        } else {
            this.profileViews.unshift(view);
        }

        this.saveData('profileViews', this.profileViews);
        this.renderProfileViews();
        this.updateEngagementAnalytics();
        this.closeProfileViewModal();
        toast.show(`Profile view ${id ? 'updated' : 'logged'} successfully!`, 'success');
    }

    renderProfileViews() {
        const container = document.getElementById('profile-views-list');
        const empty = document.getElementById('profile-views-empty');
        if (!container) return;

        if (this.profileViews.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.profileViews.map(view => `
            <div class="data-card">
                <div class="data-card-header">
                    <h4 class="data-card-title">${view.viewerName || 'Unknown Viewer'}</h4>
                    <div class="data-card-actions">
                        <button class="btn btn-small btn-secondary" onclick="tracker.openProfileViewModal('${view.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="tracker.deleteProfileView('${view.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-card-body">
                    ${view.viewerCompany ? `<p><strong>Company:</strong> ${this.escapeHtml(view.viewerCompany)}</p>` : ''}
                    ${view.viewerTitle ? `<p><strong>Title:</strong> ${this.escapeHtml(view.viewerTitle)}</p>` : ''}
                    <p><strong>Date:</strong> ${new Date(view.date).toLocaleDateString()}</p>
                    ${view.source ? `<p><strong>Source:</strong> ${this.escapeHtml(view.source)}</p>` : ''}
                    ${view.followUp ? `<p><strong>Follow-up:</strong> ${this.escapeHtml(view.followUp)}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    deleteProfileView(id) {
        if (confirm('Are you sure you want to delete this profile view?')) {
            this.profileViews = this.profileViews.filter(v => v.id !== id);
            this.saveData('profileViews', this.profileViews);
            this.renderProfileViews();
            this.updateEngagementAnalytics();
            toast.show('Profile view deleted successfully', 'success');
        }
    }

    // ==================== US-055: Engagement Analytics ====================
    updateEngagementAnalytics() {
        const totalViews = this.linkedinActivities.reduce((sum, a) => sum + (a.views || 0), 0);
        const totalLikes = this.linkedinActivities.reduce((sum, a) => sum + (a.likes || 0), 0);
        const totalComments = this.linkedinActivities.reduce((sum, a) => sum + (a.comments || 0), 0);
        const totalShares = this.linkedinActivities.reduce((sum, a) => sum + (a.shares || 0), 0);

        const contentPerformance = document.getElementById('content-performance-chart');
        if (contentPerformance) {
            const topContent = [...this.linkedinActivities]
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 5);

            contentPerformance.innerHTML = topContent.length === 0
                ? '<p style="color: #999; font-style: italic;">No content data available</p>'
                : topContent.map(activity => `
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span><strong>${this.escapeHtml(activity.type)}</strong></span>
                            <span>${activity.views || 0} views</span>
                        </div>
                        <div style="background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden;">
                            <div style="background: var(--info-color); height: 100%; width: ${totalViews > 0 ? ((activity.views / totalViews) * 100) : 0}%;"></div>
                        </div>
                    </div>
                `).join('');
        }

        const engagementTrends = document.getElementById('engagement-trends-chart');
        if (engagementTrends) {
            engagementTrends.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <strong>Total Views:</strong> ${totalViews.toLocaleString()}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Total Likes:</strong> ${totalLikes.toLocaleString()}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Total Comments:</strong> ${totalComments.toLocaleString()}
                </div>
                <div>
                    <strong>Total Shares:</strong> ${totalShares.toLocaleString()}
                </div>
            `;
        }
    }

    // ==================== US-056: Content Calendar ====================
    renderContentCalendar() {
        const container = document.getElementById('content-calendar-view');
        const empty = document.getElementById('content-calendar-empty');
        if (!container) return;

        const scheduledContent = this.contentIdeas.filter(c => c.status === 'scheduled' && c.publishDate);
        if (scheduledContent.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        
        // Group by month
        const byMonth = {};
        scheduledContent.forEach(content => {
            const date = new Date(content.publishDate);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (!byMonth[monthKey]) byMonth[monthKey] = [];
            byMonth[monthKey].push(content);
        });

        container.innerHTML = Object.entries(byMonth).map(([monthKey, contents]) => {
            const date = new Date(contents[0].publishDate);
            return `
                <div class="calendar-month">
                    <div class="calendar-month-header">${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                    ${contents.map(content => `
                        <div class="data-card" style="margin-bottom: 10px;">
                            <strong>${this.escapeHtml(content.title)}</strong><br>
                            <small>${new Date(content.publishDate).toLocaleDateString()} - ${this.escapeHtml(content.type)}</small>
                        </div>
                    `).join('')}
                </div>
            `;
        }).join('');
    }

    // ==================== US-057: Inbound Opportunities ====================
    setupInboundOpportunityModal() {
        const form = document.getElementById('inbound-opportunity-form');
        const addBtn = document.getElementById('add-inbound-opportunity-btn');
        const closeBtn = document.getElementById('close-inbound-opportunity-modal');
        const cancelBtn = document.getElementById('cancel-inbound-opportunity-btn');

        if (addBtn) addBtn.addEventListener('click', () => this.openInboundOpportunityModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeInboundOpportunityModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeInboundOpportunityModal());
        if (form) form.addEventListener('submit', (e) => this.handleInboundOpportunitySubmit(e));
    }

    openInboundOpportunityModal(opportunityId = null) {
        const modal = document.getElementById('inbound-opportunity-modal');
        const form = document.getElementById('inbound-opportunity-form');
        const title = document.getElementById('inbound-opportunity-modal-title');
        
        if (opportunityId) {
            const opp = this.inboundOpportunities.find(o => o.id === opportunityId);
            title.textContent = 'Edit Inbound Opportunity';
            document.getElementById('inbound-opportunity-id').value = opportunityId;
            document.getElementById('inbound-company').value = opp.company || '';
            document.getElementById('inbound-contact-name').value = opp.contactName || '';
            document.getElementById('inbound-date').value = opp.date || '';
            document.getElementById('inbound-role').value = opp.role || '';
            document.getElementById('inbound-source').value = opp.source || 'linkedin-message';
            document.getElementById('inbound-status').value = opp.status || 'pending';
            document.getElementById('inbound-notes').value = opp.notes || '';
        } else {
            title.textContent = 'Log Inbound Opportunity';
            form.reset();
            document.getElementById('inbound-opportunity-id').value = '';
            document.getElementById('inbound-date').value = new Date().toISOString().split('T')[0];
            document.getElementById('inbound-status').value = 'pending';
        }
        modal.style.display = 'block';
    }

    closeInboundOpportunityModal() {
        document.getElementById('inbound-opportunity-modal').style.display = 'none';
    }

    handleInboundOpportunitySubmit(e) {
        e.preventDefault();
        const id = document.getElementById('inbound-opportunity-id').value;
        const opportunity = {
            id: id || this.generateId(),
            company: document.getElementById('inbound-company').value.trim(),
            contactName: document.getElementById('inbound-contact-name').value.trim(),
            date: document.getElementById('inbound-date').value,
            role: document.getElementById('inbound-role').value.trim(),
            source: document.getElementById('inbound-source').value,
            status: document.getElementById('inbound-status').value,
            notes: document.getElementById('inbound-notes').value.trim(),
            createdAt: id ? this.inboundOpportunities.find(o => o.id === id)?.createdAt : new Date().toISOString()
        };

        if (id) {
            const index = this.inboundOpportunities.findIndex(o => o.id === id);
            if (index !== -1) this.inboundOpportunities[index] = opportunity;
        } else {
            this.inboundOpportunities.unshift(opportunity);
        }

        this.saveData('inboundOpportunities', this.inboundOpportunities);
        this.renderInboundOpportunities();
        this.closeInboundOpportunityModal();
        toast.show(`Inbound opportunity ${id ? 'updated' : 'logged'} successfully!`, 'success');
    }

    renderInboundOpportunities() {
        const container = document.getElementById('inbound-opportunities-list');
        const empty = document.getElementById('inbound-opportunities-empty');
        if (!container) return;

        if (this.inboundOpportunities.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.inboundOpportunities.map(opp => `
            <div class="data-card">
                <div class="data-card-header">
                    <h4 class="data-card-title">${this.escapeHtml(opp.company)}</h4>
                    <div class="data-card-actions">
                        <button class="btn btn-small btn-secondary" onclick="tracker.openInboundOpportunityModal('${opp.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="tracker.deleteInboundOpportunity('${opp.id}')">Delete</button>
                    </div>
                </div>
                <div class="data-card-body">
                    ${opp.role ? `<p><strong>Role:</strong> ${this.escapeHtml(opp.role)}</p>` : ''}
                    ${opp.contactName ? `<p><strong>Contact:</strong> ${this.escapeHtml(opp.contactName)}</p>` : ''}
                    <p><strong>Date:</strong> ${new Date(opp.date).toLocaleDateString()}</p>
                    <p><strong>Source:</strong> ${this.escapeHtml(opp.source)}</p>
                    <p><strong>Status:</strong> ${this.escapeHtml(opp.status)}</p>
                    ${opp.notes ? `<p><strong>Notes:</strong> ${this.escapeHtml(opp.notes)}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    deleteInboundOpportunity(id) {
        if (confirm('Are you sure you want to delete this inbound opportunity?')) {
            this.inboundOpportunities = this.inboundOpportunities.filter(o => o.id !== id);
            this.saveData('inboundOpportunities', this.inboundOpportunities);
            this.renderInboundOpportunities();
            toast.show('Inbound opportunity deleted successfully', 'success');
        }
    }

    // ==================== US-058: Weekly LinkedIn Tasks ====================
    renderWeeklyTasks() {
        const container = document.getElementById('weekly-tasks-list');
        const empty = document.getElementById('weekly-tasks-empty');
        if (!container) return;

        if (this.weeklyTasks.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        container.innerHTML = this.weeklyTasks.map(task => `
            <div class="task-item ${task.status === 'completed' ? 'completed' : ''}">
                <div class="task-item-header">
                    <h4 class="task-item-title">${this.escapeHtml(task.title)}</h4>
                    <span class="task-item-status ${task.status}">${task.status}</span>
                </div>
                <div class="task-item-description">${this.escapeHtml(task.description)}</div>
                ${task.subtasks && task.subtasks.length > 0 ? `
                    <div class="task-item-subtasks">
                        ${task.subtasks.map((st, idx) => `
                            <div class="subtask-item">
                                <input type="checkbox" ${st.completed ? 'checked' : ''} 
                                       onchange="tracker.toggleWeeklySubtask('${task.id}', ${idx})">
                                <span ${st.completed ? 'style="text-decoration: line-through;"' : ''}>${this.escapeHtml(st.text)}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="data-card-actions" style="margin-top: 10px;">
                    <button class="btn btn-small btn-secondary" onclick="tracker.toggleWeeklyTaskStatus('${task.id}')">
                        ${task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    <button class="btn btn-small btn-danger" onclick="tracker.deleteWeeklyTask('${task.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    generateWeeklyTasks() {
        const tasks = [
            {
                id: this.generateId(),
                title: 'Write and publish 1 LinkedIn article',
                description: 'Share your expertise on a relevant topic in your field',
                status: 'pending',
                week: new Date().toISOString().split('T')[0],
                subtasks: [
                    { text: 'Choose a relevant topic', completed: false },
                    { text: 'Write the article (800-1200 words)', completed: false },
                    { text: 'Add relevant images/visuals', completed: false },
                    { text: 'Publish on LinkedIn', completed: false },
                    { text: 'Engage with comments', completed: false }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: 'Post 3 times this week on LinkedIn',
                description: 'Maintain consistent presence with valuable content',
                status: 'pending',
                week: new Date().toISOString().split('T')[0],
                subtasks: [
                    { text: 'Plan content topics', completed: false },
                    { text: 'Create first post', completed: false },
                    { text: 'Create second post', completed: false },
                    { text: 'Create third post', completed: false },
                    { text: 'Schedule posts throughout the week', completed: false }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: 'Engage with 10 posts from target companies',
                description: 'Build relationships by engaging with content from companies you want to work for',
                status: 'pending',
                week: new Date().toISOString().split('T')[0],
                subtasks: [
                    { text: 'Identify target companies', completed: false },
                    { text: 'Find recent posts from these companies', completed: false },
                    { text: 'Leave thoughtful comments', completed: false },
                    { text: 'Share valuable posts', completed: false }
                ],
                createdAt: new Date().toISOString()
            }
        ];

        this.weeklyTasks = [...this.weeklyTasks, ...tasks];
        this.saveData('weeklyTasks', this.weeklyTasks);
        this.renderWeeklyTasks();
        toast.show('Weekly LinkedIn tasks generated successfully!', 'success');
    }

    toggleWeeklyTaskStatus(taskId) {
        const task = this.weeklyTasks.find(t => t.id === taskId);
        if (task) {
            task.status = task.status === 'completed' ? 'pending' : 'completed';
            this.saveData('weeklyTasks', this.weeklyTasks);
            this.renderWeeklyTasks();
        }
    }

    toggleWeeklySubtask(taskId, subtaskIndex) {
        const task = this.weeklyTasks.find(t => t.id === taskId);
        if (task && task.subtasks && task.subtasks[subtaskIndex]) {
            task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
            this.saveData('weeklyTasks', this.weeklyTasks);
            this.renderWeeklyTasks();
        }
    }

    deleteWeeklyTask(taskId) {
        if (confirm('Are you sure you want to delete this weekly task?')) {
            this.weeklyTasks = this.weeklyTasks.filter(t => t.id !== taskId);
            this.saveData('weeklyTasks', this.weeklyTasks);
            this.renderWeeklyTasks();
            toast.show('Weekly task deleted successfully', 'success');
        }
    }
}

// Initialize the tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JobTracker();
});
