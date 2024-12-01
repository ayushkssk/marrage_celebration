class RSVPForm {
    constructor() {
        this.currentStep = 1;
        this.form = document.getElementById('rsvpForm');
        this.sections = document.querySelectorAll('.form-section');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupGuestCounter();
        this.setupAttendanceButtons();
        this.initializeGSAPAnimations();
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.btn-next').forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        document.querySelectorAll('.btn-prev').forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    setupGuestCounter() {
        const counter = document.querySelector('.guest-counter');
        if (!counter) return;

        counter.addEventListener('click', (e) => {
            if (!e.target.matches('.counter-btn')) return;

            const input = counter.querySelector('input');
            const currentValue = parseInt(input.value);
            const action = e.target.dataset.action;

            if (action === 'increase' && currentValue < 5) {
                input.value = currentValue + 1;
            } else if (action === 'decrease' && currentValue > 1) {
                input.value = currentValue - 1;
            }

            // Animate button
            gsap.to(e.target, {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
        });
    }

    setupAttendanceButtons() {
        const buttons = document.querySelectorAll('.attendance-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');

                // Animate selection
                gsap.from(btn, {
                    scale: 0.9,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
        });
    }

    initializeGSAPAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Animate form sections
        this.sections.forEach(section => {
            gsap.set(section, { opacity: 0, x: 50 });
        });

        // Animate background elements
        gsap.to('.svg-background path', {
            duration: 20,
            rotate: 360,
            repeat: -1,
            ease: "none",
            transformOrigin: "center center"
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.animateStepTransition('next');
        }
    }

    prevStep() {
        this.animateStepTransition('prev');
    }

    animateStepTransition(direction) {
        const currentSection = document.querySelector(`.form-section[data-step="${this.currentStep}"]`);
        const nextStep = direction === 'next' ? this.currentStep + 1 : this.currentStep - 1;
        const nextSection = document.querySelector(`.form-section[data-step="${nextStep}"]`);

        if (!nextSection) return;

        // Animate out current section
        gsap.to(currentSection, {
            opacity: 0,
            x: direction === 'next' ? -50 : 50,
            duration: 0.3,
            onComplete: () => {
                currentSection.classList.remove('active');
                nextSection.classList.add('active');
                
                // Animate in next section
                gsap.fromTo(nextSection,
                    { opacity: 0, x: direction === 'next' ? 50 : -50 },
                    { opacity: 1, x: 0, duration: 0.3 }
                );
            }
        });

        this.currentStep = nextStep;
    }

    validateCurrentStep() {
        const currentSection = document.querySelector(`.form-section[data-step="${this.currentStep}"]`);
        const inputs = currentSection.querySelectorAll('input[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!input.value) {
                valid = false;
                this.showError(input);
            }
        });

        return valid;
    }

    showError(input) {
        gsap.to(input, {
            x: [-10, 10, -10, 10, 0],
            duration: 0.4,
            ease: "power2.out"
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Animate submit button
        const submitBtn = this.form.querySelector('.btn-submit');
        gsap.to(submitBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => this.showConfirmation()
        });
    }

    showConfirmation() {
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        
        // Create success animation
        const checkmark = `<svg class="checkmark" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>`;
        
        document.querySelector('.confirmation-animation').innerHTML = checkmark;
        
        // Animate checkmark
        gsap.fromTo('.checkmark__circle', 
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 1, ease: "power2.out" }
        );
        
        gsap.fromTo('.checkmark__check', 
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 0.3, delay: 0.9 }
        );

        modal.show();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RSVPForm();
});