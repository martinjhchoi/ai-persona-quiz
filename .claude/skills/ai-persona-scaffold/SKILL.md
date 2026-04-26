---
name: ai-persona-scaffold
description: "나의 AI 페르소나 퀴즈 앱의 Next.js 15 프로젝트를 초기화하는 스킬. package.json, next.config.ts, tailwind, globals.css, app/layout.tsx 설정 완료. 프로젝트 스캐폴딩, 의존성 설치, 기반 설정이 필요할 때 사용."
---

# AI 페르소나 — Scaffold 스킬

## 프로젝트 정보

- **경로**: `/Users/martinjhchoi/DEV_Projects/ai-persona-quiz/`
- **이미 존재하는 파일** (덮어쓰기 금지):
  - `src/data/personas.ts` — 15문항 + 8 페르소나 데이터
  - `public/chars/*.png` — 캐릭터 이미지 01~08 + EXT

## 설치 의존성

```bash
# Core
pnpm add html2canvas
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom

# Phase 2 (미리 설치)
pnpm add @vercel/kv
```

## next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // turbopack 비활성화 — Web Worker new URL() 패턴이 turbopack 미지원
  experimental: {},
};

export default nextConfig;
```

> `experimental.turbo` 옵션을 넣으면 turbopack 활성화됨. 넣지 않으면 webpack(기본)으로 동작.

## CSS 변수 (app/globals.css)

디자인 토큰을 `:root`에 선언한다:

```css
@import 'tailwindcss';

:root {
  --font-display: 'Jua', sans-serif;
  --font-body: 'Pretendard', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --bg:        #FAFAF7;
  --surface:   #FFFFFF;
  --ink:       #1A1A1A;
  --primary:   #FF2D2D;
  --accent:    #FFD600;
  --panel-bg:  #FFFDE7;

  --shadow-sm: 3px 3px 0 #1A1A1A;
  --shadow-md: 5px 5px 0 #1A1A1A;
  --shadow-lg: 8px 8px 0 #1A1A1A;
  --shadow-xl: 10px 10px 0 #1A1A1A;

  --border-thin:  2px solid #1A1A1A;
  --border-med:   3px solid #1A1A1A;
  --border-thick: 4px solid #1A1A1A;

  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   14px;
  --radius-full: 9999px;

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px;
  --space-7: 48px; --space-8: 64px;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg);
  color: var(--ink);
  /* 스크린톤 도트 배경 */
  background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

## app/layout.tsx

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '나의 AI 페르소나',
  description: '15문항으로 알아보는 나의 AI 사용 스타일',
  openGraph: { title: '나의 AI 페르소나', description: '15문항 퀴즈로 AI 페르소나 확인' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jua&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
```

## 완료 기준

1. `pnpm dev` 실행 시 `localhost:3000` 응답
2. `pnpm build` 에러 없음
3. `_workspace/01_scaffold_done.txt` 작성
