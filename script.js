/* ========================================
   AVIT Website - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Preloader.init();
    Header.init();
    HeroSlider.init();
    MobileMenu.init();
    StatsCounter.init();
    TestimonialsAnimation.init();
    ContactModal.init();
    ContactPopup.init();
    ProductCarousel.init();
});

/* ========================================
   Circular Carousel Module
   ======================================== */
let currentRotation = 0;
let activeCardIndex = 0;
const totalCards = 7;
const radius = 400; // Distance from center

function positionCards() {
    const cards = document.querySelectorAll('.circular-card');
    const angleStep = (2 * Math.PI) / totalCards;

    cards.forEach((card, index) => {
        // Calculate angle for each card
        const angle = angleStep * index + currentRotation;

        // Calculate position on the circular path
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - radius;

        // Calculate scale based on z position (cards in front are bigger)
        const scale = (z + radius * 2) / (radius * 2) * 0.5 + 0.5;

        // Calculate opacity based on position
        const opacity = scale;

        // Calculate z-index based on z position
        const zIndex = Math.round((z + radius) / 10);

        // Apply transforms
        card.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;

        // Highlight the front card
        if (Math.abs(angle % (2 * Math.PI)) < 0.3 || Math.abs(angle % (2 * Math.PI) - 2 * Math.PI) < 0.3) {
            card.style.boxShadow = '0 30px 60px rgba(0, 168, 255, 0.4)';
        } else {
            card.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)';
        }
    });
}

function rotateCarousel(direction) {
    const angleStep = (2 * Math.PI) / totalCards;
    currentRotation -= direction * angleStep;

    activeCardIndex = (activeCardIndex + direction + totalCards) % totalCards;

    positionCards();
    updateCircularDots();
}

function goToCardSlide(index) {
    const angleStep = (2 * Math.PI) / totalCards;
    const steps = index - activeCardIndex;
    currentRotation -= steps * angleStep;
    activeCardIndex = index;

    positionCards();
    updateCircularDots();
}

function updateCircularDots() {
    const dots = document.querySelectorAll('#carouselDots .dot');
    dots.forEach((dot, index) => {
        if (index === activeCardIndex) {
            dot.style.background = '#00a8ff';
            dot.style.transform = 'scale(1.2)';
        } else {
            dot.style.background = 'rgba(255,255,255,0.3)';
            dot.style.transform = 'scale(1)';
        }
    });
}

const ProductCarousel = {
    init() {
        const carousel = document.getElementById('circularCarousel');
        if (carousel) {
            // Initial positioning for circular carousel on homepage
            positionCards();

            // Auto-rotate every 4 seconds
            setInterval(() => {
                rotateCarousel(1);
            }, 4000);
        }
        // Note: Solutions page carousels are initialized via inline script in solutions.html
    }
};

/* ========================================
   Preloader Module
   ======================================== */
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 1500);
        });
    }
};

/* ========================================
   Header Module
   ======================================== */
const Header = {
    init() {
        const header = document.getElementById('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add scrolled class
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show on scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }
};

/* ========================================
   Hero Slider Module
   ======================================== */
const HeroSlider = {
    currentSlide: 1,
    totalSlides: 4,
    autoplayInterval: null,
    autoplayDelay: 3000,

    init() {
        this.hero = document.getElementById('hero');
        if (!this.hero) return; // Exit if no hero section exists

        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.pagination-dot');

        this.bindEvents();
        this.startAutoplay();
        this.setVideoSpeed(0.5);
    },

    setVideoSpeed(speed) {
        const videos = document.querySelectorAll('.slide-video');
        videos.forEach(video => {
            video.playbackRate = speed;
        });
    },

    bindEvents() {
        // Pagination dots
        this.dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideNum = parseInt(dot.dataset.slide);
                this.goToSlide(slideNum);
                this.resetAutoplay();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
                this.resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.resetAutoplay();
            }
        });

        // Touch/Swipe support
        this.initTouchEvents();
    },

    initTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.hero.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.hero.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    },

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
            this.resetAutoplay();
        }
    },

    goToSlide(slideNum) {
        // Remove active class from current
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to new slide
        const newSlide = document.querySelector(`[data-slide="${slideNum}"]`);
        const newDot = document.querySelector(`.pagination-dot[data-slide="${slideNum}"]`);

        if (newSlide) newSlide.classList.add('active');
        if (newDot) newDot.classList.add('active');

        this.currentSlide = slideNum;
    },

    nextSlide() {
        let next = this.currentSlide + 1;
        if (next > this.totalSlides) next = 1;
        this.goToSlide(next);
    },

    prevSlide() {
        let prev = this.currentSlide - 1;
        if (prev < 1) prev = this.totalSlides;
        this.goToSlide(prev);
    },

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    },

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    },

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
};

/* ========================================
   Mobile Menu Module
   ======================================== */
