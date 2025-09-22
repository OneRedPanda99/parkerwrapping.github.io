// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAnimations();
    
    // Setup navigation
    setupNavigation();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup contact form
    setupContactForm();
    
    // Add scroll effects
    setupScrollEffects();
});

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Pricing Calculator Function
function calculatePrice() {
    const length = parseFloat(document.getElementById('length').value) || 0;
    const width = parseFloat(document.getElementById('width').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    const serviceType = document.querySelector('input[name="service"]:checked').value;
    
    if (length <= 0 || width <= 0 || height <= 0) {
        alert('Please enter valid dimensions for all fields.');
        return;
    }
    
    // Calculate surface area using your formula:
    // Top/bottom: 2 × (length × width)
    // Long sides: 2 × (width × height) - assuming width is the longer side
    // Short sides: 2 × (length × height) - assuming length is the shorter side
    
    const topBottom = 2 * (length * width);
    const longSides = 2 * (Math.max(length, width) * height);
    const shortSides = 2 * (Math.min(length, width) * height);
    const totalSurfaceArea = topBottom + longSides + shortSides;
    
    // Calculate pricing based on service type
    const rate = serviceType === 'basic' ? 0.01 : 0.015;
    const basePrice = totalSurfaceArea * rate;
    
    // Round to nearest $0.25 for professional pricing (like your example)
    const roundedPrice = serviceType === 'basic' ? 
        Math.ceil(basePrice * 4) / 4 : // Round to nearest quarter
        Math.ceil(basePrice * 4) / 4;
    
    // Apply minimum pricing like in your example
    const finalPrice = serviceType === 'basic' ? 
        Math.max(roundedPrice, 5.00) : 
        Math.max(roundedPrice, 7.50);
    
    // Update display with animation
    updateResults(totalSurfaceArea, basePrice, finalPrice, {
        topBottom,
        longSides,
        shortSides,
        rate,
        serviceType
    });
}

// Update calculation results with smooth animation
function updateResults(surfaceArea, basePrice, finalPrice, breakdown) {
    const surfaceAreaEl = document.getElementById('surface-area');
    const basePriceEl = document.getElementById('base-price');
    const totalPriceEl = document.getElementById('total-price');
    const breakdownEl = document.getElementById('breakdown-details');
    
    // Animate the values
    animateValue(surfaceAreaEl, 0, surfaceArea, 800, (val) => `${Math.round(val)} sq in`);
    animateValue(basePriceEl, 0, basePrice, 800, (val) => `$${val.toFixed(2)}`);
    animateValue(totalPriceEl, 0, finalPrice, 1000, (val) => `$${val.toFixed(2)}`);
    
    // Update breakdown
    breakdownEl.innerHTML = `
        <div class="breakdown-item">
            <span>Top/Bottom surfaces:</span>
            <span>2 × (${breakdown.topBottom / 2} sq in) = ${breakdown.topBottom} sq in</span>
        </div>
        <div class="breakdown-item">
            <span>Long sides:</span>
            <span>2 × (${breakdown.longSides / 2} sq in) = ${breakdown.longSides} sq in</span>
        </div>
        <div class="breakdown-item">
            <span>Short sides:</span>
            <span>2 × (${breakdown.shortSides / 2} sq in) = ${breakdown.shortSides} sq in</span>
        </div>
        <div class="breakdown-divider"></div>
        <div class="breakdown-item total">
            <span>Total Surface Area:</span>
            <span>${Math.round(surfaceArea)} sq in</span>
        </div>
        <div class="breakdown-item">
            <span>Rate (${breakdown.serviceType}):</span>
            <span>$${breakdown.rate.toFixed(3)}/sq in</span>
        </div>
        <div class="breakdown-item">
            <span>Calculated price:</span>
            <span>$${basePrice.toFixed(2)}</span>
        </div>
        <div class="breakdown-item final">
            <span>Final price:</span>
            <span>$${finalPrice.toFixed(2)}</span>
        </div>
    `;
    
    // Add CSS for breakdown styling
    if (!document.getElementById('breakdown-styles')) {
        const style = document.createElement('style');
        style.id = 'breakdown-styles';
        style.textContent = `
            .breakdown-item {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid var(--border-color);
                font-size: 0.9rem;
            }
            .breakdown-item:last-child {
                border-bottom: none;
            }
            .breakdown-item.total {
                font-weight: 600;
                color: var(--primary-color);
                margin-top: 0.5rem;
                padding-top: 1rem;
                border-top: 1px solid var(--border-color);
            }
            .breakdown-item.final {
                font-weight: 700;
                font-size: 1rem;
                color: var(--primary-color);
                margin-top: 0.5rem;
                padding-top: 1rem;
                border-top: 2px solid var(--primary-color);
            }
            .breakdown-divider {
                height: 1px;
                background: var(--border-color);
                margin: 1rem 0;
            }
        `;
        document.head.appendChild(style);
    }
}

// Animate number values smoothly
function animateValue(element, start, end, duration, formatter) {
    const startTime = Date.now();
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        element.textContent = formatter ? formatter(current) : current.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    requestAnimationFrame(animate);
}

// Initialize scroll-triggered animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Add delay for staggered animations
                const delay = entry.target.getAttribute('data-delay') || 0;
                if (delay) {
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation attributes
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
}

// Setup scroll effects for navbar
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Update navbar background opacity based on scroll
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Contact form functionality
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'SENDING...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--dark-bg);
                color: var(--text-primary);
                padding: 1rem 1.5rem;
                border-radius: 5px;
                border-left: 4px solid var(--primary-color);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                z-index: 1001;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 300px;
                font-family: var(--font-secondary);
            }
            .notification-success {
                border-left-color: var(--primary-color);
            }
            .notification-error {
                border-left-color: var(--accent-color);
            }
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Smooth reveal animation for page load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add loading animation styles
    if (!document.getElementById('loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            body {
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            body.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
});

// Add some interactive touches
document.addEventListener('mousemove', function(e) {
    // Subtle parallax effect for geometric shapes
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.02;
        const x = (mouseX - 0.5) * speed * 100;
        const y = (mouseY - 0.5) * speed * 100;
        
        shape.style.transform += ` translate(${x}px, ${y}px)`;
    });
});

// Performance optimization - throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll-heavy functions
window.addEventListener('scroll', throttle(function() {
    // Additional scroll-based animations can go here
}, 16)); // ~60fps