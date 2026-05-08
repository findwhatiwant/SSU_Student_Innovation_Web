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

    answer(type) {
        this.scores[type] = (this.scores[type] || 0) + 1;
        this.currentQ++;
    },

    get current()    { return this.questions[this.currentQ]; },
    get total()      { return this.questions.length; },
    get isFinished() { return this.currentQ >= this.questions.length; },
    get topType()    { return Object.entries(this.scores).sort((a, b) => b[1] - a[1])[0][0]; },
};

export default store;
