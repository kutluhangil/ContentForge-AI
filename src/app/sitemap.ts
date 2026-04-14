import type { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://contentforge.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['tr', 'en'];

  const staticPaths = ['', '/pricing'];

  const urls: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      urls.push({
        url: `${APP_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${APP_URL}/${l}${path}`])
          ),
        },
      });
    }
  }

  return urls;
}
