class WeddingCountdown {
    constructor() {
        // Set wedding date: March 10, 2025 00:00:00
        this.weddingDate = new Date('2025-03-10T00:00:00').getTime();
        
        // Get DOM elements
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        
        // Start countdown
        this.init();
    }

    init() {
        // Update immediately
        this.updateCountdown();
        
        // Update every second
        setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = this.weddingDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            // Update DOM with padded numbers
            if (this.daysElement) this.daysElement.innerHTML = this.padNumber(days);
            if (this.hoursElement) this.hoursElement.innerHTML = this.padNumber(hours);
            if (this.minutesElement) this.minutesElement.innerHTML = this.padNumber(minutes);
            if (this.secondsElement) this.secondsElement.innerHTML = this.padNumber(seconds);

            // Add animation class
            this.addPulseAnimation(seconds);
        } else {
            // Wedding day has arrived!
            this.showWeddingDay();
        }
    }

    padNumber(number) {
        return number.toString().padStart(2, '0');
    }

    addPulseAnimation(seconds) {
        // Add pulse animation to seconds
        if (this.secondsElement) {
            this.secondsElement.classList.add('pulse');
            setTimeout(() => {
                this.secondsElement.classList.remove('pulse');
            }, 900); // Remove class just before next second
        }
    }

    showWeddingDay() {
        const countdownElements = [
            this.daysElement,
            this.hoursElement,
            this.minutesElement,
            this.secondsElement
        ];

        countdownElements.forEach(element => {
            if (element) element.innerHTML = '00';
        });

        // Add wedding day message
        const countdownContainer = document.querySelector('.countdown');
        if (countdownContainer) {
            countdownContainer.innerHTML = '<div class="wedding-day-message">Our Wedding Day! ❤️</div>';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeddingCountdown();
}); 