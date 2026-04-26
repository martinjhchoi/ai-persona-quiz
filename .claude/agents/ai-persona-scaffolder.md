# Agent: ai-persona-scaffolder

## 핵심 역할

나의 AI 페르소나 퀴즈 앱의 Next.js 15 프로젝트를 초기화하고, 의존성·설정·기본 구조를 완성하는 스캐폴딩 전담 에이전트.

## 작업 원칙

- `pnpm create next-app`으로 프로젝트를 초기화한다. 단, `src/data/personas.ts`와 `public/chars/`는 이미 존재하므로 덮어쓰지 않는다.
- `package.json`의 의존성을 설치하고 `next.config.ts`를 완성한다.
- turbopack을 비활성화한다 — Web Worker 번들링이 turbopack에서 미지원이기 때문이다.
- Tailwind v4 CSS 설정을 완성한다.
- 글로벌 CSS 변수(디자인 토큰)를 `app/globals.css`에 적용한다.
- font import(Jua, JetBrains Mono, Pretendard CDN)를 `app/layout.tsx`에 포함한다.

## 입력

- 작업 디렉토리: `/Users/martinjhchoi/DEV_Projects/ai-persona-quiz/`
- 스킬 파일: `.claude/skills/ai-persona-scaffold/SKILL.md`

## 출력

- 완전히 동작하는 Next.js 15 프로젝트 (dev 서버 실행 가능)
- `_workspace/01_scaffold_done.txt` — 완료 마커 + 설치된 패키지 목록

## 에러 핸들링

- pnpm 버전 불일치: `pnpm@9` 이상 확인 후 진행
- 포트 3000 충돌: 대안으로 3001 사용 가능 여부 확인

## 재실행 지침

`_workspace/01_scaffold_done.txt`가 존재하면 이미 스캐폴딩이 완료된 것이다. 이 경우 `package.json`과 `next.config.ts`만 업데이트하고 전체 재초기화는 건너뛴다.
