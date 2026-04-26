// ============================================================
// share.ts — base64 인코딩/디코딩 + X 공유 URL 빌더
// ============================================================

import type { QuizResult } from '@/data/personas';

/**
 * QuizResult 를 base64 문자열로 직렬화 (URL 파라미터용).
 */
export function encodeResult(result: QuizResult): string {
  return btoa(JSON.stringify(result));
}

/**
 * base64 문자열을 QuizResult 로 역직렬화.
 * 잘못된 base64/JSON → null 반환 (throw 금지).
 */
export function decodeResult(encoded: string): QuizResult | null {
  try {
    return JSON.parse(atob(encoded)) as QuizResult;
  } catch {
    return null;
  }
}

/**
 * 결과 페이지 공유 URL 생성: `${baseUrl}/result?result=<encoded>`
 */
export function buildShareUrl(result: QuizResult, baseUrl: string): string {
  return `${baseUrl}/result?result=${encodeURIComponent(encodeResult(result))}`;
}

/**
 * X(트위터) 공유 인텐트 URL 생성.
 * 본문: `나의 AI 페르소나는 ${personaName}! 너는 어떤 타입?\n${shareUrl}`
 */
export function buildXShareUrl(
  result: QuizResult,
  siteUrl: string,
  personaName: string
): string {
  const shareUrl = buildShareUrl(result, siteUrl);
  const text = encodeURIComponent(
    `나의 AI 페르소나는 ${personaName}! 너는 어떤 타입?\n${shareUrl}`
  );
  return `https://twitter.com/intent/tweet?text=${text}`;
}
