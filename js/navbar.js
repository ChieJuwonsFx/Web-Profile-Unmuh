document.addEventListener("DOMContentLoaded", () => {
    feather.replace();

    // --- Logika Navbar ---
    const navbar = document.getElementById("navbar");
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const navLinks = document.getElementById("nav-links");

    window.addEventListener("scroll", () => {
        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        }
    });

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener("click", (e) => {
            e.stopPropagation(); 
            navLinks.classList.toggle("active");
            hamburgerMenu.classList.toggle("open");
            hamburgerMenu.innerHTML = navLinks.classList.contains("active") ?
                '<i data-feather="x"></i>' :
                '<i data-feather="menu"></i>';
            feather.replace();
        });
    }

    function closeMobileMenu() {
        if (navLinks && navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
            hamburgerMenu.classList.remove("open");
            hamburgerMenu.innerHTML = '<i data-feather="menu"></i>';
            feather.replace();
        }
    }

    document.querySelectorAll(".navbar__links a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (e) => {
        if (navLinks && hamburgerMenu && !navLinks.contains(e.target) && !hamburgerMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });


    // --- Logika Theme Switcher 
    const themeCheckbox = document.getElementById("theme-checkbox");
    const handleIconContainer = document.querySelector(".navbar__slider-handle");

    const applyTheme = (theme) => {
        document.body.classList.toggle("dark-mode", theme === "dark");

        if (themeCheckbox) {
            themeCheckbox.checked = theme === "dark";
        }

        const iconName = theme === "dark" ? "moon" : "sun";
        if (handleIconContainer) {
            handleIconContainer.innerHTML = `<i data-feather="${iconName}" class="handle-icon"></i>`;
            feather.replace(); 
        }

        localStorage.setItem("theme", theme);
    };

    if (themeCheckbox) {
        themeCheckbox.addEventListener("change", () => {
            applyTheme(themeCheckbox.checked ? "dark" : "light");
        });
    }

    const savedTheme =
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ?
            "dark" :
            "light");

    applyTheme(savedTheme);
});