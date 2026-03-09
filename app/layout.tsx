import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'DEFRAG',
  description: 'The user manual for you, and your people.',
  applicationName: 'DEFRAG',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DEFRAG',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

import { AuthProvider } from '@/lib/auth-context';
import { AddToHomePrompt } from '@/components/add-to-home';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
  const buildSha = process.env.VERCEL_GIT_COMMIT_SHA || 'LOCAL';

  return (
    <html lang="en" className="bg-black text-white">
      <body className="min-h-[100dvh] bg-black text-white font-sans antialiased">
        <AuthProvider>
          {children}
          <AddToHomePrompt />
        </AuthProvider>
        <Analytics />
        
        {!isProduction && (
          <div
            style={{
              position: 'fixed',
              right: 16,
              bottom: 12,
              fontSize: 10,
              opacity: 0.35,
              fontFamily: 'var(--font-mono)',
              color: '#fff',
              pointerEvents: 'none',
              zIndex: 9999
            }}
          >
            BUILD: {buildSha.slice(0, 7)}
          </div>
        )}
      </body>
    </html>
  )
}
