'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  PERSONAS,
  ANGRY_BADGE_IMAGE,
  type QuizResult,
} from '@/data/personas';
import { downloadCard } from '@/lib/download';
import { buildShareUrl } from '@/lib/share';

interface ResultCardProps {
  result: QuizResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const persona = PERSONAS[result.type];
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) triggerToast();

    try {
      await downloadCard(cardRef.current, persona.name);
    } catch (err) {
      console.error('[ResultCard] download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareKakao = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = buildShareUrl(result, window.location.origin);
    const kakao = (window as any).Kakao;

    // 1순위: Kakao SDK (NEXT_PUBLIC_KAKAO_APP_KEY 설정 시)
    if (kakao?.isInitialized?.()) {
      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `나의 AI 페르소나는 ${persona.name}!`,
          description: `${persona.tagline.replace(/\n/g, ' ')}`,
          imageUrl: `${window.location.origin}${persona.image}`,
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [{
          title: '내 페르소나 확인하기',
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        }],
      });
      return;
    }

    // 2순위: navigator.share (HTTPS 모바일)
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `나의 AI 페르소나는 ${persona.name}!`,
          text: `${persona.tagline.replace(/\n/g, ' ')} — 너는 어떤 타입?`,
          url: shareUrl,
        });
        return;
      } catch {
        // NotAllowedError(HTTP/localhost) 또는 사용자 취소 → 폴백
      }
    }

    // 3순위: 클립보드 복사
    const copyText = shareUrl;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(copyText);
      } else {
        const ta = document.createElement('textarea');
        ta.value = copyText;
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      alert('링크가 복사되었습니다!\n카카오톡에 붙여넣기 해주세요.');
    } catch {
      alert(`공유 링크:\n${shareUrl}`);
    }
  };

  return (
    <>
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: 'env(safe-area-inset-top, 16px)',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 16,
            background: '#1a1a1a',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: 100,
            fontSize: 14,
            fontFamily: 'var(--font-body, sans-serif)',
            whiteSpace: 'nowrap',
            zIndex: 9999,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            pointerEvents: 'none',
          }}
        >
          공유 창에서 &apos;이미지 저장&apos;을 탭하세요 👆
        </div>
      )}

      <div className="result-card-wrap">
        <div id="result-card" ref={cardRef} className="result-card">
          {result.showAngryBadge && (
            <div className="angry-badge-wrap" aria-label="앵그리 욕쟁이 뱃지">
              <Image
                src={ANGRY_BADGE_IMAGE}
                alt="앵그리 욕쟁이 뱃지"
                width={72}
                height={72}
                priority
              />
            </div>
          )}

          <div
            className={`result-card-banner${result.showAngryBadge ? ' with-badge' : ''}`}
            style={{ background: persona.color }}
          >
            <span className="result-persona-type">{persona.name}</span>
            <span className="result-type-badge">{persona.typeBadge}</span>
          </div>

          <div className="result-illo">
            <span className="illo-star-1">✦</span>
            <Image
              src={persona.image}
              alt={persona.name}
              width={220}
              height={220}
              priority
            />
            <span className="illo-star-2">★</span>
          </div>

          <div className="result-card-body">
            <span className="result-tagline">{persona.tagline}</span>

            <div className="result-desc-panel">
              <p className="result-desc-text">{persona.description}</p>
            </div>

            <div className="result-hashtags">
              {persona.hashtags.map((tag) => (
                <span key={tag} className="hashtag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="result-actions">
              <button
                type="button"
                className="btn-download"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? '저장 중…' : '⬇ 카드 저장'}
              </button>
              <button
                type="button"
                className="btn-share-kakao"
                onClick={handleShareKakao}
              >
                💬 카카오톡 공유
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
