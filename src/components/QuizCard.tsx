'use client';

// ============================================================
// QuizCard.tsx — 퀴즈 카드 (질문 + 선지 A/B + 네비게이션)
// ============================================================

import type { QuizQuestion } from '@/data/personas';

interface QuizCardProps {
  question: QuizQuestion;
  index: number;          // 0-based
  total: number;
  selected: 'A' | 'B' | undefined;
  onSelect: (answer: 'A' | 'B') => void;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const AXIS_LABEL: Record<1 | 2 | 3, string> = {
  1: 'INSTRUCT 축',
  2: 'REACT 축',
  3: 'PURPOSE 축',
};

export function QuizCard({
  question,
  index,
  total,
  selected,
  onSelect,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}: QuizCardProps) {
  const human = index + 1;
  const progress = ((index + 1) / total) * 100;
  const numStr = String(human).padStart(2, '0');

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <span className="quiz-q-num">
          Q<strong>{numStr}</strong> / {total}
        </span>
        <span className="quiz-axis-tag">{AXIS_LABEL[question.axis]}</span>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-card-body">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <span className="quiz-q-stamp">{human}</span>
          <h2 className="quiz-question">{question.text}</h2>
        </div>

        <div className="quiz-options">
          <button
            type="button"
            className={`quiz-option${selected === 'A' ? ' selected' : ''}`}
            onClick={() => onSelect('A')}
            aria-pressed={selected === 'A'}
          >
            <span className="quiz-opt-label">A</span>
            <p className="quiz-opt-text">{question.optionA}</p>
          </button>
          <button
            type="button"
            className={`quiz-option${selected === 'B' ? ' selected' : ''}`}
            onClick={() => onSelect('B')}
            aria-pressed={selected === 'B'}
          >
            <span className="quiz-opt-label">B</span>
            <p className="quiz-opt-text">{question.optionB}</p>
          </button>
        </div>
      </div>

      <div className="quiz-nav">
        <button
          type="button"
          className="btn-nav"
          onClick={onPrev}
          disabled={!canGoPrev}
          aria-label="이전 문항으로"
        >
          ← 이전
        </button>
        <span className="quiz-counter">
          {human} / {total}
        </span>
        <button
          type="button"
          className="btn-nav"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="다음 문항으로"
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
