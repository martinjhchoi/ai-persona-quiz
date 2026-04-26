---
name: ai-persona-ui
description: "나의 AI 페르소나 퀴즈의 3개 페이지(/, /quiz, /result)와 UI 컴포넌트를 구현하는 스킬. 병맛 만화 디자인 시스템, 하드 드롭섀도, 기울기 효과, 결과 카드, 공유/다운로드 UI 구현 시 사용."
---

# AI 페르소나 — UI 레이어 스킬

## 디자인 Source of Truth

- HTML 레퍼런스: `/Users/martinjhchoi/.gstack/projects/DEV_Projects/designs/ai-persona-quiz-20260426/finalized.html`
- 디자인 시스템: `/Users/martinjhchoi/.gstack/projects/DEV_Projects/ai-persona-DESIGN.md`
- CSS 토큰: `app/globals.css` (이미 scaffold 단계에서 적용됨)

## 구현 파일 목록

```
src/components/QuizCard.tsx
src/components/ResultCard.tsx
app/page.tsx           — Hero
app/quiz/page.tsx      — 퀴즈 플로우 (useQuiz 사용)
app/result/page.tsx    — 결과 카드 (Suspense 필수)
```

## 핵심 디자인 규칙

```css
/* 하드 드롭섀도 (blur 0) */
box-shadow: var(--shadow-md);     /* 5px 5px 0 #1A1A1A */

/* 기울기 */
.card:nth-child(odd)  { transform: rotate(-0.5deg); }
.card:nth-child(even) { transform: rotate(0.5deg); }
.hero-title           { transform: rotate(-1.5deg); }

/* hover 인터랙션 */
.card:hover { transform: translate(-2px, -2px) rotate(-0.5deg);
              box-shadow: var(--shadow-lg); }
.card:active { transform: translate(3px, 3px) rotate(-0.5deg);
               box-shadow: none; }

/* 속도선 배경 (Hero) */
background-image: repeating-conic-gradient(
  from 0deg at 50% 50%,
  transparent 0deg, transparent 10deg,
  rgba(0,0,0,0.04) 10deg, rgba(0,0,0,0.04) 11deg
);
```

## result/page.tsx — Suspense 필수 패턴

```tsx
import { Suspense } from 'react';
import ResultContent from './ResultContent'; // useSearchParams() 사용

function ResultSkeleton() {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 420, height: 600, background: 'var(--surface)', border: 'var(--border-thick)', borderRadius: 'var(--radius-lg)' }} />
  </div>;
}

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultSkeleton />}>
      <ResultContent />
    </Suspense>
  );
}
```

```tsx
// ResultContent.tsx (use client)
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { decodeResult } from '@/lib/share';

export default function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const encoded = searchParams.get('result');
  const result = encoded ? decodeResult(encoded) : null;

  // base64 decode 실패 시 홈으로
  if (!result) { router.replace('/'); return null; }

  return <ResultCard result={result} />;
}
```

## ResultCard.tsx — 분노 뱃지 조건부

```tsx
import Image from 'next/image';
import { PERSONAS, ANGRY_BADGE_IMAGE } from '@/data/personas';
import type { QuizResult } from '@/data/personas';

export function ResultCard({ result }: { result: QuizResult }) {
  const persona = PERSONAS[result.type];
  return (
    <div id="result-card" style={{ position: 'relative', width: 420, border: 'var(--border-thick)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', background: 'var(--surface)', overflow: 'hidden' }}>
      {/* 분노 뱃지 — 조건부 */}
      {result.showAngryBadge && (
        <div style={{ position: 'absolute', top: -14, right: -14, zIndex: 10 }}>
          <Image src={ANGRY_BADGE_IMAGE} alt="앵그리 욕쟁이 뱃지" width={72} height={72} />
        </div>
      )}

      {/* 배너 — 페르소나 컬러 */}
      <div style={{ background: persona.color, padding: 'var(--space-4) var(--space-5)', paddingRight: result.showAngryBadge ? 80 : undefined }}>
        <span style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 20 }}>{persona.name}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.8)', marginLeft: 8 }}>{persona.typeBadge}</span>
      </div>

      {/* 캐릭터 이미지 */}
      <div style={{ background: persona.color, padding: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
        <Image src={persona.image} alt={persona.name} width={200} height={200} style={{ objectFit: 'contain' }} />
      </div>

      {/* 카드 바디 */}
      <div style={{ padding: 'var(--space-5)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, whiteSpace: 'pre-line', marginBottom: 'var(--space-4)' }}>{persona.tagline}</p>
        <div style={{ background: 'var(--panel-bg)', border: 'var(--border-thin)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7 }}>{persona.description}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
          {persona.hashtags.map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--ink)', color: 'var(--bg)', padding: '2px 10px', borderRadius: 'var(--radius-full)' }}>{tag}</span>
          ))}
        </div>
        {/* 액션 버튼 */}
        <CardActions result={result} personaName={persona.name} />
      </div>
    </div>
  );
}
```

## 완료 기준

1. `pnpm build` 에러 없음
2. `localhost:3000` 접속 → Hero → 퀴즈 → 결과 카드 정상 렌더
3. `_workspace/03_ui_done.txt` 작성

## 참조

상세 디자인 스펙: `references/design-spec.md`
