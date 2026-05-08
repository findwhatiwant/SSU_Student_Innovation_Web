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
            const tm = trimmed.match(/^\[([A-Z])\]$/);
            if (tm) { curType = tm[1]; types[curType] = { name: '', desc: '' }; continue; }
            if (curType) {
                const nm = trimmed.match(/^이름:\s*(.+)/);
                if (nm) { types[curType].name = nm[1].trim(); continue; }
                const dm = trimmed.match(/^설명:\s*(.+)/);
                if (dm) { types[curType].desc = dm[1].trim(); continue; }
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
                const cm = trimmed.match(/^-\s*(.+?)\s*→\s*([A-Z])$/);
                if (cm) { curQ.choices.push({ text: cm[1].trim(), type: cm[2] }); continue; }
                if (trimmed && !curQ.text) curQ.text = trimmed;
            }
        }
    }

    if (curQ?.choices.length) questions.push(curQ);
    return { types, questions };
}
