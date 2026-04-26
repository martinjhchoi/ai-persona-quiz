'use client';

// ============================================================
// app/result/ResultContent.tsx — 결과 카드 + 공유 진입 처리
// useSearchParams 사용 (반드시 Suspense 안에서 호출됨)
// ============================================================

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ResultCard } from '@/components/ResultCard';
import { decodeResult } from '@/lib/share';
import { PERSONAS } from '@/data/personas';

export default function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const encoded = searchParams.get('result');
  const sharedFlag = searchParams.get('shared');

  const result = useMemo(() => {
    if (!encoded) return null;
    return decodeResult(decodeURIComponent(encoded));
  }, [encoded]);

  // base64 decode 실패 시 홈으로 보냄
  useEffect(() => {
    if (encoded && !result) {
      router.replace('/');
    }
  }, [encoded, result, router]);

  // 공유 URL로 진입한 경우 (referrer 기반 단순 휴리스틱)
  // — 본인이 막 끝낸 결과인지 vs 친구가 보내준 링크인지 구분이 필요할 때만 CTA 노출
  // 명확한 지표가 없으므로 ?shared=1 쿼리로 마킹할 수 있도록만 준비
  const isSharedView = sharedFlag === '1';

  if (!encoded) {
    // 결과 파라미터가 없으면 홈으로 안내
    return (
      <main className="result-screen">
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              marginBottom: 'var(--space-4)',
            }}
          >
            결과를 찾을 수 없어요.
          </p>
          <Link href="/" className="btn-primary">
            처음으로 →
          </Link>
        </div>
      </main>
    );
  }

  if (!result) {
    // 디코딩 중 / 실패 → useEffect 가 곧 홈으로 보냄
    return (
      <main className="result-screen">
        <div style={{ fontFamily: 'var(--font-mono)', opacity: 0.6 }}>
          결과를 불러오는 중…
        </div>
      </main>
    );
  }

  const persona = PERSONAS[result.type];

  return (
    <main className="result-screen">
      {isSharedView && (
        <div className="share-cta">
          <h2>
            친구가 {persona.name}<br />이래!
          </h2>
          <p>당신의 AI 페르소나는 무엇인가요? 15문항 퀴즈로 확인해보세요.</p>
          <Link href="/quiz" className="btn-start-quiz">
            나는 어떤 타입? →
          </Link>
        </div>
      )}

      <ResultCard result={result} />

      <Link href="/quiz" className="btn-restart">
        ↺ 다시 풀어보기
      </Link>
    </main>
  );
}
