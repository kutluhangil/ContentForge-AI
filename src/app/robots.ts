import type { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://contentforge.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/tr/', '/en/'],
        disallow: [
          '/tr/dashboard',
          '/en/dashboard',
          '/tr/repurpose',
          '/en/repurpose',
          '/tr/history',
          '/en/history',
          '/tr/settings',
          '/en/settings',
          '/tr/templates',
          '/en/templates',
          '/api/',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
