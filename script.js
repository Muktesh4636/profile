// Mobile Navigation Toggle
// Always start at top on page load/reload
if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
});

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Profile photo now static from resources folder; upload removed

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#home' || href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Navbar background stays constant - no scroll changes

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation classes to elements
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index % 2 === 0) {
            section.classList.add('fade-in');
        } else {
            section.classList.add('slide-in-left');
        }
        observer.observe(section);
    });

    // Add animation to skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Add animation to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.classList.add('fade-in');
        item.style.animationDelay = `${index * 0.2}s`;
        observer.observe(item);
    });

    // Add animation to achievement cards
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
        card.classList.add('slide-in-right');
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Render dynamic projects
    renderProjects();

    // Phone number: trigger dialer on copy/select attempts
    const PHONE_DIGITS = '919182351381';
    const phoneAnchors = document.querySelectorAll('.phone-link a');

    function normalizeDigits(text) {
        return (text || '').replace(/\D+/g, '');
    }

    function openDialer() {
        window.location.href = `tel:+${PHONE_DIGITS}`;
    }

    // Ensure click always opens dialer (fallback if browser blocks tel: default)
    phoneAnchors.forEach(a => {
        a.addEventListener('click', (e) => {
            // allow default tel: but also force as fallback
            setTimeout(() => openDialer(), 0);
        });
    });

    // If user copies the phone number, open dialer instead
    document.addEventListener('copy', (e) => {
        const selection = window.getSelection();
        if (!selection) return;
        const text = selection.toString();
        if (normalizeDigits(text).includes(PHONE_DIGITS)) {
            e.preventDefault();
            openDialer();
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Build a compact message to notify your phone
    const compact = `New contact message:%0AFrom: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0ASubject: ${encodeURIComponent(subject)}%0A%0A${encodeURIComponent(message)}`;

    const phoneDigits = '919182351381';
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    const smsLink = `sms:+${phoneDigits}?&body=${compact}`;
    const whatsappLink = `https://wa.me/${phoneDigits}?text=${compact}`;
    const mailtoLink = `mailto:mukteshreddy4636@gmail.com?subject=${encodeURIComponent('New contact form message')}&body=${compact}`;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Opening messenger...';
    submitBtn.disabled = true;

    // Try to notify via native SMS on mobile; WhatsApp Web on desktop; fall back to email
    try {
        if (isMobile) {
            window.location.href = smsLink;
        } else {
            window.open(whatsappLink, '_blank', 'noopener');
        }
        // Also open email as a backup channel after a short delay
        setTimeout(() => { window.location.href = mailtoLink; }, 400);
    } catch (_) {}

    // Give user feedback and reset UI
    setTimeout(() => {
        showNotification('Your messaging app opened with the message. Send to notify your phone.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1200);
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax effect for hero section (optimized with rAF)
(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    let ticking = false;
    const parallaxStrength = 0.2; // gentler for smoother feel

    function onScroll() {
        const y = window.pageYOffset * parallaxStrength;
        hero.style.transform = `translate3d(0, ${y}px, 0)`;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    onScroll();
})();

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }
});

// Add hover effects to skill cards
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    z-index: 10001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Close notifications
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }
});

// Add focus management for accessibility
document.querySelectorAll('a, button, input, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        if (this.matches('.phone-link a, .navbar .nav-link')) {
            this.style.outline = 'none';
            return;
        }
        this.style.outline = '2px solid #2563eb';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Progress bar only - navbar stays constant
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// -------- Projects (Dynamic Rendering) --------
const projects = [
    {
        title: 'Financing App',
        description: 'Financing application built with Django, HTML, CSS, and PostgreSQL. Includes auth, role-based access, and transaction workflows.',
        tech: ['Django', 'HTML', 'CSS', 'PostgreSQL'],
        year: '2023–2024',
        image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1400&auto=format&fit=crop',
        links: {
            details: '#',
            github: '#'
        }
    },
    {
        title: 'Real-Time Guidance Platform',
        description: 'A platform providing real-time project mentorship for students with chat, scheduling, and resource sharing.',
        tech: ['Django Channels', 'WebSockets', 'Tailwind'],
        year: '2024',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop',
        links: {
            details: '#',
            github: '#'
        }
    },
    {
        title: 'Django Portfolio Project',
        description: 'Placeholder for another Django project showcasing best practices in DRF and clean architecture.',
        tech: ['Django REST Framework', 'JWT'],
        year: '2024',
        image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1400&auto=format&fit=crop',
        links: {
            details: '#',
            github: '#'
        }
    }
];

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    grid.innerHTML = projects.map(project => `
        <div class="project-card fade-in">
            <div class="project-media">
                ${project.image ? `<img src="${project.image}" alt="${project.title}" />` : `<i class="fas fa-diagram-project"></i>`}
            </div>
            <div class="project-content">
                <div class="project-title">${project.title}</div>
                <div class="project-meta">${project.year} · ${project.tech.map(t => `<span class=\"badge\">${t}</span>`).join(' ')}</div>
                <div class="project-desc">${project.description}</div>
                <div class="project-actions">
                    <a class="project-link" href="${project.links.details}" target="_blank" rel="noopener">
                        <i class="fas fa-up-right-from-square"></i> Details
                    </a>
                    <a class="project-link" href="${project.links.github}" target="_blank" rel="noopener">
                        <i class="fab fa-github"></i> Code
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    // Observe newly added cards for animation
    document.querySelectorAll('.project-card').forEach(card => observer.observe(card));
}
