// ============================================================
// app/result/page.tsx — 결과 페이지 (Suspense Wrapper)
// useSearchParams() 는 반드시 Suspense 안에서 사용 (Next.js 15)
// ============================================================

import { Suspense } from 'react';
import ResultContent from './ResultContent';

function ResultSkeleton() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-7) var(--space-4)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          height: 600,
          background: 'var(--surface)',
          border: 'var(--border-thick)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
        }}
        aria-label="결과 카드 로딩 중"
      />
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultSkeleton />}>
      <ResultContent />
    </Suspense>
  );
}
