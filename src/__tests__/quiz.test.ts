import { describe, it, expect } from 'vitest';
import { calculateResult } from '@/lib/scoring';
import { QUESTIONS } from '@/data/personas';

// 축별 전체 선택 헬퍼
function allAxis(axis: 1 | 2 | 3, answer: 'A' | 'B') {
  return Object.fromEntries(
    QUESTIONS.filter((q) => q.axis === axis).map((q) => [q.id, answer])
  );
}

// 8 persona combos
const combos: [string, string, Record<string, 'A' | 'B'>][] = [
  ['trainer',     '000', { ...allAxis(1, 'A'), ...allAxis(2, 'A'), ...allAxis(3, 'A') }],
  ['boss',        '001', { ...allAxis(1, 'A'), ...allAxis(2, 'A'), ...allAxis(3, 'B') }],
  ['lightning',   '010', { ...allAxis(1, 'A'), ...allAxis(2, 'B'), ...allAxis(3, 'A') }],
  ['copypaste',   '011', { ...allAxis(1, 'A'), ...allAxis(2, 'B'), ...allAxis(3, 'B') }],
  ['debater',     '100', { ...allAxis(1, 'B'), ...allAxis(2, 'A'), ...allAxis(3, 'A') }],
  ['negotiator',  '101', { ...allAxis(1, 'B'), ...allAxis(2, 'A'), ...allAxis(3, 'B') }],
  ['bestfriend',  '110', { ...allAxis(1, 'B'), ...allAxis(2, 'B'), ...allAxis(3, 'A') }],
  ['lazy-genius', '111', { ...allAxis(1, 'B'), ...allAxis(2, 'B'), ...allAxis(3, 'B') }],
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
    const answers = {
      ...allAxis(1, 'B'),
      ...allAxis(2, 'B'),
      ...allAxis(3, 'B'),
      Q7: 'A' as const,
    };
    const result = calculateResult(answers);
    expect(result.angerScore).toBe(3);
    expect(result.showAngryBadge).toBe(true);
  });

  it('Q4-A + Q9-A → score 2 → badge false', () => {
    const answers = {
      ...allAxis(1, 'B'),
      ...allAxis(2, 'B'),
      ...allAxis(3, 'B'),
      Q4: 'A' as const,
      Q9: 'A' as const,
    };
    const result = calculateResult(answers);
    expect(result.angerScore).toBe(2);
    expect(result.showAngryBadge).toBe(false);
  });

  it('Q7-A + Q4-A → score 4 → badge true', () => {
    const answers = {
      ...allAxis(1, 'B'),
      ...allAxis(2, 'B'),
      ...allAxis(3, 'B'),
      Q7: 'A' as const,
      Q4: 'A' as const,
    };
    const result = calculateResult(answers);
    expect(result.angerScore).toBe(4);
    expect(result.showAngryBadge).toBe(true);
  });

  it('all B → score 0 → badge false', () => {
    const answers = {
      ...allAxis(1, 'B'),
      ...allAxis(2, 'B'),
      ...allAxis(3, 'B'),
    };
    const result = calculateResult(answers);
    expect(result.angerScore).toBe(0);
    expect(result.showAngryBadge).toBe(false);
  });
});
