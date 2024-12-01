<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

class NotificationBanner {
    constructor() {
        this.banner = document.querySelector('.notification-banner');
        this.navbar = document.querySelector('.navbar');
        this.isMobile = window.innerWidth <= 768;
        this.autoHideDelay = this.isMobile ? 2000 : 4000; // Show duration
        this.autoHideDuration = this.isMobile ? 1000 : 1500; // Hide animation duration
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isHidden = false;
        this.isExpanded = false;
        this.init();
    }

    init() {
        if (!this.banner) return;
        
        this.createProgressBar();
        this.setupMobileFeatures();
        this.setupAutoHide();
        this.setupEventListeners();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'auto-hide-progress';
        this.banner.appendChild(progressBar);
        
        this.progressBar = progressBar;
    }

    setupMobileFeatures() {
        if (this.isMobile) {
            // Create text slider
            const textContent = this.banner.querySelector('.notification-text').innerHTML;
            const slider = document.createElement('div');
            slider.className = 'notification-text-slider';
            slider.innerHTML = `${textContent} • ${textContent}`;
            this.banner.querySelector('.notification-text').innerHTML = '';
            this.banner.querySelector('.notification-text').appendChild(slider);

            // Add swipe indicator
            const swipeIndicator = document.createElement('div');
            swipeIndicator.className = 'swipe-indicator';
            this.banner.appendChild(swipeIndicator);
        }
    }

    setupAutoHide() {
        // Initial display with progress animation
        setTimeout(() => {
            if (this.progressBar) {
                this.progressBar.style.animation = `autoHideProgress ${this.autoHideDuration}ms linear`;
            }
            setTimeout(() => this.hideBanner(), this.autoHideDuration);
        }, this.autoHideDelay);
    }

    setupEventListeners() {
        if (this.isMobile) {
            this.banner.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.banner.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            this.banner.addEventListener('touchend', () => this.handleTouchEnd());
        } else {
            this.banner.addEventListener('mouseenter', () => this.handleMouseEnter());
            this.banner.addEventListener('mouseleave', () => this.handleMouseLeave());
        }

        // Double tap to expand
        let lastTap = 0;
        this.banner.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                this.toggleExpand();
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.banner.style.transition = 'none';
    }

    handleTouchMove(e) {
        if (!this.touchStartX) return;

        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchX - this.touchStartX;
        const deltaY = touchY - this.touchStartY;

        // If vertical scroll is more significant, allow page scroll
        if (Math.abs(deltaY) > Math.abs(deltaX)) return;

        // Prevent page scroll when swiping banner
        e.preventDefault();

        if (deltaX < 0) { // Swipe left to dismiss
            this.banner.style.transform = `translateX(${deltaX}px)`;
        }
    }

    handleTouchEnd() {
        const deltaX = event.changedTouches[0].clientX - this.touchStartX;
        this.banner.style.transition = 'all 0.3s ease';

        if (deltaX < -50) { // Swipe threshold
            this.hideBanner();
        } else {
            this.banner.style.transform = 'translateX(0)';
        }

        this.touchStartX = null;
        this.touchStartY = null;
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        this.banner.classList.toggle('expanded');
        this.adjustNavbar();
    }

    hideBanner() {
        this.banner.style.transform = 'translateY(-100%)';
        this.isHidden = true;
        this.adjustNavbar();
    }

    showBanner() {
        this.banner.style.transform = 'translateY(0)';
        this.isHidden = false;
        this.adjustNavbar();
    }

    adjustNavbar() {
        if (!this.navbar) return;
        
        const bannerHeight = this.isHidden ? 0 : 
                            this.isExpanded ? 'auto' : 
                            this.isMobile ? '40px' : '60px';
        
        this.navbar.style.top = bannerHeight;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NotificationBanner();
}); 