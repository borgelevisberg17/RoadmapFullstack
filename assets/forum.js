function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

const seedPosts = [
    {
        id: 'p1',
        title: "Como começar com React em 2024?",
        content: "Tenho uma base boa de HTML/CSS e JS básico. Qual o melhor caminho para aprender React agora? Devo ir direto para Next.js ou focar no React puro primeiro?",
        category: "Dúvida Técnica",
        tags: ["react", "frontend", "iniciante"],
        author: "DevAnon",
        reputation: 42,
        date: "2024-05-20T10:00:00Z",
        votes: 15,
        views: 245,
        answers: [
            { id: 'a1', content: "Comece pela documentação oficial (react.dev). É excelente e muito moderna! Foque nos hooks básicos antes de pular para frameworks.", votes: 5, date: "2024-05-21T09:30:00Z", accepted: true, author: "CodeMaster", reputation: 1250 },
            { id: 'a2', content: "Pratique criando pequenos componentes antes de ir para frameworks como Next.js. O entendimento da renderização é fundamental.", votes: 3, date: "2024-05-22T14:20:00Z", accepted: false, author: "ReactNinja", reputation: 85 }
        ]
    },
    {
        id: 'p2',
        title: "Dica: Extensões essenciais para VS Code",
        content: "Minhas favoritas são: Prettier, ESLint, GitLens e Auto Rename Tag. Ajudam muito na produtividade! Esqueci de alguma essencial?",
        category: "Dica / Tutorial",
        tags: ["vscode", "produtividade", "ferramentas"],
        author: "ToolSmith",
        reputation: 156,
        date: "2024-05-22T16:45:00Z",
        votes: 8,
        views: 112,
        answers: []
    },
    {
        id: 'p3',
        title: "Vale a pena fazer faculdade de TI?",
        content: "Estou na dúvida se foco em cursos online ou se entro em uma graduação. O que acham do mercado atual em relação a diploma?",
        category: "Carreira",
        tags: ["carreira", "faculdade", "mercado"],
        author: "FutureDev",
        reputation: 12,
        date: "2024-05-24T11:20:00Z",
        votes: 22,
        views: 560,
        answers: [
            { id: 'a3', content: "A faculdade ajuda muito no networking e estágio. Os cursos dão a base técnica rápida. Se tiver tempo e recurso, faça os dois.", votes: 12, date: "2024-05-24T15:00:00Z", accepted: false, author: "SeniorEng", reputation: 3400 }
        ]
    },
    {
        id: 'p4',
        title: "Otimização de Queries complexas em PostgreSQL",
        content: "Estou com uma query que faz muitos JOINs e está levando mais de 2 segundos. Já usei EXPLAIN ANALYZE, mas não estou sabendo interpretar os nós de 'Seq Scan'. Qual a melhor estratégia para indexação nesse caso?",
        category: "Dúvida Técnica",
        tags: ["postgresql", "database", "performance"],
        author: "DBA_Junior",
        reputation: 85,
        date: "2024-06-04T14:20:00Z",
        votes: 12,
        views: 310,
        answers: [
            { id: 'a4', content: "O 'Seq Scan' indica que o Postgres está lendo a tabela inteira. Verifique se os campos usados no JOIN e no WHERE possuem índices (B-tree normalmente). Considere também o uso de índices compostos se você filtra por mais de uma coluna frequentemente.", votes: 8, date: "2024-06-04T16:00:00Z", accepted: true, author: "PostgresGuru", reputation: 2100 }
        ]
    },
    {
        id: 'p5',
        title: "Dúvida: CI/CD para Frontend com GitHub Actions",
        content: "Como configurar um workflow que rode os testes, faça o build e envie para o S3 apenas se estiver na branch main? Gostaria de saber como gerenciar as Secrets (chaves da AWS) de forma segura.",
        category: "Dúvida Técnica",
        tags: ["devops", "github-actions", "frontend"],
        author: "DevOpsLearner",
        reputation: 23,
        date: "2024-06-05T09:00:00Z",
        votes: 7,
        views: 185,
        answers: [
            { id: 'a5', content: "Use o campo 'on: push: branches: [main]' para filtrar a branch. Para as chaves, vá em Settings > Secrets > Actions no seu repo. No YAML, acesse via ${{ secrets.AWS_ACCESS_KEY_ID }}.", votes: 10, date: "2024-06-05T10:30:00Z", accepted: false, author: "CloudMaster", reputation: 1250 }
        ]
    }
];

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'agora há pouco';
    if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `há ${Math.floor(diffInSeconds / 86400)} dias`;

    return date.toLocaleDateString('pt-BR');
}

