import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://defrag.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/auth/login',
    '/onboarding',
    '/unlock',
    '/dashboard',
    '/chat',
    '/relationships',
    '/settings',
    '/principles',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/dashboard' ? 0.9 : 0.7,
  }));
}
