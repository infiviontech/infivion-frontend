/* ================================================
   INFIVION TECHNOLOGIES - PREMIUM CORPORATE WEBSITE
   JavaScript for Navigation, Animations & Contact Form
   ================================================ */

// API Base URL - Auto-detects localhost. For production: replace with your Render backend URL
const API_BASE_URL = (function() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    // REPLACE below with your actual Render backend URL (e.g. https://infivion-backend-xxxx.onrender.com/api)
    return 'https://infivion-backend.onrender.com/api';
})();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();
});

/* ------------------------------------------------
   NAVIGATION
   ------------------------------------------------ */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navbar && !navbar.contains(e.target) && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Navbar scroll effect
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollY = window.scrollY;
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateActiveNav);
    });

    // Initial check
    updateNavbar();
    updateActiveNav();
}

/* ------------------------------------------------
   SCROLL ANIMATIONS
   ------------------------------------------------ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll('.fade-in');
                const index = Array.from(siblings).indexOf(entry.target);
                
                entry.target.style.transitionDelay = `${index * 0.1}s`;
                entry.target.classList.add('visible');
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Trigger hero animations immediately
    const heroElements = document.querySelectorAll('.hero .fade-in');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 300 + (index * 150));
    });
}

/* ------------------------------------------------
   SMOOTH SCROLL
   ------------------------------------------------ */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ------------------------------------------------
   CONTACT FORM
   ------------------------------------------------ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Form Elements
    const userTypeSelect = document.getElementById('userType');
    const institutionField = document.getElementById('institutionField');
    const organizationField = document.getElementById('organizationField');
    const institutionInput = document.getElementById('institution');
    const organizationInput = document.getElementById('organization');
    const messageHint = document.getElementById('messageHint');
    const emailInput = document.getElementById('email');
    const fullNameInput = document.getElementById('fullName');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const otpInputGroup = document.getElementById('otpInputGroup');
    const otpInput = document.getElementById('otpInput');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const otpTimer = document.getElementById('otpTimer');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const otpVerified = document.getElementById('otpVerified');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const sendAnotherBtn = document.getElementById('sendAnotherBtn');

    // State
    let otpTimerInterval = null;
    let isOtpVerified = false;

    // Conditional Fields - Show/Hide based on user type
    userTypeSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        
        // Hide both fields first
        institutionField.style.display = 'none';
        organizationField.style.display = 'none';
        institutionInput.required = false;
        organizationInput.required = false;
        
        if (value === 'student') {
            institutionField.style.display = 'block';
            institutionInput.required = true;
            messageHint.textContent = 'Share your internship interest, skills, or any queries you have';
        } else if (value === 'company') {
            organizationField.style.display = 'block';
            organizationInput.required = true;
            messageHint.textContent = 'Describe your project requirements, timeline, or any questions';
        } else {
            messageHint.textContent = 'Share your query, project details, or internship requirements';
        }
    });

    // Start OTP Timer
    function startOtpTimer(duration) {
        let timeLeft = duration;
        
        otpTimer.style.display = 'block';
        resendOtpBtn.style.display = 'none';
        
        otpTimerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            otpTimer.textContent = `OTP expires in ${minutes}:${String(seconds).padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(otpTimerInterval);
                otpTimer.textContent = 'OTP expired. Please request a new one.';
                resendOtpBtn.style.display = 'inline-block';
            }
            
            timeLeft--;
        }, 1000);
    }

    // Send OTP
    sendOtpBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const name = fullNameInput.value.trim();
        
        // Validate email
        if (!email || !isValidEmail(email)) {
            showAlert('Please enter a valid email address');
            emailInput.focus();
            return;
        }
        
        // Show loading state
        sendOtpBtn.textContent = 'Sending...';
        sendOtpBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact/otp/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }
            
            // Show OTP input
            sendOtpBtn.style.display = 'none';
            otpInputGroup.style.display = 'block';
            
            // Start timer (5 minutes)
            startOtpTimer(300);
            
            showAlert('OTP sent to your email!', 'success');
            
        } catch (error) {
            console.error('Error sending OTP:', error);
            showAlert(error.message || 'Failed to send OTP. Please try again.');
            sendOtpBtn.textContent = 'Send OTP to Email';
            sendOtpBtn.disabled = false;
        }
    });

    // Verify OTP
    verifyOtpBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const otp = otpInput.value.trim();
        
        if (!otp || otp.length !== 6) {
            showAlert('Please enter a valid 6-digit OTP');
            return;
        }
        
        verifyOtpBtn.textContent = 'Verifying...';
        verifyOtpBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Invalid OTP');
            }
            
            // OTP Verified
            isOtpVerified = true;
            clearInterval(otpTimerInterval);
            
            // Hide OTP section, show verified message
            otpInputGroup.style.display = 'none';
            otpTimer.style.display = 'none';
            otpVerified.style.display = 'flex';
            
            // Enable submit button
            submitBtn.disabled = false;
            
            showAlert('Email verified successfully!', 'success');
            
        } catch (error) {
            console.error('Error verifying OTP:', error);
            showAlert(error.message || 'Invalid OTP. Please try again.');
            otpInput.value = '';
            otpInput.focus();
            verifyOtpBtn.textContent = 'Verify';
            verifyOtpBtn.disabled = false;
        }
    });

    // Resend OTP
    resendOtpBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const name = fullNameInput.value.trim();
        
        resendOtpBtn.textContent = 'Sending...';
        resendOtpBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact/otp/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to resend OTP');
            }
            
            otpInput.value = '';
            startOtpTimer(300);
            
            showAlert('New OTP sent to your email!', 'success');
            
        } catch (error) {
            console.error('Error resending OTP:', error);
            showAlert(error.message || 'Failed to resend OTP. Please try again.');
        }
        
        resendOtpBtn.textContent = 'Resend OTP';
        resendOtpBtn.disabled = false;
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!isOtpVerified) {
            showAlert('Please verify your email with OTP first.');
            return;
        }
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = {
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: document.getElementById('countryCode').value + ' ' + document.getElementById('phone').value.trim(),
            userType: userTypeSelect.value,
            institution: institutionInput.value.trim() || null,
            organization: organizationInput.value.trim() || null,
            message: document.getElementById('message').value.trim()
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit form');
            }
            
            // Show success message
            form.style.display = 'none';
            formSuccess.style.display = 'block';
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showAlert(error.message || 'Failed to send message. Please try again.');
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    // Send Another Message
    sendAnotherBtn.addEventListener('click', () => {
        // Reset form
        form.reset();
        form.style.display = 'flex';
        formSuccess.style.display = 'none';
        
        // Reset OTP state
        isOtpVerified = false;
        otpInputGroup.style.display = 'none';
        otpVerified.style.display = 'none';
        sendOtpBtn.style.display = 'block';
        sendOtpBtn.textContent = 'Send OTP to Email';
        sendOtpBtn.disabled = false;
        
        // Reset submit button
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = true;
        
        // Reset conditional fields
        institutionField.style.display = 'none';
        organizationField.style.display = 'none';
        messageHint.textContent = 'Share your query, project details, or internship requirements';
    });

    // Validate Form
    function validateForm() {
        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = document.getElementById('phone').value.trim();
        const userType = userTypeSelect.value;
        const message = document.getElementById('message').value.trim();
        
        if (!fullName) {
            showAlert('Please enter your full name');
            return false;
        }
        
        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email address');
            return false;
        }
        
        if (!phone || phone.length < 10) {
            showAlert('Please enter a valid phone number');
            return false;
        }
        
        if (!userType) {
            showAlert('Please select your category (Student / Company)');
            return false;
        }
        
        if (userType === 'student' && !institutionInput.value.trim()) {
            showAlert('Please enter your institution name');
            return false;
        }
        
        if (userType === 'company' && !organizationInput.value.trim()) {
            showAlert('Please enter your organization name');
            return false;
        }
        
        if (!message) {
            showAlert('Please enter your message');
            return false;
        }
        
        return true;
    }

    // Email Validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show Alert
    function showAlert(message, type = 'error') {
        // You can replace this with a nicer toast notification
        alert(message);
    }
}

/* ------------------------------------------------
   UTILITY FUNCTIONS
   ------------------------------------------------ */
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
