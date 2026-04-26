import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // turbopack 비활성화 — Web Worker new URL() 패턴이 turbopack 미지원
  experimental: {},
};

export default nextConfig;
