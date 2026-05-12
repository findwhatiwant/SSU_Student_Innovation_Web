export function parseMarkdown(text) {
    const lines = text.split('\n');
    const types = {};
    const questions = [];
    let section = null, curType = null, curQ = null;

    for (const rawLine of lines) {
        const trimmed = rawLine.trim();

        if (trimmed === '# 유형')  { section = 'types';     continue; }
        if (trimmed === '# 질문')  { section = 'questions'; continue; }

        if (section === 'types') {
            const tm = trimmed.match(/^\[(.+)\]$/);
            // 초기 객체 생성 시 summary 추가
            if (tm) { curType = tm[1]; types[curType] = { name: '', desc: '', summary: '' }; continue; }
            
            if (curType) {
                const nm = trimmed.match(/^이름:\s*(.+)/);
                if (nm) { types[curType].name = nm[1].trim(); continue; }
                
                const dm = trimmed.match(/^설명:\s*(.+)/);
                if (dm) { types[curType].desc = dm[1].trim(); continue; }
                
                // "요약:" 키워드를 찾아서 .summary에 저장!
                const sm = trimmed.match(/^요약:\s*(.+)/);
                if (sm) { types[curType].summary = sm[1].trim(); continue; }
            }
        }

        if (section === 'questions') {
            const qm = trimmed.match(/^\[(\d+)\]$/);
            if (qm) {
                if (curQ?.choices.length) questions.push(curQ);
                curQ = { text: '', choices: [] };
                continue;
            }
            if (curQ) {
                // 단일 문자가 아닌 A:2, B:1 형태의 전체 문자열을 캡처
                const cm = trimmed.match(/^-\s*(.+?)\s*→\s*(.+)$/);
                if (cm) { 
                    const choiceText = cm[1].trim();
                    const weightString = cm[2].trim();
                    const weights = {};

                    // 콤마(,)로 분리하여 다중 가중치를 파싱
                    weightString.split(',').forEach(w => {
                        const [type, score] = w.split(':').map(s => s.trim());
                        // 점수가 명시되어 있으면 그 점수를 없으면 기본값 1을 부여
                        weights[type] = score ? parseInt(score, 10) : 1; 
                    });

                    curQ.choices.push({ text: choiceText, weights: weights }); 
                    continue; 
                }
                if (trimmed && !curQ.text) curQ.text = trimmed;
            }
        }
    }

    if (curQ?.choices.length) questions.push(curQ);
    return { types, questions };
}