// ============================================================
// app/page.tsx — Hero 랜딩 (서버 컴포넌트)
// ============================================================

import Image from 'next/image';
import Link from 'next/link';
import { PERSONAS } from '@/data/personas';

const TEASE_TYPES = ['trainer', 'debater', 'bestfriend'] as const;

export default function HomePage() {
  return (
    <main className="hero-screen">
      <span className="hero-stars tl" aria-hidden>✦</span>
      <span className="hero-stars tr" aria-hidden>★</span>
      <span className="hero-stars bl" aria-hidden>★</span>
      <span className="hero-stars br" aria-hidden>✦</span>

      <div className="hero-inner">
        <span className="hero-badge">AI 성격 유형 테스트</span>
        <h1 className="hero-title">
          나의 AI<br />페르소나는?
        </h1>
        <p className="hero-sub">
          AI를 사용하는 나의 방식으로 보는 성격 유형.<br />
          15가지 질문에 솔직하게 답하고 내 타입을 확인하세요.
        </p>

        <Link href="/quiz" className="btn-primary">
          퀴즈 시작하기 →
        </Link>

        <div className="hero-tease">
          {TEASE_TYPES.map((type) => {
            const persona = PERSONAS[type];
            return (
              <div className="persona-mini-card" key={type}>
                <div
                  className="persona-mini-header"
                  style={{ background: persona.color }}
                />
                <div className="persona-mini-illo">
                  <Image
                    src={persona.image}
                    alt={persona.name}
                    width={100}
                    height={60}
                  />
                </div>
                <div className="persona-mini-body">
                  <div className="persona-mini-name">{persona.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
