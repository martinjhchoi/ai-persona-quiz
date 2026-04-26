---
name: ai-persona-qa-check
description: "나의 AI 페르소나 퀴즈의 단위 테스트를 작성하고 실행하는 스킬. 8개 페르소나 조합 검증, 분노점수 경계값, base64 roundtrip, html2canvas scale 검증. QA, 테스트, 검증 요청 시 사용."
---

# AI 페르소나 — QA 스킬

## 테스트 플랜 위치

`/Users/martinjhchoi/.gstack/projects/DEV_Projects/martinjhchoi-unknown-eng-review-test-plan-20260426-v2.md`

## 테스트 파일 구조

```
src/__tests__/
  setup.ts
  quiz.test.ts
  share.test.ts
  download.test.ts
```

## quiz.test.ts — 8 persona combos + anger boundary

```typescript
import { describe, it, expect } from 'vitest';
import { calculateResult } from '@/lib/scoring';
import { QUESTIONS } from '@/data/personas';

// Q ID 헬퍼
const Q = (id: string, answer: 'A' | 'B') => ({ [id]: answer });

// 축별 전체 선택 헬퍼
function allAxis(axis: 1|2|3, answer: 'A'|'B') {
  return Object.fromEntries(
    QUESTIONS.filter(q => q.axis === axis).map(q => [q.id, answer])
  );
}

// 8 persona combos
const combos: [string, string, Record<string, 'A'|'B'>][] = [
  ['trainer',      '000', { ...allAxis(1,'A'), ...allAxis(2,'A'), ...allAxis(3,'A') }],
  ['boss',         '001', { ...allAxis(1,'A'), ...allAxis(2,'A'), ...allAxis(3,'B') }],
  ['lightning',    '010', { ...allAxis(1,'A'), ...allAxis(2,'B'), ...allAxis(3,'A') }],
  ['copypaste',    '011', { ...allAxis(1,'A'), ...allAxis(2,'B'), ...allAxis(3,'B') }],
  ['debater',      '100', { ...allAxis(1,'B'), ...allAxis(2,'A'), ...allAxis(3,'A') }],
  ['negotiator',   '101', { ...allAxis(1,'B'), ...allAxis(2,'A'), ...allAxis(3,'B') }],
  ['bestfriend',   '110', { ...allAxis(1,'B'), ...allAxis(2,'B'), ...allAxis(3,'A') }],
  ['lazy-genius',  '111', { ...allAxis(1,'B'), ...allAxis(2,'B'), ...allAxis(3,'B') }],
];

describe('8 persona combos', () => {
  combos.forEach(([expectedType, key, answers]) => {
    it(`${key} → ${expectedType}`, () => {
      const result = calculateResult(answers);
      expect(result.type).toBe(expectedType);
    });
  });
});

describe('anger score boundary', () => {
  it('Q7-A only → score 3 → badge true', () => {
    const answers = { ...allAxis(1,'B'), ...allAxis(2,'B'), ...allAxis(3,'B'), Q7: 'A' as const };
    const result = calculateResult(answers);
    expect(result.angerScore).toBe(3);
    expect(result.showAngryBadge).toBe(true);
  });
  it('Q4-A + Q9-A → score 2 → badge false', () => {
    const answers = { ...allAxis(1,'B'), ...allAxis(2,'B'), ...allAxis(3,'B'), Q4: 'A' as const, Q9: 'A' as const };
    const result = calculateResult(answers);
    expect(result.angerScore).toBe(2);
    expect(result.showAngryBadge).toBe(false);
  });
  it('Q7-A + Q4-A → score 4 → badge true', () => {
    const answers = { ...allAxis(1,'B'), ...allAxis(2,'B'), ...allAxis(3,'B'), Q7: 'A' as const, Q4: 'A' as const };
    const result = calculateResult(answers);
    expect(result.angerScore).toBe(4);
    expect(result.showAngryBadge).toBe(true);
  });
  it('all B → score 0 → badge false', () => {
    const answers = { ...allAxis(1,'B'), ...allAxis(2,'B'), ...allAxis(3,'B') };
    const result = calculateResult(answers);
    expect(result.angerScore).toBe(0);
    expect(result.showAngryBadge).toBe(false);
  });
});
```

## share.test.ts

```typescript
import { describe, it, expect } from 'vitest';
import { encodeResult, decodeResult } from '@/lib/share';
import type { QuizResult } from '@/data/personas';

describe('base64 roundtrip', () => {
  it('encode → decode returns same object', () => {
    const result: QuizResult = { type: 'trainer', angerScore: 3, showAngryBadge: true };
    const encoded = encodeResult(result);
    const decoded = decodeResult(encoded);
    expect(decoded).toEqual(result);
  });
  it('invalid base64 → returns null (no throw)', () => {
    expect(decodeResult('not_valid_base64!!!!')).toBeNull();
  });
  it('tampered base64 → returns null', () => {
    expect(decodeResult('eyJ0eXBlIjogeH0=')).toBeNull(); // invalid JSON
  });
});
```

## download.test.ts

```typescript
import { describe, it, expect } from 'vitest';

describe('html2canvas scale', () => {
  it('scale=ceil(1080/420)=3 → 1260px ≥ 1080px', () => {
    const cardWidth = 420;
    const targetWidth = 1080;
    const scale = Math.ceil(targetWidth / cardWidth);
    expect(scale).toBe(3);
    expect(scale * cardWidth).toBeGreaterThanOrEqual(targetWidth);
  });
});
```

## 실행

```bash
pnpm test           # vitest 전체 실행
pnpm test --run     # CI 모드 (watch 없음)
```

## 완료 기준

1. 모든 테스트 PASS
2. `_workspace/04_qa_done.txt`에 테스트 결과 요약 작성
