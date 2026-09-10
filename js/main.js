import { parseMarkdown } from './parser.js';
import store          from './store.js';
import router         from './router.js';
import renderer       from './renderer.js';
import { shareResult } from './share.js';

async function init() {
    try {
        const res  = await fetch('questions.md');
        const text = await res.text();
        store.load(parseMarkdown(text));
        renderer.updateStartStats();
    } catch (e) {
        console.error('questions.md 로드 실패:', e);
    }

    const loading = document.getElementById('loading');
    loading.classList.add('hide');
    setTimeout(() => loading.remove(), 350);
    router.show('screen-start');
}

let dropoffTracked = false;

function startQuiz() {
    dropoffTracked = false;
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'quiz_start');
    }
    store.reset();
    router.goTo('screen-quiz');
    setTimeout(() => renderer.renderQuestion(), 220);
}

function trackDropoff() {
    if (dropoffTracked) return;
    const quizScreen = document.getElementById('screen-quiz');
    if (quizScreen && quizScreen.classList.contains('active') && !store.isFinished) {
        dropoffTracked = true;
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'quiz_dropoff', {
                dropoff_question: store.currentQ + 1,
                dropoff_question_tag: `Q${store.currentQ + 1}`,
                total_questions: store.total,
                transport_type: 'beacon'
            });
        }
    }
}

window.addEventListener('pagehide', trackDropoff);

document.getElementById('btn-start').addEventListener('click', startQuiz);
document.getElementById('btn-restart').addEventListener('click', startQuiz);
document.getElementById('btn-instagram').addEventListener('click', shareResult);

init();
