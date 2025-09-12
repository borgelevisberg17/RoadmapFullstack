function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('.theme-toggle i');

    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        icon.className = 'bx bx-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        icon.className = 'bx bx-sun';
        localStorage.setItem('theme', 'dark');
    }
}

function updateProgress(card) {
    const checkboxes = card.querySelectorAll('input[type="checkbox"]');
    const progress = card.querySelector('.progress');
    const total = checkboxes.length;
    const checked = card.querySelectorAll('input[type="checkbox"]:checked').length;
    const percentage = total > 0 ? (checked / total) * 100 : 0;
    progress.style.width = percentage + '%';
}

function saveProgress() {
    const progressData = {};
    document.querySelectorAll('.skill-card').forEach(card => {
        const cardId = card.id;
        progressData[cardId] = {};
        card.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            progressData[cardId][checkbox.dataset.skill] = checkbox.checked;
        });
    });
    localStorage.setItem('skillProgress', JSON.stringify(progressData));
}

function loadProgress() {
    const savedProgress = localStorage.getItem('skillProgress');
    if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        for (const cardId in progressData) {
            const card = document.getElementById(cardId);
            if (card) {
                for (const skill in progressData[cardId]) {
                    const checkbox = card.querySelector(`input[data-skill="${skill}"]`);
                    if (checkbox) {
                        checkbox.checked = progressData[cardId][skill];
                    }
                }
                updateProgress(card);
            }
        }
    }
}

function initInteractions() {
    document.querySelectorAll('.skill-card').forEach(card => {
        const checkboxes = card.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateProgress(card);
                saveProgress();
            });
        });
        updateProgress(card);
    });
}

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

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-toggle i').className = 'bx bx-sun';
    } else {
        document.body.removeAttribute('data-theme');
        document.querySelector('.theme-toggle i').className = 'bx bx-moon';
    }
}


window.addEventListener('load', () => {
    loadTheme();
    loadProgress();
    initInteractions();
    initScrollAnimations();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});