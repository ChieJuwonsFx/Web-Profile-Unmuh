document.addEventListener('DOMContentLoaded', () => {

    feather.replace();

    const parallaxBg = document.querySelector('.parallax-bg');

    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;

            parallaxBg.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        });
    }

    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
});