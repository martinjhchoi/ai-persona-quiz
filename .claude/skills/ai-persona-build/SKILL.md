---
name: ai-persona-build
description: "나의 AI 페르소나 퀴즈 앱 전체 빌드 파이프라인 오케스트레이터. 초기 빌드, Phase 1 MVP 완성, 부분 재실행, 업데이트, 보완, 다시 빌드, 스캐폴딩 다시, 로직 수정, UI 수정, QA 재실행 요청 시 반드시 이 스킬을 사용."
---

# AI 페르소나 Build 오케스트레이터

나의 AI 페르소나 퀴즈 앱을 Phase별로 순차 빌드하는 서브 에이전트 파이프라인.

## 실행 모드: 서브 에이전트 (파이프라인)

각 Phase는 완전히 순차적이며, 이전 Phase의 파일 출력을 다음 Phase의 입력으로 사용한다.

## 프로젝트 위치

`/Users/martinjhchoi/DEV_Projects/ai-persona-quiz/`

## 에이전트 구성

| Phase | 에이전트 | 스킬 | 출력 마커 |
|-------|---------|------|---------|
| 1 | ai-persona-scaffolder | ai-persona-scaffold | `_workspace/01_scaffold_done.txt` |
| 2 | ai-persona-logic-builder | ai-persona-logic | `_workspace/02_logic_done.txt` |
| 3 | ai-persona-ui-builder | ai-persona-ui | `_workspace/03_ui_done.txt` |
| 4 | ai-persona-qa | ai-persona-qa-check | `_workspace/04_qa_done.txt` |

## 워크플로우

### Phase 0: 컨텍스트 확인

실행 전 `_workspace/` 디렉토리와 완료 마커 파일을 확인하여 실행 모드를 결정한다:

```
_workspace/ 없음
  → 초기 실행. Phase 1부터 전체 진행.

_workspace/ 있음 + 사용자가 "로직만 다시" / "UI 수정" / 특정 Phase 재실행 요청
  → 부분 재실행. 해당 Phase 에이전트만 호출.
  → 이후 Phase도 영향받는 경우 연쇄 실행.

_workspace/ 있음 + 새 요청 (새 기능 추가 등)
  → 영향받는 Phase부터 재실행.
```

실행 모드를 결정한 후 사용자에게 한 줄로 보고한다:
- "초기 실행: Phase 1→2→3→4 순차 진행합니다."
- "부분 재실행: Phase 3(UI)부터 4(QA) 진행합니다."

### Phase 1: 스캐폴딩

```
마커 _workspace/01_scaffold_done.txt 확인
  → 있으면: 건너뜀
  → 없으면: ai-persona-scaffolder 에이전트 호출

Agent(
  subagent_type: "general-purpose",
  model: "opus",
  description: "Next.js 프로젝트 스캐폴딩",
  prompt: """
    역할: ai-persona-scaffolder 에이전트.
    스킬: .claude/skills/ai-persona-scaffold/SKILL.md 를 읽고 지시에 따라 실행.
    프로젝트 경로: /Users/martinjhchoi/DEV_Projects/ai-persona-quiz/
    주의: src/data/personas.ts 와 public/chars/ 는 이미 존재하므로 덮어쓰지 말 것.
    완료 후 _workspace/01_scaffold_done.txt 작성.
  """
)
```

### Phase 2: 로직 레이어

```
마커 _workspace/02_logic_done.txt 확인
  → 있으면: 건너뜀 (부분 재실행 요청 시 제외)
  → 없으면: ai-persona-logic-builder 에이전트 호출

Agent(
  subagent_type: "bkit:frontend-architect",
  model: "opus",
  description: "퀴즈 로직 레이어 구현",
  prompt: """
    역할: ai-persona-logic-builder 에이전트.
    스킬: .claude/skills/ai-persona-logic/SKILL.md 를 읽고 지시에 따라 실행.
    scoring-spec 참조: .claude/skills/ai-persona-logic/references/scoring-spec.md
    프로젝트 경로: /Users/martinjhchoi/DEV_Projects/ai-persona-quiz/
    src/data/personas.ts 는 이미 존재하며 source of truth임.
    완료 후 _workspace/02_logic_done.txt 작성.
  """
)
```

