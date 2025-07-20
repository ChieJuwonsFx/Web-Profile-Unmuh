document.addEventListener("DOMContentLoaded", () => {
  feather.replace();

  // --- Navbar Logic ---
  const navbar = document.getElementById("navbar");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navLinks = document.getElementById("nav-links");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  hamburgerMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
    hamburgerMenu.classList.toggle("open");
    hamburgerMenu.innerHTML = navLinks.classList.contains("active")
      ? '<i data-feather="x"></i>'
      : '<i data-feather="menu"></i>';
    feather.replace();
  });

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
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !hamburgerMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // --- Theme Switcher Logic ---
  const themeCheckbox = document.getElementById("theme-checkbox");
  const handleIconContainer = document.querySelector(".navbar__slider-handle");

  const applyTheme = (theme) => {
    document.body.classList.toggle("dark-mode", theme === "dark");
    themeCheckbox.checked = theme === "dark";

    const iconName = theme === "dark" ? "moon" : "sun";
    handleIconContainer.innerHTML = `<i data-feather="${iconName}" class="handle-icon"></i>`;
    feather.replace();

    localStorage.setItem("theme", theme);
  };

  themeCheckbox.addEventListener("change", () => {
    applyTheme(themeCheckbox.checked ? "dark" : "light");
  });

  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  applyTheme(savedTheme);

  // --- Header Slider Logic ---
  const slideContainer = document.getElementById("slider-container");
  const slides = document.querySelectorAll(".header__slide");
  const dotsContainer = document.querySelector(".header__slider-dots");
  let currentSlide = 0;
  let slideInterval;

  if (slideContainer && slides.length > 0) {
    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.classList.add("header__dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentSlide = i;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".header__dot");

    const updateSlider = () => {
      if (slideContainer) {
        slideContainer.style.transform = `translateX(-${
          currentSlide * (100 / slides.length)
        }%)`;
      }
      dots.forEach((dot, i) =>
        dot.classList.toggle("active", i === currentSlide)
      );
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlider();
    };

    updateSlider();
  }

  // --- Corrected General Tab Switching Function ---
  function initializeTabs(tabWrapperSelector, contentSelector) {
    const tabWrapper = document.querySelector(tabWrapperSelector);
    if (!tabWrapper) return;

    const tabs = tabWrapper.querySelectorAll(
      ".about__tab-button, .infographic__tab-button"
    );
    const indicator = tabWrapper.querySelector(
      ".about__tab-indicator, .infographic__tab-indicator"
    );
    const contents = document.querySelectorAll(contentSelector);

    function moveIndicator(target) {
      if (!target || !indicator) return;
      indicator.style.width = `${target.offsetWidth}px`;
      indicator.style.left = `${target.offsetLeft}px`;
    }

    const initialActiveTab = tabWrapper.querySelector(".active");
    if (initialActiveTab) {
      moveIndicator(initialActiveTab);
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetId = tab.dataset.target;
        const targetContent = document.getElementById(targetId);

        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        moveIndicator(tab);

        contents.forEach((content) => content.classList.remove("active"));
        if (targetContent) targetContent.classList.add("active");
      });
    });

    window.addEventListener("resize", () => {
      const activeTab = tabWrapper.querySelector(".active");
      if (activeTab) moveIndicator(activeTab);
    });
  }

  initializeTabs(".about__tabs-wrapper", ".about__tab-content");
  initializeTabs(".infographic__tabs-wrapper", ".infographic__content");

  // --- Accordion Logic ---
  const accordionItems = document.querySelectorAll(".about__accordion-item");
  accordionItems.forEach((item) => {
    const header = item.querySelector(".about__accordion-header");
    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      const parentContainer = item.closest(".about__accordion-container");
      if (parentContainer) {
        parentContainer
          .querySelectorAll(".about__accordion-item")
          .forEach((other) => {
            other.classList.remove("active");
          });
      }
      if (!isActive) item.classList.add("active");
    });
  });

  // --- Animation on Scroll ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (
            entry.target.matches(
              ".about__accordion-item, .about__identity-panel, .infographic__stat-card"
            )
          ) {
            entry.target.classList.add("visible");
          }

          if (entry.target.matches(".infographic__stat-card")) {
            const numberEl = entry.target.querySelector(
              ".infographic__card-number"
            );
            if (numberEl && !numberEl.classList.contains("counted")) {
              countUp(numberEl);
              numberEl.classList.add("counted");
            }
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(
      ".about__accordion-item, .about__identity-panel, .infographic__stat-card"
    )
    .forEach((el) => {
      observer.observe(el);
    });

  // --- Number Count Up Animation ---
  function countUp(el) {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const increment = target / totalFrames;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.innerText = target.toLocaleString("id-ID");
        clearInterval(timer);
      } else {
        el.innerText = Math.ceil(current).toLocaleString("id-ID");
      }
    }, frameDuration);
  }
});

// --- Final Prestasi Slider Logic (with Looping) ---
const sliderDesktop = document.getElementById("prestasi-slider-desktop");
const sliderTrackMobile = document.getElementById("prestasi-slider-track");

