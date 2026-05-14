const tips = [
    "Dica do Dia: Use o console.table() para visualizar arrays de objetos no JavaScript.",
    "Dica do Dia: Aprenda a usar o Git pelo terminal, isso te dará mais controle sobre o código.",
    "Dica do Dia: Não decore código, entenda a lógica por trás de cada linha.",
    "Dica do Dia: Comece pelo básico: HTML e CSS bem feitos são a base de qualquer site incrível.",
    "Dica do Dia: Pratique o DRY (Don't Repeat Yourself) para escrever código mais limpo.",
    "Dica do Dia: Faça pausas regulares. Codar cansado gera bugs difíceis de encontrar.",
    "Dica do Dia: Peça ajuda! Ninguém sabe tudo e a comunidade Dev é muito colaborativa.",
    "Dica do Dia: Use o MDN Web Docs como sua principal fonte de consulta para Web.",
    "Dica do Dia: Escreva comentários que explicam o 'porquê' e não o 'quê'.",
    "Dica do Dia: Teste seu código em diferentes navegadores e tamanhos de tela."
];

function displayDailyTip() {
    const today = new Date().toDateString();
    let tipIndex = localStorage.getItem('dailyTipIndex') || 0;
    const lastDate = localStorage.getItem('lastTipDate');

    if (lastDate !== today) {
        tipIndex = Math.floor(Math.random() * tips.length);
        localStorage.setItem('dailyTipIndex', tipIndex);
        localStorage.setItem('lastTipDate', today);
    }

    const tipContainer = document.createElement('div');
    tipContainer.style.background = 'var(--primary-color)';
    tipContainer.style.color = 'white';
    tipContainer.style.padding = '10px 20px';
    tipContainer.style.textAlign = 'center';
    tipContainer.style.fontSize = '0.9rem';
    tipContainer.style.fontWeight = 'bold';
    tipContainer.textContent = tips[tipIndex];

    document.body.prepend(tipContainer);
}

window.addEventListener('DOMContentLoaded', displayDailyTip);
