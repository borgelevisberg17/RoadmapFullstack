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
        category: "Dúvidas Técnicas",
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
        category: "Dúvidas Técnicas",
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
        id: 'p6',
        title: "Melhores técnicas de estudo para conciliar trabalho e estudos",
        content: "Trabalho 8h por dia e estou tentando transicionar para Fullstack. Alguém usa a técnica Pomodoro ou outra forma de organização que realmente funcione?",
        category: "Dicas de Estudo",
        tags: ["estudo", "produtividade", "foco"],
        author: "WorkingDev",
        reputation: 15,
        date: "2024-06-07T10:00:00Z",
        votes: 10,
        views: 150,
        answers: []
    },
    {
        id: 'p7',
        title: "Grupo de estudos focado em React e Next.js para iniciantes",
        content: "Estou montando um grupo no Discord para estudarmos juntos a documentação do Next.js e criar um projeto real. Quem tiver interesse, comenta aqui!",
        category: "Projetos em Grupo",
        tags: ["estudo", "nextjs", "comunidade"],
        author: "CommunityLeader",
        reputation: 88,
        date: "2024-06-08T15:30:00Z",
        votes: 25,
        views: 420,
        answers: []
    },
    {
        id: 'p8',
        title: "Como organizar o tempo para aprender Fullstack do zero?",
        content: "São tantas tecnologias (HTML, CSS, JS, Node, React, Bancos de dados...). Qual a ordem ideal para não se perder?",
        category: "Dicas de Estudo",
        tags: ["roadmap", "fullstack", "aprendizado"],
        author: "NewbieCoder",
        reputation: 5,
        date: "2024-06-09T09:15:00Z",
        votes: 18,
        views: 310,
        answers: []
    },
    {
        id: 'p9',
        title: "Projeto open source: Buscando contribuidores para um App de finanças",
        content: "O projeto está sendo feito com Node.js e React. É uma ótima oportunidade para quem quer colocar o primeiro projeto no portfólio.",
        category: "Projetos em Grupo",
        tags: ["opensource", "portfolio", "nodejs"],
        author: "ProjectOwner",
        reputation: 120,
        date: "2024-06-10T14:00:00Z",
        votes: 14,
        views: 280,
        answers: []
    },
    {
        id: 'p10',
        title: "Como otimizar a performance de renderização em listas gigantes no React?",
        content: "Estou trabalhando em um dashboard que exibe mais de 5.000 itens em uma única lista. Mesmo usando memoização, a interface fica lenta ao filtrar. Quais as melhores estratégias para lidar com esse volume de dados no DOM sem comprometer a UX?",
        category: "Dúvidas Técnicas",
        tags: ["react", "performance", "frontend"],
        author: "FrontendWizard",
        reputation: 340,
        date: "2024-06-12T09:00:00Z",
        votes: 32,
        views: 890,
        answers: [
            { id: 'a10', content: "A solução definitiva para isso é a **Virtualização de Listas**. Bibliotecas como `react-window` ou `react-virtualized` renderizam apenas os itens que estão visíveis no viewport, mantendo o DOM leve. Além disso, verifique se você não está recriando funções de filtro a cada render usando `useMemo` e se os componentes de item estão de fato usando `React.memo` corretamente.", votes: 25, date: "2024-06-12T11:30:00Z", accepted: true, author: "ReactSenior", reputation: 5600 }
        ]
    },
    {
        id: 'p11',
        title: "Microserviços: Quando usar mensageria (RabbitMQ/Kafka) em vez de REST?",
        content: "Minha aplicação está crescendo e estou dividindo o monolito. Tenho dúvidas sobre quando devo usar comunicação assíncrona com RabbitMQ em vez de simples chamadas HTTP entre os serviços. Quais os trade-offs?",
        category: "Dúvidas Técnicas",
        tags: ["microserviços", "arquitetura", "backend"],
        author: "ArchitectDev",
        reputation: 210,
        date: "2024-06-13T14:20:00Z",
        votes: 45,
        views: 1200,
        answers: [
            { id: 'a11', content: "Use mensageria quando precisar de **desacoplamento temporal** e **resiliência**. Se o serviço B estiver fora do ar, o serviço A ainda pode publicar a mensagem no broker. É ideal para tarefas pesadas que não precisam de resposta imediata (ex: processamento de vídeos, envio de emails em massa). Use REST quando precisar de uma resposta síncrona imediata. O trade-off é a complexidade adicional na infraestrutura e a consistência eventual dos dados.", votes: 38, date: "2024-06-13T16:00:00Z", accepted: true, author: "CloudExpert", reputation: 8900 }
        ]
    },
    {
        id: 'p12',
        title: "Estratégias avançadas de indexação em PostgreSQL para milhões de registros",
        content: "Tenho uma tabela de logs com 50 milhões de linhas. Consultas por data e categoria estão ficando lentas mesmo com índices simples. Índices parciais ou particionamento de tabelas seriam a melhor saída?",
        category: "Dúvidas Técnicas",
        tags: ["postgresql", "database", "bigdata"],
        author: "DataMaster",
        reputation: 560,
        date: "2024-06-15T10:30:00Z",
        votes: 28,
        views: 750,
        answers: [
            { id: 'a12', content: "Com 50M de linhas, o **Particionamento Declarativo** por data (range partitioning) é extremamente eficaz, pois o Postgres pode ignorar partições inteiras que não atendem ao critério da query (partition pruning). Além disso, se você filtra muito por uma categoria específica que representa pouco da tabela, um **Índice Parcial** (`WHERE categoria = 'erro'`) será muito menor e mais rápido que um índice global.", votes: 22, date: "2024-06-15T13:45:00Z", accepted: true, author: "DBAGuru", reputation: 12000 }
        ]
    },
    {
        id: 'p13',
        title: "Segurança em APIs Node.js: Como mitigar ataques de NoSQL Injection?",
        content: "Sempre ouvi falar de SQL Injection, mas como isso funciona no MongoDB? Usar um ODM como Mongoose já me protege automaticamente ou preciso sanitizar os inputs manualmente?",
        category: "Dúvidas Técnicas",
        tags: ["security", "nodejs", "mongodb"],
        author: "SecureCoder",
        reputation: 150,
        date: "2024-06-16T11:15:00Z",
        votes: 19,
        views: 430,
        answers: [
            { id: 'a13', content: "NoSQL Injection muitas vezes acontece via manipulação de operadores (ex: passar `{$gt: ''}` no campo de senha). O Mongoose ajuda ao tipar os campos, mas não é uma bala de prata. A melhor prática é usar bibliotecas como `mongo-sanitize` para remover chaves que começam com `$` dos inputs do usuário e sempre validar o schema com Joi ou Zod antes de enviar para o banco.", votes: 15, date: "2024-06-16T14:00:00Z", accepted: true, author: "SecurityAnalyst", reputation: 4500 }
        ]
    }
];

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

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
    const postId = urlParams.get('post');

    const postsContainer = document.getElementById('forum-posts');
    const filtersContainer = document.querySelector('.forum-filters');
    const searchContainer = document.getElementById('forum-search-container');
    const questionView = document.getElementById('question-view');
    const titleEl = document.getElementById('forum-title');
    const questionsCountEl = document.getElementById('questions-count');

    if (!postsContainer) return;

    // Default visibility reset
    postsContainer.style.display = 'none';
    if (filtersContainer) filtersContainer.style.display = 'none';
    if (searchContainer) searchContainer.style.display = 'none';
    questionView.style.display = 'none';

    // 1. Post Detail View
    if (postId) {
        showPost(postId, false);
        return;
    }

    // 2. Category List View
    postsContainer.style.display = 'block';
    if (filtersContainer) filtersContainer.style.display = 'flex';
    if (searchContainer) searchContainer.style.display = 'block';

    const select = document.getElementById('filter-category');
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

    const filterCategory = catParam || 'Tudo';
    const searchTerm = document.getElementById('forum-search')?.value.toLowerCase() || '';

    if (titleEl) {
        titleEl.textContent = filterCategory === 'Tudo' ? 'Todas as Perguntas' : filterCategory;
    }

    const filteredPosts = posts.filter(post => {
        const matchesCategory = filterCategory === 'Tudo' || post.category === filterCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                             post.content.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    if (questionsCountEl) {
        questionsCountEl.textContent = `${filteredPosts.length} pergunta${filteredPosts.length !== 1 ? 's' : ''}`;
    }

    postsContainer.innerHTML = '';

    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = '<p style="text-align: center; opacity: 0.6; padding: 40px;">Nenhuma pergunta encontrada nesta categoria.</p>';
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
        postsContainer.appendChild(card);
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

    // Dynamic SEO
    document.title = `${post.title} - Fórum RoadmapFullstack`;
    if (typeof updateMetaTags === 'function') {
        updateMetaTags(post.title, post.content.substring(0, 160), null, window.location.href);
    }

    // Schema Markup
    injectQASchema(post);
}

function injectQASchema(post) {
    const existingSchema = document.getElementById('qa-schema');
    if (existingSchema) existingSchema.remove();

    const schema = {
        "@context": "https://schema.org",
        "@type": "Question",
        "name": post.title,
        "text": post.content,
        "answerCount": post.answers.length,
        "upvoteCount": post.votes,
        "datePublished": post.date,
        "author": {
            "@type": "Person",
            "name": post.author || "Anônimo"
        },
        "suggestedAnswer": post.answers.map(a => ({
            "@type": "Answer",
            "text": a.content,
            "datePublished": a.date,
            "upvoteCount": a.votes,
            "author": {
                "@type": "Person",
                "name": a.author || "Anônimo"
            }
        }))
    };

    const script = document.createElement('script');
    script.id = 'qa-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
}

function backToForum() {
    const url = new URL(window.location);
    url.searchParams.delete('post');
    url.searchParams.delete('category');
    window.history.pushState({}, '', url);

    const filters = document.querySelector('.forum-filters');
    const askBtn = document.querySelector('header .btn');
    const titleEl = document.getElementById('forum-title');
    const searchContainer = document.getElementById('forum-search-container');

    if (filters) filters.style.display = 'flex';
    if (askBtn) askBtn.style.display = 'block';
    if (searchContainer) searchContainer.style.display = 'block';
    if (titleEl) titleEl.textContent = 'Fórum da Comunidade';

    loadPosts();

    // Reset SEO
    document.title = 'Fórum da Comunidade - RoadmapFullstack';
    if (typeof updateMetaTags === 'function') {
        updateMetaTags('Fórum da Comunidade', 'Tire suas dúvidas, compartilhe conhecimento e conecte-se com outros desenvolvedores.', null, window.location.href);
    }
}

function filterByCategory(category) {
    const select = document.getElementById('filter-category');
    if (select) select.dataset.manuallyChanged = 'true';

    const url = new URL(window.location);
    url.searchParams.set('category', category);
    url.searchParams.delete('post');
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
        if (stats) stats.style.display = 'none';
    } else {
        form.style.display = 'none';
        loadPosts(); // Handle which view to show
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
