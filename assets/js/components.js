class ComponentLoader {
    constructor() {
        this.components = {
            notification: {
                id: 'notification-banner',
                path: 'components/notification.html'
            },
            header: {
                id: 'header-container',
                path: 'components/header.html'
            },
            footer: {
                id: 'footer-container',
                path: 'components/footer.html'
            }
        };
        this.loadedComponents = new Set();
        this.init();
    }

    async init() {
        try {
            await this.loadAllComponents();
            this.setupEventListeners();
            this.highlightCurrentPage();
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    async loadAllComponents() {
        const loadPromises = Object.values(this.components).map(component => 
            this.loadComponent(component.id, component.path)
        );
        await Promise.all(loadPromises);
    }

    async loadComponent(containerId, path) {
        const container = document.getElementById(containerId);
        if (!container || this.loadedComponents.has(containerId)) return;

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            container.innerHTML = html;
            this.loadedComponents.add(containerId);
            this.initializeComponent(containerId);
        } catch (error) {
            console.error(`Error loading component ${path}:`, error);
        }
    }

    initializeComponent(containerId) {
        switch(containerId) {
            case 'header-container':
                this.initializeHeader();
                break;
            case 'footer-container':
                this.initializeFooter();
                break;
            case 'notification-banner':
                // Notification banner is initialized separately
                break;
        }
    }

    initializeHeader() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }

    initializeFooter() {
        // Initialize any footer-specific functionality
        this.updateCopyrightYear();
    }

    updateCopyrightYear() {
        const yearElement = document.querySelector('.copyright-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === 'index.html' && href === '/') ||
                (href !== '/' && currentPage.includes(href))) {
                link.classList.add('active');
            }
        });
    }

    setupEventListeners() {
        // Mobile menu toggle
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', () => {
                navbarCollapse.classList.toggle('show');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbarToggler.contains(e.target) && 
                    !navbarCollapse.contains(e.target) && 
                    navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
}); 