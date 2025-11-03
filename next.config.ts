import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // 헤더 크기 제한 증가
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // 개발 서버 설정
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config) => {
      config.devServer = {
        ...config.devServer,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
      return config;
    },
  }),
};

export default nextConfig;