const MobileMenu = {
    init() {
        this.menuBtn = document.getElementById('mobileMenuBtn');
        this.closeBtn = document.getElementById('mobileMenuClose');
        this.nav = document.getElementById('mainNav');
        this.navItems = document.querySelectorAll('.nav-item.has-dropdown');

        if (this.menuBtn && this.nav) {
            this.bindEvents();
        }
    },

    bindEvents() {
        // Toggle menu
        this.menuBtn.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Toggle dropdowns on mobile
        this.navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    item.classList.toggle('active');
                }
            });
        });

        // Close menu on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                this.closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && !this.menuBtn.contains(e.target)) {
                this.closeMenu();
            }
        });
    },

    toggleMenu() {
        this.menuBtn.classList.toggle('active');
        this.nav.classList.toggle('active');
        document.body.style.overflow = this.nav.classList.contains('active') ? 'hidden' : 'auto';
    },

    closeMenu() {
        this.menuBtn.classList.remove('active');
        this.nav.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

/* ========================================
   Stats Counter Module
   ======================================== */
const StatsCounter = {
    init() {
        this.observeAllStats();
    },

    observeAllStats() {
        // Observe all elements with data-count attribute
        const allStats = document.querySelectorAll('[data-count]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });

        allStats.forEach(stat => observer.observe(stat));
    },

    animateCounter(stat) {
        const target = parseInt(stat.dataset.count);
        const useComma = stat.dataset.format === 'comma';
        const suffix = stat.dataset.suffix || '';
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const formatNumber = (num) => {
            return useComma ? num.toLocaleString() : num;
        };

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = formatNumber(Math.ceil(current)) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = formatNumber(target) + suffix;
            }
        };

        updateCounter();
    }
};

/* ========================================
   Testimonials Animation Module
   ======================================== */
const TestimonialsAnimation = {
    init() {
        this.box = document.querySelector('.testimonials-box');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.animated = false;

        this.observeTestimonials();
    },

    observeTestimonials() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateTestimonials();
                    this.animated = true;
                }
            });
        }, { threshold: 0.2 });

        const testimonialsSection = document.querySelector('.testimonials-section');
        if (testimonialsSection) {
            observer.observe(testimonialsSection);
        }
    },

    animateTestimonials() {
        // First animate the box
        if (this.box) {
            this.box.classList.add('animate-in');
        }
        // Then animate cards with staggered delay
        this.cards.forEach(card => {
            card.classList.add('animate-in');
        });
    }
};

/* ========================================
   Contact Modal Module
   ======================================== */
