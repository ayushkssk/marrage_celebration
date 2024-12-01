class GuestBook {
    constructor() {
        this.messageForm = document.getElementById('messageForm');
        this.messagesGrid = document.getElementById('messagesGrid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.page = 1;
        this.loading = false;
        
        // Demo messages for testing
        this.demoMessages = [
            {
                name: 'Sarah Johnson',
                message: 'Congratulations on your beautiful wedding! Wishing you a lifetime of love and happiness.',
                date: '2024-01-15T10:30:00',
                image: 'assets/images/guestbook/message1.jpg',
                likes: 12
            },
            // Add more demo messages as needed
        ];

        this.init();
    }

    init() {
        this.setupFormHandling();
        this.setupImageUpload();
        this.setupInfiniteScroll();
        this.setupAnimations();
        this.loadInitialMessages();
    }

    setupFormHandling() {
        this.messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleMessageSubmit(e);
        });
    }

    setupImageUpload() {
        const imageUpload = document.getElementById('imageUpload');
        const imagePreview = document.getElementById('imagePreview');

        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('preview-image');
                
                imagePreview.innerHTML = '';
                imagePreview.appendChild(img);

                // Animate image preview
                gsap.from(img, {
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            };
            reader.readAsDataURL(file);
        });
    }

    setupInfiniteScroll() {
        window.addEventListener('scroll', () => {
            if (this.loading) return;

            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                this.loadMoreMessages();
            }
        });

        this.loadMoreBtn.addEventListener('click', () => this.loadMoreMessages());
    }

    setupAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Animate messages on scroll
        ScrollTrigger.batch(".message-card", {
            onEnter: (elements) => {
                gsap.from(elements, {
                    opacity: 0,
                    y: 30,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: "power2.out"
                });
            },
            once: true
        });
    }

    async handleMessageSubmit(e) {
        const formData = new FormData(e.target);
        const submitBtn = e.target.querySelector('.submit-btn');
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="button-loader"></div>';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create new message
            const messageData = {
                name: formData.get('guestName'),
                message: formData.get('message'),
                date: new Date().toISOString(),
                image: document.querySelector('.preview-image')?.src,
                likes: 0
            };

            this.addMessageToGrid(messageData);
            this.messageForm.reset();
            document.getElementById('imagePreview').innerHTML = '';

            // Show success animation
            gsap.to(submitBtn, {
                backgroundColor: '#28a745',
                duration: 0.3,
                onComplete: () => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent';
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span>Share Message</span><svg class="submit-icon" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
                    }, 2000);
                }
            });

        } catch (error) {
            console.error('Error submitting message:', error);
            submitBtn.innerHTML = 'Error. Try Again';
            submitBtn.disabled = false;
        }
    }

    addMessageToGrid(messageData) {
        const template = document.getElementById('messageTemplate');
        const messageElement = template.content.cloneNode(true);

        // Fill in message data
        messageElement.querySelector('.guest-name').textContent = messageData.name;
        messageElement.querySelector('.message-date').textContent = 
            new Date(messageData.date).toLocaleDateString();
        messageElement.querySelector('.message-content').textContent = messageData.message;
        messageElement.querySelector('.guest-avatar').textContent = 
            messageData.name.charAt(0).toUpperCase();
        messageElement.querySelector('.like-count').textContent = messageData.likes;

        if (messageData.image) {
            const imgContainer = messageElement.querySelector('.message-image');
            const img = document.createElement('img');
            img.src = messageData.image;
            imgContainer.appendChild(img);
        }

        // Setup like button
        const likeBtn = messageElement.querySelector('.like-btn');
        likeBtn.addEventListener('click', () => this.handleLike(likeBtn));

        // Setup share button
        const shareBtn = messageElement.querySelector('.share-btn');
        shareBtn.addEventListener('click', () => this.handleShare(messageData));

        // Add to grid with animation
        this.messagesGrid.insertBefore(messageElement, this.messagesGrid.firstChild);
        
        gsap.from(this.messagesGrid.firstChild, {
            opacity: 0,
            y: -50,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    }

    handleLike(button) {
        const likeCount = button.querySelector('.like-count');
        const currentLikes = parseInt(likeCount.textContent);
        
        if (!button.classList.contains('liked')) {
            button.classList.add('liked');
            likeCount.textContent = currentLikes + 1;
            
            gsap.from(button, {
                scale: 1.5,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        } else {
            button.classList.remove('liked');
            likeCount.textContent = currentLikes - 1;
        }
    }

    handleShare(messageData) {
        const modal = new bootstrap.Modal(document.getElementById('shareModal'));
        modal.show();

        // Setup share buttons
        document.querySelector('.share-facebook').onclick = () => 
            this.shareToSocial('facebook', messageData);
        document.querySelector('.share-twitter').onclick = () => 
            this.shareToSocial('twitter', messageData);
        document.querySelector('.share-whatsapp').onclick = () => 
            this.shareToSocial('whatsapp', messageData);
        document.querySelector('.share-copy').onclick = () => 
            this.copyToClipboard(messageData);
    }

    shareToSocial(platform, messageData) {
        const text = `${messageData.name}'s message: ${messageData.message}`;
        const url = window.location.href;

        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
        };

        window.open(urls[platform], '_blank');
    }

    async copyToClipboard(messageData) {
        const text = `${messageData.name}'s message: ${messageData.message}\n${window.location.href}`;
        
        try {
            await navigator.clipboard.writeText(text);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    async loadMoreMessages() {
        this.loading = true;
        this.loadMoreBtn.querySelector('.button-loader').style.display = 'inline-block';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Load demo messages
            this.demoMessages.forEach(message => this.addMessageToGrid(message));
            
            this.page++;
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            this.loading = false;
            this.loadMoreBtn.querySelector('.button-loader').style.display = 'none';
        }
    }

    loadInitialMessages() {
        // Load first batch of messages
        this.loadMoreMessages();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GuestBook();
}); 