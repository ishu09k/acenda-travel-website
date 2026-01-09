// ==================== Mobile Menu Toggle ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ==================== Smooth Scroll Effect ====================
// Enhanced smooth scrolling with custom behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Modern scroll behavior with custom easing
            smoothScrollTo(targetPosition, 800);
        }
    });
});

// Custom smooth scroll function with easing
function smoothScrollTo(targetY, duration = 800) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = Date.now();
    
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    function scroll() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        window.scrollTo(0, startY + distance * easeInOutQuad(progress));
        
        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    }
    
    requestAnimationFrame(scroll);
}

// ==================== Active Navigation Highlight ====================
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== Search Form Handler ====================
const searchBtn = document.querySelector('.search-btn');
const locationInput = document.getElementById('location');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const guestsInput = document.getElementById('guests');

searchBtn.addEventListener('click', handleSearch);

function handleSearch() {
    const location = locationInput.value.trim();
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const guests = guestsInput.value;
    
    // Validation
    if (!location) {
        alert('Please enter a destination');
        locationInput.focus();
        return;
    }
    
    if (!checkin) {
        alert('Please select check-in date');
        checkinInput.focus();
        return;
    }
    
    if (!checkout) {
        alert('Please select check-out date');
        checkoutInput.focus();
        return;
    }
    
    if (!guests || guests < 1) {
        alert('Please enter number of guests');
        guestsInput.focus();
        return;
    }
    
    // Check if checkout is after checkin
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    
    if (checkoutDate <= checkinDate) {
        alert('Check-out date must be after check-in date');
        return;
    }
    
    // Show success message
    const searchMessage = `
        Searching for trips to ${location}
        Check-in: ${formatDate(checkin)}
        Check-out: ${formatDate(checkout)}
        Guests: ${guests}
    `;
    
    alert(searchMessage);
    
    // In a real application, you would send this data to a server
    console.log({
        location,
        checkin,
        checkout,
        guests,
        duration: Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24))
    });
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Allow Enter key in search fields
const searchInputs = [locationInput, checkinInput, checkoutInput, guestsInput];
searchInputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

// ==================== Intersection Observer for Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service cards and destination cards for animations
document.querySelectorAll('.service-card, .destination-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ==================== Scroll to Top Button ====================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.setAttribute('class', 'scroll-top-btn');
scrollTopBtn.setAttribute('title', 'Scroll to top');
document.body.appendChild(scrollTopBtn);

// Add CSS for scroll-top button dynamically
const style = document.createElement('style');
style.textContent = `
    .scroll-top-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #0077be 0%, #00a8e8 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        font-weight: bold;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 119, 190, 0.4);
        z-index: 999;
    }
    
    .scroll-top-btn.visible {
        opacity: 1;
        visibility: visible;
    }
    
    .scroll-top-btn:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 119, 190, 0.6);
    }

    .nav-link.active {
        color: #00c9ff;
    }
`;
document.head.appendChild(style);

// Show/hide scroll-top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Scroll to top functionality
scrollTopBtn.addEventListener('click', () => {
    smoothScrollTo(0, 800);
});

// ==================== Service Link Handler ====================
const serviceLinks = document.querySelectorAll('.service-link');
serviceLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // Scroll to contact section
        const contactSection = document.getElementById('contact');
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        smoothScrollTo(targetPosition, 800);
    });
});

// ==================== Initialize ====================
console.log('Acenda Travel Website - JavaScript loaded successfully');
