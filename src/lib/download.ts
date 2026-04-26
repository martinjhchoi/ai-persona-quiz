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

  try {
    const dataUrl = await toPng(cardEl, {
      pixelRatio: 3,
      backgroundColor: '#ffffff',
      // 회전된 자식 요소(tagline, hashtag)도 캡처 시 제거
      filter: (node: Node) => {
        if (node instanceof HTMLElement) {
          // 액션 버튼은 이미 display:none 했으므로 추가 필터 불필요
        }
        return true;
      },
    });

    // 스타일 복원
    cardEl.style.transform = origTransform;
    if (badge) { badge.style.top = origTop; badge.style.right = origRight; badge.style.animation = origAnim; }
    if (actions) actions.style.display = origDisplay;

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  } catch (err) {
    // 스타일 복원 보장
    cardEl.style.transform = origTransform;
    if (badge) { badge.style.top = origTop; badge.style.right = origRight; badge.style.animation = origAnim; }
    if (actions) actions.style.display = origDisplay;
    console.error('[downloadCard] failed:', err);
    throw err;
  }
}
