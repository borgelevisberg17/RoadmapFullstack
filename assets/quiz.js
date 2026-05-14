let quizResults = {
    visual: 0,
    logic: 0,
    data: 0,
    web: 0,
    mobile: 0,
    server: 0,
    build: 0,
    protect: 0
};

function openQuiz() {
    // Reset quiz
    document.querySelectorAll('.quiz-step').forEach(step => step.classList.remove('active'));
    document.querySelector('.quiz-step[data-step="1"]').classList.add('active');
    document.getElementById('quiz-modal').style.display = 'block';

    quizResults = { visual: 0, logic: 0, data: 0, web: 0, mobile: 0, server: 0, build: 0, protect: 0 };
}

function nextQuizStep(currentStep, choice) {
    quizResults[choice]++;
    document.querySelector(`.quiz-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.quiz-step[data-step="${currentStep + 1}"]`).classList.add('active');
}

function finishQuiz(choice) {
    quizResults[choice]++;
    document.querySelector('.quiz-step[data-step="3"]').classList.remove('active');

    let suggestion = '';
    if (quizResults.protect > 0) {
        suggestion = 'cybersecurity';
    } else if (quizResults.data > 0) {
        suggestion = 'datascience';
    } else if (quizResults.mobile > 0) {
        suggestion = 'mobile';
    } else if (quizResults.visual > 0 && quizResults.web > 0) {
        suggestion = 'frontend';
    } else if (quizResults.logic > 0 && quizResults.server > 0) {
        suggestion = 'backend';
    } else {
        suggestion = 'fullstack';
    }

    const roadmaps = {
        'fullstack': 'Fullstack Developer',
        'frontend': 'Frontend Developer',
        'backend': 'Backend Developer',
        'mobile': 'Mobile Developer',
        'cybersecurity': 'Cybersecurity Specialist',
        'datascience': 'Data Scientist'
    };

    document.getElementById('suggested-roadmap').textContent = roadmaps[suggestion];
    document.getElementById('suggested-roadmap').dataset.value = suggestion;
    document.getElementById('quiz-result').classList.add('active');
}

function goToSuggested() {
    const suggestion = document.getElementById('suggested-roadmap').dataset.value;
    loadRoadmap(suggestion);
    closeModal('quiz-modal');
}