### Phase 3: UI 레이어

```
마커 _workspace/03_ui_done.txt 확인
  → 있으면: 건너뜀 (부분 재실행 요청 시 제외)
  → 없으면: ai-persona-ui-builder 에이전트 호출

Agent(
  subagent_type: "bkit:frontend-architect",
  model: "opus",
  description: "3개 페이지 + 컴포넌트 구현",
  prompt: """
    역할: ai-persona-ui-builder 에이전트.
    스킬: .claude/skills/ai-persona-ui/SKILL.md 를 읽고 지시에 따라 실행.
    디자인 참조: .claude/skills/ai-persona-ui/references/design-spec.md
    finalized.html: /Users/martinjhchoi/.gstack/projects/DEV_Projects/designs/ai-persona-quiz-20260426/finalized.html
    프로젝트 경로: /Users/martinjhchoi/DEV_Projects/ai-persona-quiz/
    result/page.tsx 에서 useSearchParams 는 반드시 Suspense 내부에서만 사용할 것.
    완료 후 _workspace/03_ui_done.txt 작성.
  """
)
```

### Phase 4: QA

```
ai-persona-qa 에이전트 호출

Agent(
  subagent_type: "general-purpose",
  model: "opus",
  description: "단위 테스트 작성 및 실행",
  prompt: """
    역할: ai-persona-qa 에이전트.
    스킬: .claude/skills/ai-persona-qa-check/SKILL.md 를 읽고 지시에 따라 실행.
    테스트 플랜: /Users/martinjhchoi/.gstack/projects/DEV_Projects/martinjhchoi-unknown-eng-review-test-plan-20260426-v2.md
    프로젝트 경로: /Users/martinjhchoi/DEV_Projects/ai-persona-quiz/
    pnpm test --run 으로 실제 실행 후 결과를 보고할 것.
    완료 후 _workspace/04_qa_done.txt 에 테스트 결과 요약 작성.
  """
)
```

### Phase 5: 완료 보고

1. 각 Phase 완료 마커 확인
2. 최종 보고:
   - 생성된 파일 목록
   - 테스트 결과 요약 (`_workspace/04_qa_done.txt` 내용)
   - 로컬 확인: `http://localhost:3000`
   - 다음 단계: GitHub repo 생성 + Vercel 배포 (OpsEngineer)

## 에러 핸들링

- Phase 실패 시: 에러 내용을 `_workspace/{N}_error.txt`에 기록하고 다음 Phase 진행 여부를 사용자에게 확인
- Phase 2 실패 시 Phase 3 진행 불가 (의존성) → 자동 중단 후 보고

## 테스트 시나리오

**정상 흐름:**
초기 실행 → Phase 1 스캐폴딩 완료 → Phase 2 로직 완성 → Phase 3 UI 완성 → Phase 4 테스트 전부 PASS.

**에러 흐름:**
Phase 3 result/page.tsx에서 Suspense 누락 → `pnpm build` 실패 → Phase 3 에이전트가 수정 후 재빌드.

**부분 재실행:**
"UI만 다시 해줘" → Phase 0에서 `_workspace/01_scaffold_done.txt`, `_workspace/02_logic_done.txt` 확인 → Phase 3+4만 실행.

## should-trigger 쿼리 (트리거 검증)

- "ai-persona 빌드해줘"
- "퀴즈 앱 만들어줘"
- "스캐폴딩 시작해"
- "scoring.ts 만들어"
- "결과 카드 UI 구현해"
- "테스트 다시 실행해"
- "UI만 다시 해줘"
- "페르소나 퀴즈 처음부터"

## should-NOT-trigger 쿼리

- "퀴즈 질문 내용 수정해줘" (personas.ts 직접 편집 — 데이터 변경, 빌드 파이프라인 아님)
- "Vercel 배포해줘" (OpsEngineer 담당)
- "GitHub repo 만들어줘" (OpsEngineer 담당)
- "Phase 2 ChatGPT 업로드 기능 추가해줘" (별도 Phase 2 하네스 필요)
