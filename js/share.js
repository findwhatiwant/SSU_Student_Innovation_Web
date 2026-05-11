import store from './store.js';

export async function shareResult() {
    const result = store.types[store.topType];
    const overlay = document.getElementById('share-overlay');
    const card    = document.getElementById('share-card');

    document.getElementById('share-type-name').textContent = result.name;
    document.getElementById('share-type-desc').textContent = result.summary;

    overlay.classList.add('visible');
    card.classList.add('visible');

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    try {
        const canvas = await html2canvas(card, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            width: 360,
            height: 640,
        });

        _hide(overlay, card);

        const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
        const file = new File([blob], 'ssu-혁신단-유형-결과.png', { type: 'image/png' });

        if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ 
                files: [file],
                // 공유 텍스트에 인스타 아이디 추가
                text: `나의 혁신단 유형은 [${result.name}]! @ssu_innovators 태그하고 이벤트 참여해요! 🎁` 
            });
        } else {
            _download(canvas);
        }
    } catch (e) {
        _hide(overlay, card);
        if (e.name !== 'AbortError') {
            console.warn('공유 실패, 다운로드로 전환:', e);
        }
    }
}

function _hide(overlay, card) {
    overlay.classList.remove('visible');
    card.classList.remove('visible');
}

function _download(canvas) {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'ssu-혁신단-유형-결과.png';
    a.click();
    // 알림 문구에도 인스타 아이디 반영
    setTimeout(() => alert('이미지가 다운로드되었습니다.\n@ssu_innovators 계정을 태그해서 스토리에 올려주세요! 🎁'), 300);
}