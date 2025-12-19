// Main Application Controller
class FatalExeApp {
    constructor() {
        this.userManager = new UserManager();
        this.currentUser = this.userManager.currentUser;
        this.currentPage = 'dashboard';
        
        this.init();
    }
    
    init() {
        // Check if user is logged in
        if (!this.currentUser) {
            this.showAuth();
            return;
        }
        
        // Show main app
        this.showApp();
        
        // Initialize components
        this.bindEvents();
        this.loadDashboard();
        this.updateUserInfo();
        this.applyTheme();
    }
    
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
        
        // User dropdown
        const userDropdown = document.getElementById('userDropdown');
        const userDropdownMenu = document.getElementById('userDropdownMenu');
        
        if (userDropdown && userDropdown
