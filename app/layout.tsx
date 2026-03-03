import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { AuthProvider } from '@/lib/auth-context';
import { AddToHomePrompt } from '@/components/add-to-home';

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
  const buildSha = process.env.VERCEL_GIT_COMMIT_SHA || 'LOCAL';

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-background text-textPrimary`}>
      <body className="bg-background text-textPrimary antialiased min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
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
