// LOGIN VALIDATION
function handleLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            showNotification('Please enter email and password.', 'error');
            return;
        }
        if (password.length < 3) {
            showNotification('Password must be at least 3 characters.', 'error');
            return;
        }
        
        sessionStorage.setItem('isLoggedIn', 'true');
        showNotification('Login successful! Redirecting to Home...', 'success');
        setTimeout(() => {
            window.location.href = 'home.html';  // ✅ CHANGED: Now goes to Home page
        }, 1000);
    });
}

// Password Toggle
function setupPasswordToggle() {
    const toggleBtn = document.querySelector('.toggle-password');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            toggleBtn.classList.toggle('fa-eye');
            toggleBtn.classList.toggle('fa-eye-slash');
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideIn 0.3s ease;
        border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0f6b8c'};
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to style
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// PROTECT ROUTES
function protectRoutes() {
    const protectedPages = ['dashboard.html', 'home.html', 'about.html', 'contact.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const loggedIn = sessionStorage.getItem('isLoggedIn');
        if (!loggedIn && currentPage !== 'index.html') {
            window.location.href = 'index.html';
        }
    }
}

// LOGOUT FUNCTIONALITY
function setupLogout() {
    const logoutBtns = document.querySelectorAll('[id^="logoutBtn"]');
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('isLoggedIn');
                showNotification('Logged out successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 500);
            });
        }
    });
}

// DARK MODE TOGGLE
function setupDarkMode() {
    const toggles = document.querySelectorAll('[id^="themeToggle"]');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcons(true);
    }
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcons(isDark);
            showNotification(`${isDark ? 'Dark' : 'Light'} mode activated`, 'info');
        });
    });
}

function updateThemeIcons(isDark) {
    const toggles = document.querySelectorAll('[id^="themeToggle"]');
    toggles.forEach(toggle => {
        toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// MOBILE MENU TOGGLE
function mobileMenuToggle() {
    const toggle = document.getElementById('mobileMenu');
    const navLinks = document.querySelector('.nav-links');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
}

// CONTACT FORM HANDLER
function handleContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Thank you! Your message has been received.', 'success');
            contactForm.reset();
        });
    }
}

// ANIMATE ON SCROLL
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card-enhanced, .about-card, .kpi-card, .chart-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    protectRoutes();
    handleLogin();
    setupPasswordToggle();
    setupLogout();
    setupDarkMode();
    mobileMenuToggle();
    handleContactForm();
    setupScrollAnimations();
});