if (sliderDesktop && sliderTrackMobile) {
  const prestasiData = [
    {
      title: "Juara 1 Lomba UI/UX Nasional",
      description:
        'Merancang aplikasi "EduConnect" yang inovatif untuk pendidikan, tim SI berhasil memenangkan kompetisi desain antarmuka tingkat nasional.',
      image:
        "https://images.unsplash.com/photo-1556740738-b6a63e2775d2?auto=format&fit=crop&q=80&w=800",
      level: "Nasional",
    },
    {
      title: "Runner-Up International Hackathon",
      description:
        "Tim TI menciptakan solusi berbasis AI untuk efisiensi energi dan berhasil meraih posisi kedua di ajang bergengsi ini.",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      level: "Internasional",
    },
    {
      title: "Finalis Business Plan Competition",
      description:
        'Gagasan startup "AgroTech" untuk modernisasi pertanian berhasil menembus babak final kompetisi rencana bisnis regional.',
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      level: "Regional",
    },
    {
      title: "Hibah Penelitian DIKTI",
      description:
        "Proposal penelitian tentang keamanan data pada sistem IoT berhasil mendapatkan dana hibah dari DIKTI untuk pengembangan lebih lanjut.",
      image:
        "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=800",
      level: "Riset",
    },
    {
      title: "Best Paper di Konferensi Ilmiah",
      description:
        "Artikel ilmiah mengenai implementasi Machine Learning untuk prediksi pasar saham dianugerahi sebagai makalah terbaik.",
      image:
        "https://images.unsplash.com/photo-1599658880436-c61792e70672?auto=format&fit=crop&q=80&w=800",
      level: "Publikasi",
    },
  ];

  function createCardHTML(data) {
    return `
      <div class="prestasi-card__image-container">
          <img src="${data.image}" alt="${data.title}" class="prestasi-card__image">
            <span class="prestasi-card__level">${data.level}</span>
          </div>
          <div class="prestasi-card__content">
                <h3 class="prestasi-card__title">${data.title}</h3>
                    <p class="prestasi-card__description">${data.description}</p>
                    <a href="#" class="prestasi-card__link">Baca Selengkapnya <i data-feather="arrow-right"></i></a>
          </div>
      `;
  }

  prestasiData.forEach((data) => {
    const cardDesktop = document.createElement("div");
    cardDesktop.className = "prestasi-card";
    cardDesktop.innerHTML = createCardHTML(data);
    sliderDesktop.appendChild(cardDesktop);

    const slideMobile = document.createElement("div");
    slideMobile.className = "prestasi-slider-mobile__slide";
    const cardMobile = document.createElement("div");
    cardMobile.className = "prestasi-card";
    cardMobile.innerHTML = createCardHTML(data);
    slideMobile.appendChild(cardMobile);
    sliderTrackMobile.appendChild(slideMobile);
  });

  feather.replace();

  // Desktop Slider Logic
  const cardsDesktop = document.querySelectorAll(
    "#prestasi-slider-desktop .prestasi-card"
  );
  const prevButton = document.getElementById("prestasi-prev");
  const nextButton = document.getElementById("prestasi-next");
  let activeIndexDesktop = 0;

  function updateSliderDesktop() {
    cardsDesktop.forEach((card, i) => {
      const offset = i - activeIndexDesktop;
      const isVisible = Math.abs(offset) <= 2;
      const translateX = offset * 150;
      const scale = 1 - Math.abs(offset) * 0.2;
      const rotateY = offset * -10;
      const zIndex = 100 - Math.abs(offset);
      const blur = Math.abs(offset) > 0 ? 4 : 0;
      const opacity = isVisible ? (Math.abs(offset) > 1 ? 0 : 0.7) : 0;
      const pointerEvents = offset === 0 ? "auto" : "none";
      card.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
      card.style.zIndex = zIndex;
      card.style.filter = `blur(${blur}px)`;
      card.style.opacity = offset === 0 ? "1" : opacity;
      card.style.pointerEvents = pointerEvents;
    });
  }
  nextButton.addEventListener("click", () => {
    activeIndexDesktop = (activeIndexDesktop + 1) % cardsDesktop.length;
    updateSliderDesktop();
  });
  prevButton.addEventListener("click", () => {
    activeIndexDesktop =
      (activeIndexDesktop - 1 + cardsDesktop.length) % cardsDesktop.length;
    updateSliderDesktop();
  });
  updateSliderDesktop();

  // Mobile Slider Logic
  const sliderMobileContainer = document.getElementById(
    "prestasi-slider-mobile"
  );
  const progressBar = document.getElementById("prestasi-progress-bar");
  const currentIndexEl = document.getElementById("prestasi-current-index");
  const totalSlidesEl = document.getElementById("prestasi-total-slides");
  let activeIndexMobile = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  totalSlidesEl.textContent = prestasiData.length;

  function updateSliderMobile() {
    const offset = -activeIndexMobile * 100;
    sliderTrackMobile.style.transform = `translateX(${offset}%)`;
    const progress = ((activeIndexMobile + 1) / prestasiData.length) * 100;
    progressBar.style.width = `${progress}%`;
    currentIndexEl.textContent = activeIndexMobile + 1;
  }

  sliderMobileContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchEndX = 0;
  });
  sliderMobileContainer.addEventListener("touchmove", (e) => {
    touchEndX = e.touches[0].clientX;
  });
  sliderMobileContainer.addEventListener("touchend", () => {
    if (touchEndX === 0) return;
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      activeIndexMobile = (activeIndexMobile + 1) % prestasiData.length;
    } else if (touchEndX - touchStartX > swipeThreshold) {
      activeIndexMobile =
        (activeIndexMobile - 1 + prestasiData.length) % prestasiData.length;
    }
    updateSliderMobile();
  });

  updateSliderMobile();
}
