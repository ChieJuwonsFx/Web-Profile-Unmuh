document.addEventListener("DOMContentLoaded", () => {
    const staffCards = document.querySelectorAll('.staff-card');
    const filterButtons = document.querySelectorAll('.filter-button');

    if (staffCards.length === 0 || filterButtons.length === 0) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
        const layerBack = heroSection.querySelector('.layer-back');
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            if (layerBack) {
                layerBack.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            }
        });
    }
    
    function filterStaff(filterType) {
        staffCards.forEach(card => {
            const cardType = card.dataset.type;
            const isVisible = (filterType === 'all' || cardType === filterType);

            card.classList.toggle('hidden', !isVisible);

            if (isVisible) {
                observer.observe(card);
            } else {
                observer.unobserve(card);
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterType = button.dataset.filter;
            filterStaff(filterType);
        });
    });

    const initialFilter = document.querySelector('.filter-button.active')?.dataset.filter || 'all';
    filterStaff(initialFilter);
});