'use client';

// ============================================================
// app/quiz/page.tsx — 15문항 퀴즈 플로우
// ============================================================

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/hooks/useQuiz';
import { QUESTIONS } from '@/data/personas';
import { encodeResult } from '@/lib/share';
import { QuizCard } from '@/components/QuizCard';

export default function QuizPage() {
  const router = useRouter();
  const { state, currentQuestion, selectAnswer, goBack } = useQuiz();

  // 퀴즈 완료 → 결과 페이지로 이동
  useEffect(() => {
    if (state.phase === 'complete' && state.result) {
      const encoded = encodeResult(state.result);
      router.push(`/result?result=${encodeURIComponent(encoded)}`);
    }
  }, [state.phase, state.result, router]);

  const total = QUESTIONS.length;
  const selected = state.answers[currentQuestion?.id];

  // 다음 버튼: 답을 선택한 경우에만 활성화
  // (현재 useQuiz는 선택 즉시 다음으로 이동 — 다음 버튼은 보조적 역할)
  const handleNext = () => {
    if (selected) {
      // 이미 답이 있으면 selectAnswer 재호출 (다음으로 진행)
      selectAnswer(selected);
    }
  };

  if (state.phase === 'complete') {
    // 결과 산출 완료 → 리다이렉트 대기 중
    return (
      <main className="quiz-screen">
        <div style={{ fontFamily: 'var(--font-mono)', opacity: 0.6 }}>
          결과 계산 중…
        </div>
      </main>
    );
  }

  return (
    <main className="quiz-screen">
      <QuizCard
        question={currentQuestion}
        index={state.currentIndex}
        total={total}
        selected={selected}
        onSelect={selectAnswer}
        onPrev={goBack}
        onNext={handleNext}
        canGoPrev={state.currentIndex > 0}
        canGoNext={!!selected}
      />
    </main>
  );
}
