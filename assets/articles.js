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
    const select = document.getElementById('article-select');

    if (list) list.innerHTML = '';
    if (select) {
        select.innerHTML = '<option value="">Selecione um artigo...</option>';
    }

    articlesData.forEach(article => {
        if (list) {
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
        }

        if (select) {
            const option = document.createElement('option');
            option.value = article.id;
            option.textContent = article.title;
            select.appendChild(option);
        }
    });
}

function parseMarkdown(text) {
    // Escapar HTML básico para segurança, mas mantendo o que vamos gerar
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Code blocks - handle before other replacements to avoid escaping issues
    // Using a placeholder to protect code blocks from further processing
    const codeBlocks = [];
    html = html.replace(/```(javascript|typescript|bash|css|html|sql|php|python|json|yaml|dockerfile)\n([\s\S]*?)\n```/g, (match, lang, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push(`<pre><code class="language-${lang}">${code}</code></pre>`);
        return placeholder;
    });

    html = html
        // Headers
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')

        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')

        // Bold
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

        // Links: [text](url)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')

        // Lists
        .replace(/^\s*[-*]\s+(.*)/gm, '<li>$1</li>');

    // Wrap consecutive <li> groups in <ul>
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>\n$1</ul>\n');

    // Paragraphs: Wrap blocks of text separated by double newlines that are NOT tags
    let lines = html.split(/\n\n+/);
    html = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        // If it starts with a tag we handled, don't wrap in <p>
        if (/^<(h1|h2|h3|ul|li|pre|div|a|strong|code)/.test(trimmed)) {
            return trimmed;
        }
        return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    // Restore code blocks
    codeBlocks.forEach((block, i) => {
        html = html.replace(`__CODE_BLOCK_${i}__`, block);
    });

    // Unescape some things that might have been escaped by mistake in link URLs or similar
    // but the regexes above should have handled it if used carefully.
    // Actually, the initial escape is good, but our replacements used literal < and >.
    // Let's fix the literal replacements in the regexes above:
    // Actually, the replacement strings in .replace() are literals, so they are fine.
    // The only issue is if the text content itself had < or > which we WANT to keep escaped.

    return html;
}

function showArticle(id) {
    if (!id) return;
    const article = articlesData.find(a => a.id === id);
    if (!article) return;

    // Update sidebar active state
    document.querySelectorAll('#article-list li').forEach(li => {
        li.classList.remove('active');
        if (li.textContent === article.title) li.classList.add('active');
    });

    // Update select if exists
    const select = document.getElementById('article-select');
    if (select) select.value = id;

    const content = document.getElementById('article-content');
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

window.addEventListener('DOMContentLoaded', loadArticles);