const ContactModal = {
    init() {
        this.modal = document.getElementById('contactModal');
        this.openBtns = document.querySelectorAll('.btn-contact');
        this.closeBtn = document.querySelector('.modal-close');
        this.overlay = document.querySelector('.modal-overlay');
        this.form = document.getElementById('modalContactForm');

        if (this.modal) {
            this.bindEvents();
        }
    },

    bindEvents() {
        // Open modal
        this.openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        });

        // Close modal on close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal on overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.closeModal();
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Handle form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    },

    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    },

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Show success message
        const modalContent = this.modal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <div class="form-success">
                <i class="fas fa-check-circle"></i>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you soon.</p>
                <button class="btn-primary" onclick="ContactModal.closeModal()">Close</button>
            </div>
        `;

        // Reset after closing
        setTimeout(() => {
            this.closeModal();
            location.reload();
        }, 3000);
    }
};

/* ========================================
   Slide-in Contact Popup (Timed)
   ======================================== */
const ContactPopup = {
    init() {
        this.popup = document.getElementById('contactPopup');
        if (!this.popup) return;

        this.closeBtn = this.popup.querySelector('.contact-popup-close');
        this.form = document.getElementById('popupContactForm');

        // Don't show if already dismissed this session
        if (sessionStorage.getItem('contactPopupDismissed')) return;

        this.bindEvents();
        this.startTimer();
    },

    startTimer() {
        // Show popup after 1 minute (60000ms)
        this.timer = setTimeout(() => {
            this.showPopup();
        }, 60000);
    },

    showPopup() {
        if (this.popup) {
            this.popup.classList.add('visible');
        }
    },

    hidePopup() {
        if (this.popup) {
            this.popup.classList.remove('visible');
            sessionStorage.setItem('contactPopupDismissed', 'true');
        }
        if (this.timer) {
            clearTimeout(this.timer);
        }
    },

    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hidePopup());
        }

        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    },

    handleSubmit() {
        const body = this.popup.querySelector('.contact-popup-body');
        body.innerHTML = `
            <div class="form-success">
                <i class="fas fa-check-circle"></i>
                <h3>Thank You!</h3>
                <p>We'll get back to you shortly.</p>
            </div>
        `;
        sessionStorage.setItem('contactPopupDismissed', 'true');
        setTimeout(() => this.hidePopup(), 3000);
    }
};

/* ========================================
   Smooth Scroll
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Skip if this is the contact button
        if (this.classList.contains('btn-contact')) {
            return;
        }
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/* ========================================
   Parallax Effect (Optional Enhancement)
   ======================================== */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < window.innerHeight) {
        const displays = document.querySelectorAll('.floating-display');
        displays.forEach(display => {
            display.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    }
});

/* ========================================
   GSAP Scroll Animations
   ======================================== */
const GSAPAnimations = {
    init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Smooth scroll behavior
        ScrollTrigger.defaults({
            toggleActions: "play none none reverse"
        });

        // Animate section labels
        gsap.utils.toArray('.section-label').forEach(label => {
            gsap.from(label, {
                scrollTrigger: {
                    trigger: label,
                    start: "top 85%",
                },
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: "power2.out"
            });
        });

        // Animate section titles
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        // Animate about features - staggered fade in from bottom
        gsap.utils.toArray('.about-feature').forEach((feature, index) => {
            gsap.from(feature, {
                scrollTrigger: {
                    trigger: feature,
                    start: "top 85%",
                },
                opacity: 0,
                y: 60,
                duration: 0.7,
                delay: index * 0.15,
                ease: "power2.out"
            });
        });

        // Animate about services - staggered fade in from bottom
        gsap.utils.toArray('.about-service').forEach((service, index) => {
            gsap.from(service, {
                scrollTrigger: {
                    trigger: service,
                    start: "top 85%",
                },
                opacity: 0,
                y: 60,
                duration: 0.7,
                delay: index * 0.15,
                ease: "power2.out"
            });
        });

        // Animate solution tabs - slide in from left/right alternating
        gsap.utils.toArray('.solution-tab').forEach((tab, index) => {
            gsap.from(tab, {
                scrollTrigger: {
                    trigger: tab,
                    start: "top 80%",
                },
                opacity: 0,
                x: index % 2 === 0 ? -100 : 100,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        // Animate stat items - scale and fade
        gsap.utils.toArray('.stat-item').forEach((stat, index) => {
            gsap.from(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: "top 85%",
                },
                opacity: 0,
                scale: 0.8,
                duration: 0.6,
                delay: index * 0.1,
                ease: "back.out(1.7)"
            });
        });

        // Animate testimonial cards
        gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                },
                opacity: 0,
                y: 50,
                duration: 0.7,
                delay: index * 0.1,
                ease: "power2.out"
            });
        });

        // Animate partner logos
        gsap.utils.toArray('.partner-logo').forEach((logo, index) => {
            gsap.from(logo, {
                scrollTrigger: {
                    trigger: logo,
                    start: "top 90%",
                },
                opacity: 0,
                y: 30,
                duration: 0.5,
                delay: index * 0.05,
                ease: "power2.out"
            });
        });

        // Animate feature cards on other pages
        gsap.utils.toArray('.feature-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                delay: index * 0.1,
                ease: "power2.out"
            });
        });

        // Animate vision quote with fade and scale
        const visionQuote = document.querySelector('.vision-quote');
        if (visionQuote) {
            gsap.from(visionQuote, {
                scrollTrigger: {
                    trigger: visionQuote,
                    start: "top 80%",
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power2.out"
            });
        }

        // Animate product cards - staggered reveal
        gsap.utils.toArray('.product-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                },
                opacity: 0,
                y: 80,
                scale: 0.9,
                duration: 0.8,
                delay: index * 0.1,
                ease: "power3.out"
            });
        });

        // Animate footer columns
        gsap.utils.toArray('.footer-column').forEach((col, index) => {
            gsap.from(col, {
                scrollTrigger: {
                    trigger: col,
                    start: "top 90%",
                },
                opacity: 0,
                y: 40,
                duration: 0.6,
                delay: index * 0.1,
                ease: "power2.out"
            });
        });

        // Page hero animations for inner pages
        const pageHero = document.querySelector('.page-hero');
        if (pageHero) {
            gsap.from('.page-label', {
                opacity: 0,
                y: 30,
                duration: 0.6,
                delay: 0.2,
                ease: "power2.out"
            });
            gsap.from('.page-title', {
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: 0.4,
                ease: "power2.out"
            });
            gsap.from('.page-subtitle', {
                opacity: 0,
                y: 30,
                duration: 0.6,
                delay: 0.6,
                ease: "power2.out"
            });
        }

        // Animate about grid on about page
        const aboutGrid = document.querySelector('.about-grid');
        if (aboutGrid) {
            gsap.from('.about-text', {
                scrollTrigger: {
                    trigger: aboutGrid,
                    start: "top 80%",
                },
                opacity: 0,
                x: -50,
                duration: 0.8,
                ease: "power2.out"
            });
            gsap.from('.about-image', {
                scrollTrigger: {
                    trigger: aboutGrid,
                    start: "top 80%",
                },
                opacity: 0,
                x: 50,
                duration: 0.8,
                ease: "power2.out"
            });
        }

        // Animate mission/vision cards
        gsap.utils.toArray('.mv-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                },
                opacity: 0,
                y: 50,
                rotation: 5,
                duration: 0.7,
                delay: index * 0.15,
                ease: "power2.out"
            });
        });
    }
};

// Initialize GSAP animations after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        GSAPAnimations.init();
    }, 100);
});
