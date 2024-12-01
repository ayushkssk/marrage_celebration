class EventsManager {
    constructor() {
        this.locations = {
            'garden-palace': {
                lat: 40.7128,
                lng: -74.0060,
                address: '123 Garden Street, New York, NY',
                title: 'Garden Palace'
            },
            'grand-cathedral': {
                lat: 40.7580,
                lng: -73.9855,
                address: '456 Cathedral Ave, New York, NY',
                title: 'Grand Cathedral'
            }
        };
        
        this.init();
    }

    init() {
        this.setupLocationButtons();
        this.initMap();
        this.setupScrollAnimation();
    }

    setupLocationButtons() {
        document.querySelectorAll('.location-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const locationId = btn.dataset.location;
                this.showLocation(locationId);
            });
        });
    }

    initMap() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: { lat: 40.7128, lng: -74.0060 }
        });
        this.marker = new google.maps.Marker({
            map: this.map
        });
    }

    showLocation(locationId) {
        const location = this.locations[locationId];
        const modal = new bootstrap.Modal(document.getElementById('locationModal'));
        
        this.map.setCenter({ lat: location.lat, lng: location.lng });
        this.marker.setPosition({ lat: location.lat, lng: location.lng });
        
        document.getElementById('location-address').innerHTML = `
            <h5>${location.title}</h5>
            <p>${location.address}</p>
        `;
        
        document.getElementById('location-directions').innerHTML = `
            <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}" 
               target="_blank" class="btn btn-primary">
                Get Directions
            </a>
        `;
        
        modal.show();
    }

    setupScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EventsManager();
}); 