// ===== GLOBAL VARIABLES =====
let products = [];
let selectedColors = [];
let currentTestimonial = 0;
const totalTestimonials = 3;

// ===== DOM ELEMENTS =====
const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const dashboard = document.getElementById('dashboard');
const logoutBtn = document.getElementById('logoutBtn');
const refreshProductsBtn = document.getElementById('refreshProducts');
const productsGrid = document.getElementById('productsGrid');
const dashboardProducts = document.getElementById('dashboardProducts');
const dashboardProductForm = document.getElementById('dashboardProductForm');
const colorOptions = document.querySelectorAll('#colorOptions .color-option');
const selectedColorsInput = document.getElementById('selectedColors');
const filterBtns = document.querySelectorAll('.filter-btn');
const testimonialTrack = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const faqItems = document.querySelectorAll('.faq-item');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    initEventListeners();
    initTestimonialSlider();
    updateHeaderOnScroll();
    setActiveNavLink();
    animateFloatingElements();
});

// ===== PRODUCTS MANAGEMENT =====
function initProducts() {
    const savedProducts = localStorage.getItem('portfolioProducts');

    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = [
            {
                id: 1,
                name: "Modern Web Template",
                price: 49.99,
                description: "A sleek and responsive web template perfect for business websites.",
                image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
                colors: ["#6C63FF", "#36D1DC", "#34495E"],
                category: "web"
            },
            {
                id: 2,
                name: "E-commerce UI Kit",
                price: 89.99,
                description: "Complete e-commerce UI kit with 50+ screens and components.",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
                colors: ["#FF6584", "#F39C12", "#2ECC71"],
                category: "ui"
            }
        ];
        saveProductsToStorage();
    }
} // ✅ MISSING BRACE FIXED HERE

function saveProductsToStorage() {
    localStorage.setItem('portfolioProducts', JSON.stringify(products));
}

function addProduct(product) {
    product.id = Date.now();
    products.push(product);
    saveProductsToStorage();
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', e => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;

            if (u === 'Admin' && p === 'Admin') {
                dashboard.style.display = 'block';
                loginModal.style.display = 'none';
            } else {
                loginError.style.display = 'block';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            dashboard.style.display = 'none';
        });
    }

    if (dashboardProductForm) {
        dashboardProductForm.addEventListener('submit', e => {
            e.preventDefault();
        });
    }
}

// ===== TESTIMONIAL SLIDER =====
function initTestimonialSlider() {
    if (!prevBtn || !nextBtn || !testimonialTrack) return;

    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
        updateTestimonialSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        updateTestimonialSlider();
    });

    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        updateTestimonialSlider();
    }, 5000);
}

function updateTestimonialSlider() {
    testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
}

// ===== HEADER =====
function updateHeaderOnScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 100);
}

function setActiveNavLink() {}

// ===== ANIMATIONS =====
function animateFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, i) => {
        el.style.animationDelay = `${i * 0.5}s`;
    });
}