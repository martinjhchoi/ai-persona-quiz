// ============================================================
// useQuiz.ts — 15문항 퀴즈 상태 머신 + sessionStorage 백업
// ============================================================
'use client';

import { useState, useCallback } from 'react';
import { QUESTIONS, type QuizQuestion, type QuizResult } from '@/data/personas';
import { calculateResult } from '@/lib/scoring';

type Answers = Record<string, 'A' | 'B'>;

interface QuizState {
  currentIndex: number;
  answers: Answers;
  result: QuizResult | null;
  phase: 'quiz' | 'complete';
}

/**
 * 퀴즈 진행 훅.
 *
 * - selectAnswer: 현재 문항에 답을 기록하고 다음 문항으로 이동.
 *   마지막 문항이면 calculateResult 를 실행하고 phase='complete' 로 전환.
 * - goBack: 첫 문항이 아니면 이전 문항으로 이동 (답안은 유지).
 * - reset: 모든 상태 초기화 + sessionStorage 백업 삭제.
 *
 * sessionStorage 키: `quiz_answers` (JSON 문자열). 저장 실패는 조용히 무시.
 */
export function useQuiz() {
  const [state, setState] = useState<QuizState>(() => ({
    currentIndex: 0,
    answers: {},
    result: null,
    phase: 'quiz',
  }));

  const currentQuestion: QuizQuestion = QUESTIONS[state.currentIndex];
  const progress = (state.currentIndex / QUESTIONS.length) * 100;

  const selectAnswer = useCallback((answer: 'A' | 'B') => {
    // Phase 1: 답 즉시 기록 → .selected 스타일 렌더링 (노란색 피드백)
    setState((prev) => {
      const answers: Answers = {
        ...prev.answers,
        [QUESTIONS[prev.currentIndex].id]: answer,
      };
      try {
        sessionStorage.setItem('quiz_answers', JSON.stringify(answers));
      } catch {
        /* noop */
      }
      return { ...prev, answers };
    });

    // Phase 2: 300ms 후 다음 문항으로 이동 (또는 결과 산출)
    setTimeout(() => {
      setState((prev) => {
        const isLast = prev.currentIndex === QUESTIONS.length - 1;
        if (isLast) {
          return {
            ...prev,
            result: calculateResult(prev.answers),
            phase: 'complete',
          };
        }
        return { ...prev, currentIndex: prev.currentIndex + 1 };
      });
    }, 300);
  }, []);

  const goBack = useCallback(() => {
    setState((prev) =>
      prev.currentIndex > 0
        ? { ...prev, currentIndex: prev.currentIndex - 1 }
        : prev
    );
  }, []);

  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem('quiz_answers');
    } catch {
      /* noop */
    }
    setState({ currentIndex: 0, answers: {}, result: null, phase: 'quiz' });
  }, []);

  return {
    state,
    currentQuestion,
    progress,
    selectAnswer,
    goBack,
    reset,
  };
}
