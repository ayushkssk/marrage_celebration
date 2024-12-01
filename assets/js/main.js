class App {
    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
    }

    initializeComponents() {
        // Initialize all components
        this.componentLoader = new ComponentLoader();
        
        // Initialize other features after components are loaded
        this.setupLazyLoading();
        this.initializeAnimations();
    }

    setupEventListeners() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    initializeAnimations() {
        if (window.gsap) {
            gsap.from('.hero-content', {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power2.out'
            });
        }
    }

    handleResize() {
        // Handle responsive adjustments
        this.updateMobileLayout();
    }

    updateMobileLayout() {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('is-mobile', isMobile);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 