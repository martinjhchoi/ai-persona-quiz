import type { Metadata } from 'next';
import KakaoInit from '@/components/KakaoInit';
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
      <body>
        {children}
        <KakaoInit />
      </body>
    </html>
  );
}
