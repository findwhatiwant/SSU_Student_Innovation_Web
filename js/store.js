const store = {
    types: {},
    questions: [],
    currentQ: 0,
    scores: {},
    _cachedTopType: null, // 한 번 뽑은 결과를 기억할 변수

    load({ types, questions }) {
        this.types = types;
        this.questions = questions;
    },

    reset() {
        this.currentQ = 0;
        this.scores = {};
        this._cachedTopType = null; // 다시하기 누르면 리셋
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
    
    get topType() {
        // 이미 뽑아둔 결과가 있으면 다시 랜덤 안 돌리고 그대로 반환
        if (this._cachedTopType) return this._cachedTopType; 

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
        
        // 기존의 랜덤 로직 유지
        const randomIndex = Math.floor(Math.random() * topTypes.length);
        
        // 처음 뽑은 랜덤 결과를 변수에 저장
        this._cachedTopType = topTypes[randomIndex]; 
        return this._cachedTopType;
    },
};

export default store;