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

function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    const readTime = Math.ceil(minutes);
    return `${readTime} min de leitura`;
}

function renderArticles() {
    const list = document.getElementById('article-list');
    const controls = document.getElementById('pagination-controls');
    const searchInput = document.getElementById('article-search');
    const displayArea = document.getElementById('article-display-area');
    const viewArea = document.getElementById('article-view');

    if (!list) return;

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

    list.innerHTML = '';
    if (paginated.length === 0) {
        list.innerHTML = '<p style="text-align: center; opacity: 0.6; padding: 40px;">Nenhum artigo encontrado.</p>';
    } else {
        paginated.forEach(article => {
            const readingTime = calculateReadingTime(article.content);
            const excerpt = article.content.substring(0, 180).replace(/[#*`]/g, '') + '...';

            const item = document.createElement('div');
            item.className = 'question-summary';
            item.style.cursor = 'pointer';
            item.innerHTML = `
                <div class="question-content-summary" style="padding-left: 0;">
                    <a href="?id=${article.id}" class="question-summary-title" onclick="event.preventDefault(); showArticle('${article.id}')">${article.title}</a>
                    <div class="question-summary-excerpt">${excerpt}</div>
                    <div class="question-summary-meta">
                        <div class="question-tags">
                            ${(article.tags || ['Artigo']).map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="user-card">
                            <span class="username">Por ${article.author}</span>
                            <span class="date">${article.date} • ${readingTime}</span>
                        </div>
                    </div>
                </div>
            `;
            item.onclick = (e) => {
                if (e.target.tagName !== 'A') {
                    showArticle(article.id);
                    window.scrollTo(0, 0);
                }
            };
            list.appendChild(item);
        });
    }

    // Render Pagination
    if (controls) {
        controls.innerHTML = '';
        if (totalPages > 1) {
            const paginationWrapper = document.createElement('div');
            paginationWrapper.className = 'modern-pagination';

            // Previous Button
            const prevBtn = document.createElement('button');
            prevBtn.className = `page-nav-btn ${currentPage === 1 ? 'disabled' : ''}`;
            prevBtn.innerHTML = "<i class='bx bx-chevron-left'></i> Anterior";
            prevBtn.disabled = currentPage === 1;
            prevBtn.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderArticles();
                    window.scrollTo(0, 0);
                }
            };
            paginationWrapper.appendChild(prevBtn);

            // Page Numbers with Truncation
            const pageNumbers = document.createElement('div');
            pageNumbers.className = 'page-numbers';

            const maxVisiblePages = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            if (startPage > 1) {
                const firstBtn = document.createElement('button');
                firstBtn.className = 'page-num';
                firstBtn.textContent = '1';
                firstBtn.onclick = () => { currentPage = 1; renderArticles(); window.scrollTo(0, 0); };
                pageNumbers.appendChild(firstBtn);

                if (startPage > 2) {
                    const dots = document.createElement('span');
                    dots.className = 'pagination-dots';
                    dots.textContent = '...';
                    pageNumbers.appendChild(dots);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                const btn = document.createElement('button');
                btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
                btn.textContent = i;
                btn.onclick = () => {
                    currentPage = i;
                    renderArticles();
                    window.scrollTo(0, 0);
                };
                pageNumbers.appendChild(btn);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    const dots = document.createElement('span');
                    dots.className = 'pagination-dots';
                    dots.textContent = '...';
                    pageNumbers.appendChild(dots);
                }

                const lastBtn = document.createElement('button');
                lastBtn.className = 'page-num';
                lastBtn.textContent = totalPages;
                lastBtn.onclick = () => { currentPage = totalPages; renderArticles(); window.scrollTo(0, 0); };
                pageNumbers.appendChild(lastBtn);
            }
            paginationWrapper.appendChild(pageNumbers);

            // Next Button
            const nextBtn = document.createElement('button');
            nextBtn.className = `page-nav-btn ${currentPage === totalPages ? 'disabled' : ''}`;
            nextBtn.innerHTML = "Próximo <i class='bx bx-chevron-right'></i>";
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderArticles();
                    window.scrollTo(0, 0);
                }
            };
            paginationWrapper.appendChild(nextBtn);

            controls.appendChild(paginationWrapper);
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
        codeBlocks.push(`
            <div class="code-container" style="position: relative;">
                <button onclick="copyCode(this)" style="position: absolute; right: 10px; top: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 3px; cursor: pointer; font-size: 0.7rem; padding: 2px 5px;">Copiar</button>
                <pre><code class="language-${lang}">${code}</code></pre>
            </div>
        `);
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
    const readingTime = calculateReadingTime(article.content);

    content.innerHTML = `
        <article class="article-body">
            <header class="article-header">
                <h1>${article.title}</h1>
                <div class="article-meta">
                    <span><i class='bx bx-user'></i> ${article.author}</span>
                    <span><i class='bx bx-calendar'></i> ${article.date}</span>
                    <span><i class='bx bx-time-five'></i> ${readingTime}</span>
                </div>
            </header>

            <div class="article-content-wrapper">
                ${formattedContent}
            </div>

            <div style="margin-top: 50px; padding: 25px; background: #fdf7e2; border: 1px solid #f1e5bc; border-radius: 3px;">
                <h4 style="margin-bottom: 15px; display: flex; align-items: center; gap: 8px;"><i class='bx bx-link-external'></i> Referências e Links</h4>
                <ul style="font-size: 0.9rem; margin-bottom: 20px;">
                    ${article.sources.map(s => `<li>${s}</li>`).join('')}
                </ul>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${article.links.map(l => `<a href="${l.url}" target="_blank" class="btn btn-outline" style="background: #fff;">${l.text}</a>`).join('')}
                </div>
            </div>
        </article>
    `;

    loadRelatedQuestions(article.tags || []);
}

function backToList() {
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
    renderArticles();
    document.getElementById('related-questions-widget').style.display = 'none';
}

function copyCode(btn) {
    const code = btn.nextElementSibling.innerText;
    navigator.clipboard.writeText(code).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copiado!';
        setTimeout(() => btn.innerText = originalText, 2000);
    });
}

function loadRelatedQuestions(tags) {
    const forumPosts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    const related = forumPosts.filter(p =>
        p.tags.some(t => tags.includes(t))
    ).slice(0, 5);

    const widget = document.getElementById('related-questions-widget');
    const list = document.getElementById('related-questions-list');

    if (related.length > 0) {
        widget.style.display = 'block';
        list.innerHTML = related.map(p => `
            <li style="margin-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px;">
                <a href="forum.html?post=${p.id}" style="text-decoration: none; color: var(--link-color); display: block; margin-bottom: 3px;">${p.title}</a>
                <div style="font-size: 0.75rem; color: #6a737c;">${p.answers.length} respostas • ${p.votes} votos</div>
            </li>
        `).join('');
    } else {
        widget.style.display = 'none';
    }
}

window.addEventListener('DOMContentLoaded', loadArticles);
