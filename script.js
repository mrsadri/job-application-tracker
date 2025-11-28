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
        this.init();
    }

    init() {
        this.loadProfile();
        this.setupEventListeners();
        this.filterApplications(); // Use filterApplications to apply sorting on initial load
        this.updateStats();
        this.setDefaultDate();
        this.renderSuggestedJobs();
    }

    setupEventListeners() {
        // Modal controls
        document.getElementById('add-job-btn').addEventListener('click', () => this.openModal());
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
        const stored = localStorage.getItem('jobApplications');
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
        fetch('my-profile.json')
            .then(response => response.json())
            .then(profile => {
                this.profile = profile;
            })
            .catch(error => {
                console.error('Error loading profile:', error);
            });
    }

    loadSuggestedJobs() {
        const stored = localStorage.getItem('suggestedJobs');
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
        localStorage.setItem('suggestedJobs', JSON.stringify(this.suggestedJobs));
        this.renderSuggestedJobs();
    }

    saveApplications() {
        try {
            const data = JSON.stringify(this.applications);
            localStorage.setItem('jobApplications', data);
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
        
        // Announce stats update
        this.announce(`Statistics updated: ${stats.total} total applications`);
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
                // If no date, include the job
                if (!job.created) return true;
                const jobDate = new Date(job.created);
                // If date parsing fails, include the job
                if (isNaN(jobDate.getTime())) return true;
                return jobDate >= fourWeeksAgo;
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
                            This app fetches real jobs from Remotive and Arbeitnow APIs.<br>
                            Check your internet connection and click "Refresh" to try again.
                        </p>
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
        const crawlerApiUrl = window.CRAWLER_API_URL || 'http://localhost:3000/api/crawl';
        
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
                return data.jobs.map(job => {
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

    // Job relevance scoring system
    calculateJobRelevanceScore(job, profile) {
        if (!profile) return 0;
        
        let score = 0;
        const title = (job.title || '').toLowerCase();
        const description = (job.description || '').toLowerCase();
        const location = (job.location || '').toLowerCase();
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
        
        // Location match (high weight - up to 25 points)
        const locationMatches = targetLocations.filter(targetLoc => {
            const targetLower = targetLoc.toLowerCase();
            return location.includes(targetLower) || location.includes('remote') || location.includes('anywhere');
        });
        if (locationMatches.length > 0) {
            score += 25;
        } else if (location.includes('remote') || location.includes('anywhere')) {
            score += 15; // Remote is good but less than specific location
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
            
            // Filter jobs with minimum relevance score (at least 20/100)
            // Sort by relevance score (highest first)
            const relevantJobs = uniqueJobs
                .filter(job => job.relevanceScore >= 20)
                .sort((a, b) => b.relevanceScore - a.relevanceScore);
            
            console.log(`Filtered ${uniqueJobs.length} jobs -> ${relevantJobs.length} relevant jobs (score >= 20)`);
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
    
    async fetchLinkedInJobs(locations, roles) {
        // Try to use backend crawler API first (if available)
        const crawlerApiUrl = window.CRAWLER_API_URL || 'http://localhost:3000/api/crawl';
        
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
            const crawlerApiUrl = window.CRAWLER_API_URL || 'http://localhost:3000/api/crawl';
            
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
        const allJobs = [...this.suggestedJobs];
        
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

        return `
            <div class="suggested-job-card ${stateClass} ${deprecatedClass}" data-job-id="${job.id}">
                <div class="suggested-job-header">
                    <div class="suggested-job-title-section">
                        <h3>${this.escapeHtml(job.title)}</h3>
                        <div class="suggested-job-company">${this.escapeHtml(job.company)}</div>
                        <div class="suggested-job-location">📍 ${this.escapeHtml(job.location)}</div>
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
}

// Initialize the tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JobTracker();
});
