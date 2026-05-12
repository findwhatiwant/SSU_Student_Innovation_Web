const store = {
    types: {},
    questions: [],
    currentQ: 0,
    scores: {},

    load({ types, questions }) {
        this.types = types;
        this.questions = questions;
    },

    reset() {
        this.currentQ = 0;
        this.scores = {};
        Object.keys(this.types).forEach(k => (this.scores[k] = 0));
    },

    // 수정된 부분: 단일 type 문자열이 아닌 weights 객체를 받아서 여러 점수를 동시에 올립니다.
    answer(weights) {
        for (const [type, score] of Object.entries(weights)) {
            if (this.scores[type] !== undefined) {
                this.scores[type] += score;
            }
        }
        this.currentQ++;
    },

    get current()    { return this.questions[this.currentQ]; },
    get total()      { return this.questions.length; },
    get isFinished() { return this.currentQ >= this.questions.length; },
    
    // 수정된 부분: 동점 발생 시 앞의 인덱스로 쏠리는 현상을 막기 위해 랜덤으로 선택합니다.
    get topType() {
        let maxScore = -1;
        let topTypes = [];

        for (const [type, score] of Object.entries(this.scores)) {
            if (score > maxScore) {
                maxScore = score;
                topTypes = [type];
            } else if (score === maxScore) {
                topTypes.push(type);
            }
        }

        if (topTypes.length === 0) topTypes = Object.keys(this.types);
        const randomIndex = Math.floor(Math.random() * topTypes.length);
        return topTypes[randomIndex];
    },
};

export default store;