function loadPosts() {
    let posts = JSON.parse(localStorage.getItem('forumPosts'));

    if (!posts || posts.length === 0) {
        posts = seedPosts;
        localStorage.setItem('forumPosts', JSON.stringify(posts));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    const select = document.getElementById('filter-category');

    // Only sync from URL if the select hasn't been modified yet or if it's the first load
    if (catParam && select && !select.dataset.manuallyChanged) {
        if (select.value !== catParam) {
            select.value = catParam;
            const trigger = select.closest('.custom-select-wrapper')?.querySelector('.custom-select-trigger');
            if (trigger) {
                const option = Array.from(select.options).find(o => o.value === catParam);
                if (option) trigger.textContent = option.textContent;
            }
        }
    }

    const filterCategory = document.getElementById('filter-category')?.value || 'Tudo';
    const searchTerm = document.getElementById('forum-search')?.value.toLowerCase() || '';
    const container = document.getElementById('forum-posts');
    const questionsCountEl = document.getElementById('questions-count');
    const questionView = document.getElementById('question-view');

    if (!container) return;

    // Switch view if ID in URL
    const postId = urlParams.get('post');

    if (postId) {
        showPost(postId, false);
        return;
    }

    container.style.display = 'block';
    questionView.style.display = 'none';
    document.getElementById('forum-title').textContent = 'Todas as Perguntas';

    const filteredPosts = posts.filter(post => {
        const matchesCategory = filterCategory === 'Tudo' || post.category === filterCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                             post.content.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    if (questionsCountEl) {
        questionsCountEl.textContent = `${filteredPosts.length} pergunta${filteredPosts.length !== 1 ? 's' : ''}`;
    }

    container.innerHTML = '';

    if (filteredPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.6; padding: 40px;">Nenhuma pergunta encontrada nesta categoria.</p>';
        return;
    }

    [...filteredPosts].reverse().forEach((post) => {
        const hasAccepted = post.answers.some(a => a.accepted);
        const statsHtml = `
            <div class="question-stats">
                <div class="stat-votes"><span class="stat-count">${post.votes || 0}</span> votos</div>
                <div class="stat-answers ${post.answers.length > 0 ? 'has-answers' : ''} ${hasAccepted ? 'is-accepted' : ''}">
                    <span class="stat-count">${post.answers.length}</span> respostas
                </div>
                <div class="stat-views">${post.views || 0} visualizações</div>
            </div>
        `;

        const tagsHtml = (post.tags || []).map(tag => `<span class="tech-tag">${tag}</span>`).join('');

        const card = document.createElement('div');
        card.className = 'question-summary';
        card.style.cursor = 'pointer';
        card.onclick = (e) => {
            // Prevent trigger if clicking on specific links or tags if they had separate actions
            if (e.target.tagName !== 'A' && !e.target.classList.contains('tech-tag')) {
                showPost(post.id);
            }
        };

        card.innerHTML = `
            ${statsHtml}
            <div class="question-content-summary">
                <a href="?post=${post.id}" class="question-summary-title" onclick="event.preventDefault(); showPost('${post.id}')">${escapeHTML(post.title)}</a>
                <div class="question-summary-excerpt">${escapeHTML(post.content)}</div>
                <div class="question-summary-meta">
                    <div class="question-tags">${tagsHtml}</div>
                    <div class="user-card">
                        <span class="username">${escapeHTML(post.author || 'Anônimo')}</span>
                        <span class="reputation">${post.reputation || 1}</span>
                        <span class="date">perguntou ${getRelativeTime(post.date)}</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    updateForumStats(posts);
}

function showPost(id, shouldPushState = true) {
    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    const post = posts.find(p => p.id === id);
    if (!post) {
        backToForum();
        return;
    }

    // Increment views
    post.views = (post.views || 0) + 1;
    localStorage.setItem('forumPosts', JSON.stringify(posts));

    // Update URL
    if (shouldPushState) {
        const url = new URL(window.location);
        url.searchParams.set('post', id);
        window.history.pushState({}, '', url);
    }

    const container = document.getElementById('forum-posts');
    const questionView = document.getElementById('question-view');
    const content = document.getElementById('single-post-container');
    const titleEl = document.getElementById('forum-title');
    const searchContainer = document.getElementById('forum-search-container');

    container.style.display = 'none';
    questionView.style.display = 'block';
    titleEl.textContent = post.title;

    // Hide filters, search and "Ask" button for a cleaner view
    const filters = document.querySelector('.forum-filters');
    const askBtn = document.querySelector('header .btn');
    if (filters) filters.style.display = 'none';
    if (askBtn) askBtn.style.display = 'none';
    if (searchContainer) searchContainer.style.display = 'none';

    let answersHtml = '';
    post.answers.sort((a, b) => (b.votes || 0) - (a.votes || 0)).forEach(answer => {
        answersHtml += `
            <div class="answer-item">
                <div class="post-layout">
                    <div class="voter">
                        <i class='bx bxs-up-arrow' onclick="voteAnswer('${post.id}', '${answer.id}', 1)"></i>
                        <span class="vote-count">${answer.votes || 0}</span>
                        <i class='bx bxs-down-arrow' onclick="voteAnswer('${post.id}', '${answer.id}', -1)"></i>
                        ${answer.accepted ? "<i class='bx bxs-check-circle' style='color: #5eba7d; font-size: 2rem; margin-top: 10px;'></i>" : ""}
                    </div>
                    <div class="post-text">
                        <p>${escapeHTML(answer.content)}</p>
                        <div class="post-signature-container">
                            <div class="user-card post-signature">
                                <div>
                                    <span class="date">respondido ${getRelativeTime(answer.date)}</span>
                                    <span class="username">${escapeHTML(answer.author || 'Anônimo')}</span>
                                    <span class="reputation">${answer.reputation || 1}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    content.innerHTML = `
        <div class="post-view">
            <div class="post-header-meta">
                <span>Perguntado <strong>${getRelativeTime(post.date)}</strong></span>
                <span>Visualizada <strong>${post.views} vezes</strong></span>
                <span>Categoria: <strong>${post.category || 'Geral'}</strong></span>
            </div>

            <div class="post-layout post-main-content">
                <div class="voter">
                    <i class='bx bxs-up-arrow' title="Útil" onclick="votePost('${post.id}', 1)"></i>
                    <span class="vote-count">${post.votes || 0}</span>
                    <i class='bx bxs-down-arrow' title="Não útil" onclick="votePost('${post.id}', -1)"></i>
                </div>
                <div class="post-text">
                    <div class="post-body-content">${escapeHTML(post.content).replace(/\n/g, '<br>')}</div>
                    <div class="question-tags">
                        ${(post.tags || []).map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="post-signature-container">
                        <div class="user-card post-signature">
                            <span class="date">perguntado ${getRelativeTime(post.date)}</span>
                            <div class="user-info">
                                <span class="username">${escapeHTML(post.author || 'Anônimo')}</span>
                                <span class="reputation">${post.reputation || 1}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="answers-section">
                <h3 class="answers-count-title">${post.answers.length} Resposta${post.answers.length !== 1 ? 's' : ''}</h3>
                ${answersHtml}
            </div>

            <div style="margin-top: 40px;">
                <h3 style="margin-bottom: 15px; font-weight: 400;">Sua Resposta</h3>
                <textarea id="reply-content" rows="8" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 3px;"></textarea>
                <button class="btn" style="margin-top: 15px;" onclick="submitReply('${post.id}')">Publicar sua resposta</button>
            </div>
        </div>
    `;
}

function backToForum() {
    const url = new URL(window.location);
    url.searchParams.delete('post');
    window.history.pushState({}, '', url);

    const filters = document.querySelector('.forum-filters');
    const askBtn = document.querySelector('header .btn');
    const titleEl = document.getElementById('forum-title');
    const searchContainer = document.getElementById('forum-search-container');

    if (filters) filters.style.display = 'flex';
    if (askBtn) askBtn.style.display = 'block';
    if (searchContainer) searchContainer.style.display = 'block';
    if (titleEl) titleEl.textContent = 'Todas as Perguntas';

    loadPosts();
}

function filterByCategory(category) {
    const select = document.getElementById('filter-category');
    if (select) select.dataset.manuallyChanged = 'true';

    const url = new URL(window.location);
    url.searchParams.set('category', category);
    url.searchParams.delete('post'); // Back to list if we were in a post
    window.history.pushState({}, '', url);
    loadPosts();
}

function togglePostForm() {
    const form = document.getElementById('post-form');
    const postsList = document.getElementById('forum-posts');
    const stats = document.querySelector('.forum-filters');

    if (form.style.display === 'none') {
        form.style.display = 'block';
        postsList.style.display = 'none';
        stats.style.display = 'none';
    } else {
        form.style.display = 'none';
        postsList.style.display = 'block';
        stats.style.display = 'flex';
    }
}

function submitPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const category = document.getElementById('post-category').value;

    if (!title || !content) {
        alert("Preencha o título e o conteúdo!");
        return;
    }

    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    const newPost = {
        id: 'p' + Date.now(),
        title,
        content,
        category,
        tags: [category.toLowerCase()],
        author: "DevAnon",
        reputation: 1,
        date: new Date().toISOString(),
        votes: 0,
        views: 0,
        answers: []
    };

    posts.push(newPost);
    localStorage.setItem('forumPosts', JSON.stringify(posts));

    // Clear
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';

    togglePostForm();
    loadPosts();
}

function submitReply(postId) {
    const content = document.getElementById('reply-content').value;
    if (!content) return;

    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) return;

    posts[postIndex].answers.push({
        id: 'a' + Date.now(),
        content,
        votes: 0,
        date: new Date().toISOString(),
        author: "RespondedorAnon",
        reputation: 1,
        accepted: false
    });

    localStorage.setItem('forumPosts', JSON.stringify(posts));
    showPost(postId);
}

function votePost(postId, delta) {
    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.votes = (post.votes || 0) + delta;
        localStorage.setItem('forumPosts', JSON.stringify(posts));
        showPost(postId);
    }
}

function voteAnswer(postId, answerId, delta) {
    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    if (post) {
        const answer = post.answers.find(a => a.id === answerId);
        if (answer) {
            answer.votes = (answer.votes || 0) + delta;
            localStorage.setItem('forumPosts', JSON.stringify(posts));
            showPost(postId);
        }
    }
}

function updateForumStats(posts) {
    const statsContainer = document.getElementById('forum-stats');
    if (!statsContainer) return;

    const totalQuestions = posts.length;
    const totalAnswers = posts.reduce((sum, p) => sum + p.answers.length, 0);
    const resolvedCount = posts.filter(p => p.answers.some(a => a.accepted)).length;

    statsContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <span>Total de Perguntas:</span>
                <strong>${totalQuestions}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <span>Total de Respostas:</span>
                <strong>${totalAnswers}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <span>Resolvidas:</span>
                <strong style="color: #5eba7d;">${resolvedCount}</strong>
            </div>
        </div>
    `;
}

window.addEventListener('popstate', () => {
    loadPosts();
});

window.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});
