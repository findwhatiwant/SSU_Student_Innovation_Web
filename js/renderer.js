import store from './store.js';
import router from './router.js';

const renderer = {
    updateStartStats() {
        document.getElementById('stat-questions').textContent = store.total;
        document.getElementById('stat-types').textContent = Object.keys(store.types).length;
    },

    renderQuestion() {
        const { text, choices } = store.current;

        document.getElementById('quiz-num').textContent   = `Q${store.currentQ + 1}`;
        document.getElementById('quiz-total').textContent = `${store.currentQ + 1} / ${store.total}`;
        document.getElementById('progress-bar').style.width = `${(store.currentQ / store.total) * 100}%`;

        const wrap = document.getElementById('quiz-q-wrap');
        wrap.classList.remove('slide-in', 'slide-out');
        void wrap.offsetWidth;
        wrap.classList.add('slide-in');

        document.getElementById('quiz-question').textContent = text;

        const list = document.getElementById('choices-list');
        list.innerHTML = '';
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', () => this._onChoiceClick(choice.type, btn));
            list.appendChild(btn);
        });
    },

    renderResult() {
        const result = store.types[store.topType];
        document.getElementById('result-name').textContent = result.name;
        document.getElementById('result-desc').textContent = result.desc;
        document.getElementById('progress-bar').style.width = '100%';
        router.goTo('screen-result');
    },

    _onChoiceClick(type, btn) {
        document.querySelectorAll('.choice-btn').forEach(b => {
            b.disabled = true;
            b.style.cursor = 'default';
        });
        btn.classList.add('selected');
        store.answer(type);

        setTimeout(() => {
            document.getElementById('quiz-q-wrap').classList.add('slide-out');
            setTimeout(() => {
                if (store.isFinished) this.renderResult();
                else this.renderQuestion();
            }, 200);
        }, 380);
    },
};

export default renderer;
