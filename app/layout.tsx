import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://defrag.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: {
    default: 'DEFRAG — The user manual for you, and your people.',
    template: '%s | DEFRAG',
  },
  description: 'A relational intelligence platform. Understand yourself. Navigate your relationships. Reduce friction where it matters most.',
  applicationName: 'DEFRAG',
  keywords: ['relationships', 'self-understanding', 'astrology', 'natal chart', 'communication', 'relational intelligence'],
  authors: [{ name: 'DEFRAG' }],
  creator: 'DEFRAG',
  publisher: 'DEFRAG',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'DEFRAG',
    title: 'DEFRAG — The user manual for you, and your people.',
    description: 'A relational intelligence platform. Understand yourself. Navigate your relationships. Reduce friction where it matters most.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DEFRAG - Relational Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DEFRAG — The user manual for you, and your people.',
    description: 'A relational intelligence platform. Understand yourself. Navigate your relationships.',
    images: ['/og-image.png'],
    creator: '@defragapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
};

import { AuthProvider } from '@/lib/auth-context';
import { AddToHomePrompt } from '@/components/add-to-home';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const buildSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'LOCAL';
  const buildTimestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP;
  const buildDate = buildTimestamp ? buildTimestamp.split('T')[0] : new Date().toISOString().split('T')[0];

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-black text-white`}>
      <body className="min-h-[100dvh] bg-black text-white font-sans antialiased">
        <AuthProvider>
          {children}
          <AddToHomePrompt />
        </AuthProvider>
        <Analytics />
        
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
          Build: {buildDate} / {buildSha.slice(0, 7)}
        </div>
      </body>
    </html>
  )
}
