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
            
            // choice.type 대신 choice.weights를 넘겨주도록 변경
            btn.addEventListener('click', () => this._onChoiceClick(choice.weights, btn));
            
            list.appendChild(btn);
        });
    },

    renderResult() {
    const topType = store.topType;
    const result = store.types[topType];

    if (!result) {
        console.error('결과 유형 없음. topType:', topType, '| types:', Object.keys(store.types));
        router.goTo('screen-result');
        return;
    }

    document.getElementById('result-name').textContent = result.name;
    document.getElementById('result-desc').textContent = result.desc;
    
    // 포스터 이미지 처리
    const posterImg = document.getElementById('result-poster-img');
    const posterWrap = document.getElementById('poster-wrap');

    if (posterImg && posterWrap) {
        posterImg.onerror = () => {
            // 포스터 이미지가 없는 경우 해당 영역을 숨김
            posterWrap.style.display = 'none'; 
        };
        posterImg.onload = () => {
            // 이미지가 성공적으로 로드된 경우에만 영역을 보여줌
            posterWrap.style.display = 'block';
        };
        posterImg.src = `images/${store.topType}.png`; 
    }

    document.getElementById('progress-bar').style.width = '100%';
    router.goTo('screen-result');
},

    // 파라미터 이름을 type에서 weights로 변경
    _onChoiceClick(weights, btn) {
        document.querySelectorAll('.choice-btn').forEach(b => {
            b.disabled = true;
            b.style.cursor = 'default';
        });
        btn.classList.add('selected');
        
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