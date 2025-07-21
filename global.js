document.addEventListener("DOMContentLoaded", () => {
    feather.replace(); // Inisialisasi Feather Icons secara global

    // --- Navbar Logic ---
    const navbar = document.getElementById("navbar");
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const navLinks = document.getElementById("nav-links");
    const themeToggle = document.getElementById("theme-toggle");

    // Navbar scroll effect
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    });

    // Hamburger menu toggle
    hamburgerMenu.addEventListener("click", (e) => {
        e.stopPropagation(); // Mencegah event klik menyebar ke document
        navLinks.classList.toggle("active");
        hamburgerMenu.classList.toggle("open");
        hamburgerMenu.innerHTML = navLinks.classList.contains("active")
            ? '<i data-feather="x"></i>'
            : '<i data-feather="menu"></i>';
        feather.replace(); // Re-initialize feather icons after changing content
    });

    // Close mobile menu when a link is clicked
    function closeMobileMenu() {
        if (navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
            hamburgerMenu.classList.remove("open");
            hamburgerMenu.innerHTML = '<i data-feather="menu"></i>';
            feather.replace();
        }
    }
    document.querySelectorAll(".navbar__links a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !hamburgerMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // --- Theme Toggle Logic ---
    // Cek preferensi tema dari localStorage atau sistem operasi
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        updateThemeToggleIcon(currentTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.classList.add("dark-mode");
        updateThemeToggleIcon("dark-mode");
    } else {
        document.body.classList.add("light-mode"); // Default to light mode if no preference
        updateThemeToggleIcon("light-mode");
    }

    function updateThemeToggleIcon(theme) {
        if (theme === "dark-mode") {
            themeToggle.innerHTML = '<i data-feather="sun"></i>';
        } else {
            themeToggle.innerHTML = '<i data-feather="moon"></i>';
        }
        feather.replace();
    }

    themeToggle.addEventListener("click", () => {
        if (document.body.classList.contains("dark-mode")) {
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
            localStorage.setItem("theme", "light-mode");
            updateThemeToggleIcon("light-mode");
        } else {
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark-mode");
            updateThemeToggleIcon("dark-mode");
        }
    });

    // --- Animasi Fade In on Scroll (Global Utility) ---
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Ketika 10% elemen terlihat
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Hentikan observasi setelah terlihat
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        observer.observe(el);
    });
});