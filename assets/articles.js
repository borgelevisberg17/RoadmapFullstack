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
    if (!text) return '';

    // Basic HTML Escaping
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const codeBlocks = [];
    html = html.replace(/```(?:([a-z]+)\n)?([\s\S]*?)\n```/g, (match, lang, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        const displayLang = lang || 'text';
        codeBlocks.push(`
            <div class="code-container" style="position: relative;">
                <button onclick="copyCode(this)" style="position: absolute; right: 10px; top: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 3px; cursor: pointer; font-size: 0.7rem; padding: 2px 5px;">Copiar</button>
                <pre><code class="language-${displayLang}">${code}</code></pre>
            </div>
        `);
        return placeholder;
    });

    // Helper for inline formatting
    function applyInline(str) {
        return str
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    }

    // Table Parsing - must be before headers/lists to avoid conflicts
    html = html.replace(/^\s*\|(.+)\|\s*\n\s*\|([-|\s:]+)\|\s*\n((?:\s*\|.+\|\s*\n?)*)/gm, (match, header, separator, rows) => {
        const headerCols = header.split('|').map(c => c.trim()).filter(c => c !== "");
        const tableHeader = `<thead><tr>${headerCols.map(c => `<th>${applyInline(c)}</th>`).join('')}</tr></thead>`;

        const tableRows = rows.trim().split('\n').map(row => {
            const cols = row.split('|').map(c => c.trim()).filter(c => c !== "");
            return `<tr>${cols.map(c => `<td>${applyInline(c)}</td>`).join('')}</tr>`;
        }).join('');

        return `<div class="table-container"><table>${tableHeader}<tbody>${tableRows}</tbody></table></div>\n`;
    });

    // Block level elements
    html = html
        .replace(/^#### (.*$)/gm, (m, p1) => `<h4>${applyInline(p1)}</h4>`)
        .replace(/^### (.*$)/gm, (m, p1) => `<h3>${applyInline(p1)}</h3>`)
        .replace(/^## (.*$)/gm, (m, p1) => `<h2>${applyInline(p1)}</h2>`)
        .replace(/^# (.*$)/gm, (m, p1) => `<h1>${applyInline(p1)}</h1>`)
        .replace(/^\s*>\s+(.*)/gm, (m, p1) => `<blockquote>${applyInline(p1)}</blockquote>`)
        .replace(/^\s*[-*]\s+(.*)/gm, (m, p1) => `<li>${applyInline(p1)}</li>`);

    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>\n$1</ul>\n');
    html = html.replace(/((?:<blockquote>.*<\/blockquote>\n?)+)/g, match => {
        const content = match.replace(/<\/?blockquote>\n?/g, '<br>').replace(/^<br>|<br>$/g, '');
        return `<blockquote>${content}</blockquote>`;
    });

    let lines = html.split(/\n\n+/);
    html = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (/^<(h1|h2|h3|h4|ul|li|pre|div|a|strong|code|table|thead|tbody|tr|th|td|blockquote)/.test(trimmed)) {
            return trimmed;
        }
        return `<p>${applyInline(trimmed).replace(/\n/g, '<br>')}</p>`;
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

    // Dynamic SEO
    document.title = `${article.title} - RoadmapFullstack`;
    if (typeof updateMetaTags === 'function') {
        const excerpt = article.content.substring(0, 160).replace(/[#*`]/g, '');
        updateMetaTags(article.title, excerpt, null, window.location.href);
    }

    // Schema Markup
    injectArticleSchema(article);

    loadRelatedQuestions(article.tags || []);
}

function injectArticleSchema(article) {
    // Remove existing article schema if any
    const existingSchema = document.getElementById('article-schema');
    if (existingSchema) existingSchema.remove();

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "author": {
            "@type": "Person",
            "name": article.author
        },
        "datePublished": article.date,
        "description": article.content.substring(0, 160).replace(/[#*`]/g, ''),
        "publisher": {
            "@type": "Organization",
            "name": "RoadmapFullstack",
            "logo": {
                "@type": "ImageObject",
                "url": "https://roadmapfullstack.com/assets/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        }
    };

    const script = document.createElement('script');
    script.id = 'article-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
}

function backToList() {
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
    renderArticles();
    document.getElementById('related-questions-widget').style.display = 'none';

    // Reset SEO
    document.title = 'Artigos e Publicações - RoadmapFullstack';
    if (typeof updateMetaTags === 'function') {
        updateMetaTags('Artigos e Publicações', 'Conhecimento técnico aprofundado, dicas de carreira, tutoriais e tendências do mundo da tecnologia.', null, window.location.href);
    }
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
