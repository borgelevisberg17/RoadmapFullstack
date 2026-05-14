let roadmapsData = {};
let resourcesData = {};
let currentRoadmap = 'fullstack';

async function fetchData() {
    try {
        const [roadmapsRes, resourcesRes] = await Promise.all([
            fetch('data/roadmaps.json'),
            fetch('data/resources.json')
        ]);
        roadmapsData = await roadmapsRes.json();
        resourcesData = await resourcesRes.json();
        loadRoadmap(currentRoadmap);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

function loadRoadmap(id) {
    currentRoadmap = id;
    const roadmap = roadmapsData[id];
    if (!roadmap) return;

    // Update UI active state in sidebar
    const roadmapList = document.getElementById('roadmap-list');
    if (roadmapList) {
        roadmapList.querySelectorAll('li').forEach(li => {
            li.classList.remove('active');
            if (li.textContent.toLowerCase().includes(id.toLowerCase())) {
                li.classList.add('active');
            }
        });
    }

    const titleEl = document.getElementById('roadmap-title');
    if (titleEl) titleEl.textContent = roadmap.title;

    const descEl = document.getElementById('roadmap-description');
    if (descEl) descEl.textContent = roadmap.description;

    const contentArea = document.getElementById('roadmap-content');
    if (!contentArea) return;
    contentArea.innerHTML = '';

    if (roadmap.levels) {
        for (const levelKey in roadmap.levels) {
            const level = roadmap.levels[levelKey];
            const levelSection = document.createElement('div');
            levelSection.className = 'level-section';
            levelSection.innerHTML = `<h2 style="margin: 20px 0; border-bottom: 2px solid var(--primary-color); padding-bottom: 5px;">${level.title}</h2>`;

            const levelGrid = document.createElement('div');
            levelGrid.className = 'roadmap-grid';

            level.steps.forEach(step => {
                const card = document.createElement('div');
                card.className = 'category-card';

                let itemsHtml = '';
                step.items.forEach(item => {
                    const isChecked = getProgress(id, item);
                    const count = getLearningCount(item);
                    itemsHtml += `
                        <div class="tech-tag-container" style="display: flex; align-items: center; gap: 5px; margin-bottom: 5px;">
                            <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleProgress('${id}', '${item}', this.checked)">
                            <a href="javascript:void(0)" class="tech-tag" onclick="showResources('${item}')">
                                ${item}
                            </a>
                            <button class="btn btn-outline" style="padding: 2px 5px; font-size: 0.6rem;" onclick="incrementLearning('${item}')">
                                <i class='bx bx-user-plus'></i> Estou aprendendo
                            </button>
                            <span class="learning-count" id="count-${item.replace(/[^a-zA-Z0-9]/g, '')}">${count} estudando</span>
                        </div>
                    `;
                });

                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3>${step.category}</h3>
                        ${step.project ? `<i class='bx bx-briefcase' title="Projeto Sugerido" style="color: var(--primary-color); cursor: help;" onclick="alert('Projeto Sugerido: ${step.project}')"></i>` : ''}
                    </div>
                    <div class="tech-items" style="flex-direction: column; align-items: flex-start;">
                        ${itemsHtml}
                    </div>
                `;
                levelGrid.appendChild(card);
            });
            levelSection.appendChild(levelGrid);
            contentArea.appendChild(levelSection);
        }
    } else if (roadmap.steps) {
        // Fallback for old format
        roadmap.steps.forEach(step => {
            const card = document.createElement('div');
            card.className = 'category-card';

            let itemsHtml = '';
            step.items.forEach(item => {
                const isChecked = getProgress(id, item);
                const count = getLearningCount(item);
                itemsHtml += `
                    <div class="tech-tag-container" style="display: flex; align-items: center; gap: 5px; margin-bottom: 5px;">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleProgress('${id}', '${item}', this.checked)">
                        <a href="javascript:void(0)" class="tech-tag" onclick="showResources('${item}')">
                            ${item}
                        </a>
                        <button class="btn btn-outline" style="padding: 2px 5px; font-size: 0.6rem;" onclick="incrementLearning('${item}')">
                            <i class='bx bx-user-plus'></i> Estou aprendendo
                        </button>
                        <span class="learning-count" id="count-${item.replace(/[^a-zA-Z0-9]/g, '')}">${count} estudando</span>
                    </div>
                `;
            });

            card.innerHTML = `
                <h3>${step.category}</h3>
                <div class="tech-items" style="flex-direction: column; align-items: flex-start;">
                    ${itemsHtml}
                </div>
            `;
            contentArea.appendChild(card);
        });
    }
}

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

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-toggle i').className = 'bx bx-sun';
    }
}

// Progress Management
function toggleProgress(roadmapId, item, checked) {
    const progress = JSON.parse(localStorage.getItem('roadmapProgress') || '{}');
    if (!progress[roadmapId]) progress[roadmapId] = {};
    progress[roadmapId][item] = checked;
    localStorage.setItem('roadmapProgress', JSON.stringify(progress));
}

function getProgress(roadmapId, item) {
    const progress = JSON.parse(localStorage.getItem('roadmapProgress') || '{}');
    return progress[roadmapId] ? progress[roadmapId][item] : false;
}

// Learning Count Simulation
function getLearningCount(item) {
    const counts = JSON.parse(localStorage.getItem('learningCounts') || '{}');
    if (!counts[item]) {
        counts[item] = Math.floor(Math.random() * 100) + 1; // Initial random count
        localStorage.setItem('learningCounts', JSON.stringify(counts));
    }
    return counts[item];
}

function incrementLearning(item) {
    const counts = JSON.parse(localStorage.getItem('learningCounts') || '{}');
    counts[item] = (counts[item] || 0) + 1;
    localStorage.setItem('learningCounts', JSON.stringify(counts));
    const elementId = `count-${item.replace(/[^a-zA-Z0-9]/g, '')}`;
    const el = document.getElementById(elementId);
    if (el) el.textContent = `${counts[item]} estudando`;
}

// Modals
function showResources(tech) {
    const resource = resourcesData[tech];
    document.getElementById('modal-tech-name').textContent = tech;
    const details = document.getElementById('modal-tech-details');

    if (resource) {
        details.innerHTML = `
            <p><strong>Documentação Oficial:</strong> <a href="${resource.docs}" target="_blank">${resource.docs}</a></p>

            <div style="margin-top: 15px;">
                <strong>Canais do YouTube:</strong>
                <p style="font-size: 0.9rem;">${resource.youtube ? resource.youtube.join(', ') : 'Em breve'}</p>
            </div>

            <div style="margin-top: 15px;">
                <strong>Sugestões de Livros:</strong>
                <ul style="font-size: 0.9rem;">${resource.books ? resource.books.map(b => `<li>${b}</li>`).join('') : '<li>Em breve</li>'}</ul>
            </div>

            <div style="margin-top: 15px;">
                <strong>Cursos Recomendados:</strong>
                <ul style="font-size: 0.9rem;">${resource.courses.map(c => `<li><a href="${c}" target="_blank">${c}</a></li>`).join('')}</ul>
            </div>

            <div style="margin-top: 15px;">
                <strong>Projetos Práticos:</strong>
                <ul style="font-size: 0.9rem;">${resource.projects.map(p => `<li>${p}</li>`).join('')}</ul>
            </div>
        `;
    } else {
        details.innerHTML = `<p>Recursos para ${tech} em breve!</p>`;
    }
    document.getElementById('resource-modal').style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Export
async function exportRoadmap() {
    const element = document.querySelector('.content-area');
    if (!element || typeof html2canvas === 'undefined') return;

    const canvas = await html2canvas(element, {
        backgroundColor: getComputedStyle(document.body).backgroundColor
    });
    const link = document.createElement('a');
    link.download = `roadmap-${currentRoadmap}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

function copyShareLink() {
    const url = new URL(window.location.href);
    url.searchParams.set('roadmap', currentRoadmap);
    navigator.clipboard.writeText(url.toString()).then(() => {
        alert("Link copiado para a área de transferência!");
    });
}

window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    const urlParams = new URLSearchParams(window.location.search);
    const roadmapParam = urlParams.get('roadmap');
    if (roadmapParam) currentRoadmap = roadmapParam;

    fetchData();
});

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}
