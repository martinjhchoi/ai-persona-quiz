---
name: ai-persona-logic
description: "나의 AI 페르소나 퀴즈의 순수 로직 레이어(scoring.ts, share.ts, download.ts, useQuiz.ts)를 구현하는 스킬. 퀴즈 채점 로직, base64 공유 URL, html2canvas 다운로드, React 상태 머신 구현 시 사용."
---

# AI 페르소나 — Logic 레이어 스킬

## 구현 파일 목록

```
src/lib/scoring.ts    — 3-axis 채점 + 분노점수 + 페르소나 결정
src/lib/share.ts      — base64 인코딩/디코딩 + X 공유 URL
src/lib/download.ts   — html2canvas PNG 다운로드 (iOS fallback)
src/hooks/useQuiz.ts  — 15문항 상태 머신 + sessionStorage 백업
```

## scoring.ts

```typescript
import { QUESTIONS, PERSONA_MAP, ANGER_THRESHOLD, type QuizResult } from '@/data/personas';

type Answers = Record<string, 'A' | 'B'>;

export function calculateResult(answers: Answers): QuizResult {
  // Axis별 A 선택 횟수 집계
  const axisA = [0, 0, 0]; // index 0=axis1, 1=axis2, 2=axis3
  const axisTotal = [0, 0, 0];
  let angerScore = 0;

  for (const q of QUESTIONS) {
    const idx = q.axis - 1;
    axisTotal[idx]++;
    const answer = answers[q.id];
    if (answer === 'A') {
      axisA[idx]++;
      if (q.angerTrigger) angerScore += q.angerTrigger.score;
    }
  }

  // 각 축: A 과반수(≥3/5) → 0, B 과반수 → 1
  const key = axisA
    .map((a, i) => (a >= Math.ceil(axisTotal[i] / 2) ? '0' : '1'))
    .join('') as keyof typeof PERSONA_MAP;

  return {
    type: PERSONA_MAP[key],
    angerScore,
    showAngryBadge: angerScore >= ANGER_THRESHOLD,
  };
}
```

## share.ts

```typescript
import type { QuizResult } from '@/data/personas';

export function encodeResult(result: QuizResult): string {
  return btoa(JSON.stringify(result));
}

export function decodeResult(encoded: string): QuizResult | null {
  try {
    return JSON.parse(atob(encoded)) as QuizResult;
  } catch {
    return null; // 잘못된 base64 → null 반환 (에러 throw 금지)
  }
}

export function buildShareUrl(result: QuizResult, baseUrl: string): string {
  return `${baseUrl}/result?result=${encodeURIComponent(encodeResult(result))}`;
}

export function buildXShareUrl(result: QuizResult, siteUrl: string, personaName: string): string {
  const shareUrl = buildShareUrl(result, siteUrl);
  const text = encodeURIComponent(`나의 AI 페르소나는 ${personaName}! 너는 어떤 타입?\n${shareUrl}`);
  return `https://twitter.com/intent/tweet?text=${text}`;
}
```

## download.ts

```typescript
'use client';

export async function downloadCard(cardEl: HTMLElement, personaName: string): Promise<void> {
  const html2canvas = (await import('html2canvas')).default;
  const targetWidth = 1080;
  const scale = Math.ceil(targetWidth / cardEl.offsetWidth); // 보통 3

  const canvas = await html2canvas(cardEl, {
    scale,
    useCORS: true,
    backgroundColor: null,
  });

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/png')
  );

  const filename = `ai-persona-${personaName.replace(/\s/g, '-')}.png`;

  // iOS Safari: blob URL 방식
  if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank'); // iOS는 직접 다운로드 불가, 새 탭 열기
    return;
  }

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
```

## useQuiz.ts

```typescript
'use client';
import { useState, useCallback } from 'react';
import { QUESTIONS, type QuizQuestion } from '@/data/personas';
import { calculateResult } from '@/lib/scoring';
import type { QuizResult } from '@/data/personas';

type Answers = Record<string, 'A' | 'B'>;

interface QuizState {
  currentIndex: number;
  answers: Answers;
  result: QuizResult | null;
  phase: 'quiz' | 'complete';
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>(() => ({
    currentIndex: 0,
    answers: {},
    result: null,
    phase: 'quiz',
  }));

  const currentQuestion: QuizQuestion = QUESTIONS[state.currentIndex];
  const progress = (state.currentIndex / QUESTIONS.length) * 100;

  const selectAnswer = useCallback((answer: 'A' | 'B') => {
    setState((prev) => {
      const answers = { ...prev.answers, [QUESTIONS[prev.currentIndex].id]: answer };
      // sessionStorage 백업
      try { sessionStorage.setItem('quiz_answers', JSON.stringify(answers)); } catch {}

      const isLast = prev.currentIndex === QUESTIONS.length - 1;
      if (isLast) {
        return { ...prev, answers, result: calculateResult(answers), phase: 'complete' };
      }
      return { ...prev, answers, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) =>
      prev.currentIndex > 0 ? { ...prev, currentIndex: prev.currentIndex - 1 } : prev
    );
  }, []);

  const reset = useCallback(() => {
    try { sessionStorage.removeItem('quiz_answers'); } catch {}
    setState({ currentIndex: 0, answers: {}, result: null, phase: 'quiz' });
  }, []);

  return { state, currentQuestion, progress, selectAnswer, goBack, reset };
}
```

## 완료 기준

1. TypeScript 컴파일 에러 없음 (`pnpm tsc --noEmit`)
2. 모든 함수가 import 가능
3. `_workspace/02_logic_done.txt` 작성

## 참조

상세 scoring 규격: `references/scoring-spec.md`
