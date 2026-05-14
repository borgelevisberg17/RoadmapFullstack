function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

const seedPosts = [
    {
        title: "Como começar com React em 2024?",
        content: "Tenho uma base boa de HTML/CSS e JS básico. Qual o melhor caminho para aprender React agora?",
        category: "Dúvida Técnica",
        date: "20/05/2024",
        answers: [
            { content: "Comece pela documentação oficial (react.dev). É excelente e muito moderna!", votes: 5, date: "21/05/2024" },
            { content: "Pratique criando pequenos componentes antes de ir para frameworks como Next.js.", votes: 3, date: "22/05/2024" }
        ]
    },
    {
        title: "Dica: Extensões essenciais para VS Code",
        content: "Minhas favoritas são: Prettier, ESLint, GitLens e Auto Rename Tag. Ajudam muito na produtividade!",
        category: "Dica / Tutorial",
        date: "22/05/2024",
        answers: []
    },
    {
        title: "Vale a pena fazer faculdade de TI?",
        content: "Estou na dúvida se foco em cursos online ou se entro em uma graduação. O que acham?",
        category: "Carreira",
        date: "24/05/2024",
        answers: [
            { content: "A faculdade ajuda muito no networking e estágio. Os cursos dão a base técnica rápida.", votes: 12, date: "24/05/2024" }
        ]
    }
];

function loadPosts() {
    let posts = JSON.parse(localStorage.getItem('forumPosts'));

    if (!posts || posts.length === 0) {
        posts = seedPosts;
        localStorage.setItem('forumPosts', JSON.stringify(posts));
    }

    const filterCategory = document.getElementById('filter-category')?.value || 'Tudo';
    const container = document.getElementById('forum-posts');
    if (!container) return;
    container.innerHTML = '';

    const filteredPosts = posts.filter(post =>
        filterCategory === 'Tudo' || post.category === filterCategory
    );

    if (filteredPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.6;">Nenhuma pergunta encontrada nesta categoria.</p>';
        return;
    }

    [...filteredPosts].reverse().forEach((post) => {
        // Find original index for voting/replies to work
        const originalIndex = posts.findIndex(p => p.title === post.title && p.date === post.date);
        const card = document.createElement('div');
        card.className = 'question-card';

        let answersHtml = '';
        post.answers.forEach((answer, aIndex) => {
            answersHtml += `
                <div class="answer">
                    <div style="display: flex; gap: 10px; align-items: flex-start;">
                        <div style="display: flex; flex-direction: column; align-items: center; min-width: 30px;">
                            <i class='bx bx-chevron-up' style="cursor: pointer; font-size: 1.5rem;" onclick="voteAnswer(${originalIndex}, ${aIndex}, 1)"></i>
                            <span>${answer.votes || 0}</span>
                            <i class='bx bx-chevron-down' style="cursor: pointer; font-size: 1.5rem;" onclick="voteAnswer(${originalIndex}, ${aIndex}, -1)"></i>
                        </div>
                        <div style="flex-grow: 1;">
                            <p>${escapeHTML(answer.content)}</p>
                            <small style="opacity: 0.6;">Respondido anonimamente em ${escapeHTML(answer.date)}</small>
                        </div>
                    </div>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="question-header">
                <span><i class='bx bx-tag-alt'></i> ${escapeHTML(post.category || 'Geral')}</span>
                <span>${escapeHTML(post.date)}</span>
            </div>
            <a href="javascript:void(0)" class="question-title">${escapeHTML(post.title)}</a>
            <p>${escapeHTML(post.content)}</p>

            <div class="answer-box">
                <div id="answers-${originalIndex}">
                    ${answersHtml}
                </div>
                <div class="form-group" style="margin-top: 15px; display: flex; gap: 10px;">
                    <input type="text" id="reply-input-${originalIndex}" placeholder="Escreva uma resposta anônima..." style="flex-grow: 1;">
                    <button class="btn" onclick="submitReply(${originalIndex})" style="padding: 5px 15px;">Responder</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function togglePostForm() {
    const form = document.getElementById('post-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function submitPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const category = document.getElementById('post-category').value;

    if (!title || !content) {
        alert("Preencha todos os campos!");
        return;
    }

    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    posts.push({
        title,
        content,
        category,
        date: new Date().toLocaleDateString(),
        answers: []
    });

    localStorage.setItem('forumPosts', JSON.stringify(posts));

    // Clear and hide
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    togglePostForm();
    loadPosts();
}

function submitReply(postIndex) {
    const input = document.getElementById(`reply-input-${postIndex}`);
    const content = input.value;

    if (!content) return;

    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    posts[postIndex].answers.push({
        content,
        votes: 0,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem('forumPosts', JSON.stringify(posts));
    input.value = '';
    loadPosts();
}

function voteAnswer(postIndex, answerIndex, delta) {
    const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    const answer = posts[postIndex].answers[answerIndex];
    answer.votes = (answer.votes || 0) + delta;
    localStorage.setItem('forumPosts', JSON.stringify(posts));
    loadPosts();
}

window.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});
