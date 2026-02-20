import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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
  return (
    <html lang="en">
      <body className="bg-[#000000] text-[#FFFFFF] font-sans antialiased">
        <AuthProvider>
          {children}
          <AddToHomePrompt />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
