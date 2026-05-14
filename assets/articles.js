let articlesData = [];
let currentPage = 1;
const articlesPerPage = 20;

async function loadArticles() {
    const res = await fetch('data/articles.json');
    articlesData = await res.json();

    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    if (articleId) {
        showArticle(articleId);
    } else {
        renderArticles();
    }

    // Setup Search
    const searchInput = document.getElementById('article-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderArticles();
        });
    }
}

function renderArticles() {
    const grid = document.getElementById('article-grid');
    const controls = document.getElementById('pagination-controls');
    const searchInput = document.getElementById('article-search');
    const displayArea = document.getElementById('article-display-area');
    const viewArea = document.getElementById('article-view');

    if (!grid) return;

    displayArea.style.display = 'block';
    viewArea.style.display = 'none';

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const filtered = articlesData.filter(a =>
        a.title.toLowerCase().includes(searchTerm) ||
        a.content.toLowerCase().includes(searchTerm) ||
        a.author.toLowerCase().includes(searchTerm)
    );

    const startIndex = (currentPage - 1) * articlesPerPage;
    const paginated = filtered.slice(startIndex, startIndex + articlesPerPage);
    const totalPages = Math.ceil(filtered.length / articlesPerPage);

    grid.innerHTML = '';
    if (paginated.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; opacity: 0.6; padding: 40px;">Nenhum artigo encontrado.</p>';
    } else {
        paginated.forEach(article => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <h3 style="color: var(--primary-color);">${article.title}</h3>
                <p style="font-size: 0.85rem; margin-top: 10px; opacity: 0.7;">
                    ${article.content.substring(0, 120).replace(/[#*`]/g, '')}...
                </p>
                <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; opacity: 0.6;">
                    <span>Por ${article.author}</span>
                    <span>${article.date}</span>
                </div>
            `;
            card.onclick = () => {
                showArticle(article.id);
                window.scrollTo(0, 0);
            };
            grid.appendChild(card);
        });
    }

    // Render Pagination
    if (controls) {
        controls.innerHTML = '';
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `btn ${i === currentPage ? '' : 'btn-outline'}`;
                btn.textContent = i;
                btn.onclick = () => {
                    currentPage = i;
                    renderArticles();
                    window.scrollTo(0, 0);
                };
                controls.appendChild(btn);
            }
        }
    }
}

function parseMarkdown(text) {
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const codeBlocks = [];
    html = html.replace(/```(javascript|typescript|bash|css|html|sql|php|python|json|yaml|dockerfile)\n([\s\S]*?)\n```/g, (match, lang, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push(`<pre><code class="language-${lang}">${code}</code></pre>`);
        return placeholder;
    });

    html = html
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/^\s*[-*]\s+(.*)/gm, '<li>$1</li>');

    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>\n$1</ul>\n');

    let lines = html.split(/\n\n+/);
    html = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (/^<(h1|h2|h3|ul|li|pre|div|a|strong|code)/.test(trimmed)) {
            return trimmed;
        }
        return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    codeBlocks.forEach((block, i) => {
        html = html.replace(`__CODE_BLOCK_${i}__`, block);
    });

    return html;
}

function showArticle(id) {
    if (!id) return;
    const article = articlesData.find(a => a.id === id);
    if (!article) return;

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('id', id);
    window.history.pushState({}, '', url);

    const displayArea = document.getElementById('article-display-area');
    const viewArea = document.getElementById('article-view');
    const content = document.getElementById('article-content');

    displayArea.style.display = 'none';
    viewArea.style.display = 'block';

    let formattedContent = parseMarkdown(article.content);

    const otherArticles = articlesData.filter(a => a.id !== id).slice(0, 3);
    let suggestionsHtml = '';
    if (otherArticles.length > 0) {
        suggestionsHtml = `
            <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid var(--primary-color);">
                <h3>Leia também:</h3>
                <div class="roadmap-grid" style="margin-top: 20px;">
                    ${otherArticles.map(a => `
                        <div class="category-card" style="cursor: pointer;" onclick="showArticle('${a.id}'); window.scrollTo(0,0);">
                            <h4>${a.title}</h4>
                            <p style="font-size: 0.8rem; margin-top: 10px; opacity: 0.8;">${a.author}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

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
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${article.links.map(l => `<a href="${l.url}" target="_blank" class="btn btn-outline">${l.text}</a>`).join('')}
                    </div>
                </div>
            </div>

            ${suggestionsHtml}
        </article>
    `;
}

function backToList() {
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
    renderArticles();
}

window.addEventListener('DOMContentLoaded', loadArticles);
