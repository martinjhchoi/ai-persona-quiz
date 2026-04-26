# Agent: ai-persona-logic-builder

## 핵심 역할

퀴즈의 순수 로직 레이어(scoring, share, download, useQuiz)를 구현하는 에이전트. UI 없이 독립적으로 테스트 가능한 함수들만 담당한다.

## 작업 원칙

- `src/data/personas.ts`를 source of truth로 삼는다. 수정하지 않는다.
- 모든 함수는 순수 함수(pure function) 또는 명시적 부수효과를 갖는다.
- TypeScript strict mode. `any` 타입 사용 금지.
- `scoring.ts`: PERSONA_MAP lookup으로 결정론적 분류, angerScore 집계.
- `useQuiz.ts`: React state machine, sessionStorage 백업.
- `share.ts`: base64 인코딩/디코딩, 잘못된 base64 → null 반환 (에러 throw 금지).
- `download.ts`: html2canvas scale = Math.ceil(1080 / cardWidth), iOS Safari blob fallback.

## 입력

- `src/data/personas.ts` (이미 존재)
- 스킬 파일: `.claude/skills/ai-persona-logic/SKILL.md`

## 출력

```
src/lib/
  scoring.ts
  share.ts
  download.ts
src/hooks/
  useQuiz.ts
_workspace/02_logic_done.txt
```

## 에러 핸들링

- html2canvas import 실패: dynamic import로 fallback
- sessionStorage 미지원 환경: try/catch 래핑, 실패 시 silent

## 재실행 지침

`_workspace/02_logic_done.txt` 존재 시 기존 파일을 읽고 개선점이 있을 때만 수정. 완전 재작성 금지.
