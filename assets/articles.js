let articlesData = [];

async function loadArticles() {
    const res = await fetch('data/articles.json');
    articlesData = await res.json();
    renderArticleList();

    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    if (articleId) {
        showArticle(articleId);
    }
}

function renderArticleList() {
    const list = document.getElementById('article-list');
    list.innerHTML = '';
    articlesData.forEach(article => {
        const li = document.createElement('li');
        li.textContent = article.title;
        li.onclick = () => {
            showArticle(article.id);
            // Update URL without refresh
            const url = new URL(window.location);
            url.searchParams.set('id', article.id);
            window.history.pushState({}, '', url);
        };
        list.appendChild(li);
    });
}

function showArticle(id) {
    const article = articlesData.find(a => a.id === id);
    if (!article) return;

    // Update sidebar active state
    document.querySelectorAll('#article-list li').forEach(li => {
        li.classList.remove('active');
        if (li.textContent === article.title) li.classList.add('active');
    });

    const content = document.getElementById('article-content');
    let formattedContent = article.content
        .replace(/### (.*)\n/g, '<h3>$1</h3>')
        .replace(/```(javascript|bash|css|html|sql)\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

    content.innerHTML = `
        <article class="article-body">
            <header class="hero-section">
                <h1>${article.title}</h1>
                <p style="font-size: 0.9rem; opacity: 0.7;">Por ${article.author} em ${article.date}</p>
            </header>

            <div style="margin-top: 30px;">
                ${formattedContent}
            </div>

            <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid var(--border-color);">
                <h4>Fontes e Referências:</h4>
                <ul>
                    ${article.sources.map(s => `<li>${s}</li>`).join('')}
                </ul>
                <div style="margin-top: 20px;">
                    <h4>Links Úteis:</h4>
                    ${article.links.map(l => `<a href="${l.url}" target="_blank" class="btn btn-outline" style="margin-right: 10px; margin-top: 10px;">${l.text}</a>`).join('')}
                </div>
            </div>
        </article>
    `;

    // Re-run any code highlighting or formatting if needed
}

window.addEventListener('DOMContentLoaded', loadArticles);
