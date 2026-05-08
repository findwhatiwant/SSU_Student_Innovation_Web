import store from './store.js';

export async function shareResult() {
    const result = store.types[store.topType];
    const overlay = document.getElementById('share-overlay');
    const card    = document.getElementById('share-card');

    document.getElementById('share-type-name').textContent = result.name;
    document.getElementById('share-type-desc').textContent = result.desc;

    // 오버레이로 화면을 가린 뒤 카드를 화면 위에 올려 캡처
    overlay.classList.add('visible');
    card.classList.add('visible');

    // 두 프레임 대기 (렌더 보장)
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
            await navigator.share({ files: [file] });
        } else {
            _download(canvas);
        }
    } catch (e) {
        _hide(overlay, card);
        if (e.name !== 'AbortError') {
            // Web Share API 미지원 환경 — 다운로드로 폴백
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
    setTimeout(() => alert('이미지가 다운로드되었습니다.\n인스타그램 앱에서 스토리로 업로드해주세요!'), 300);
}
