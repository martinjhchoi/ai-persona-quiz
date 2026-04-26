// ============================================================
// scoring.ts — 3-axis 채점 + 분노점수 + 페르소나 결정
// 규격: .claude/skills/ai-persona-logic/references/scoring-spec.md
// ============================================================

import {
  QUESTIONS,
  PERSONA_MAP,
  ANGER_THRESHOLD,
  type QuizResult,
} from '@/data/personas';

/**
 * 답안 매핑 — 문항 ID → 'A' | 'B'
 */
export type Answers = Record<string, 'A' | 'B'>;

/**
 * 15문항 답안을 받아 3-axis 결정 + 분노점수 + showAngryBadge 산출.
 *
 * 축 결정 규칙:
 *  - 각 축 5문항 중 A가 과반수(≥ ceil(5/2)=3) → 0
 *  - 그렇지 않으면(B 과반수) → 1
 *  - 키 = `${axis1}${axis2}${axis3}` (3-bit 문자열) → PERSONA_MAP 조회
 *
 * 분노점수 규칙:
 *  - 각 문항의 angerTrigger.score 는 A 선택 시에만 가산
 *  - 합계 ≥ ANGER_THRESHOLD(3) 이면 showAngryBadge: true
 */
export function calculateResult(answers: Answers): QuizResult {
  // index 0=axis1, 1=axis2, 2=axis3
  const axisA = [0, 0, 0];
  const axisTotal = [0, 0, 0];
  let angerScore = 0;

  for (const q of QUESTIONS) {
    const idx = q.axis - 1;
    axisTotal[idx]++;
    const answer = answers[q.id];
    if (answer === 'A') {
      axisA[idx]++;
      if (q.angerTrigger) {
        angerScore += q.angerTrigger.score;
      }
    }
  }

  // 각 축: A 과반수(≥ ceil(total/2)) → '0', 아니면 '1'
  const key = axisA
    .map((a, i) => (a >= Math.ceil(axisTotal[i] / 2) ? '0' : '1'))
    .join('') as keyof typeof PERSONA_MAP;

  return {
    type: PERSONA_MAP[key],
    angerScore,
    showAngryBadge: angerScore >= ANGER_THRESHOLD,
  };
}
