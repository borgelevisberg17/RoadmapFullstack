  function toggleTheme() {
            const body = document.body;
            const icon = document.querySelector('.theme-toggle i');
            
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                icon.className = 'bx bx-moon';
            } else {
                body.setAttribute('data-theme', 'dark');
                icon.className = 'bx bx-sun';
            }
        }

        // Animate progress bars
        function animateProgressBars() {
            const progressBars = document.querySelectorAll('.progress');
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            });
        }

        // Animate on scroll
        function initScrollAnimations() {
            gsap.registerPlugin(ScrollTrigger);

            gsap.utils.toArray('.skill-card').forEach(card => {
                gsap.from(card, {
                    y: 100,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom-=100",
                        toggleActions: "play none none reverse"
                    }
                });
            });

            gsap.utils.toArray('.timeline-item').forEach(item => {
                gsap.from(item, {
                    x: item.classList.contains('right') ? 100 : -100,
                    opacity: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: item,
                        start: "top bottom-=100",
                        toggleActions: "play none none reverse"
                    }
                });
            });
        }

        // Initialize animations
        window.addEventListener('load', () => {
            animateProgressBars();
            initScrollAnimations();
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });