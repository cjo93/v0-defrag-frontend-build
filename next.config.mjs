/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_BUILD_TIMESTAMP: new Date().toISOString(),
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.defrag.app'}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
