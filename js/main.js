import { parseMarkdown } from './parser.js';
import store    from './store.js';
import router   from './router.js';
import renderer from './renderer.js';

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

function startQuiz() {
    store.reset();
    router.goTo('screen-quiz');
    setTimeout(() => renderer.renderQuestion(), 220);
}

document.getElementById('btn-start').addEventListener('click', startQuiz);
document.getElementById('btn-restart').addEventListener('click', startQuiz);
document.getElementById('btn-instagram').addEventListener('click', () =>
    alert('인스타그램 공유 기능은 준비 중입니다.')
);

init();
