/** @type {import('next').NextConfig} */
const USE_EXTERNAL_API = process.env.USE_EXTERNAL_API === 'true';
const EXTERNAL_API_BASE = process.env.API_EXTERNAL_BASE || 'https://api.defrag.app';

const nextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().toISOString(),
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "frame-src https://js.stripe.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.openai.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
            ].join('; '),
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.defrag.app' }],
        destination: 'https://defrag.app/:path*',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    if (!USE_EXTERNAL_API) return [];
    return [
      {
        source: '/api/:path*',
        destination: `${EXTERNAL_API_BASE}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
