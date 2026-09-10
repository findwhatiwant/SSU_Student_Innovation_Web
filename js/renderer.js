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

        // GA4 이벤트: 문항 노출(단계별 진행 추적용)
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'quiz_step', {
                step_number: store.currentQ + 1,
                step_name: `Q${store.currentQ + 1}`,
                total_steps: store.total
            });
        }

        const list = document.getElementById('choices-list');
        list.innerHTML = '';
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            
            // choice.type 대신 choice.weights를 넘겨주도록 변경
            btn.addEventListener('click', () => this._onChoiceClick(choice.weights, btn));
            
            list.appendChild(btn);
        });
    },

    renderResult() {
    const topType = store.topType; // 여기서 딱 한 번만 결정! (예: "I"로 고정)
    const result = store.types[topType];

    if (!result) return;

    const nameEl = document.getElementById('result-name');
    nameEl.textContent = result.name;
    nameEl.classList.remove('is-long', 'is-extra-long');
    if (result.name.length >= 14) {
        nameEl.classList.add('is-extra-long');
    } else if (result.name.length >= 10) {
        nameEl.classList.add('is-long');
    }
    document.getElementById('result-desc').textContent = result.desc;
    
    const posterImg = document.getElementById('result-poster-img');
    const posterWrap = document.getElementById('poster-wrap');

    if (posterImg && posterWrap) {
        posterImg.onload = () => { posterWrap.style.display = 'block'; };
        posterImg.onerror = function () {
            if (!this.src.endsWith('images/N.png')) {
                this.src = 'images/N.png';
            } else {
                posterWrap.style.display = 'none';
            }
        };
        
        // store.topType 대신 위에서 이미 결정된 topType 변수를 사용
        posterImg.src = `images/${topType}.png`; 
    }

    document.getElementById('progress-bar').style.width = '100%';
    router.goTo('screen-result');

    if (typeof window.gtag === 'function') {
        window.gtag('event', 'quiz_complete', {
            event_label: result.name,
            program_type: topType
        });
    }
},

    // 파라미터 이름을 type에서 weights로 변경
    _onChoiceClick(weights, btn) {
        document.querySelectorAll('.choice-btn').forEach(b => {
            b.disabled = true;
            b.style.cursor = 'default';
        });
        btn.classList.add('selected');

        // GA4 이벤트: 문항 응답
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'quiz_answer', {
                question_number: store.currentQ + 1,
                question_tag: `Q${store.currentQ + 1}`
            });
        }
        
        // store.answer에 다중 가중치 객체(weights)를 통째로 넘김
        store.answer(weights);

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