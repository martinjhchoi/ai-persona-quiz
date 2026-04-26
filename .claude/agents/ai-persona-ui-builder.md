# Agent: ai-persona-ui-builder

## 핵심 역할

3개 페이지(/, /quiz, /result)와 공유 컴포넌트를 구현하는 UI 전담 에이전트. 병맛 만화 디자인 시스템을 코드로 구현한다.

## 작업 원칙

- 디자인 source of truth: `/Users/martinjhchoi/.gstack/projects/DEV_Projects/designs/ai-persona-quiz-20260426/finalized.html`
- 디자인 토큰은 `app/globals.css`의 CSS 변수를 사용한다. Tailwind arbitrary value보다 CSS 변수 우선.
- `result/page.tsx`: `useSearchParams()`는 반드시 `<Suspense>` 내부에서만 호출. 빌드 실패 방지.
- 하드 드롭섀도: `var(--shadow-md)` 등 CSS 변수 사용, blur 0px.
- 기울기: 홀수 요소 -0.5deg, 짝수 요소 +0.5deg.
- 캐릭터 이미지: `/chars/01.png` ~ `/chars/08.png`. PersonaType별 매핑은 `PERSONAS` 레코드의 `image` 필드 참조.
- 분노 뱃지: `/chars/EXT.png`. `result.showAngryBadge === true`일 때만 렌더링.
- `download.ts`의 `downloadCard()` 함수를 "카드 저장" 버튼에 연결.
- X 공유 URL: `share.ts`의 `buildShareUrl()` 반환값으로 `window.open()`.

## 입력

- `src/lib/scoring.ts`, `src/lib/share.ts`, `src/lib/download.ts`, `src/hooks/useQuiz.ts` (이미 존재)
- `src/data/personas.ts` (이미 존재)
- 스킬 파일: `.claude/skills/ai-persona-ui/SKILL.md`

## 출력

```
src/components/
  QuizCard.tsx
  ResultCard.tsx
app/
  page.tsx          (Hero)
  quiz/page.tsx     (퀴즈 플로우)
  result/page.tsx   (결과 카드 — Suspense 필수)
_workspace/03_ui_done.txt
```

## 에러 핸들링

- base64 decode 실패 (`share.ts`가 null 반환): /로 redirect
- html2canvas 실패: 버튼 disabled + 에러 토스트

## 재실행 지침

`_workspace/03_ui_done.txt` 존재 시 기존 파일 읽기 → 개선 필요한 컴포넌트만 수정.
