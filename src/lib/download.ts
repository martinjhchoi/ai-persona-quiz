'use client';

/**
 * html-to-image 사용 이유:
 *  - html2canvas는 allowTaint:true 시 canvas.toBlob()이 null 반환
 *  - html2canvas는 Google Fonts(Jua 등) 임베딩이 불안정
 *  - html-to-image는 동일 출처 이미지/폰트를 fetch로 자동 data URL 변환
 */
export async function downloadCard(
  cardEl: HTMLElement,
  personaName: string
): Promise<void> {
  const { toPng } = await import('html-to-image');

  const filename = `ai-persona-${personaName.replace(/\s/g, '-')}.png`;

  // 저장 전 뱃지 위치 조정 (화면: 카드 바깥 -14px → 저장: 배너 안 8px)
  const badge = cardEl.querySelector<HTMLElement>('.angry-badge-wrap');
  const origTop = badge?.style.top ?? '';
  const origRight = badge?.style.right ?? '';
  const origAnim = badge?.style.animation ?? '';
  if (badge) {
    badge.style.top = '8px';
    badge.style.right = '8px';
    badge.style.animation = 'none';
  }

  // 액션 버튼 숨기기 (PNG 제외)
  const actions = cardEl.querySelector<HTMLElement>('.result-actions');
  const origDisplay = actions?.style.display ?? '';
  if (actions) actions.style.display = 'none';

  // 카드 회전 일시 제거 (엣지 클리핑 방지)
  const origTransform = cardEl.style.transform;
  cardEl.style.transform = 'none';

  // 이미지 pre-fetch: Next.js <Image> srcset 문제 대응 (모바일 캡처 시 빈칸 방지)
  const imgEls = Array.from(cardEl.querySelectorAll<HTMLImageElement>('img'));
  const origSrcData = imgEls.map((img) => ({ src: img.src, srcset: img.srcset }));

  for (const img of imgEls) {
    const src = img.currentSrc || img.src;
    if (!src || src.startsWith('data:')) continue;
    try {
      const res = await fetch(src, { cache: 'no-cache' });
      const blob = await res.blob();
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          img.src = reader.result as string;
          img.srcset = '';
          resolve();
        };
        reader.onerror = () => resolve();
        reader.readAsDataURL(blob);
      });
    } catch {
      // fetch 실패 시 원본 유지
    }
  }

  const restore = () => {
    cardEl.style.transform = origTransform;
    if (badge) {
      badge.style.top = origTop;
      badge.style.right = origRight;
      badge.style.animation = origAnim;
    }
    if (actions) actions.style.display = origDisplay;
    imgEls.forEach((img, i) => {
      img.src = origSrcData[i].src;
      img.srcset = origSrcData[i].srcset;
    });
  };

  try {
    const dataUrl = await toPng(cardEl, {
      pixelRatio: 3,
      backgroundColor: '#ffffff',
    });

    restore();

    // iOS: navigator.share({ files }) → 사진 앱 저장
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && typeof navigator.share === 'function') {
      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: '나의 AI 페르소나' });
          return;
        }
      } catch {
        // 사용자 취소 또는 share 실패 → a.click() 폴백
      }
    }

    // Android / Desktop: <a download>
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  } catch (err) {
    restore();
    console.error('[downloadCard] failed:', err);
    throw err;
  }
}
